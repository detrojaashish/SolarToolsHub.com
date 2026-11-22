# SolarToolsHub – working contract for parallel agents (Nov 2026)

Several agents edit this repo **at the same time**. Read this whole file before touching anything.

## 0. What the site is
- SolarToolsHub.com: all-India solar calculators, subsidy and state guides, in en / hi / gu / mr. Static React "islands" site (Vite 5 + React 18 + custom prerender). 288 pre-rendered pages. Must rank top in Google India for solar searches and pass AdSense review.
- **The site is 100% solar.** Non-solar calculators are never built here – we only *link* to akdet.com (wording: "Need more calculators? Visit akdet.com" – never "our other website", never "non-solar", akdet also has solar tools) (`NETWORK.akdet` in `src/config.js`).
- **Sales go through Avirat Energy Pvt. Ltd.** (installation partner, all-India installation and delivery). The public prefers to **call**, so every CTA is **call-first**: phone `+91 99797 45444` (`tel:` link) → WhatsApp → website link. All partner facts live in `PARTNER` in `src/config.js` (phone, WhatsApp, email, address, branches, logo `/partners/avirat-energy.png` 234×96 transparent PNG with dark-grey text – put it on a white/light chip). Never invent Avirat facts (no fake ratings, awards, review counts or "installed MW").
- **No contact details of the site owner anywhere, no Play Store link.** Credits: "Developed by TWOCOMPO TECHNOLOGIES PRIVATE LIMITED" → https://twocompo.com, and "Technology partner: MVPChecker" → https://mvpchecker.com (`NETWORK` in config).
- Hard quality bars: Lighthouse mobile 100/100/100/100 (Perf, A11y, Best-Practices, SEO), CLS 0, no external requests on page load, WCAG AA contrast, every dropdown is the searchable `SearchSelect`.

## 1. File ownership (STRICT – never edit a file you do not own; put requests for other files in your final report)
| Owner | Files |
|---|---|
| **designer** | `src/styles.css`, `src/components/Layout.jsx`, `src/components/ui.jsx`, `src/pages/home.jsx`, `src/pages/tools.jsx`, `src/pages/states.jsx`, `src/pages/misc.jsx`, `src/ui/SearchSelect.jsx`, `src/ui/fields.jsx` (markup/classes only – keep every prop name), `src/i18n/extra/ui.js`, `scripts/og-images.mjs`, `public/favicon.svg`, `public/manifest.webmanifest`, `public/fonts/*`, `public/icons/*`, `public/og/*` |
| **calc** | `src/lib/solar.js`, `src/lib/format.js`, `src/islands/*.jsx`, `src/data/lite.js`, `src/i18n/extra/calc.js`, `src/ui/pdf.js`, `scripts/check.mjs`, `scripts/test-calc.mjs` (new) |
| **domain** | `src/data/states.js`, `src/data/benefits.js` (new), `qa/reports/domain.md` |
| **seo** | `src/i18n/en.js`, `hi.js`, `gu.js`, `mr.js`, `src/pages/content.jsx`, `src/pages/guides.jsx` (new, optional), `src/data/posts.js`, `src/entry-server.jsx`, `scripts/prerender.mjs`, `public/_headers`, `public/.htaccess`, `docker/nginx.conf` |
| lead (nobody else) | `src/config.js`, `src/client.js`, `src/i18n/index.js`, `vite.config.js`, `package.json`, `Dockerfile`, `docker-compose.yml`, `README.md`, `docs/*` |

Exported names used across owners must not change: page component export names, island file names and their props (`t, states, defState, title, bill, mode, …`), `fields.jsx` component names/props, `lib/solar.js` existing export names (you may add new ones and add optional params).

## 2. Building without colliding
Node is not on PATH. In the Bash tool: `export PATH="/c/laragonnew/bin/nodejs/node-v18:$PATH"` (Node 18.8).
Each agent builds into its **own** output folder and port – never use plain `dist/` or port 4173:

| Agent | Build | Preview |
|---|---|---|
| designer | `OUT=dist-design npm run build` | `OUT=dist-design PORT=4181 node scripts/serve.mjs` |
| calc | `OUT=dist-calc npm run build` | `OUT=dist-calc PORT=4182 node scripts/serve.mjs` |
| seo | `OUT=dist-seo npm run build` | `OUT=dist-seo PORT=4183 node scripts/serve.mjs` |
| domain | (no build needed) `OUT=dist-domain npm run build` if you want to check | port 4184 |

Run the preview server in the background and stop it when done. Other agents' half-finished edits can break your build for a minute – if the error is in a file you do not own, wait ~1–2 min and retry; do not fix their file.
Tools: `node scripts/shot.mjs <url> <out.png> [width] [height] [fullPage 0|1]` (screenshot), `node scripts/check.mjs <baseUrl> <outDir>` (console/hydration/overflow QA), `node scripts/lighthouse.mjs <baseUrl> [paths…]` (mobile Lighthouse; first page of a run can show noisy TBT on Windows – re-run before trusting a low score). Put scratch files/screenshots under `qa/<your-name>/` (git-ignored).

## 3. i18n
- Big dictionaries `src/i18n/{en,hi,gu,mr}.js` belong to **seo** only.
- New strings from **calc** go to `src/i18n/extra/calc.js` (merged into `d.calc`, reaches islands as `t.<key>`); new strings from **designer** go to `src/i18n/extra/ui.js` (available as `d.ux.<key>` on pages and as `t.<key>` in islands). Shape `{ en:{}, hi:{}, gu:{}, mr:{} }`; English is the fallback. Always supply all four languages, written naturally (how people actually speak/search: Hindi and Gujarati users say "सोलर सब्सिडी", "સોલાર સબસિડી", "kW", "यूनिट"), not literal translation.
- Islands get `t = { ...d.calc, ...d.common, ...d.ux }`. PDF reports must be in the page language (en/hi/gu/mr): jsPDF text cannot shape Indic scripts, so the calc agent renders pages on a canvas (browser text shaping) and embeds them as images.

## 4. Subsidy data contract (`src/data/states.js` → `extra`, read by `lib/solar.js`)
Central scheme (PM Surya Ghar, residential, on-grid, DCR modules): ₹30,000/kW for the first 2 kW + ₹18,000 for the 3rd kW (max ₹78,000); special-category states/UTs ₹33,000 / ₹19,800 (max ₹85,800); RWA/GHS ₹18,000/kW up to 500 kW; nothing for commercial. MNRE benchmark cost: ₹50,000/kW for the first 2 kW, ₹45,000/kW above 2 kW (→ 2.18 kWp = ₹1,08,100).

Every state object keeps its current fields. `extra` becomes:
```js
extra: {
  status: 'confirmed' | 'reported' | 'unconfirmed' | 'none', // 'none' = no state top-up at all
  asOf: 'YYYY-MM-DD',           // date the rule was last verified
  source: 'https://…',          // best primary source
  note: 'plain-English sentence(s) shown on the state page',
  minKw, maxKw,                 // eligible NEW-system size window in kWp; outside it the top-up is 0
  // ── default RULE (used for consumer class "general" and for any class without its own entry) – use ONE of:
  perKw, max,                   // ₹ per kW with optional cap
  rates: [..], max,             // slab ₹ for 1st, 2nd, 3rd… kW (pro-rata inside a kW), optional cap
  flat,                         // flat ₹ amount
  benchmark: { first2: 50000, above2: 45000 }, share: 10,
                                // benchmark model: household pays `share` % of benchmark cost,
                                // state pays  max(0, benchmarkCost − centralCFA − householdShare)
  // ── per-consumer-class overrides: each value is a partial RULE shallow-merged over the default rule
  classes: { scst: { share: 5 }, bpl: { perKw: 20000, max: 40000 }, free: { flat: 17000, minKw: 1.1 } },
  general: false,               // set ONLY when the scheme is restricted to the listed classes (means-tested)
}
```
Consumer class ids (fixed): `general`, `scst` (SC/ST), `bpl` (BPL / Antyodaya / EWS / low-income), `free` (registered beneficiary of the state's free- or subsidised-electricity scheme). The calculator shows a class selector containing `general` + the keys of `classes` for the chosen state.
Reference example the owner has confirmed (Gujarat, systems commissioned from 22 Oct 2026, ≤ 2.18 kWp): benchmark model, share 10 % general / 5 % SC-ST → **2.18 kWp: benchmark ₹1,08,100, central ₹63,240, household pays ₹10,810 (SC/ST ₹5,405), state pays ₹34,050**; 2 kWp: central ₹60,000, state ₹30,000, household ₹10,000. This must reproduce exactly and is the default state/size of the subsidy calculator.
Other owner-supplied reference values (from akdet.com/solar-subsidy-calculator, checked 25 Oct 2026): Delhi ₹10,000/kW max ₹30,000 (3 kW total ₹1,08,000); Bihar ₹10,000/kW max ₹20,000; Uttar Pradesh ₹15,000/kW max ₹30,000 (reported); Rajasthan flat ₹17,000 for registered free-electricity households with ≥ 1.1 kW (reported). Where a primary source clearly contradicts these, use the primary source and say so in your report.

## 5. CSS class contract for calculator markup (calc writes markup, designer writes CSS)
Existing (keep working): `.calc .calc-in .calc-out .calc-wide .field .lbl .inp .fix .hint .seg(.on) .sel .ss-btn .ss-pop .ss-search .ss-list .stats .stat(.big .acc) .sl .sv .hero-stat .out-h .sub-h .bars .bar .bl .bt .bf(.b1 .b2 .b3) .bv .note(.ok) .act-row .btn(.btn-sun .btn-dark .btn-ghost .btn-lg .btn-call .btn-wa) .mini-cta .mc-t .mc-a .mc-link .tbl .tscroll .grid2 .grid3 .proposal`.
New:
```html
<div class="bd">                               <!-- itemised "receipt" breakdown -->
  <div class="bd-h">Subsidy breakdown</div>
  <div class="bd-row"><span>System cost <small>MNRE benchmark</small></span><b>₹1,08,100</b></div>
  <div class="bd-row minus"><span>Central subsidy <small>2 kW × ₹30,000 + 0.18 kW × ₹18,000</small></span><b>− ₹63,240</b></div>
  <div class="bd-row minus"><span>Gujarat state subsidy</span><b>− ₹34,050</b></div>
  <div class="bd-row tot"><span>You pay</span><b>₹10,810</b></div>
</div>
<ul class="ben"><li><b>Title</b><span>one-line explanation</span></li></ul>   <!-- list of benefits -->
<span class="tag">neutral</span> <span class="tag ok">confirmed</span> <span class="tag warn">reported</span>
<p class="note warn">warning note</p>   <p class="note tip">best-value suggestion</p>
<details class="adv"><summary>Edit rates (advanced)</summary>…fields…</details>
<table class="tbl cmp">…<tr class="best">…</tr></table>   <!-- comparison table, best row highlighted -->
```
