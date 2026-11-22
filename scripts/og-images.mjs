// Generates favicons + one 1200x630 Open Graph image per page (in the page's language).
// Run after `npm run build` (needs dist-server/routes.json). Writes to public/ and dist/.
// Uses system fonts (Segoe UI / Nirmala UI on Windows) so Indic scripts render correctly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.OUT || 'dist';
const out = [path.join(root, 'public'), path.join(root, OUT)].filter((p) => fs.existsSync(p));
const routes = JSON.parse(fs.readFileSync(path.join(root, OUT + '-server', 'routes.json'), 'utf8'));
const force = process.argv.includes('--force');

const write = async (rel, buf) => {
  for (const o of out) {
    const f = path.join(o, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, buf);
  }
};

// ── icons ───────────────────────────────────────────────────────────────
const favicon = fs.readFileSync(path.join(root, 'public', 'favicon.svg'));
for (const [name, size] of [['icons/icon-192.png', 192], ['icons/icon-512.png', 512], ['icons/apple-touch-icon.png', 180], ['icons/icon-48.png', 48]]) {
  await write(name, await sharp(favicon, { density: 600 }).resize(size, size).png().toBuffer());
}
const maskable = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#0a1120"/><image href="data:image/svg+xml;base64,${favicon.toString('base64')}" x="96" y="96" width="320" height="320"/></svg>`);
await write('icons/maskable-512.png', await sharp(maskable).png().toBuffer());
// favicon.ico = ICO container with an embedded 48px PNG
const png48 = await sharp(favicon, { density: 300 }).resize(48, 48).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(0, 0); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico.writeUInt8(48, 6); ico.writeUInt8(48, 7); ico.writeUInt8(0, 8); ico.writeUInt8(0, 9);
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(png48.length, 14); ico.writeUInt32LE(22, 18);
await write('favicon.ico', Buffer.concat([ico, png48]));

// ── OG images ──────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TAG = { en: 'Free Solar Calculators · India 2026', hi: 'मुफ़्त सोलर कैलकुलेटर · भारत 2026', gu: 'મફત સોલાર કેલ્ક્યુલેટર · ભારત 2026', mr: 'मोफत सोलर कॅल्क्युलेटर · भारत 2026' };

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  if (lines.length > 3) { lines.length = 3; lines[2] = lines[2].replace(/\s*\S*$/, '') + '…'; }
  return lines;
}

function svg({ title, lang }) {
  const indic = lang !== 'en';
  const lines = wrap(title, indic ? 27 : 29);
  const fs1 = lines.length > 2 ? 62 : 72;
  const font = indic ? "'Nirmala UI','Noto Sans Devanagari','Noto Sans Gujarati',sans-serif" : "'Segoe UI','Inter','Noto Sans',Arial,sans-serif";
  const mono = indic ? font : "'Cascadia Mono','Consolas','Menlo',monospace";
  const tag = TAG[lang] || TAG.en;
  // PV-cell grid (fades out towards the text on the left)
  const grid = [];
  for (let x = 60; x < 1200; x += 60) grid.push(`<path d="M${x} 0v630"/>`);
  for (let y = 60; y < 630; y += 60) grid.push(`<path d="M0 ${y}h1200"/>`);
  const y0 = 300 - ((lines.length - 1) * (fs1 + 12)) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="fade" x1="0" y1="1" x2="1" y2="0"><stop offset=".35" stop-color="#0a1120"/><stop offset="1" stop-color="#0a1120" stop-opacity="0"/></linearGradient></defs>
<rect width="1200" height="630" fill="#0a1120"/>
<g stroke="#ffffff" stroke-opacity=".09" stroke-width="1.5">${grid.join('')}</g>
<rect width="1200" height="630" fill="url(#fade)"/>
<circle cx="1110" cy="50" r="290" fill="none" stroke="#ffd400" stroke-opacity=".5" stroke-width="2" stroke-dasharray="3 11"/>
<circle cx="1110" cy="50" r="150" fill="#ffd400"/>
<g transform="translate(64,56)">
<g fill="#f3f6fa"><rect width="23" height="23" rx="5"/><rect y="31" width="23" height="23" rx="5"/><rect x="31" y="31" width="23" height="23" rx="5"/></g><circle cx="42.5" cy="11.5" r="11.5" fill="#ffd400"/>
<text x="72" y="39" font-family="'Segoe UI',Arial,sans-serif" font-size="33" font-weight="800" fill="#f3f6fa" letter-spacing="-1">Solar<tspan fill="#ffd400" font-weight="500">ToolsHub</tspan></text>
</g>
<rect x="64" y="${y0 - fs1 - 44}" width="12" height="12" fill="#ffd400"/>
<text x="90" y="${y0 - fs1 - 31}" font-family="${mono}" font-size="${indic ? 22 : 20}" font-weight="700" fill="#ffd400"${indic ? '' : ' letter-spacing="1.5"'}>${esc(indic ? tag : tag.toUpperCase())}</text>
${lines.map((l, i) => `<text x="62" y="${y0 + i * (fs1 + 12)}" font-family="${font}" font-size="${fs1}" font-weight="800" fill="#ffffff"${indic ? '' : ' letter-spacing="-2"'}>${esc(l)}</text>`).join('\n')}
<rect x="64" y="536" width="1072" height="2" fill="#27344e"/>
<text x="64" y="584" font-family="'Segoe UI',Arial,sans-serif" font-size="25" font-weight="700" fill="#c9d2df">solartoolshub.com</text>
<rect x="1040" y="566" width="96" height="14" fill="#ffd400"/>
</svg>`;
}

let made = 0;
for (const r of routes) {
  const rel = `og/${r.key}.jpg`;
  if (!force && fs.existsSync(path.join(root, 'public', rel))) {
    if (fs.existsSync(path.join(root, OUT))) { fs.mkdirSync(path.join(root, OUT, 'og'), { recursive: true }); fs.copyFileSync(path.join(root, 'public', rel), path.join(root, OUT, rel)); }
    continue;
  }
  const buf = await sharp(Buffer.from(svg(r))).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  await write(rel, buf);
  made++;
}
console.log(`Icons done · OG images generated: ${made} (of ${routes.length})`);
