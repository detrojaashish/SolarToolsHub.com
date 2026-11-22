// Screenshot helper. usage: node scripts/shot.mjs <url> <out.png> [width=1366] [height=900] [full=0]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const [url, out, w = '1366', h = '900', full = '0'] = process.argv.slice(2);
const exe = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const browser = await puppeteer.launch({ executablePath: exe, headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, isMobile: +w < 600, deviceScaleFactor: 1 });
try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 }); } catch (e) { console.log('nav:', e.message); }
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: out, fullPage: full === '1' });
console.log('saved', out, await page.title());
await browser.close();
