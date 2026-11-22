// Lazy PDF report generator – downloaded only when the user clicks "Download PDF".
//
// The report is in the language of the page (en / hi / gu / mr). jsPDF's own text engine cannot shape
// Devanagari or Gujarati (matras and conjuncts break), so every A4 page is laid out on an offscreen <canvas>
// with Canvas 2D fillText – the browser shapes Indic scripts correctly with the system fonts – and then placed
// in the PDF as one JPEG. Invisible link annotations keep the phone / WhatsApp / e-mail / website lines tappable.
//
// report = { title, subtitle, filename, note,
//   sections: [ { title, rows: [[label, value, { sub, tot }?]] }      label left, value right, optional small text
//             | { title, table: { head: [], rows: [[]] } }
//             | { title, list: [] }                                    bullet list (rates, conditions, notes)
//             | { title, text } ] }
// opts   = { t, lang }  – t = the island's strings (pdf* keys are used for the page chrome)

import { PARTNER } from '../config.js';

const PW = 595; // A4 in pt
const PH = 842;
const M = 44;
const CW = PW - 2 * M;
const SCALE = 2.5; // canvas pixels per pt (≈ 180 dpi)
const BOTTOM = PH - 66; // content must end above the footer
const FF = '"Segoe UI","Nirmala UI","Noto Sans Devanagari","Noto Sans Gujarati","Noto Sans",system-ui,-apple-system,Roboto,Arial,sans-serif';
const INK = '#0f172a';
const MUTE = '#475569';
const SOFT = '#64748b';
const LINE = '#e2e8f0';
const AMBER = '#b45309';
const SITE_URL = PARTNER.url + '/?utm_source=solartoolshub&utm_medium=pdf';

const loadLogo = () =>
  new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = PARTNER.logo;
  });

// Marathi "æ" typed as अ + ◌ॅ shows a dotted circle in some fonts – use the single letter ॲ instead
const clean = (s) => String(s ?? '').replace(/अॅ/g, 'ॲ');
// input labels carry their unit, e.g. "Loan amount (₹)" – in a report the value already shows it
const bare = (s) => clean(s).replace(/\s*\((₹[^)]*|kWp?|kWh|%|W|V|A|m|ft)\)/g, '');

export async function downloadReport({ title = '', subtitle, sections = [], note, filename = 'solar-report.pdf' }, { t = {}, lang = 'en' } = {}) {
  const [{ jsPDF }, logo] = await Promise.all([import('jspdf'), loadLogo(), document.fonts && document.fonts.ready]);
  // page-chrome strings (literal t.keys so unused strings can be pruned by a source scan), English fallback
  const S = {
    tagline: clean(t.pdfTagline || 'Free solar calculators for India'),
    partnerH: clean(t.pdfPartnerH || 'Get this system installed – our installation partner'),
    partnerLine: clean(t.partnerLine || 'Solar installation, subsidy paperwork & delivery across India'),
    callNow: clean(t.callNow || t.pdfCall || 'Call'),
    call: clean(t.pdfCall || 'Call'),
    whatsapp: clean(t.whatsapp || 'WhatsApp'),
    foot: clean(t.pdfFoot || 'Installation partner'),
    disc: clean(t.pdfDisc || 'Estimates are indicative. Verify final figures with your DISCOM and installer.'),
    page: clean(t.pdfPage || 'Page {n} of {m}'),
  };
  let date;
  try {
    date = new Date().toLocaleDateString(lang + '-IN-u-nu-latn', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  let pages = [];
  let ctx;
  let links;
  let y = 0;
  let K = 1; // vertical density: 1 = normal, < 1 = tighter (used to avoid a nearly empty last page)
  let dry = false; // measuring pass: count pages on one small scratch canvas
  const scratch = document.createElement('canvas');

  // ── drawing helpers (all coordinates in pt) ──
  const font = (size, weight = 400, italic = false) => {
    ctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${FF}`;
  };
  const width = (s) => ctx.measureText(s).width;
  /** word-wrap with the current font; a single over-long word is broken by characters */
  const wrap = (text, maxW) => {
    const out = [];
    for (const para of clean(text).split('\n')) {
      let line = '';
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const test = line ? line + ' ' + word : word;
        if (width(test) <= maxW) line = test;
        else {
          if (line) out.push(line);
          line = word;
          while (width(line) > maxW && line.length > 1) {
            let cut = line.length - 1;
            while (cut > 1 && width(line.slice(0, cut)) > maxW) cut--;
            out.push(line.slice(0, cut));
            line = line.slice(cut);
          }
        }
      }
      out.push(line);
    }
    return out.length ? out : [''];
  };
  const draw = (lines, x, top, lh, color, align = 'left') => {
    if (dry) return;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    (Array.isArray(lines) ? lines : [lines]).forEach((ln, i) => ctx.fillText(clean(ln), x, top + lh * i + lh * 0.74));
    ctx.textAlign = 'left';
  };
  const rect = (x, top, w, h, fill, r = 0, stroke) => {
    if (dry) return;
    ctx.beginPath();
    if (r) {
      ctx.moveTo(x + r, top);
      ctx.arcTo(x + w, top, x + w, top + h, r);
      ctx.arcTo(x + w, top + h, x, top + h, r);
      ctx.arcTo(x, top + h, x, top, r);
      ctx.arcTo(x, top, x + w, top, r);
      ctx.closePath();
    } else ctx.rect(x, top, w, h);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };
  const hline = (top, color = LINE) => {
    if (dry) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.moveTo(M, top);
    ctx.lineTo(PW - M, top);
    ctx.stroke();
  };
  const link = (x, top, w, h, url) => links.push({ x, y: top, w, h, url });

  const newPage = () => {
    const canvas = dry ? scratch : document.createElement('canvas');
    canvas.width = dry ? 8 : Math.round(PW * SCALE);
    canvas.height = dry ? 8 : Math.round(PH * SCALE);
    ctx = canvas.getContext('2d');
    ctx.scale(SCALE, SCALE);
    ctx.textBaseline = 'alphabetic';
    links = [];
    pages.push({ canvas, ctx, links });
    rect(0, 0, PW, PH, '#ffffff');
    // header band
    rect(0, 0, PW, 70, INK);
    if (!dry) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(M + 14, 35, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    font(18, 700);
    draw('SolarToolsHub', M + 38, 15, 22, '#ffffff');
    font(9);
    draw(S.tagline + '  |  solartoolshub.com', M + 38, 39, 13, '#cbd5e1');
    draw(date, PW - M, 22, 13, '#ffffff', 'right');
    y = 92;
  };
  const ensure = (h) => {
    if (y + h > BOTTOM) newPage();
  };

  const heading = (text) => {
    font(11.5, 700);
    const lines = wrap(bare(text).toUpperCase(), CW);
    draw(lines, M, y, 15, AMBER);
    y += lines.length * 15 + 4 * K;
  };

  // label left (wraps), value right (wraps), optional small text under the label
  const row = ([label, value, o = {}]) => {
    const LH = 15 * K;
    const SH = 12 * K;
    const PAD = 9 * K;
    const valSize = o.tot ? 12.5 : 10.5;
    label = bare(label);
    value = clean(value);
    font(valSize, 700);
    const vNat = width(value);
    font(10.5, o.tot ? 700 : 400);
    const lNat = width(label);
    // give the value what it needs up to 62 % of the line, the label gets the rest
    const vMax = lNat + vNat + 18 <= CW ? vNat : Math.min(CW * 0.62, Math.max(CW * 0.4, CW - lNat - 18));
    const lMax = CW - Math.min(vNat, vMax) - 18;
    const lLines = wrap(label, lMax);
    font(8.8);
    const sLines = o.sub ? wrap(o.sub, lMax) : [];
    font(valSize, 700);
    const vLines = wrap(value, vMax + 0.5);
    const h = Math.max(lLines.length * LH + sLines.length * SH, vLines.length * LH) + PAD;
    ensure(h);
    if (o.tot) rect(M - 6, y, CW + 12, h - 1, '#fef3c7', 5);
    font(10.5, o.tot ? 700 : 400);
    draw(lLines, M, y + PAD / 2 - 1, LH, o.tot ? INK : MUTE);
    if (sLines.length) {
      font(8.8);
      draw(sLines, M, y + PAD / 2 - 1 + lLines.length * LH, SH, SOFT);
    }
    font(valSize, 700);
    draw(vLines, PW - M, y + PAD / 2 - 1, LH, INK, 'right');
    if (!o.tot) hline(y + h - 1);
    y += h;
  };

  const table = ({ head = [], rows = [] }) => {
    const LH = 12.5 * K;
    const PAD = 8 * K;
    const n = head.length || (rows[0] || []).length;
    if (!n) return;
    const all = [head, ...rows].map((r) => Array.from({ length: n }, (_, i) => clean(r[i])));
    // column widths follow the content; when the table is too wide every column shrinks and its text wraps
    font(9, 700);
    const nat = Array.from({ length: n }, (_, i) => Math.max(...all.map((r) => width(r[i]))) + 12);
    const sum = nat.reduce((a, b) => a + b, 0);
    const cw = nat.map((w) => (sum <= CW ? w + (CW - sum) / n : Math.max(34, (w * CW) / sum)));
    const fit = CW / cw.reduce((a, b) => a + b, 0);
    const x = [];
    cw.reduce((a, w, i) => ((x[i] = a), (cw[i] = w * fit), a + w * fit), M);
    const numeric = Array.from({ length: n }, (_, i) => i > 0 && rows.every((r) => /^[\s−\-+₹\d]/.test(String(r[i] ?? '0'))));
    const line = (cells, isHead) => {
      font(9, isHead ? 700 : 400);
      const wrapped = cells.map((c, i) => wrap(c, cw[i] - 10));
      const h = Math.max(...wrapped.map((w) => w.length)) * LH + PAD;
      if (y + h > BOTTOM) {
        newPage();
        if (!isHead && head.length) line(all[0], true);
        font(9, isHead ? 700 : 400);
      }
      if (isHead) rect(M, y, CW, h, '#f1f5f9');
      wrapped.forEach((w, i) => draw(w, numeric[i] ? x[i] + cw[i] - 5 : x[i] + 5, y + PAD / 2, LH, INK, numeric[i] ? 'right' : 'left'));
      if (!isHead) hline(y + h, '#f1f5f9');
      y += h;
    };
    if (head.length) line(all[0], true);
    all.slice(head.length ? 1 : 0).forEach((r) => line(r, false));
  };

  const bullets = (items) => {
    const LH = 13.5 * K;
    for (const item of items) {
      font(9.5);
      const lines = wrap(item, CW - 12);
      ensure(lines.length * LH + 4 * K);
      font(9.5);
      draw('•', M, y, LH, AMBER);
      draw(lines, M + 12, y, LH, MUTE);
      y += lines.length * LH + 4 * K;
    }
  };

  const para = (text, { size = 9.5, color = MUTE, italic = false } = {}) => {
    const LH = size * 1.45 * K;
    font(size, 400, italic);
    for (const ln of wrap(text, CW)) {
      ensure(LH);
      font(size, 400, italic);
      draw(ln, M, y, LH, color);
      y += LH;
    }
  };

  // installation partner box: logo, legal name, call / WhatsApp, e-mail, website, address
  const partner = () => {
    const tx = logo ? M + 160 : M + 16;
    const tw = M + CW - tx - 14;
    font(9);
    const pl = wrap(S.partnerLine, tw).slice(0, 2);
    font(8);
    const addr = wrap(PARTNER.address, tw).slice(0, 2);
    const bh = Math.max(94, 41 + pl.length * 12.5 + 32 + addr.length * 11 + 9);
    ensure(bh + 4);
    rect(M, y, CW, bh, '#fffbeb', 8, '#f59e0b');
    if (logo) {
      rect(M + 12, y + 16, 132, 62, '#ffffff', 6);
      if (!dry) {
        try {
          ctx.drawImage(logo, M + 20, y + 23, 116, 116 * (logo.naturalHeight / logo.naturalWidth || 0.41));
        } catch {}
      }
    }
    font(8, 700);
    draw(wrap(S.partnerH.toUpperCase(), tw).slice(0, 1), tx, y + 8, 12, AMBER);
    font(14, 700);
    draw(PARTNER.legalName, tx, y + 20, 19, INK);
    font(9);
    draw(pl, tx, y + 39, 12.5, MUTE);
    const cy = y + 41 + pl.length * 12.5;
    font(12, 700);
    const call = `${S.callNow}: ${PARTNER.phone}`;
    draw(call, tx, cy, 17, '#047857');
    link(tx, cy, width(call), 17, 'tel:' + PARTNER.tel);
    const wx = tx + width(call) + 14;
    const wa = S.whatsapp + ' ›';
    draw(wa, wx, cy, 17, '#047857');
    link(wx, cy, width(wa), 17, 'https://wa.me/' + PARTNER.whatsapp);
    font(9);
    const sep = '   |   ';
    const site = PARTNER.url.replace('https://', '');
    draw(PARTNER.email + sep + site, tx, cy + 18, 13, INK);
    link(tx, cy + 18, width(PARTNER.email), 13, 'mailto:' + PARTNER.email);
    link(tx + width(PARTNER.email + sep), cy + 18, width(site), 13, SITE_URL);
    font(8);
    draw(addr, tx, cy + 32, 11, SOFT);
    y += bh + 10;
  };

  const layout = () => {
    pages = [];
    newPage();
    font(20, 700);
    const tl = wrap(title, CW);
    draw(tl, M, y, 26, INK);
    y += tl.length * 26;
    if (subtitle) {
      font(10.5);
      const sl = wrap(bare(subtitle), CW);
      draw(sl, M, y + 2, 15, MUTE);
      y += sl.length * 15 + 2;
    }
    y += 10 * K;
    for (const sec of sections) {
      if (!sec) continue;
      // keep a heading with its first rows, and a short table in one piece
      const rows = sec.table ? (sec.table.rows || []).length + 1 : 0;
      ensure(sec.title ? 24 + (rows && rows <= 14 ? rows * 21 * K : 30) : 0);
      if (sec.title) heading(sec.title);
      if (sec.table) table(sec.table);
      for (const r of sec.rows || []) row(r);
      if (sec.list) bullets(sec.list.filter(Boolean));
      if (sec.text) para(sec.text);
      y += 12 * K;
    }
    if (note) {
      para(note, { size: 9.5, color: SOFT, italic: lang === 'en' });
      y += 10 * K;
    }
    partner();
    return pages.length;
  };

  // a first measuring pass; if a slightly tighter layout saves a page (typically a last page holding only the
  // partner box) use it
  dry = true;
  const n1 = layout();
  if (n1 > 1) K = [0.94, 0.88, 0.82].find((k) => ((K = k), layout() < n1)) || 1;
  dry = false;
  layout();

  // ── footer on every page (needs the page count, so it is drawn last) ──
  pages.forEach((pg, i) => {
    ctx = pg.ctx;
    links = pg.links;
    hline(PH - 54);
    font(8);
    const foot = `${S.foot}: ${PARTNER.legalName}  |  ${S.call} / WhatsApp ${PARTNER.phone}  |  ${PARTNER.url.replace('https://', '')}`;
    draw(wrap(foot, CW - 70).slice(0, 1), M, PH - 50, 12, SOFT);
    link(M, PH - 50, Math.min(width(foot), CW - 70), 12, SITE_URL);
    draw(wrap(S.disc, CW).slice(0, 2), M, PH - 38, 11, SOFT);
    draw(S.page.replace('{n}', i + 1).replace('{m}', pages.length), PW - M, PH - 50, 12, SOFT, 'right');
  });

  // ── canvas pages → PDF ──
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  const dw = doc.internal.pageSize.getWidth();
  const dh = doc.internal.pageSize.getHeight();
  const kx = dw / PW;
  const ky = dh / PH;
  pages.forEach((pg, i) => {
    if (i) doc.addPage();
    doc.addImage(pg.canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, dw, dh, undefined, 'FAST');
    pg.links.forEach((l) => doc.link(l.x * kx, l.y * ky, l.w * kx, l.h * ky, { url: l.url }));
    pg.canvas.width = pg.canvas.height = 0; // free the bitmap
  });
  doc.save(filename);
}
