// High-demand landing pages (owner: seo): size-wise price pages, price list hub, apply-online guide,
// on-grid vs off-grid comparison, plus small localized add-on blocks for state / segment pages.
// Every number comes from src/lib/solar.js so the pages always agree with the calculators.
// Uses only existing shared components and CSS classes.
import { Breadcrumbs, Faq, Cta, AdSlot, PageHead, ToolCard } from '../components/ui.jsx';
import { lp } from '../i18n/index.js';
import { STATES } from '../data/states.js';
import * as S from '../lib/solar.js';
import { PARTNER } from '../config.js';

export const PRICE_SIZES = [1, 2, 3, 4, 5, 10];
export const priceSlug = (kw) => `${kw}kw-solar-system-price`;
export const GUIDE = { hub: '/solar-panel-price', apply: '/pm-surya-ghar-apply-online', types: '/on-grid-vs-off-grid-solar', list: '/solar-subsidy-state-wise' };
const HUB_SIZES = [1, 2, 3, 4, 5, 6, 8, 10];
const TOP_STATES = ['gujarat', 'maharashtra', 'uttar-pradesh', 'rajasthan', 'delhi', 'madhya-pradesh', 'karnataka', 'tamil-nadu', 'haryana', 'punjab', 'bihar', 'kerala', 'west-bengal', 'telangana'];
const GEN = 4.2; // all-India average units per kW per day (same default as lib/solar.js)
const TARIFF = 7; // ₹ per unit used for the headline example

// ─── formatting ────────────────────────────────────────────────────────
const nf = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const n0 = (n) => nf.format(Math.round(Number(n) || 0));
const rupee = (n) => '₹' + n0(n);
const dec = (x) => x.toFixed(2).replace(/\.?0+$/, '');
const roundTo = (n, step) => Math.round((Number(n) || 0) / step) * step;
const fill = (str, vars = {}) => String(str ?? '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));

/** ₹96,000 · ₹1.74 lakh · ₹1.2 crore – with the language's own word for lakh / crore */
export function money(n, d) {
  n = Math.round(Number(n) || 0);
  if (n >= 1e7) return `₹${dec(n / 1e7)} ${d?.common?.crore || 'crore'}`;
  if (n >= 1e5) return `₹${dec(n / 1e5)} ${d?.common?.lakh || 'lakh'}`;
  return rupee(n);
}
/** ₹65,000–₹81,000 · ₹1.57–1.95 lakh */
export function moneyRange(lo, hi, d) {
  lo = roundTo(lo, 1000);
  hi = roundTo(hi, 1000);
  if (lo >= 1e5 && hi < 1e7) return `₹${dec(lo / 1e5)}–${dec(hi / 1e5)} ${d?.common?.lakh || 'lakh'}`;
  if (hi < 1e5) return `${rupee(lo)}–${rupee(hi)}`;
  return `${money(lo, d)}–${money(hi, d)}`;
}

// ─── maths (defensive wrappers around lib/solar.js) ────────────────────
const num = (v, f = 0) => (Number.isFinite(Number(v)) ? Number(v) : f);
function cost(kw, type = 'ongrid') {
  let c = null;
  try { c = S.systemCost(kw, type); } catch { c = null; }
  const mid = num(c && typeof c === 'object' ? c.mid : c);
  return { mid, low: num(c && c.low, Math.round(mid * 0.9)), high: num(c && c.high, Math.round(mid * 1.12)) };
}
const central = (kw, special = false) => { try { return num(S.centralSubsidy(kw, { special })); } catch { return 0; } };
const stateTop = (kw, s) => { try { return typeof S.stateSubsidy === 'function' ? num(S.stateSubsidy(kw, s)) : 0; } catch { return 0; } };
const genYear = (kw, gen = GEN) => { try { return num(S.yearlyGeneration(kw, gen), Math.round(kw * gen * 365)); } catch { return Math.round(kw * gen * 365); } };
const roi = (o) => { try { return S.roiModel(o) || {}; } catch { return {}; } };
const emiOf = (p, r, y) => { try { return num((S.emi(p, r, y) || {}).emi); } catch { return 0; } };
/** MNRE benchmark cost (contract §4): ₹50,000/kW for the first 2 kW, ₹45,000/kW above */
export const benchmark = (kw) => {
  try { if (typeof S.benchmarkCost === 'function') { const b = num(S.benchmarkCost(kw)); if (b > 0) return b; } } catch { /* fall through */ }
  return Math.min(kw, 2) * 50000 + Math.max(0, kw - 2) * 45000;
};
/** price range text for a size and system type, e.g. typeRange(3, 'hybrid') */
export const typeRange = (kw, type, d) => { const c = cost(kw, type); return moneyRange(c.low, c.high, d); };
const years1 = (y) => (y === null || y === undefined || !Number.isFinite(Number(y)) ? '—' : dec(Math.round(Number(y) * 10) / 10));

/** All figures for one system size (general-category home, on-grid) */
export function priceModel(kw, d, { tariff = TARIFF, gen = GEN } = {}) {
  const c = cost(kw);
  const sub = Math.min(central(kw), c.mid);
  const subSp = Math.min(central(kw, true), c.mid);
  const net = c.mid - sub;
  const unitsYear = genYear(kw, gen);
  const unitsMonth = roundTo(unitsYear / 12, 5);
  const r = roi({ kw, netCost: net, grossCost: c.mid, tariff, gen });
  const saveYear = roundTo(unitsYear * tariff, 100);
  const small = kw <= 3;
  const rate = small ? 6 : 8.15; // repo + 0.5 % up to ₹2 lakh (≤ 3 kW); normal bank rate above (domain report, Nov 2026)
  const yrs = 5;
  const vars = {
    kw,
    range: moneyRange(c.low, c.high, d),
    cost: money(roundTo(c.mid, 1000), d),
    perKw: rupee(roundTo(c.mid / kw, 100)),
    benchmark: rupee(benchmark(kw)),
    benchNet: rupee(Math.max(0, benchmark(kw) - sub)),
    subsidy: rupee(sub),
    subsidySpecial: rupee(subSp),
    net: money(roundTo(net, 1000), d),
    netSpecial: money(roundTo(c.mid - subSp, 1000), d),
    panels: Math.ceil((kw * 1000) / 550),
    areaLow: n0(kw * 80),
    areaHigh: n0(kw * 100),
    unitsDay: dec(Math.round(kw * gen * 10) / 10),
    unitsMonth: n0(unitsMonth),
    unitsYear: n0(roundTo(unitsYear, 10)),
    co2: dec(Math.round(((unitsYear * num(S.CO2_PER_KWH, 0.71)) / 1000) * 10) / 10),
    bill: `${rupee(roundTo(unitsMonth * 6, 100))}–${rupee(roundTo(unitsMonth * 8, 100))}`,
    tariff,
    saveYear: rupee(saveYear),
    saveMonth: rupee(roundTo(saveYear / 12, 100)),
    payback: years1(r.payback),
    save25: money(roundTo(num(r.total), 1000), d),
    rate,
    years: yrs,
    emi: rupee(emiOf(net, rate, yrs)),
  };
  return { kw, c, sub, subSp, net, unitsYear, unitsMonth, small, vars };
}

/** Subsidy and savings for one state and size – same formula the state pages use */
export function stateModel(s, kw = 3) {
  const c = cost(kw);
  const cen = central(kw, !!s.special);
  const top = stateTop(kw, s);
  const sub = Math.min(c.mid, cen + top);
  const net = c.mid - sub;
  const units = genYear(kw, s.gen);
  const r = roi({ kw, netCost: net, grossCost: c.mid, tariff: s.tariff, gen: s.gen });
  return { cost: c.mid, central: cen, top, sub, net, units, savings: Math.round(units * s.tariff), payback: r.payback };
}

/** Global tokens available in every dictionary string */
export function globalTokens(d) {
  const t = { phone: PARTNER.phone };
  for (const k of PRICE_SIZES) {
    const c = cost(k);
    t['cost' + k] = money(roundTo(c.mid, 1000), d);
    t['range' + k] = moneyRange(c.low, c.high, d);
    t['net' + k] = money(roundTo(c.mid - Math.min(central(k), c.mid), 1000), d);
  }
  return t;
}
/** Deep copy of a dictionary with the global tokens filled in (unknown placeholders are left alone) */
export function fillDict(node, tokens) {
  if (typeof node === 'string') return node.includes('{') ? fill(node, tokens) : node;
  if (Array.isArray(node)) return node.map((x) => fillDict(x, tokens));
  if (node && typeof node === 'object') { const o = {}; for (const k of Object.keys(node)) o[k] = fillDict(node[k], tokens); return o; }
  return node;
}

export const stateName = (d, s) => (d.stateNames && d.stateNames[s.slug]) || s.name;

// ─── FAQ builders (also used for JSON-LD, so visible text and schema are identical) ──
export function priceFaqs(d, kw) {
  const g = d.guides.price;
  const m = priceModel(kw, d);
  const sz = g.sizes[kw] || {};
  const v = { ...m.vars, acAnswer: sz.ac || '', subNote: fill(m.small ? g.subNoteSmall : g.subNoteBig, m.vars) };
  const list = g.faqs.map((f) => ({ q: fill(f.q, v), a: fill(f.a, v) }));
  if (sz.faq) list.push({ q: fill(sz.faq.q, v), a: fill(sz.faq.a, v) });
  return list;
}
export function stateQa(d, s) {
  const m3 = stateModel(s, 3);
  const v = {
    state: stateName(d, s),
    nodal: s.nodal,
    tariff: s.tariff,
    gen: s.gen,
    sc1: rupee(central(1, !!s.special)),
    sc2: rupee(central(2, !!s.special)),
    sc3: rupee(central(3, !!s.special)),
    max: rupee(Math.max(...[1, 1.5, 2, 2.18, 2.5, 3].map((k) => central(k, !!s.special) + stateTop(k, s)))),
    sSub: rupee(m3.sub),
    sNet: money(roundTo(m3.net, 1000), d),
    sUnits: n0(roundTo(m3.units, 10)),
    sUnitsMonth: n0(roundTo(m3.units / 12, 5)),
    sSave: rupee(roundTo(m3.savings, 100)),
    sPayback: years1(m3.payback),
  };
  return (d.statePage.qa || []).map((f) => ({ q: fill(f.q, v), a: fill(f.a, v) }));
}

// ─── state-wise subsidy list: everything is read from src/data/states.js through lib/solar.js ──
const LIST_SIZES = [1, 1.1, 1.5, 2, 2.18, 2.5, 3];
const topFor = (kw, s, klass) => {
  try { return typeof S.stateSubsidy === 'function' ? num(S.stateSubsidy(kw, s, 'residential', klass ? { klass } : undefined)) : 0; } catch { return 0; }
};
const classesOf = (s) => { try { return typeof S.stateClasses === 'function' ? S.stateClasses(s).filter((c) => c !== 'general') : []; } catch { return []; } };
const dateLong = (iso, lang) => { try { return new Date(iso + 'T00:00:00').toLocaleDateString(lang || 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return iso; } };

export function subsidyListModel(d) {
  const rows = STATES.map((s) => {
    const x = s.extra || {};
    const cen3 = central(3, !!s.special);
    const gen = Math.max(...LIST_SIZES.map((k) => topFor(k, s)));
    const total = Math.max(...LIST_SIZES.map((k) => central(k, !!s.special) + topFor(k, s)));
    const classes = classesOf(s).map((c) => [c, Math.max(...LIST_SIZES.map((k) => topFor(k, s, c)))]).filter(([, v]) => v > 0);
    const any = gen > 0 || classes.length > 0;
    // a state with no payable amount is shown as "no top-up" unless something has been reported but not confirmed
    const status = any ? x.status || 'reported' : x.status === 'reported' || x.status === 'unconfirmed' ? x.status : 'none';
    return { s, name: stateName(d, s), cen3, gen, total, classes, any, status, maxKw: gen > 0 && x.maxKw && x.maxKw < 3 ? x.maxKw : null, asOf: x.asOf };
  });
  const withTop = rows.filter((r) => r.any).length;
  const top = [...rows].filter((r) => r.gen > 0).sort((a, b) => b.total - a.total).slice(0, 5);
  const asOf = rows.map((r) => r.asOf).filter(Boolean).sort().pop() || '2026-11-22';
  const vars = { withTop, noTop: rows.filter((r) => r.status === 'none').length, date: dateLong(asOf, d.htmlLang), top1: top[0] ? top[0].name : '', top1Total: top[0] ? rupee(top[0].total) : '' };
  return { rows, top, vars };
}
export function subsidyListFaqs(d) {
  const { vars } = subsidyListModel(d);
  return d.guides.subsidyList.faqs.map((f) => ({ q: fill(f.q, vars), a: fill(f.a, vars) }));
}

// ─── small building blocks ─────────────────────────────────────────────
const Table = ({ head, rows, hl = -1 }) => (
  <div className="tscroll">
    <table className="tbl">
      <thead><tr>{head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className={i === hl ? 'hl' : undefined}>{r.map((c, j) => (j ? <td key={j}>{c}</td> : <th key={j} scope="row">{c}</th>))}</tr>)}</tbody>
    </table>
  </div>
);
/** FAQ block without the id="faq" anchor – for pages that already render the shared <Faq> once */
const Qa = ({ items, title }) => (
  <section className="faq">
    <h2>{title}</h2>
    {items.map((f, i) => (
      <details key={i} open={i === 0}>
        <summary>{f.q}</summary>
        <p>{f.a}</p>
      </details>
    ))}
  </section>
);

/** Cross-links to the guide pages – appended to existing page types from entry-server.jsx */
export function GuideLinks({ d, lang, skip = '' }) {
  const L = (p) => lp(p, lang);
  const g = d.guides.price;
  const links = [
    [GUIDE.hub, d.nav.priceList],
    ...PRICE_SIZES.map((k) => ['/' + priceSlug(k), fill(g.sizeLink, { kw: k })]),
    [GUIDE.list, d.nav.subsidyList],
    [GUIDE.apply, d.nav.applyOnline],
    [GUIDE.types, d.nav.solarTypes],
  ].filter(([p]) => p !== skip);
  return (
    <section className="sec">
      <h2>{d.nav.guides}</h2>
      <div className="chips">{links.map(([p, t]) => <a key={p} className="chip" href={L(p)}>{t}</a>)}</div>
    </section>
  );
}
export const GuideLinksWrap = (props) => <div className="wrap"><GuideLinks {...props} /></div>;

const Side = ({ d, lang, tools, links = [] }) => (
  <aside className="side">
    <h2 className="side-h">{d.common.related}</h2>
    <div className="side-list">{tools.map((s) => <ToolCard key={s} slug={s} d={d} lang={lang} />)}</div>
    {links.map(([href, text]) => <a key={href} className="side-link" href={href}>{text}</a>)}
  </aside>
);

// ─── /<n>kw-solar-system-price ─────────────────────────────────────────
export function PricePage({ d, lang, kw }) {
  const L = (p) => lp(p, lang);
  const g = d.guides.price;
  const m = priceModel(kw, d);
  const v = m.vars;
  const f = (s, extra) => fill(s, extra ? { ...v, ...extra } : v);
  const sz = g.sizes[kw] || {};
  const types = [
    ['ongrid', cost(kw, 'ongrid'), f(g.subsidyYes), d.common.no],
    ['hybrid', cost(kw, 'hybrid'), f(g.subsidyHybrid), d.common.yes],
    ['offgrid', cost(kw, 'offgrid'), g.subsidyNo, d.common.yes],
  ];
  const tariffs = [6, 8, 10].map((t) => {
    const r = roi({ kw, netCost: m.net, grossCost: m.c.mid, tariff: t, gen: GEN });
    return [fill(g.perUnit, { t }), rupee(roundTo(m.unitsYear * t, 100)), fill(g.paybackYears, { y: years1(r.payback) })];
  });
  const stateRows = TOP_STATES.map((slug) => STATES.find((s) => s.slug === slug)).filter(Boolean).map((s) => {
    const sm = stateModel(s, kw);
    return [<a href={L('/state/' + s.slug)}>{stateName(d, s)}</a>, rupee(sm.sub), money(roundTo(sm.net, 1000), d)];
  });
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: g.crumb, href: L(GUIDE.hub) }, { name: f(g.sizeLink) }]} />
      <PageHead kicker={d.guides.updated} h1={f(g.h1)} lead={f(g.lead)} />
      <section className="facts">
        <div className="fact"><span>{g.facts.net}</span><b>{v.net}</b></div>
        <div className="fact"><span>{g.facts.price}</span><b>{v.range}</b></div>
        <div className="fact"><span>{g.facts.subsidy}</span><b>{v.subsidy}</b></div>
        <div className="fact"><span>{g.facts.units}</span><b>{v.unitsMonth}</b></div>
      </section>
      <AdSlot d={d} />
      <div className="cols">
        <article className="prose">
          <h2>{f(g.breakupTitle)}</h2>
          <Table
            head={[g.th.item, g.th.amount]}
            hl={kw <= 3 ? 4 : 3}
            rows={[
              [g.rows.ongrid, v.range],
              [g.rows.perKw, v.perKw],
              // MNRE publishes a benchmark cost only up to 3 kW
              ...(kw <= 3 ? [[g.rows.benchmark, v.benchmark]] : []),
              [g.rows.central, '− ' + v.subsidy],
              [g.rows.net, v.net],
              // same basis as the subsidy calculator's default receipt (benchmark cost − central subsidy)
              ...(kw <= 3 ? [[g.rows.benchNet, v.benchNet]] : []),
              [g.rows.special, '− ' + v.subsidySpecial],
              [g.rows.netSpecial, v.netSpecial],
            ]}
          />
          <p>{g.includes}</p>

          <h2>{f(g.suitsTitle)}</h2>
          <p>{f(sz.suits)}</p>
          {sz.note && <p className="note">{f(sz.note)}</p>}

          <h2>{f(g.specTitle)}</h2>
          <Table head={[g.th.item, g.th.amount]} rows={Object.keys(g.spec).map((k) => [g.spec[k], f(g.specVals[k])])} />
          <p className="disc">{g.specNote}</p>

          <h2>{f(g.runsTitle)}</h2>
          <ul className="ticks">{(sz.runs || []).map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="disc">{g.runsNote}</p>

          <h2>{f(g.typeTitle)}</h2>
          <p>{g.typeIntro}</p>
          <Table head={g.typeTh} rows={types.map(([k, c, sub, backup]) => [g.types[k], moneyRange(c.low, c.high, d), sub, backup])} />
          <p><a href={L(GUIDE.types)}>{d.nav.solarTypes} →</a></p>

          <h2>{f(g.saveTitle)}</h2>
          <p>{f(g.saveIntro)}</p>
          <Table head={g.saveTh} rows={tariffs} />
          <p><a href={L('/solar-roi-calculator')}>{d.tools['solar-roi-calculator'].name} →</a></p>

          <h2>{f(g.emiTitle)}</h2>
          <p>{f(g.emiText)} {m.small ? g.emiNoteSmall : g.emiNoteBig}</p>
          <p><a href={L('/solar-emi-calculator')}>{g.emiLink} →</a></p>

          <h2>{f(g.stateTitle)}</h2>
          <p>{g.stateIntro}</p>
          <Table head={g.stateTh} rows={stateRows} />
          <p><a href={L(GUIDE.list)}>{g.allStates} →</a></p>

          <h2>{f(g.buyTitle)}</h2>
          <ol className="steps">{g.buySteps.map((x) => <li key={x}>{x}</li>)}</ol>
          <p><a href={L(GUIDE.apply)}>{g.applyLink} →</a></p>

          <Faq items={priceFaqs(d, kw)} title={d.common.faqTitle} />
          <p className="disc">{d.common.disclaimerShort}</p>
        </article>
        <Side d={d} lang={lang} tools={['solar-system-price-estimator', 'solar-subsidy-calculator', 'solar-emi-calculator', 'solar-quote-checker']} links={[[L(GUIDE.hub), d.nav.priceList], [L('/states'), d.nav.allStates]]} />
      </div>
      <Cta d={d} campaign={`price-${kw}kw`} />
      <section className="sec">
        <h2>{g.otherSizes}</h2>
        <div className="chips">
          {PRICE_SIZES.filter((k) => k !== kw).map((k) => <a key={k} className="chip" href={L('/' + priceSlug(k))}>{fill(g.sizeLink, { kw: k })}</a>)}
          <a className="chip" href={L(GUIDE.hub)}>{d.nav.priceList}</a>
        </div>
      </section>
    </div>
  );
}

// ─── /solar-panel-price ────────────────────────────────────────────────
export function PriceHub({ d, lang }) {
  const L = (p) => lp(p, lang);
  const g = d.guides.price;
  const h = g.hub;
  const rows = HUB_SIZES.map((k) => {
    const m = priceModel(k, d);
    const label = `${k} kW`;
    return [PRICE_SIZES.includes(k) ? <a href={L('/' + priceSlug(k))}>{label}</a> : label, m.vars.range, m.vars.subsidy, m.vars.net, m.vars.unitsMonth, m.vars.bill];
  });
  const typeRows = [1, 2, 3, 5, 10].map((k) => [`${k} kW`, ...['ongrid', 'hybrid', 'offgrid'].map((t) => { const c = cost(k, t); return moneyRange(c.low, c.high, d); })]);
  const perKw = [1, 2, 3, 5, 10].map((k) => { const m = priceModel(k, d); return [`${k} kW`, m.vars.perKw, m.vars.cost]; });
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: g.crumb }]} />
      <PageHead kicker={d.guides.updated} h1={h.h1} lead={h.lead} />
      <div className="cols">
        <article className="prose">
          <h2>{h.tableTitle}</h2>
          <Table head={h.th} rows={rows} hl={2} />
          <p className="disc">{h.tableNote}</p>

          <h2>{h.sizesTitle}</h2>
          <ul className="links">{PRICE_SIZES.map((k) => <li key={k}><a href={L('/' + priceSlug(k))}>{fill(g.title, priceModel(k, d).vars)}</a></li>)}</ul>

          <h2>{h.typeTitle}</h2>
          <p>{h.typeIntro}</p>
          <Table head={h.typeTh} rows={typeRows} />
          <p><a href={L(GUIDE.types)}>{h.typeLink} →</a></p>

          <h2>{h.perKwTitle}</h2>
          <p>{h.perKwText}</p>
          <Table head={h.perKwTh} rows={perKw} />

          <h2>{h.factorsTitle}</h2>
          {h.factors.map((x) => <p key={x.t}><strong>{x.t}.</strong> {x.d}</p>)}

          <h2>{h.gstTitle}</h2>
          <p>{h.gstText}</p>

          <Faq items={h.faqs} title={d.common.faqTitle} />
          <p className="disc">{d.common.disclaimerShort}</p>
        </article>
        <Side d={d} lang={lang} tools={['solar-system-price-estimator', 'solar-quote-checker', 'solar-subsidy-calculator', 'solar-calculator']} links={[[L(GUIDE.apply), d.nav.applyOnline], [L('/states'), d.nav.allStates]]} />
      </div>
      <AdSlot d={d} />
      <Cta d={d} campaign="price-list" />
    </div>
  );
}

// ─── /pm-surya-ghar-apply-online ───────────────────────────────────────
export function ApplyGuide({ d, lang }) {
  const L = (p) => lp(p, lang);
  const a = d.guides.apply;
  const amount = [1, 2, 3].map((k) => [k === 3 ? '3 kW +' : `${k} kW`, rupee(central(k)), rupee(central(k, true))]);
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.pmsg, href: L('/pm-surya-ghar-yojana') }, { name: a.crumb }]} />
      <PageHead kicker={d.guides.updated} h1={a.h1} lead={a.lead} />
      <div className="cols">
        <article className="prose">
          <h2>{a.docsTitle}</h2>
          <ul className="pills">{a.docs.map((x) => <li key={x}>{x}</li>)}</ul>

          <h2>{a.stepsTitle}</h2>
          <ol className="steps">{a.steps.map((x) => <li key={x.t}><strong>{x.t}.</strong> {x.d}</li>)}</ol>
          <p><a className="btn btn-dark" href="https://pmsuryaghar.gov.in" target="_blank" rel="noopener nofollow">pmsuryaghar.gov.in ↗</a></p>

          <h2>{a.timeTitle}</h2>
          <Table head={a.timeTh} rows={a.time} />
          <p className="disc">{a.timeNote}</p>

          <h2>{a.statusTitle}</h2>
          <p>{a.statusText}</p>

          <h2>{a.amountTitle}</h2>
          <p>{a.amountText}</p>
          <Table head={a.amountTh} rows={amount} />
          <p><a href={L('/solar-subsidy-calculator')}>{a.amountLink} →</a></p>

          <h2>{a.rejectTitle}</h2>
          <ul className="ticks">{a.reject.map((x) => <li key={x}>{x}</li>)}</ul>

          <h2>{a.fakeTitle}</h2>
          <p className="note">{a.fakeText}</p>

          <h2>{a.helpTitle}</h2>
          <p>{a.helpText}</p>

          <Faq items={a.faqs} title={d.common.faqTitle} />
        </article>
        <Side d={d} lang={lang} tools={['solar-subsidy-calculator', 'solar-calculator', 'solar-emi-calculator', 'solar-quote-checker']} links={[[L('/pm-surya-ghar-yojana'), d.nav.pmsg], [L(GUIDE.hub), d.nav.priceList], [L('/states'), d.nav.allStates]]} />
      </div>
      <AdSlot d={d} />
      <Cta d={d} campaign="apply-online" />
      <GuideLinks d={d} lang={lang} skip={GUIDE.apply} />
    </div>
  );
}

// ─── /on-grid-vs-off-grid-solar ────────────────────────────────────────
export function SolarTypes({ d, lang }) {
  const L = (p) => lp(p, lang);
  const t = d.guides.types;
  const r3 = ['ongrid', 'hybrid', 'offgrid'].map((k) => { const c = cost(3, k); return moneyRange(c.low, c.high, d); });
  const cmp = [...t.cmp.slice(0, 4), [t.priceRow, ...r3], ...t.cmp.slice(4)];
  const priceRows = [1, 2, 3, 5, 10].map((k) => [PRICE_SIZES.includes(k) ? <a href={L('/' + priceSlug(k))}>{k} kW</a> : `${k} kW`, ...['ongrid', 'hybrid', 'offgrid'].map((x) => { const c = cost(k, x); return moneyRange(c.low, c.high, d); })]);
  const block = (title, text, pros) => (
    <>
      <h2>{title}</h2>
      <p>{text}</p>
      <ul className="ticks">{pros.map((x) => <li key={x}>{x}</li>)}</ul>
    </>
  );
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: t.crumb }]} />
      <PageHead kicker={d.guides.updated} h1={t.h1} lead={t.lead} />
      <div className="cols">
        <article className="prose">
          <h2>{t.cmpTitle}</h2>
          <table>
            <thead><tr>{t.cmpTh.map((x) => <th key={x} scope="col">{x}</th>)}</tr></thead>
            <tbody>{cmp.map((r) => <tr key={r[0]}>{r.map((c, i) => (i ? <td key={i}>{c}</td> : <th key={i} scope="row">{c}</th>))}</tr>)}</tbody>
          </table>
          {block(t.onTitle, t.onText, t.onPros)}
          {block(t.hyTitle, t.hyText, t.hyPros)}
          {block(t.offTitle, t.offText, t.offPros)}

          <h2>{t.priceTitle}</h2>
          <Table head={t.priceTh} rows={priceRows} />
          <p className="disc">{t.priceNote}</p>

          <h2>{t.chooseTitle}</h2>
          <ol className="steps">{t.choose.map((x) => <li key={x.t}><strong>{x.t}</strong> {x.d}</li>)}</ol>

          <Faq items={t.faqs} title={d.common.faqTitle} />
          <p className="disc">{d.common.disclaimerShort}</p>
        </article>
        <Side d={d} lang={lang} tools={['solar-system-price-estimator', 'solar-battery-calculator', 'solar-inverter-size-calculator', 'solar-load-calculator']} links={[[L(GUIDE.hub), d.nav.priceList], [L(GUIDE.apply), d.nav.applyOnline]]} />
      </div>
      <AdSlot d={d} />
      <Cta d={d} campaign="solar-types" />
      <GuideLinks d={d} lang={lang} skip={GUIDE.types} />
    </div>
  );
}

// ─── /solar-subsidy-state-wise ─────────────────────────────────────────
const STATUS_TAG = { confirmed: 'tag ok', reported: 'tag warn', unconfirmed: 'tag warn', none: 'tag' };
export function SubsidyList({ d, lang }) {
  const L = (p) => lp(p, lang);
  const t = d.guides.subsidyList;
  const { rows, top, vars } = subsidyListModel(d);
  const f = (s) => fill(s, vars);
  const row = (r) => [
    <a href={L('/state/' + r.s.slug)}>{r.name}</a>,
    rupee(r.cen3),
    r.gen > 0 ? (r.maxKw ? fill(t.atSize, { amount: rupee(r.gen), kw: r.maxKw }) : fill(t.upTo, { amount: rupee(r.gen) })) : '—',
    r.classes.length ? r.classes.map(([c, v]) => `${t.classes[c] || c}: ${fill(t.upTo, { amount: rupee(v) })}`).join(' · ') : '—',
    <b>{rupee(r.total)}</b>,
    <span className={STATUS_TAG[r.status] || 'tag'}>{t.status[r.status] || r.status}</span>,
  ];
  const none = rows.filter((r) => r.status === 'none');
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.states, href: L('/states') }, { name: t.crumb }]} />
      <PageHead kicker={d.guides.updated} h1={t.h1} lead={f(t.lead)} />
      <section className="sec">
        <h2>{t.tableTitle}</h2>
        <Table head={t.th} rows={rows.map(row)} />
        <p className="disc">{f(t.tableNote)} {d.pmsg.specialNote}</p>
      </section>
      <AdSlot d={d} />
      <div className="cols">
        <article className="prose">
          <h2>{t.topTitle}</h2>
          <p>{t.topIntro}</p>
          <ol>{top.map((r) => <li key={r.s.slug}><a href={L('/state/' + r.s.slug)}>{fill(t.topRow, { state: r.name, total: rupee(r.total) })}</a></li>)}</ol>

          <h2>{t.statusTitle}</h2>
          {t.statusText.map((x) => <p key={x.t}><strong>{x.t}.</strong> {x.d}</p>)}

          <h2>{t.noneTitle}</h2>
          <p>{t.noneIntro}</p>
          <div className="chips">{none.map((r) => <a key={r.s.slug} className="chip" href={L('/state/' + r.s.slug)}>{r.name}</a>)}</div>

          <h2>{t.howTitle}</h2>
          <p>{t.howText}</p>
          <p><a href={L('/solar-subsidy-calculator')}>{d.tools['solar-subsidy-calculator'].name} →</a> · <a href={L(GUIDE.apply)}>{d.nav.applyOnline} →</a></p>

          <Faq items={subsidyListFaqs(d)} title={d.common.faqTitle} />
          <p className="disc">{d.common.notGovt} {d.common.disclaimerShort}</p>
        </article>
        <Side d={d} lang={lang} tools={['solar-subsidy-calculator', 'solar-calculator', 'solar-system-price-estimator', 'solar-emi-calculator']} links={[[L('/pm-surya-ghar-yojana'), d.nav.pmsg], [L(GUIDE.hub), d.nav.priceList]]} />
      </div>
      <Cta d={d} campaign="subsidy-list" />
      <GuideLinks d={d} lang={lang} skip={GUIDE.list} />
    </div>
  );
}

// ─── add-on blocks appended to existing page types (see entry-server.jsx) ──
/** Localized, state-specific quick answers + price links, shown under every state page */
export function StateMore({ d, lang, s }) {
  const sp = d.statePage;
  return (
    <div className="wrap">
      <Qa items={stateQa(d, s)} title={fill(sp.moreTitle, { state: stateName(d, s) })} />
      <GuideLinks d={d} lang={lang} />
    </div>
  );
}
/** FAQs for a "solar for …" segment page */
export function SegmentMore({ d, lang, slug }) {
  const s = d.segments[slug];
  return (
    <div className="wrap">
      <Faq items={s.faqs} title={d.common.faqTitle} />
      <GuideLinks d={d} lang={lang} />
    </div>
  );
}
