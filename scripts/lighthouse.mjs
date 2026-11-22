// Runs Lighthouse (mobile, PageSpeed defaults) against a few pages and prints category scores.
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4173';
const pages = process.argv.slice(3).length ? process.argv.slice(3) : ['/', '/solar-calculator', '/state/gujarat', '/gu/solar-subsidy-calculator', '/blog/solar-panel-price-in-india'];
const chromePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox'] });
for (const p of pages) {
  const r = await lighthouse(base + p, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
  const c = r.lhr.categories;
  const a = r.lhr.audits;
  const s = (k) => Math.round(c[k].score * 100);
  console.log(`${p.padEnd(34)} Perf ${s('performance')} | A11y ${s('accessibility')} | BP ${s('best-practices')} | SEO ${s('seo')} | LCP ${a['largest-contentful-paint'].displayValue} TBT ${a['total-blocking-time'].displayValue} CLS ${a['cumulative-layout-shift'].displayValue}`);
  const fails = Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === 'binary').map((x) => x.id);
  if (fails.length) console.log('   failing: ' + fails.join(', '));
  if (process.env.LH_DEBUG) {
    for (const id of ['color-contrast', 'heading-order']) {
      const it = a[id]?.details?.items || [];
      it.slice(0, 6).forEach((x) => console.log(`   ${id}: ${x.node?.snippet?.slice(0, 120)}`));
    }
  }
}
await chrome.kill();
