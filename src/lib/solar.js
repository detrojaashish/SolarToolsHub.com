// Core solar maths shared by every calculator. Pure functions, no React.
// Subsidy rules follow docs/CONTRACT.md §4; state data lives in src/data/states.js (`extra`).

// The central-scheme constants below mirror `PMSG` in src/data/states.js (the source of truth, kept out of this
// file so the 60 KB state data never reaches the browser). scripts/test-calc.mjs fails if the two ever differ.
export const PMSG_RATES = {
  general: { first2: 30000, third: 18000, max: 78000 },
  special: { first2: 33000, third: 19800, max: 85800 },
  rwaPerKw: 18000,
  rwaPerKwSpecial: 19800,
  rwaMaxKw: 500,
  rwaKwPerHouse: 3,
};
// MNRE benchmark cost of a residential rooftop system (₹ per kW): first 2 kW / 3rd kW.
// MNRE defines it only up to 3 kW – above that there is no official benchmark (BENCHMARK_MAX_KW).
export const BENCHMARK = { first2: 50000, above2: 45000 };
export const BENCHMARK_SPECIAL = { first2: 55000, above2: 49500 };
export const BENCHMARK_MAX_KW = 3;
// Consumer classes a state scheme can distinguish (fixed ids, display order)
export const CLASS_IDS = ['general', 'scst', 'bpl', 'free'];

export const CO2_PER_KWH = 0.71; // kg CO2 per kWh (CEA grid emission factor)
export const KG_CO2_PER_TREE = 21; // kg absorbed by one tree per year
export const SQFT_PER_KW = 90; // shadow-free flat roof needed per kW (tilted rows + walkways)
export const COMMERCIAL_TARIFF_FACTOR = 1.35; // commercial / industrial tariff vs the domestic average
export const EXPORT_RATE = 3; // ₹/unit typically credited for surplus units left at year end

const EPS = 1e-9;
/** finite, non-negative number (anything else → 0) – makes every formula safe while the user is typing */
export const pos = (n) => {
  n = Number(n);
  return n > 0 && Number.isFinite(n) ? n : 0;
};
export const round = (n, d = 0) => {
  const p = 10 ** d;
  return Math.round((Number(n) || 0) * p) / p;
};
export const clamp = (n, a, b) => Math.min(b, Math.max(a, Number(n) || 0));
const numOr = (v, d) => (v === '' || v == null || !Number.isFinite(Number(v)) || Number(v) < 0 ? d : Number(v));

/** benchmark ₹/kW for a region; later arguments (state rule, user-edited rates) override earlier ones */
export function benchmarkRates(special, ...over) {
  const r = { ...(special ? BENCHMARK_SPECIAL : BENCHMARK) };
  for (const o of over) {
    if (!o) continue;
    r.first2 = numOr(o.first2, r.first2);
    r.above2 = numOr(o.above2, r.above2);
  }
  return r;
}

/**
 * MNRE benchmark cost: ₹50,000/kW for the first 2 kW, ₹45,000/kW for the 3rd (2.18 kWp → ₹1,08,100);
 * special-category states ₹55,000 / ₹49,500. `rates` = { first2, above2 } (default: general states).
 * Note: official only up to 3 kW – beyond that the same ₹/kW is just an extrapolation.
 */
export function benchmarkCost(kw, rates) {
  kw = pos(kw);
  const r = benchmarkRates(false, rates);
  return Math.round(Math.min(kw, 2) * r.first2 + Math.max(0, kw - 2) * r.above2);
}

const centralRates = (special, o) => {
  const r = special ? PMSG_RATES.special : PMSG_RATES.general;
  return o ? { first2: numOr(o.first2, r.first2), third: numOr(o.third, r.third) } : r;
};

/**
 * Central subsidy (PM Surya Ghar) as slab lines: [{ kw, rate, amount }].
 * The subsidy is per household for up to 3 kW in total, so capacity that is already installed
 * uses up the first slabs:  cfa(existing + new) − cfa(existing).
 */
export function centralLines(kw, { special = false, category = 'residential', existingKw = 0, rates, houses } = {}) {
  kw = pos(kw);
  if (!kw || category === 'commercial') return [];
  if (category === 'society') {
    // RWA / group housing, common facilities: ₹18,000/kW (₹19,800 special category) on the lower of
    // installed kW, 3 kW × number of houses and 500 kW. Without `houses` only the 500 kW cap applies.
    const rate = special ? PMSG_RATES.rwaPerKwSpecial : PMSG_RATES.rwaPerKw;
    const k = Math.min(kw, PMSG_RATES.rwaMaxKw, pos(houses) ? pos(houses) * PMSG_RATES.rwaKwPerHouse : Infinity);
    return [{ kw: round(k, 2), rate, amount: Math.round(k * rate) }];
  }
  const r = centralRates(special, rates);
  const a = pos(existingKw);
  const b = a + kw;
  const seg = (lo, hi, rate) => {
    const k = Math.min(b, hi) - Math.max(a, lo);
    return k > EPS && rate > 0 ? { kw: round(k, 2), rate, amount: Math.round(k * rate) } : null;
  };
  return [seg(0, 2, r.first2), seg(2, 3, r.third)].filter(Boolean);
}

/** Central subsidy under PM Surya Ghar (₹). Residential ≤ 3 kW per household, RWA/GHS ₹18,000/kW (₹19,800 special) ≤ 500 kW, commercial 0. */
export function centralSubsidy(kw, opts = {}) {
  return centralLines(kw, opts).reduce((s, l) => s + l.amount, 0);
}

// ── State top-up ────────────────────────────────────────────────────────────
/** `extra` of a state (docs/CONTRACT.md §4). src/data/states.js is the only source of state rules. */
export function stateExtra(state) {
  return (state && state.extra) || null;
}

const kindOf = (r) =>
  !r ? null : r.benchmark || r.share != null ? 'benchmark' : r.flat > 0 ? 'flat' : r.rates && r.rates.length ? 'rates' : r.perKw > 0 ? 'perKw' : null;

/** Consumer classes the state's scheme distinguishes: always 'general' + the keys of extra.classes */
export function stateClasses(state) {
  const x = stateExtra(state);
  const c = (x && x.classes) || {};
  return CLASS_IDS.filter((id) => id === 'general' || c[id]);
}

/** Effective top-up rule for a consumer class (class entry shallow-merged over the default rule) */
export function stateRule(state, klass = 'general') {
  const x = stateExtra(state);
  if (!x) return { kind: null };
  const { classes, general, status, asOf, source, note, ...base } = x;
  const own = klass !== 'general' && classes && classes[klass];
  let rule;
  if (!own) {
    if (general === false) return { kind: null, restricted: true };
    rule = { ...base };
  } else {
    const k = kindOf(own);
    // a class that uses a different model keeps only the size window of the default rule
    rule = k && k !== kindOf(base) ? { minKw: base.minKw, maxKw: base.maxKw, ...own } : { ...base, ...own };
  }
  rule.kind = kindOf(rule);
  return rule;
}

/**
 * State top-up with the reason when it is zero.
 * → { amount, kind, reason, rule, benchmark, share, shareAmt }
 * reason: null | 'none' | 'class' | 'category' | 'below' | 'above' | 'existing' | 'covered'
 *         | 'manual' (a scheme exists but has no fixed formula, e.g. Andaman & Nicobar) | 'unconfirmed'
 */
export function stateDetail(kw, state, category = 'residential', { klass = 'general', central, existingKw = 0, rates } = {}) {
  kw = pos(kw);
  const ex = pos(existingKw);
  const out = { amount: 0, kind: null, reason: 'none', rule: null, benchmark: null, share: null, shareAmt: null };
  const rule = stateRule(state, klass);
  out.kind = rule.kind;
  if (!rule.kind) {
    const status = (stateExtra(state) || {}).status;
    if (rule.restricted) out.reason = 'class';
    else if (status === 'unconfirmed') out.reason = 'unconfirmed';
    else if (status && status !== 'none') out.reason = 'manual';
    return out;
  }
  out.rule = rule;
  const special = !!(state && state.special);
  if (rates) {
    if (rule.maxKw && pos(rates.maxKw)) rule.maxKw = pos(rates.maxKw);
    if (rule.kind === 'benchmark') {
      const sh = klass === 'scst' ? rates.shareScst : klass === 'general' ? rates.share : undefined;
      if (sh !== '' && sh != null && Number.isFinite(Number(sh))) rule.share = clamp(sh, 0, 100);
    }
  }
  if (rule.kind === 'benchmark') {
    rule.benchmark = benchmarkRates(special, rule.benchmark, rates && rates.benchmark);
    out.share = clamp(numOr(rule.share, 0), 0, 100);
    out.benchmark = benchmarkCost(kw, rule.benchmark);
    out.shareAmt = Math.round((out.benchmark * out.share) / 100);
  }
  if (category !== 'residential') return { ...out, reason: 'category' };
  if (!kw) return { ...out, reason: null };
  if (rule.minKw && kw < rule.minKw - EPS) return { ...out, reason: 'below' };
  if (rule.maxKw && kw > rule.maxKw + EPS) return { ...out, reason: 'above' };
  if (rule.maxKw && ex + kw > rule.maxKw + EPS) return { ...out, reason: 'existing' };

  const cap = (v) => (rule.max > 0 ? Math.min(v, rule.max) : v);
  let v = 0;
  if (rule.kind === 'benchmark') {
    const c = central == null ? centralSubsidy(kw, { special, category, existingKw: ex, rates: rates && rates.central }) : pos(central);
    v = cap(Math.max(0, out.benchmark - c - out.shareAmt));
    if (!v) return { ...out, reason: 'covered' };
  } else if (rule.kind === 'flat') {
    if (ex > EPS) return { ...out, reason: 'existing' }; // one-time grant per household
    v = cap(rule.flat);
  } else {
    // per-kW or slab rates, capped per household → capacity already installed uses up the first slabs
    const f = rule.kind === 'rates' ? (k) => cap(rule.rates.reduce((s, r, i) => s + r * Math.max(0, Math.min(1, k - i)), 0)) : (k) => cap(rule.perKw * k);
    v = f(ex + kw) - f(ex);
    if (v <= 0) return { ...out, reason: ex ? 'existing' : 'none' };
  }
  return { ...out, amount: Math.round(v), reason: null };
}

/** Extra state top-up in ₹ (0 when the state has none or the system / consumer does not qualify) */
export function stateSubsidy(kw, state, category = 'residential', opts) {
  return stateDetail(kw, state, category, opts).amount;
}

// On-grid installed price per kW (₹, incl. GST) by size – DCR panels for homes.
// Based on indicative installed prices published in Oct 2026 (1 kW ₹60–80k, 2 kW ₹1.1–1.5 lakh,
// 3 kW ₹1.65–2.1 lakh, 5 kW ₹2.55–3.2 lakh, 10 kW ₹4.8–5.9 lakh); larger sizes follow C&I EPC prices.
const PRICE_TABLE = [
  [1, 70000], [2, 65000], [3, 60000], [5, 57000], [10, 53000], [25, 46000], [50, 42000], [100, 38000], [500, 34000],
];

function interp(kw) {
  if (kw <= PRICE_TABLE[0][0]) return PRICE_TABLE[0][1];
  for (let i = 1; i < PRICE_TABLE.length; i++) {
    const [k1, p1] = PRICE_TABLE[i - 1];
    const [k2, p2] = PRICE_TABLE[i];
    if (kw <= k2) return p1 + ((p2 - p1) * (kw - k1)) / (k2 - k1);
  }
  return PRICE_TABLE[PRICE_TABLE.length - 1][1];
}

export const TYPE_FACTOR = { ongrid: 1, hybrid: 1.55, offgrid: 1.45 };

/** Price per kW for a system type. category commercial uses non-DCR (cheaper) panels. */
export function pricePerKw(kw, type = 'ongrid', category = 'residential') {
  let p = interp(Math.max(0.5, pos(kw) || 1)) * (TYPE_FACTOR[type] || 1);
  if (category === 'commercial') p *= 0.88;
  return Math.round(p / 100) * 100;
}

export function systemCost(kw, type = 'ongrid', category = 'residential') {
  kw = pos(kw);
  const mid = pricePerKw(kw, type, category) * kw;
  return { mid: Math.round(mid), low: Math.round(mid * 0.9), high: Math.round(mid * 1.12) };
}

/** Rough component break-up (share of total) */
export function costBreakup(total, type = 'ongrid') {
  const shares =
    type === 'ongrid'
      ? { panels: 0.5, inverter: 0.14, battery: 0, bos: 0.22, install: 0.14 }
      : { panels: 0.32, inverter: 0.14, battery: 0.3, bos: 0.14, install: 0.1 };
  return Object.fromEntries(Object.entries(shares).map(([k, v]) => [k, Math.round(pos(total) * v)]));
}

export const yearlyGeneration = (kw, gen = 4.2) => Math.round(pos(kw) * (pos(gen) || 4.2) * 365);

/** Recommended kW from monthly units (rounded up to 0.5 kW) */
export function sizeFromUnits(units, gen = 4.2) {
  const kw = pos(units) / ((pos(gen) || 4.2) * 30);
  return Math.max(1, Math.ceil(kw * 2 - EPS) / 2);
}

// one size, no comparison – the building block of subsidyPlan
function planCore({ kw, state, category, klass, ex, quote, rates, type, basis, houses }) {
  const special = !!(state && state.special);
  const sub = type !== 'offgrid'; // off-grid systems are outside PM Surya Ghar
  const lines = sub ? centralLines(kw, { special, category, existingKw: ex, rates: rates && rates.central, houses }) : [];
  let central = lines.reduce((s, l) => s + l.amount, 0);
  const sd = sub ? stateDetail(kw, state, category, { klass, central, existingKw: ex, rates }) : { amount: 0, kind: null, reason: 'offgrid', rule: null, share: null, shareAmt: null };
  // MNRE publishes a benchmark cost only for home systems up to 3 kW – above that (and for RWA / commercial /
  // battery systems) there is none, so the cost basis falls back to the market estimate
  const official = category === 'residential' && type === 'ongrid' && kw <= BENCHMARK_MAX_KW + EPS;
  const benchmark = official ? benchmarkCost(kw, benchmarkRates(special, sd.rule && sd.rule.benchmark, rates && rates.benchmark)) : null;
  const market = systemCost(kw, type, category).mid;
  const q = pos(quote);
  const b = q ? 'quote' : basis === 'benchmark' && official ? 'benchmark' : 'market';
  const cost = q || (b === 'benchmark' ? benchmark : market);
  // a subsidy can never be more than the system costs
  const capped = central + sd.amount > cost;
  central = Math.min(central, cost);
  const stateAmt = Math.min(sd.amount, cost - central);
  const subsidy = central + stateAmt;
  const pay = cost - subsidy;
  return { kw, cost, basis: b, benchmark, market, lines, central, state: stateAmt, stateInfo: sd, subsidy, capped, pay, perKw: kw ? Math.round(pay / kw) : 0, pct: cost ? Math.round((subsidy / cost) * 100) : 0 };
}

/**
 * Everything the subsidy UI and PDF need for one household.
 * rates (optional overrides from "Edit rates"): { central:{first2,third}, benchmark:{first2,above2}, share, shareScst, maxKw }
 * basis: 'benchmark' | 'market' – cost used when no vendor quotation is given. Default: the MNRE benchmark only where
 *        the state's own rule for this consumer class is built on it (benchmark model, e.g. Gujarat) and the home
 *        system is on-grid and up to 3 kW; everywhere else the market estimate, like every other calculator.
 *        `benchmark` is still returned for homes up to 3 kW, as information.
 * houses: number of flats (society only) – eligible capacity is capped at 3 kW per house.
 * → { kw, cost, basis, benchmark (null above 3 kW), market, lines, central, state, stateInfo, subsidy, pay, perKw, pct,
 *     units, saving, payback, tariff, classes, status, note, asOf, limit, compare:[rows], best, tip }
 */
export function subsidyPlan({ kw, state, category = 'residential', klass = 'general', existingKw = 0, quote, tariff, rates, type = 'ongrid', basis, houses } = {}) {
  kw = pos(kw);
  const ex = pos(existingKw);
  const std = basis || (category === 'residential' && type === 'ongrid' && stateRule(state, klass).kind === 'benchmark' ? 'benchmark' : 'market');
  const arg = { state, category, klass, ex, rates, type, basis: std, houses };
  const p = planCore({ ...arg, kw, quote });
  const x = stateExtra(state) || {};
  const gen = (state && state.gen) || 4.2;
  const tf = pos(tariff) || (state && state.tariff) || 7;
  p.tariff = tf;
  p.units = yearlyGeneration(kw, gen);
  p.saving = Math.round(p.units * tf);
  p.payback = p.saving > 0 ? round(p.pay / p.saving, 1) : null;
  p.classes = stateClasses(state);
  p.klass = klass;
  p.existingKw = ex;
  p.category = category;
  p.status = x.status || (kindOf(x) || x.classes ? null : 'none');
  p.note = x.note || '';
  p.asOf = x.asOf || '';
  const rule = p.stateInfo.rule;
  p.limit = (rule && rule.maxKw) || null;
  p.compare = [];
  p.best = null;
  p.tip = null;
  if (category === 'residential' && type !== 'offgrid') {
    // candidate sizes: 1, 2, the state's own limit, 3, 5 and the requested size
    const set = [1, 2, 3, 5, kw];
    if (p.limit) set.push(p.limit, p.limit - ex);
    if (rule && rule.minKw) set.push(rule.minKw);
    if (ex) set.push(3 - ex);
    const sizes = [...new Set(set.map((k) => round(k, 2)).filter((k) => k >= 0.5))].sort((a, b) => a - b);
    p.compare = sizes.map((k) => {
      // the row of the chosen size is the headline plan itself (so it includes the vendor quotation, if any)
      const r = Math.abs(k - kw) < 0.005 ? p : planCore({ ...arg, kw: k });
      // ent = what the rules entitle the home to, before the "never more than the cost" cap
      return { kw: k, cost: r.cost, basis: r.basis, central: r.central, state: r.state, subsidy: r.subsidy, ent: r.lines.reduce((a, l) => a + l.amount, 0) + r.stateInfo.amount, pay: r.pay, perKw: r.perKw, cur: Math.abs(k - kw) < 0.005 };
    });
    // best value = the size up to 3 kW (the centrally subsidised range) that is entitled to the highest subsidy;
    // ties go to the size that costs the household less
    p.best = p.compare.filter((r) => r.kw <= BENCHMARK_MAX_KW + EPS).reduce((a, r) => (r.ent > a.ent || (r.ent === a.ent && r.pay < a.pay) ? r : a));
    p.compare.forEach((r) => (r.best = r === p.best));
    const cur = p.compare.find((r) => r.cur);
    if (cur && p.best.subsidy > 0) {
      const b = p.best;
      if (cur === b) p.tip = { id: 'best', kw: b.kw, subsidy: b.subsidy };
      else if (kw < b.kw) p.tip = b.subsidy > cur.subsidy ? { id: 'more', kw: b.kw, extra: b.subsidy - cur.subsidy, subsidy: b.subsidy } : null;
      else if (b.state > cur.state) p.tip = { id: 'limit', kw: b.kw, more: cur.pay - b.pay, lost: b.subsidy - cur.subsidy };
      else if (cur.subsidy <= b.subsidy) p.tip = { id: 'cap', kw: b.kw, subsidy: b.subsidy };
    }
  }
  return p;
}

/** Size a calculator opens on: the largest size that still gets the state's top-up for this consumer class when the
 *  rule has a limit (Gujarat 2.18 kWp, Maharashtra BPL 1 kW), otherwise the size (≤ 3 kW) with the highest subsidy (3 kW) */
export function bestSize(state, klass = 'general') {
  // a top-up that stops at a size limit (Maharashtra BPL / SC-ST 1 kW, Haryana Antyodaya 2 kWp, Gujarat 2.18 kWp):
  // open on that limit, otherwise the consumer would first see "₹0 state subsidy" for a class that does get one
  const cap = stateRule(state, klass).maxKw;
  if (cap >= 0.5 && cap <= BENCHMARK_MAX_KW && stateSubsidy(cap, state, 'residential', { klass }) > 0) return cap;
  const b = subsidyPlan({ kw: 3, state, klass }).best;
  return b && b.subsidy > 0 ? b.kw : 3;
}

/** Internal rate of return (% per year) of [-cost, saving1, saving2, …] – bisection, null when undefined */
export function irr(flows) {
  const f = (r) => flows.reduce((s, c, i) => s + c / Math.pow(1 + r, i), 0);
  if (!(flows[0] < 0) || f(0) <= 0) return null;
  let lo = 0;
  let hi = 10;
  if (f(hi) > 0) return null;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (f(m) > 0) lo = m;
    else hi = m;
  }
  return round(lo * 100, 1);
}

/** Year-by-year savings model. O&M is charged on the gross (pre-subsidy) cost. */
export function roiModel({ kw, netCost, tariff, gen = 4.2, escalation = 3, degradation = 0.5, om = 1, years = 25, grossCost }) {
  netCost = pos(netCost);
  const tf = pos(tariff);
  const esc = clamp(escalation, 0, 20);
  const deg = clamp(degradation, 0, 5);
  const rows = [];
  const flows = [-netCost];
  let cum = -netCost;
  let payback = null;
  let total = 0;
  const base = yearlyGeneration(kw, gen);
  const omCost = ((pos(grossCost) || netCost) * clamp(om, 0, 10)) / 100;
  for (let y = 1; y <= years; y++) {
    const units = base * Math.pow(1 - deg / 100, y - 1);
    const t = tf * Math.pow(1 + esc / 100, y - 1);
    const saving = units * t - omCost;
    const prev = cum;
    cum += saving;
    total += saving;
    flows.push(saving);
    if (payback === null && cum >= 0) payback = y - 1 + (saving > 0 ? -prev / saving : 0);
    rows.push({ year: y, units: Math.round(units), tariff: round(t, 2), saving: Math.round(saving), cum: Math.round(cum) });
  }
  return {
    rows,
    payback: payback === null ? null : round(Math.max(0, payback), 1),
    total: Math.round(total),
    roi: netCost > 0 ? round(((total - netCost) / netCost) * 100, 0) : 0,
    irr: irr(flows),
  };
}

export function emi(principal, ratePct, years) {
  const P = pos(principal);
  const n = Math.max(1, Math.round((pos(years) || 1) * 12));
  const r = pos(ratePct) / 1200;
  const e = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { emi: Math.round(e), total: Math.round(e * n), interest: Math.round(e * n - P), months: n };
}

/** Full rooftop plan from a monthly bill / units. Cost = market estimate; subsidy from the same engine as the subsidy calculator. */
export function rooftopPlan({ state, bill, units, by = 'bill', category = 'residential', tariff, panelW = 550, klass = 'general', houses }) {
  const t = pos(tariff) || (state && state.tariff) || 7;
  const gen = (state && state.gen) || 4.2;
  const monthlyUnits = by === 'bill' ? pos(bill) / t : pos(units);
  const kw = sizeFromUnits(monthlyUnits, gen);
  const plan = subsidyPlan({ kw, state, category, klass, tariff: t, basis: 'market', houses });
  const cost = systemCost(kw, 'ongrid', category);
  const annualUnits = yearlyGeneration(kw, gen);
  const usable = Math.min(annualUnits, monthlyUnits * 12);
  // the saving is the part of the bill the plant wipes out, so it can never be more than the bill itself;
  // surplus units are NOT counted as a saving – what the DISCOM may pay for them is reported separately
  const annualSavings = Math.round(usable * t);
  const exportCredit = Math.round((annualUnits - usable) * Math.min(t, EXPORT_RATE));
  const roi = roiModel({ kw, netCost: plan.pay, grossCost: cost.mid, tariff: annualUnits ? annualSavings / annualUnits : t, gen });
  return {
    tariff: t,
    monthlyUnits: Math.round(monthlyUnits),
    kw,
    panels: Math.ceil((kw * 1000) / panelW - EPS),
    roofSqft: Math.round(kw * SQFT_PER_KW),
    cost,
    central: plan.central,
    extra: plan.state,
    subsidy: plan.subsidy,
    net: plan.pay,
    plan,
    // what the household would pay if the installer charged exactly the MNRE benchmark cost (homes up to 3 kW only)
    benchPay: plan.benchmark == null ? null : Math.max(0, plan.benchmark - plan.lines.reduce((x, l) => x + l.amount, 0) - plan.stateInfo.amount),
    coverage: monthlyUnits > 0 ? Math.min(100, Math.round((annualUnits / (monthlyUnits * 12)) * 100)) : 100,
    annualUnits,
    annualSavings,
    exportCredit,
    monthlySavings: Math.round(annualSavings / 12),
    payback: roi.payback,
    savings25: roi.total,
    co2: round((annualUnits * CO2_PER_KWH) / 1000, 1),
    trees: Math.round((annualUnits * CO2_PER_KWH) / KG_CO2_PER_TREE),
    depreciation: category === 'commercial' ? Math.round(cost.mid * 0.4 * 0.25) : 0,
  };
}

/**
 * CAPEX (own the plant) vs OPEX / PPA for a business, after tax, over 25 years.
 * CAPEX: bill saved − O&M, taxed like any profit, plus the tax shield of 40% WDV depreciation every year.
 * OPEX:  (grid tariff − PPA tariff) × units, taxed the same way. npv* discounts both at `discount` % a year.
 */
export function opexCapex({ kw, cost, grid, ppa, tax = 25, esc = 3, gen = 4.2, discount = 9, ppaEsc = 1, om = 1, years = 25 }) {
  cost = pos(cost);
  const g = pos(grid);
  const pp = pos(ppa);
  const tx = clamp(tax, 0, 60) / 100;
  const e = clamp(esc, 0, 20) / 100;
  const d = clamp(discount, 0, 50) / 100;
  const base = yearlyGeneration(kw, gen);
  let wdv = cost;
  let capex = 0;
  let opex = 0;
  let npvCapex = -cost;
  let npvOpex = 0;
  let cum = -cost;
  let payback = null;
  let dep1 = 0;
  for (let y = 1; y <= years; y++) {
    const u = base * Math.pow(0.995, y - 1);
    const tf = g * Math.pow(1 + e, y - 1);
    const dep = wdv * 0.4;
    wdv -= dep;
    if (y === 1) dep1 = dep * tx;
    const c = (u * tf - cost * (pos(om) / 100)) * (1 - tx) + dep * tx;
    const o = u * Math.max(0, tf - pp * Math.pow(1 + pos(ppaEsc) / 100, y - 1)) * (1 - tx);
    const df = Math.pow(1 + d, y);
    capex += c;
    opex += o;
    npvCapex += c / df;
    npvOpex += o / df;
    const prev = cum;
    cum += c;
    if (payback === null && cum >= 0) payback = round(y - 1 + (c > 0 ? -prev / c : 0), 1);
  }
  return { base, dep1: Math.round(dep1), capexNet: Math.round(capex - cost), opexSave: Math.round(opex), npvCapex: Math.round(npvCapex), npvOpex: Math.round(npvOpex), payback, capexBetter: npvCapex >= npvOpex };
}

/** Battery bank for a backup load. Efficiency covers inverter + battery + wiring losses. */
export function batterySizing({ load, hours, type = 'lithium', volt = 48, gen = 4.2 }) {
  const li = type !== 'lead';
  const V = pos(volt) || 48;
  const dod = li ? 0.9 : 0.5;
  const eff = li ? 0.9 : 0.8;
  const need = pos(load) * pos(hours); // Wh the appliances actually use
  const wh = need / (dod * eff); // rated battery energy to buy
  const ah = wh / V;
  const unitV = li ? Math.min(V, 48) : 12;
  const series = Math.max(1, Math.round(V / unitV));
  const sizes = li ? [50, 100, 150, 200, 280, 314] : [100, 150, 200, 220];
  const sizeAh = sizes.find((a) => a >= ah - EPS) || sizes[sizes.length - 1];
  const parallel = Math.max(1, Math.ceil(ah / sizeAh - EPS));
  const amps = pos(load) / (V * eff); // battery current at full load
  return { dod, eff, need, wh, ah, unitV, series, parallel, count: series * parallel, sizeAh, amps: Math.round(amps), highAmps: amps > 120, solarKw: round(need / eff / 1000 / (pos(gen) || 4.2), 1) };
}

const INV_ONGRID = [1, 1.5, 2, 2.5, 3, 3.3, 3.6, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 125];
const INV_BACKUP = [0.7, 1, 1.5, 2, 2.5, 3, 3.5, 5, 6, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 80, 100];

/** Inverter size: on-grid follows the panel array (DC/AC ≈ 1.1), off-grid follows the load, hybrid must satisfy both. */
export function inverterSizing({ load, pf = 0.8, surge = false, margin = 25, array, type = 'ongrid' }) {
  const kva = round((pos(load) / clamp(pf || 0.8, 0.5, 1) / 1000) * (1 + pos(margin) / 100) * (surge ? 1.5 : 1), 1);
  const arr = pos(array);
  const byArray = round(arr / 1.1, 2);
  const pick = (list, v) => list.find((s) => s >= v - EPS) || Math.ceil(v);
  const rec = type === 'ongrid' ? pick(INV_ONGRID, byArray) : pick(INV_BACKUP, type === 'hybrid' ? Math.max(kva, byArray) : kva);
  return { kva, byArray, rec, unit: type === 'ongrid' ? 'kW' : 'kVA', ratio: rec ? round(arr / rec, 2) : 0 };
}

// Real module area (sq ft) of common panel wattages; rows on a flat roof need ~1.8× that (tilt, row gap, walkway)
const PANEL_SQFT = { 450: 23.3, 550: 27.8, 580: 27.8, 600: 30.5, 650: 33.4 };
export const PANEL_WATTS = Object.keys(PANEL_SQFT);

export function roofCapacity({ len, wid, usable = 70, panelW = 550, mount = 'flat' }) {
  const total = pos(len) * pos(wid);
  const use = (total * clamp(usable, 0, 100)) / 100;
  const per = (PANEL_SQFT[panelW] || 27.8) * (mount === 'flat' ? 1.8 : 1.15);
  const count = Math.floor(use / per + EPS);
  return { total, use, per: round(per, 1), count, kw: round((count * Number(panelW)) / 1000, 2) };
}

export const CABLE_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];
// Approximate current rating (A), PVC/XLPE copper in conduit/air
const CU_AMPS = { 1.5: 18, 2.5: 25, 4: 34, 6: 44, 10: 61, 16: 82, 25: 108, 35: 135, 50: 165, 70: 210, 95: 255, 120: 295, 150: 340, 185: 390, 240: 460, 300: 530 };

/** Cable size by voltage drop and current rating. phase 1 = DC or single-phase (out and back), 3 = three-phase AC. */
export function cableSize({ current, voltage, length, drop = 2, material = 'copper', phase = 1 }) {
  const rho = material === 'copper' ? 0.0183 : 0.0294; // Ω·mm²/m at ~40 °C
  const k = Number(phase) === 3 ? Math.sqrt(3) : 2;
  const I = pos(current);
  const V = Math.max(1, pos(voltage));
  const L = pos(length);
  const vd = (V * (pos(drop) || 2)) / 100;
  const area = (k * L * I * rho) / vd;
  const ampFactor = material === 'copper' ? 1 : 0.78;
  const found = CABLE_SIZES.find((s) => s >= area && CU_AMPS[s] * ampFactor >= I * 1.25);
  const size = found || CABLE_SIZES[CABLE_SIZES.length - 1];
  const actual = (k * L * I * rho) / size;
  return { area: round(area, 2), size, ok: !!found, dropV: round(actual, 2), dropPct: round((actual / V) * 100, 2), loss: Math.round(actual * I * (k === 2 ? 1 : Math.sqrt(3))) };
}

export function stringSizing({ voc, vmp, coeff = -0.27, tmin = 5, tmax = 45, vmax = 1000, mpptMin = 200, mpptMax = 850 }) {
  voc = pos(voc);
  vmp = pos(vmp);
  const c = (Number(coeff) || 0) / 100;
  const lo = Number(tmin) || 0;
  const vocCold = voc * (1 + c * (lo - 25));
  const cellHot = (Number(tmax) || 0) + 25; // cells run about 25 °C hotter than the air
  const vmpHot = vmp * (1 + c * 1.15 * (cellHot - 25)); // Vmp falls a little faster with heat than Voc
  const vmpCold = vmp * (1 + c * (lo - 25));
  if (!(vocCold > 0) || !(vmpHot > 0) || !(vmpCold > 0)) return { vocCold: 0, vmpHot: 0, max: 0, min: 0, ok: false };
  const max = Math.max(0, Math.floor(Math.min(pos(vmax) / vocCold, pos(mpptMax) / vmpCold) + EPS));
  const min = Math.ceil(pos(mpptMin) / vmpHot - EPS);
  return { vocCold: round(vocCold, 1), vmpHot: round(vmpHot, 1), max, min, ok: max >= min && max > 0 };
}

// ── compact state list for the browser (src/data/lite.js packs, the islands unpack) ──
const unpackRule = (x) => {
  const r = {};
  if (x.p) r.perKw = x.p;
  if (x.m) r.max = x.m;
  if (x.r) r.rates = x.r;
  if (x.f) r.flat = x.f;
  if (x.b) r.benchmark = { first2: x.b[0], above2: x.b[1] };
  if (x.sh != null) r.share = x.sh;
  if (x.mn) r.minKw = x.mn;
  if (x.mk) r.maxKw = x.mk;
  return r;
};
export const packRule = (r) => {
  const x = {};
  if (r.perKw) x.p = r.perKw;
  if (r.max) x.m = r.max;
  if (r.rates && r.rates.length) x.r = r.rates;
  if (r.flat) x.f = r.flat;
  if (r.benchmark) x.b = [r.benchmark.first2, r.benchmark.above2];
  if (r.share != null) x.sh = r.share;
  if (r.minKw) x.mn = r.minKw;
  if (r.maxKw) x.mk = r.maxKw;
  return x;
};
const STATUS = { c: 'confirmed', r: 'reported', u: 'unconfirmed', n: 'none' };

/** lite state {s,n,t,g,sp,x} → the shape the functions above expect */
export function fromLite(s) {
  if (!s) return null;
  const x = s.x || {};
  const extra = unpackRule(x);
  if (x.st) extra.status = STATUS[x.st] || x.st;
  if (x.a) extra.asOf = x.a;
  if (x.nt) extra.note = x.nt;
  if (x.g0) extra.general = false;
  if (x.c) extra.classes = Object.fromEntries(Object.entries(x.c).map(([k, v]) => [k, unpackRule(v)]));
  return { slug: s.s, name: s.en || s.n, tariff: s.t, gen: s.g, special: !!s.sp, extra };
}
