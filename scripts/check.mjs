// QA: loads pages in headless Chrome, reports console errors / hydration problems / horizontal overflow,
// takes screenshots, drives the subsidy calculator and captures the generated PDF reports.
// usage: node scripts/check.mjs [baseUrl] [outDir] [steps]      (exit code 1 when anything fails)
//        steps = comma list of pages,interact,fuzz,pdf (default: all)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4173';
const out = process.argv[3] || 'qa';
const steps = (process.argv[4] || 'pages,interact,fuzz,pdf').split(',');
const run = (step) => steps.includes(step);
fs.mkdirSync(out, { recursive: true });
const exe = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const pages = [
  '/', '/solar-calculator', '/solar-subsidy-calculator', '/solar-system-price-estimator', '/solar-quote-checker', '/solar-roi-calculator', '/solar-emi-calculator',
  '/solar-inverter-size-calculator', '/solar-battery-calculator', '/solar-load-calculator', '/roof-area-calculator', '/solar-string-sizing-calculator',
  '/solar-wire-size-calculator', '/ev-charging-cost-calculator', '/opex-vs-capex-calculator', '/solar-proposal-generator',
  '/state/gujarat', '/state/delhi', '/gu/', '/gu/solar-subsidy-calculator', '/hi/solar-calculator', '/hi/solar-emi-calculator', '/mr/solar-emi-calculator',
  '/blog/pm-surya-ghar-muft-bijli-yojana-guide', '/states', '/mr/solar-for/hospital',
];
const SHOTS = ['/', '/state/gujarat', '/gu/', '/solar-proposal-generator', '/solar-subsidy-calculator'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// real mouse click on an element that is first centred in the viewport without animation – the page uses
// scroll-behavior: smooth and a sticky header, so a plain page.click() can land on the header or mid-scroll
const tap = async (page, sel) => {
  await page.$eval(sel, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await sleep(80);
  await page.click(sel);
};

const browser = await puppeteer.launch({ executablePath: exe, headless: 'new' });
let bad = 0;
const fail = (msg) => {
  bad++;
  console.log('✗ ' + msg);
};

for (const p of run('pages') ? pages : []) {
  const page = await browser.newPage();
  const errs = [];
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(base + p, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(600);
  // islands hydrate when they come near the viewport – bring each one into view, then wait for React
  const count = await page.$$eval('[data-island]', (els) => els.length);
  for (let i = 0; i < count; i++) {
    await page.evaluate((n) => document.querySelectorAll('[data-island]')[n].scrollIntoView({ block: 'center' }), i);
    await sleep(150);
  }
  await page.waitForFunction(() => [...document.querySelectorAll('[data-island]')].every((el) => el.__ready), { timeout: 8000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  // every island on the page must have hydrated without React complaining
  const pending = await page.evaluate(() => [...document.querySelectorAll('[data-island]')].filter((el) => !el.__ready).map((el) => el.dataset.island));
  if (pending.length) errs.push('NOT HYDRATED: ' + pending.join(', '));
  // nothing a visitor reads may contain a broken number or an unfilled placeholder
  const junk = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.match(/NaN|undefined|Infinity|\{[a-z][a-zA-Z0-9]*\}|₹-|\[object/g));
  if (junk) errs.push('BAD TEXT: ' + [...new Set(junk)].join(' '));
  const name = p.replace(/\W+/g, '_') || 'home';
  if (SHOTS.includes(p)) await page.screenshot({ path: `${out}/${name}-desktop.png`, fullPage: p.includes('subsidy') });
  const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (wide) errs.push('HORIZONTAL OVERFLOW (1366px)');
  // phone width: no horizontal scrolling either
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 });
  await sleep(300);
  if (SHOTS.includes(p)) await page.screenshot({ path: `${out}/${name}-mobile.png`, fullPage: p.includes('subsidy') });
  const narrow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (narrow) errs.push('HORIZONTAL OVERFLOW (390px)');
  console.log((errs.length ? '✗ ' : '✓ ') + p + (errs.length ? '\n   ' + errs.slice(0, 5).join('\n   ') : ''));
  if (errs.length) bad++;
  await page.close();
}

// ── interaction test: subsidy calculator ──
if (run('interact')) {
  const page = await browser.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(base + '/solar-subsidy-calculator', { waitUntil: 'networkidle0' });
  const hero = () => page.$eval('.calc-out .hero-stat strong', (e) => e.textContent.trim());
  const rows = () => page.$$eval('.calc-out .bd .bd-row', (els) => els.map((e) => e.querySelector('b').textContent.trim()));
  const state = () => page.$eval('.calc .ss-btn span', (e) => e.textContent.trim());
  const expect = (label, got, want) => (got === want ? console.log(`✓ ${label}: ${got}`) : fail(`${label}: expected "${want}", got "${got}"`));

  // server-rendered default (before any JavaScript ran): Gujarat, 2.18 kWp, General
  expect('default state', await state(), 'Gujarat');
  expect('default "You pay"', await hero(), '₹10,810');
  expect('default receipt (cost / central / state / you pay)', (await rows()).join(' | '), '₹1,08,100 | − ₹63,240 | − ₹34,050 | ₹10,810');
  expect('default best row', await page.$eval('.calc-out table.cmp tr.best th', (e) => e.textContent.trim().slice(0, 7)), '2.18 kW');

  // consumer class SC/ST (clicked before idle hydration – must still work thanks to click replay)
  const seg = await page.$$('.calc-in .seg');
  const classBtns = await seg[1].$$('button');
  await classBtns[1].click();
  await page.waitForFunction(() => document.querySelector('.calc-out .hero-stat strong').textContent.trim() === '₹5,405', { timeout: 8000 }).catch(() => {});
  expect('Gujarat SC/ST 2.18 kWp', await hero(), '₹5,405');
  await (await seg[1].$$('button'))[0].click();

  // quick chip 3 kW → above Gujarat's 2.18 kWp limit, state subsidy disappears
  const chips = await page.$$('.calc-in .chips .chip');
  for (const c of chips) if ((await c.evaluate((e) => e.textContent.trim())) === '3 kW') await c.click();
  await sleep(150);
  expect('Gujarat 3 kW', (await rows()).join(' | '), '₹1,45,000 | − ₹78,000 | − ₹0 | ₹67,000');
  expect('tip mentions the limit', String((await page.$eval('.calc-out .note.tip', (e) => e.textContent)).includes('2.18')), 'true');

  // type 2.18 back into the size field (decimals must be accepted)
  const kwInput = await page.$('.calc-in input[type=number]');
  await kwInput.click({ clickCount: 3 });
  await kwInput.type('2.18');
  await sleep(150);
  expect('typed 2.18 kWp', await hero(), '₹10,810');

  // switch to another state by typing in the searchable select
  await tap(page, '.calc .ss-btn');
  await page.waitForSelector('.ss-search', { timeout: 5000 });
  await page.type('.ss-search', 'odis');
  await page.keyboard.press('Enter');
  await sleep(250);
  expect('state after typing "odis"', await state(), 'Odisha');
  expect('Odisha default (3 kW at market price: 78,000 + 60,000)', (await rows()).join(' | '), '₹1,80,000 | − ₹78,000 | − ₹60,000 | ₹42,000');
  await tap(page, '.calc .ss-btn');
  await page.waitForSelector('.ss-search');
  await page.type('.ss-search', 'maharash');
  await page.keyboard.press('Enter');
  await sleep(250);
  expect('Maharashtra default (3 kW at market price, central only)', (await rows()).join(' | '), '₹1,80,000 | − ₹78,000 | − ₹0 | ₹1,02,000');

  // empty size field while typing → zeros, never NaN
  await kwInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await sleep(150);
  expect('empty size', await hero(), '₹0');
  const txt = await page.$eval('.calc-out', (e) => e.innerText);
  if (/NaN|undefined|Infinity/.test(txt)) fail('NaN / undefined in the result with an empty size');
  if (errs.length) fail('console errors during interaction: ' + errs.slice(0, 3).join(' | '));
  await page.close();
}

// ── fuzz: every calculator must survive empty, zero, negative and huge input and every option button ──
for (const p of run('fuzz') ? pages.filter((x) => /calculator|estimator|checker|generator/.test(x) && !/^\/(hi|gu|mr)\//.test(x)) : []) {
  const page = await browser.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.setViewport({ width: 1366, height: 900 });
  await page.goto(base + p, { waitUntil: 'networkidle0' });
  await page.mouse.move(10, 10); // starts hydration
  await page.waitForFunction(() => [...document.querySelectorAll('[data-island]')].every((el) => el.__ready), { timeout: 10000 }).catch(() => {});
  const res = await page.evaluate(async () => {
    const tick = () => new Promise((r) => setTimeout(r, 0));
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    const type = (el, v) => {
      setter.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const out = () => document.querySelector('.calc-out').innerText;
    const bad = [];
    const look = (what) => {
      const m = out().match(/NaN|undefined|Infinity|\[object|₹-|-₹|\{[a-z][a-zA-Z0-9]*\}/);
      if (m) bad.push(`${what} → "${m[0]}"`);
    };
    let steps = 0;
    // open the collapsed blocks so their fields are part of the test
    document.querySelectorAll('.calc details').forEach((d) => (d.open = true));
    const nSeg = document.querySelectorAll('.calc-in .seg button, .calc-in input[type=checkbox]').length;
    for (let s = -1; s < nSeg; s++) {
      if (s >= 0) {
        const b = document.querySelectorAll('.calc-in .seg button, .calc-in input[type=checkbox]')[s];
        if (!b) break;
        b.click();
        await tick();
        look('option "' + (b.textContent || 'checkbox').trim() + '"');
        steps++;
      }
      const n = document.querySelectorAll('.calc-in input[type=number]').length;
      for (let i = 0; i < n; i++) {
        for (const v of ['', '0', '-5', '0.01', '99999999']) {
          const el = document.querySelectorAll('.calc-in input[type=number]')[i];
          if (!el) break;
          const label = (el.closest('.field')?.querySelector('label')?.textContent || el.getAttribute('aria-label') || 'input ' + i).trim();
          const before = el.value;
          type(el, v);
          await tick();
          look(`${label} = "${v}"`);
          type(document.querySelectorAll('.calc-in input[type=number]')[i] || el, before);
          await tick();
          steps++;
        }
      }
    }
    return { steps, bad: [...new Set(bad)] };
  });
  if (res.bad.length || errs.length) fail(`fuzz ${p}: ${[...res.bad, ...errs].slice(0, 6).join(' ; ')}`);
  else console.log(`✓ fuzz ${p} (${res.steps} input changes)`);
  await page.close();
}

// ── PDF reports: generated in the page language; the blob is captured (headless Chrome does not save downloads) ──
const PDFS = [['/solar-subsidy-calculator', 'subsidy-en'], ['/gu/solar-subsidy-calculator', 'subsidy-gu'], ['/hi/solar-calculator', 'solar-hi'], ['/mr/solar-emi-calculator', 'emi-mr'], ['/solar-roi-calculator', 'roi-en'], ['/solar-proposal-generator', 'proposal-en']];
for (const [path, file] of run('pdf') ? PDFS : []) {
  const page = await browser.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.setViewport({ width: 1366, height: 900 });
  await page.evaluateOnNewDocument(() => {
    const orig = URL.createObjectURL.bind(URL);
    window.__blobs = [];
    URL.createObjectURL = (b) => {
      if (b instanceof Blob) window.__blobs.push(b);
      return orig(b);
    };
    window.print = () => { window.__printed = true; }; // PdfButton falls back to print() when the PDF fails
  });
  await page.goto(base + path, { waitUntil: 'networkidle0' });
  await tap(page, '.calc-out .act-row .btn-dark');
  const got = await page.waitForFunction(() => window.__blobs.length > 0 || window.__printed, { timeout: 30000 }).then(() => true, () => false);
  const b64 = got
    ? await page.evaluate(async () => {
        const b = window.__blobs[window.__blobs.length - 1];
        if (!b) return '';
        const buf = new Uint8Array(await b.arrayBuffer());
        let s = '';
        for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192));
        return btoa(s);
      })
    : '';
  const pdf = Buffer.from(b64, 'base64');
  if (pdf.subarray(0, 5).toString() === '%PDF-' && pdf.length > 20000 && !errs.length) {
    fs.writeFileSync(`${out}/${file}.pdf`, pdf);
    const n = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`✓ PDF ${path} → ${out}/${file}.pdf (${Math.round(pdf.length / 1024)} KB, ${n} page${n === 1 ? '' : 's'})`);
  } else fail(`PDF ${path}: ${errs[0] || (got ? 'no PDF blob (fell back to print)' : 'timeout')}`);
  await page.close();
}

await browser.close().catch((e) => console.log("(browser cleanup: " + e.code + ")")); // Windows can refuse to delete the temp profile – not a test failure
console.log(bad ? `\nFAILED: ${bad} problem(s)` : '\nAll checks passed');
process.exit(bad ? 1 : 0);
