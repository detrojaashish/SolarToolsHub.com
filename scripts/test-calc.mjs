// Calculator maths tests – plain Node, no framework.   usage: node scripts/test-calc.mjs
// 1. subsidy reference values (docs/CONTRACT.md §4 + the verified rules in src/data/states.js)
// 2. sanity sweep: every state × consumer class × size 0.5–10 kW (+ existing capacity, + lite round-trip)
// 3. EMI / ROI / cable / string / battery / inverter / roof / OPEX-CAPEX against hand-computed values
import * as S from '../src/lib/solar.js';
import { STATES, PMSG } from '../src/data/states.js';
import { STATES_LITE } from '../src/data/lite.js';

let pass = 0;
let fail = 0;
const fails = [];
const ok = (cond, msg) => {
  if (cond) pass++;
  else {
    fail++;
    fails.push(msg);
    console.log('  ✗ ' + msg);
  }
};
const eq = (got, want, msg) => ok(got === want, `${msg}: expected ${want}, got ${got}`);
const near = (got, want, tol, msg) => ok(Math.abs(got - want) <= tol, `${msg}: expected ${want} ±${tol}, got ${got}`);
const inr = (n) => (n == null ? '–' : '₹' + new Intl.NumberFormat('en-IN').format(n));
const st = (slug) => STATES.find((s) => s.slug === slug);
const section = (name) => console.log('\n' + name);

// ── 0. the constants in lib/solar.js must mirror PMSG in states.js (the source of truth) ─────────────
section('Central-scheme constants (lib/solar.js ↔ data/states.js)');
for (const k of ['general', 'special']) {
  for (const f of ['first2', 'third', 'max']) eq(S.PMSG_RATES[k][f], PMSG[k][f], `PMSG.${k}.${f}`);
  for (const f of ['first2', 'above2']) eq((k === 'special' ? S.BENCHMARK_SPECIAL : S.BENCHMARK)[f], PMSG.benchmark[k][f], `PMSG.benchmark.${k}.${f}`);
}
for (const f of ['rwaPerKw', 'rwaPerKwSpecial', 'rwaMaxKw', 'rwaKwPerHouse']) eq(S.PMSG_RATES[f], PMSG[f], `PMSG.${f}`);
console.log(`  ${fail ? '✗' : '✓'} central ₹${PMSG.general.first2}/₹${PMSG.general.third} (special ₹${PMSG.special.first2}/₹${PMSG.special.third}), benchmark ₹${PMSG.benchmark.general.first2}/₹${PMSG.benchmark.general.above2} (special ₹${PMSG.benchmark.special.first2}/₹${PMSG.benchmark.special.above2}), RWA ₹${PMSG.rwaPerKw}/₹${PMSG.rwaPerKwSpecial} per kW`);

// ── 1. reference values ─────────────────────────────────────────────────────
section('Reference values');
const ref = (label, args, want) => {
  const p = S.subsidyPlan(args);
  const got = { benchmark: p.benchmark, cost: p.cost, central: p.central, state: p.state, pay: p.pay, subsidy: p.subsidy };
  const bad = Object.keys(want).filter((k) => got[k] !== want[k]);
  ok(!bad.length, `${label}: ${bad.map((k) => `${k} expected ${want[k]}, got ${got[k]}`).join('; ')}`);
  console.log(`  ${bad.length ? '✗' : '✓'} ${label} → cost ${inr(p.cost)} (${p.basis}) · central ${inr(p.central)} · state ${inr(p.state)} · total ${inr(p.subsidy)} · you pay ${inr(p.pay)}`);
  return p;
};
const guj = st('gujarat');
eq(S.benchmarkCost(2.18), 108100, 'benchmarkCost(2.18)');
eq(S.benchmarkCost(2), 100000, 'benchmarkCost(2)');
eq(S.benchmarkCost(3), 145000, 'benchmarkCost(3)');
eq(S.benchmarkCost(3, S.BENCHMARK_SPECIAL), 159500, 'special-category benchmark 3 kW (2 × 55,000 + 49,500)');
// owner-confirmed Gujarat values, straight from src/data/states.js
const g218 = ref('Gujarat general 2.18 kWp', { kw: 2.18, state: guj }, { benchmark: 108100, cost: 108100, central: 63240, state: 34050, pay: 10810 });
eq(g218.lines.map((l) => `${l.kw}x${l.rate}=${l.amount}`).join(' + '), '2x30000=60000 + 0.18x18000=3240', 'central slab lines for 2.18 kWp');
eq(g218.stateInfo.shareAmt, 10810, 'Gujarat household share (10% of benchmark)');
eq(g218.basis, 'benchmark', 'Gujarat 2.18 kWp cost basis');
eq(g218.status, 'confirmed', 'Gujarat status');
ref('Gujarat SC/ST 2.18 kWp', { kw: 2.18, state: guj, klass: 'scst' }, { benchmark: 108100, central: 63240, state: 39455, pay: 5405 });
ref('Gujarat general 2 kWp', { kw: 2, state: guj }, { benchmark: 100000, central: 60000, state: 30000, pay: 10000 });
ref('Gujarat general 3 kWp (above the 2.18 limit)', { kw: 3, state: guj }, { benchmark: 145000, central: 78000, state: 0, pay: 67000 });
// Delhi: Gazette of 17 Sep 2026 – ₹26,000/kW, max ₹78,000, never more than cost − central (supersedes ₹10,000/kW)
const del = st('delhi');
// default cost basis outside benchmark-model states is the market price → the same figures as every other calculator
const d3 = ref('Delhi 3 kW (default = market price ₹1,80,000)', { kw: 3, state: del }, { benchmark: 145000, cost: 180000, central: 78000, state: 78000, pay: 24000 });
eq(d3.basis, 'market', 'Delhi default cost basis');
eq(d3.capped, false, 'Delhi 3 kW at market price is not capped');
ref('Delhi 3 kW at benchmark cost when asked for (state capped at cost − central)', { kw: 3, state: del, basis: 'benchmark' }, { cost: 145000, central: 78000, state: 67000, pay: 0 });
eq(S.subsidyPlan({ kw: 3, state: del }).stateInfo.amount, 78000, 'Delhi 3 kW uncapped state amount (₹26,000 × 3)');
eq(S.subsidyPlan({ kw: 3, state: del, basis: 'benchmark' }).capped, true, 'Delhi 3 kW at benchmark cost flagged as capped');
ref('Delhi 3 kW at market price', { kw: 3, state: del, basis: 'market' }, { cost: 180000, central: 78000, state: 78000, pay: 24000 });
ref('Bihar 2 kW', { kw: 2, state: st('bihar') }, { cost: 130000, central: 60000, state: 20000, pay: 50000 });
ref('Uttar Pradesh 3 kW', { kw: 3, state: st('uttar-pradesh') }, { central: 78000, state: 30000 });
ref('Rajasthan 3 kW, free-electricity household', { kw: 3, state: st('rajasthan'), klass: 'free' }, { central: 78000, state: 17000 });
ref('Rajasthan 3 kW, general', { kw: 3, state: st('rajasthan') }, { central: 78000, state: 0 });
eq(S.stateDetail(3, st('rajasthan')).reason, 'class', 'Rajasthan general: reason = class');
eq(S.stateDetail(1, st('rajasthan'), 'residential', { klass: 'free' }).reason, 'below', 'Rajasthan free below 1.1 kW');
ref('Haryana 2 kW, Antyodaya / BPL', { kw: 2, state: st('haryana'), klass: 'bpl' }, { cost: 130000, central: 60000, state: 50000, pay: 20000 });
ref('Haryana 2 kW, Antyodaya / BPL at benchmark cost', { kw: 2, state: st('haryana'), klass: 'bpl', basis: 'benchmark' }, { central: 60000, state: 40000, pay: 0 }); // ₹50,000 capped at cost − central
eq(S.stateSubsidy(2, st('haryana'), 'residential', { klass: 'bpl' }), 50000, 'Haryana BPL 2 kW state amount');
eq(S.stateSubsidy(3, st('haryana'), 'residential', { klass: 'bpl' }), 0, 'Haryana BPL above 2 kWp');
ref('Maharashtra 1 kW, BPL (SMART scheme)', { kw: 1, state: st('maharashtra'), klass: 'bpl' }, { cost: 70000, central: 30000, state: 17500, pay: 22500 });
ref('Maharashtra 1 kW, SC/ST', { kw: 1, state: st('maharashtra'), klass: 'scst' }, { cost: 70000, central: 30000, state: 15000, pay: 25000 });
eq(S.stateSubsidy(2, st('maharashtra'), 'residential', { klass: 'bpl' }), 0, 'Maharashtra SMART is for 1 kW only');
eq(S.stateSubsidy(1, st('maharashtra')), 0, 'Maharashtra general gets no top-up');
ref('Andhra Pradesh 2 kW, SC/ST (free system)', { kw: 2, state: st('andhra-pradesh'), klass: 'scst' }, { central: 60000, state: 40000, pay: 0 });
ref('West Bengal 3 kW, general', { kw: 3, state: st('west-bengal') }, { central: 78000, state: 15000 });
ref('West Bengal 3 kW, SC/ST', { kw: 3, state: st('west-bengal'), klass: 'scst' }, { central: 78000, state: 30000 });
ref('Odisha 3 kW', { kw: 3, state: st('odisha') }, { central: 78000, state: 60000 });
ref('Tamil Nadu 3 kW', { kw: 3, state: st('tamil-nadu') }, { central: 78000, state: 22000 });
const an = ref('Andaman & Nicobar 3 kW (UT top-up not modelled – note only)', { kw: 3, state: st('andaman-and-nicobar-islands') }, { benchmark: 159500, cost: 180000, central: 85800, state: 0, pay: 94200 });
ok(an.status === 'confirmed' && an.note.length > 50, 'Andaman & Nicobar keeps its status and note');
ref('special-category state 3 kW (Sikkim)', { kw: 3, state: st('sikkim') }, { benchmark: 159500, central: 85800, state: 0 });
// no official benchmark above 3 kW → market estimate is the cost basis
const m5 = ref('Maharashtra 5 kW (no benchmark above 3 kW → market price)', { kw: 5, state: st('maharashtra') }, { benchmark: null, cost: 285000, central: 78000, state: 0, pay: 207000 });
eq(m5.basis, 'market', 'cost basis above 3 kW');
eq(S.subsidyPlan({ kw: 3.01, state: guj }).benchmark, null, 'no benchmark at 3.01 kW');
eq(S.subsidyPlan({ kw: 3, state: guj }).basis, 'benchmark', 'benchmark still used at exactly 3 kW');
// RWA / group housing: ₹18,000/kW (₹19,800 special), min(installed, 3 kW × houses, 500 kW)
ref('RWA / housing society 100 kW', { kw: 100, state: st('maharashtra'), category: 'society' }, { central: 1800000, state: 0 });
ref('RWA 100 kW with 20 flats (60 kW eligible)', { kw: 100, state: st('maharashtra'), category: 'society', houses: 20 }, { central: 1080000 });
ref('RWA 100 kW, special-category state', { kw: 100, state: st('sikkim'), category: 'society', houses: 50 }, { central: 1980000 });
eq(S.centralSubsidy(100, { category: 'society' }), 1800000, 'RWA 100 kW');
eq(S.centralSubsidy(600, { category: 'society' }), 9000000, 'RWA capped at 500 kW');
eq(S.centralSubsidy(600, { category: 'society', houses: 300 }), 9000000, 'RWA 300 flats still capped at 500 kW');
eq(S.centralSubsidy(5, { category: 'commercial' }), 0, 'commercial gets no central subsidy');
eq(S.stateSubsidy(3, del, 'commercial'), 0, 'no state top-up for commercial');
eq(S.centralSubsidy(1), 30000, 'central 1 kW');
eq(S.centralSubsidy(1.5), 45000, 'central 1.5 kW');
eq(S.centralSubsidy(2.5), 69000, 'central 2.5 kW');
eq(S.centralSubsidy(10), 78000, 'central 10 kW');
eq(S.centralSubsidy(3, { special: true }), 85800, 'special category 3 kW');
eq(S.centralSubsidy(2, { special: true }), 66000, 'special category 2 kW');
// existing capacity uses up the first slabs (CFA only for the balance up to 3 kW in total)
eq(S.centralSubsidy(2, { existingKw: 1 }), 48000, 'central 2 kW new with 1 kW existing');
eq(S.centralSubsidy(1, { existingKw: 3 }), 0, 'central with 3 kW already installed');
eq(S.centralSubsidy(1.18, { existingKw: 1 }), 33240, 'central 1.18 kW new with 1 kW existing');
eq(S.subsidyPlan({ kw: 1.18, state: guj, existingKw: 1 }).pay, 5900, 'Gujarat 1.18 kWp new + 1 kW existing → household pays 10% of ₹59,000');
eq(S.subsidyPlan({ kw: 2, state: guj, existingKw: 1 }).state, 0, 'Gujarat: existing + new above 2.18 kWp → no state top-up');
eq(S.stateDetail(2, guj, 'residential', { existingKw: 1 }).reason, 'existing', 'Gujarat: reason = existing');
// engine rule types with fixtures (independent of the data file)
const fx = (extra, special = false) => ({ slug: 'fixture', tariff: 7, gen: 4.2, special, extra });
const PERKW = fx({ status: 'confirmed', perKw: 10000, max: 30000 });
const SLAB = fx({ status: 'confirmed', rates: [25000, 25000, 10000], max: 60000 });
eq(S.subsidyPlan({ kw: 3, state: PERKW }).subsidy, 108000, 'per-kW rule ₹10,000/kW max ₹30,000: 3 kW total subsidy');
eq(S.stateSubsidy(1.5, PERKW), 15000, 'per-kW rule 1.5 kW');
eq(S.stateSubsidy(8, PERKW), 30000, 'per-kW rule 8 kW stays at the cap');
eq(S.stateSubsidy(2, PERKW, 'residential', { existingKw: 2 }), 10000, 'per-kW rule with 2 kW existing: only the balance to the cap');
eq(S.stateSubsidy(2.5, SLAB), 55000, 'slab rule 25k + 25k + half of 10k');
eq(S.stateSubsidy(5, SLAB), 60000, 'slab rule: nothing beyond the last slab');
eq(S.stateSubsidy(2, SLAB, 'residential', { existingKw: 1 }), 35000, 'slab rule with 1 kW existing');
eq(S.stateSubsidy(3, fx({ perKw: 20000, max: 50000, classes: { bpl: { perKw: 30000 } } }), 'residential', { klass: 'bpl' }), 50000, 'class override keeps the default cap');
eq(S.stateSubsidy(3, fx({ perKw: 20000, max: 30000, classes: { scst: { flat: 40000 } } }), 'residential', { klass: 'scst' }), 40000, 'class with another model drops the default cap');
eq(S.stateSubsidy(3, fx({ flat: 17000 }), 'residential', { existingKw: 1 }), 0, 'flat grant is paid once per home');
eq(S.subsidyPlan({ kw: 2, state: fx({ share: 10, maxKw: 3 }, true) }).pay, 11000, 'benchmark model in a special-category state uses ₹55,000/kW');
eq(S.stateSubsidy(3, fx({ perKw: 0, max: 0, note: 'old shape' })), 0, 'old-shape "no top-up" entry');
eq(S.stateSubsidy(1.5, fx({ perKw: 16200, max: 33600, rates: [16200, 17400], maxKw: 2.18 })), 24900, 'old-shape slab entry still works');
// best-value size and tips
eq(S.bestSize(guj), 2.18, 'best size Gujarat');
eq(S.bestSize(guj, 'scst'), 2.18, 'best size Gujarat SC/ST');
eq(S.bestSize(st('maharashtra')), 3, 'best size Maharashtra (general: no top-up)');
eq(S.bestSize(st('maharashtra'), 'bpl'), 1, 'best size Maharashtra BPL = 1 kW, the only size with the SMART top-up');
eq(S.bestSize(st('maharashtra'), 'scst'), 1, 'best size Maharashtra SC/ST = 1 kW');
eq(S.bestSize(st('rajasthan'), 'free'), 3, 'best size Rajasthan free-electricity class (minimum size only → 3 kW)');
eq(S.bestSize({ slug: 'x', name: 'X', tariff: 6, gen: 4, extra: { share: 100, maxKw: 2 } }), 3, 'a size limit that earns no top-up is ignored');
eq(S.bestSize({ slug: 'x', name: 'X', tariff: 6, gen: 4, extra: { perKw: 5000, maxKw: 0.3 } }), 3, 'a size limit below the smallest system is ignored');
eq(S.bestSize(null), 3, 'best size without a state');
// every class with a size limit opens on a size that really gets its top-up
for (const s of STATES) for (const c of S.stateClasses(s)) {
  const lim = S.stateRule(s, c).maxKw;
  if (lim && lim <= 3) ok(S.subsidyPlan({ kw: S.bestSize(s, c), state: s, klass: c }).state > 0, `${s.slug}/${c}: default size ${S.bestSize(s, c)} kW gets the state top-up`);
}
eq(S.bestSize(st('haryana'), 'bpl'), 2, 'best size Haryana BPL (top-up only up to 2 kWp)');
eq(S.bestSize(st('andhra-pradesh'), 'scst'), 2, 'best size Andhra Pradesh SC/ST');
eq(S.bestSize(del), 3, 'best size Delhi (not 5 kW, although the cost cap bites at benchmark cost)');
eq(S.bestSize(st('goa')), 3, 'best size Goa (never above the centrally subsidised 3 kW)');
for (const s of STATES) for (const c of S.stateClasses(s)) ok(S.bestSize(s, c) <= 3 && S.bestSize(s, c) >= 1, `${s.slug}/${c}: best size ${S.bestSize(s, c)}`);
eq(g218.tip && g218.tip.id, 'best', 'tip at Gujarat 2.18');
const g3 = S.subsidyPlan({ kw: 3, state: guj });
eq(g3.tip && g3.tip.id, 'limit', 'tip at Gujarat 3 kW');
eq(g3.tip && g3.tip.more, 56190, 'Gujarat 3 kW costs ₹56,190 more than 2.18 kWp');
const m2 = S.subsidyPlan({ kw: 2, state: st('maharashtra') });
eq(m2.tip && m2.tip.id, 'more', 'tip at Maharashtra 2 kW');
eq(m2.tip && m2.tip.extra, 18000, 'Maharashtra: 3 kW gets ₹18,000 more');
eq(m5.tip && m5.tip.id, 'cap', 'tip at Maharashtra 5 kW');
// vendor quotation and edited rates
const gq = S.subsidyPlan({ kw: 2.18, state: guj, quote: 130000 });
eq(gq.pay, 130000 - 63240 - 34050, 'Gujarat 2.18 kWp with ₹1,30,000 quotation');
eq(gq.basis, 'quote', 'cost basis = quotation');
const gr = S.subsidyPlan({ kw: 2.18, state: guj, rates: { share: 20, central: { first2: 25000, third: 18000 }, benchmark: { first2: 60000, above2: 50000 } } });
eq(gr.benchmark, 129000, 'edited benchmark');
eq(gr.central, 53240, 'edited central rate');
eq(gr.pay, 25800, 'edited household share 20%');
eq(S.subsidyPlan({ kw: 2.5, state: guj, rates: { maxKw: 3 } }).state > 0, true, 'edited state limit 3 kWp');
eq(S.subsidyPlan({ kw: 2.18, state: guj, rates: { central: { first2: '', third: '' }, benchmark: { first2: '', above2: '' }, share: '', shareScst: '', maxKw: '' } }).pay, 10810, 'empty rate fields fall back to the defaults');
eq(S.subsidyPlan({ kw: 3, state: guj, type: 'offgrid' }).subsidy, 0, 'off-grid gets no subsidy');

// ── 2. sanity sweep ─────────────────────────────────────────────────────────
section('Sanity sweep: 36 states × classes × sizes');
eq(STATES.length, 36, 'number of states / UTs');
ok(STATES.every((s) => s.extra && ['confirmed', 'reported', 'unconfirmed', 'none'].includes(s.extra.status)), 'every state has a contract-shape `extra` with a status');
const sizes = [];
for (let k = 0.5; k <= 10.001; k += 0.25) sizes.push(Math.round(k * 100) / 100);
sizes.push(1.1, 2.18, 2.19, 3.27);
sizes.sort((a, b) => a - b);
let combos = 0;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
for (const s of STATES) {
  const lite = S.fromLite(STATES_LITE.find((x) => x.s === s.slug));
  const classes = S.stateClasses(s);
  ok(classes[0] === 'general' && classes.every((c) => S.CLASS_IDS.includes(c)), `${s.slug}: class list ${classes}`);
  eq(S.stateClasses(lite).join(), classes.join(), `${s.slug}: classes survive the lite round-trip`);
  eq(Object.keys(s.extra.classes || {}).filter((c) => !S.CLASS_IDS.includes(c)).join(), '', `${s.slug}: unknown class ids`);
  for (const klass of S.CLASS_IDS) {
    for (const basis of ['benchmark', 'market']) {
      let prevCentral = -1;
      for (const kw of sizes) {
        for (const existingKw of [0, 1]) {
          combos++;
          const tag = `${s.slug}/${klass}/${basis}/${kw}kW/ex${existingKw}`;
          const p = S.subsidyPlan({ kw, state: s, klass, basis, existingKw });
          const nums = [p.cost, p.market, p.central, p.state, p.subsidy, p.pay, p.perKw, p.pct, p.units, p.saving];
          ok(nums.every(isNum), `${tag}: NaN / non-finite value in ${nums}`);
          ok(kw > 3 ? p.benchmark === null && p.basis === 'market' : isNum(p.benchmark) && p.basis === basis, `${tag}: benchmark ${p.benchmark} / basis ${p.basis}`);
          ok(p.central >= 0 && p.state >= 0 && p.pay >= 0 && p.cost > 0, `${tag}: negative amount`);
          ok(p.subsidy <= p.cost, `${tag}: subsidy ${p.subsidy} > cost ${p.cost}`);
          ok(p.subsidy === p.central + p.state && p.pay === p.cost - p.subsidy, `${tag}: receipt does not add up`);
          ok(p.central <= (s.special ? 85800 : 78000), `${tag}: central above cap`);
          ok(p.payback === null || (isNum(p.payback) && p.payback >= 0), `${tag}: payback ${p.payback}`);
          ok(p.best && p.compare.length >= 4 && p.compare.filter((r) => r.best).length === 1 && p.compare.filter((r) => r.cur).length === 1, `${tag}: best / current row`);
          ok(p.best.kw <= 3 && p.compare.every((r) => r.kw > 3 || r.ent <= p.best.ent), `${tag}: best is not the highest subsidy among sizes up to 3 kW`);
          ok(['confirmed', 'reported', 'unconfirmed', 'none'].includes(p.status), `${tag}: status ${p.status}`);
          if (!existingKw) {
            ok(p.central >= prevCentral, `${tag}: central subsidy not monotonic in size`);
            prevCentral = p.central;
            // the browser gets the compact list – it must give identical numbers
            const q = S.subsidyPlan({ kw, state: lite, klass, basis });
            ok(q.central === p.central && q.state === p.state && q.pay === p.pay && q.status === p.status && (p.status === 'none' || q.note === p.note), `${tag}: lite ≠ full (${q.central}/${q.state}/${q.pay} vs ${p.central}/${p.state}/${p.pay})`);
            // old positional signature still works and agrees
            ok(S.stateSubsidy(kw, s, 'residential', { klass }) >= p.state, `${tag}: stateSubsidy() disagrees`);
            ok(S.centralSubsidy(kw, { special: s.special }) >= p.central, `${tag}: centralSubsidy() disagrees`);
          }
        }
      }
    }
  }
  eq(S.centralSubsidy(3, { special: s.special }), s.special ? 85800 : 78000, `${s.slug} central 3 kW`);
  // other categories and garbage input never throw or produce NaN
  for (const category of ['society', 'commercial']) {
    const p = S.subsidyPlan({ kw: 50, state: s, category, houses: 10 });
    ok(isNum(p.pay) && p.pay >= 0 && p.state === 0 && p.benchmark === null, `${s.slug}/${category}: pay ${p.pay}, state ${p.state}`);
    eq(p.central, category === 'society' ? 30 * (s.special ? 19800 : 18000) : 0, `${s.slug}/${category}: central for 50 kW, 10 flats`);
  }
  for (const kw of ['', null, undefined, NaN, -5, 'abc', Infinity, 0]) {
    const p = S.subsidyPlan({ kw, state: s, quote: kw, tariff: kw, existingKw: kw, houses: kw });
    ok([p.cost, p.central, p.state, p.subsidy, p.pay, p.units, p.saving].every((v) => v === 0), `${s.slug}: kw=${String(kw)} should give zeros`);
    const r = S.rooftopPlan({ state: s, bill: kw, units: kw, tariff: kw });
    ok([r.kw, r.net, r.subsidy, r.annualSavings, r.savings25].every(isNum) && r.net >= 0, `${s.slug}: rooftopPlan with bill=${String(kw)}`);
  }
  for (const bill of [500, 1500, 3000, 8000, 20000]) {
    const r = S.rooftopPlan({ state: s, bill });
    ok(r.kw >= 1 && r.net >= 0 && r.subsidy <= r.cost.mid && r.annualSavings > 0 && r.payback !== null && r.payback < 20, `${s.slug}: rooftopPlan bill ${bill} → ${r.kw} kW, net ${r.net}, payback ${r.payback}`);
    eq(r.net, S.subsidyPlan({ kw: r.kw, state: s, basis: 'market' }).pay, `${s.slug}: solar calculator and subsidy engine agree at bill ${bill}`);
  }
}
console.log(`  ${fail ? '✗' : '✓'} ${combos} state/class/size/basis/existing combinations checked`);
console.log('  best-value size per state for general consumers (central + state, at benchmark cost):');
for (const s of STATES) {
  const b = S.subsidyPlan({ kw: 3, state: s }).best;
  if (b.state > 0) console.log(`    ${s.slug}: ${b.kw} kW → ${inr(b.central)} + ${inr(b.state)} = ${inr(b.subsidy)} [${s.extra.status}]`);
}
console.log('  consumer-class rules: ' + STATES.filter((s) => S.stateClasses(s).length > 1).map((s) => `${s.slug} [${S.stateClasses(s).slice(1)}]`).join(', '));

// ── 3. other calculators ────────────────────────────────────────────────────
section('EMI / ROI / price / cable / string / battery / inverter / roof / OPEX-CAPEX');
// EMI: P·r·(1+r)^n / ((1+r)^n − 1);  ₹1,00,000 at 12 % for 1 year = ₹8,884.88
eq(S.emi(100000, 12, 1).emi, 8885, 'EMI 1 lakh @12% 1 yr');
eq(S.emi(120000, 0, 1).emi, 10000, 'EMI at 0%');
eq(S.emi(200000, 6, 10).emi, 2220, 'EMI 2 lakh @6% 10 yr'); // 2220.41
near(S.emi(200000, 6, 10).interest, 66449, 1, 'EMI interest = total − principal'); // 2220.41 × 120 − 2,00,000
eq(S.emi(0, 7, 5).emi, 0, 'EMI of nothing');
ok(Number.isFinite(S.emi('', '', '').emi), 'EMI with empty input');
// ROI: 1 kW, 4 units/day, ₹5, no escalation / degradation / O&M → 1,460 units, ₹7,300 a year
const r1 = S.roiModel({ kw: 1, netCost: 36500, tariff: 5, gen: 4, escalation: 0, degradation: 0, om: 0 });
eq(r1.rows[0].units, 1460, 'ROI first-year units');
eq(r1.rows[0].saving, 7300, 'ROI first-year saving');
eq(r1.payback, 5, 'ROI payback 36,500 / 7,300');
eq(r1.total, 182500, 'ROI 25-year savings');
eq(r1.roi, 400, 'ROI simple return %');
near(r1.irr, 19.8, 0.2, 'IRR of 25 × 7,300 on 36,500'); // annuity factor 5 over 25 years ≈ 19.8 %
const r2 = S.roiModel({ kw: 3, netCost: 102000, grossCost: 180000, tariff: 7, gen: 4.5 });
ok(r2.rows[0].saving === Math.round(4928 * 7 - 1800), `O&M is charged on gross cost (got ${r2.rows[0].saving})`);
ok(r2.rows[24].units < r2.rows[0].units && r2.rows[24].tariff > 7, 'degradation and escalation applied');
eq(S.roiModel({ kw: 0, netCost: 0, tariff: 0 }).payback, 0, 'ROI with zeros does not blow up');
eq(S.irr([-100, 110]), 10, 'IRR simple');
eq(S.irr([-100, 50]), null, 'IRR undefined when never recovered');
eq(S.yearlyGeneration(3, 4.5), 4928, 'yearly generation 3 kW × 4.5 × 365');
eq(S.sizeFromUnits(400, 4.2), 3.5, 'size for 400 units/month'); // 3.17 → 3.5
eq(S.sizeFromUnits(0), 1, 'minimum size 1 kW');
// prices: per-kW falls with size, range brackets the mid price
let prev = Infinity;
for (const k of [1, 2, 3, 5, 10, 25, 50, 100, 500]) {
  const p = S.pricePerKw(k);
  ok(p <= prev && p >= 30000 && p <= 80000, `price per kW at ${k} kW = ${p}`);
  prev = p;
  const c = S.systemCost(k);
  ok(c.low < c.mid && c.mid < c.high, `price range at ${k} kW`);
}
eq(S.systemCost(3).mid, 180000, '3 kW on-grid market estimate');
ok(S.pricePerKw(3, 'hybrid') > S.pricePerKw(3, 'offgrid') && S.pricePerKw(3, 'offgrid') > S.pricePerKw(3), 'hybrid > off-grid > on-grid');
ok(S.pricePerKw(50, 'ongrid', 'commercial') < S.pricePerKw(50), 'commercial (non-DCR) is cheaper');
eq(Object.values(S.costBreakup(180000)).reduce((a, b) => a + b, 0), 180000, 'cost break-up adds up');
// cable: A = 2·L·I·ρ / Vdrop → 2 × 25 × 13 × 0.0183 / 6 = 1.98 mm² → 2.5 mm² (25 A ≥ 13 × 1.25)
const c1 = S.cableSize({ current: 13, voltage: 400, length: 25, drop: 1.5, material: 'copper' });
eq(c1.area, 1.98, 'cable area by voltage drop');
eq(c1.size, 2.5, 'cable size');
eq(c1.dropV, 4.76, 'actual drop V'); // 2 × 25 × 13 × 0.0183 / 2.5
near(c1.dropPct, 1.19, 0.011, 'actual drop %');
eq(c1.loss, 62, 'cable loss W');
eq(S.cableSize({ current: 40, voltage: 230, length: 5, drop: 3 }).size, 10, 'short run is sized by current rating (61 A ≥ 50 A)');
ok(S.cableSize({ current: 13, voltage: 400, length: 25, drop: 1.5, material: 'aluminium' }).size > c1.size, 'aluminium needs a bigger cable');
const c3 = S.cableSize({ current: 30, voltage: 415, length: 50, drop: 2, phase: 3 });
eq(c3.area, 5.73, 'three-phase area √3·L·I·ρ / Vdrop'); // 1.732 × 50 × 30 × 0.0183 / 8.3
eq(c3.size, 6, 'three-phase size');
eq(S.cableSize({ current: 900, voltage: 48, length: 100, drop: 1 }).ok, false, 'impossible cable is flagged');
ok(Number.isFinite(S.cableSize({ current: '', voltage: '', length: '', drop: '' }).size), 'cable with empty input');
// string: Voc 49.8, −0.26 %/°C, 5 °C → 49.8 × 1.052 = 52.4 V ; 1000 V / 52.4 = 19 ; hot Vmp 41.9 × (1 − 0.0026 × 1.15 × 45) = 36.3 → 200/36.3 → 6
const s1 = S.stringSizing({ voc: 49.8, vmp: 41.9, coeff: -0.26, tmin: 5, tmax: 45, vmax: 1000, mpptMin: 200, mpptMax: 850 });
eq(s1.vocCold, 52.4, 'Voc cold');
eq(s1.vmpHot, 36.3, 'Vmp hot');
eq(s1.max, 19, 'max panels per string');
eq(s1.min, 6, 'min panels per string');
eq(s1.ok, true, 'string ok');
ok(s1.max * s1.vocCold <= 1000, 'string never exceeds inverter max voltage');
const s0 = S.stringSizing({ voc: '', vmp: '', coeff: '' });
ok(s0.ok === false && s0.max === 0 && s0.min === 0, 'string sizing with empty input');
eq(S.stringSizing({ voc: 49.8, vmp: 41.9, vmax: 100, mpptMin: 200, mpptMax: 850 }).ok, false, 'no safe string when the inverter voltage is too low');
// battery: 800 W × 4 h = 3.2 kWh ; lithium ÷ (0.9 DoD × 0.9 eff) = 3.95 kWh → 82 Ah at 48 V → 1 × 100 Ah
const b1 = S.batterySizing({ load: 800, hours: 4, type: 'lithium', volt: 48 });
near(b1.wh, 3950.6, 0.1, 'battery Wh lithium');
eq(Math.ceil(b1.ah), 83, 'battery Ah at 48 V');
eq(`${b1.count}x${b1.unitV}V${b1.sizeAh}Ah`, '1x48V100Ah', 'lithium bank');
const b2 = S.batterySizing({ load: 800, hours: 4, type: 'lead', volt: 48 }); // 3200 / (0.5 × 0.8) = 8 kWh → 167 Ah → 4 × 12 V 200 Ah in series
near(b2.wh, 8000, 0.1, 'battery Wh lead-acid');
eq(`${b2.count}x${b2.unitV}V${b2.sizeAh}Ah/${b2.series}S${b2.parallel}P`, '4x12V200Ah/4S1P', 'lead-acid bank');
eq(S.batterySizing({ load: 5000, hours: 2, type: 'lithium', volt: 12 }).highAmps, true, '5 kW on 12 V is flagged');
ok(Number.isFinite(S.batterySizing({ load: '', hours: '' }).wh), 'battery with empty input');
// inverter: 3000 W / 0.8 pf × 1.25 = 4.7 kVA → 5 kVA ; 5 kWp on-grid / 1.1 = 4.55 → 5 kW
const i1 = S.inverterSizing({ load: 3000, pf: 0.8, margin: 25, array: 5, type: 'offgrid' });
eq(i1.kva, 4.7, 'inverter kVA from load');
eq(i1.rec, 5, 'off-grid inverter');
eq(S.inverterSizing({ load: 3000, array: 5, type: 'ongrid' }).rec, 5, 'on-grid inverter for 5 kWp');
eq(S.inverterSizing({ load: 3000, array: 2.18, type: 'ongrid' }).rec, 2, 'on-grid inverter for 2.18 kWp');
eq(S.inverterSizing({ load: 1000, array: 8, type: 'hybrid' }).rec, 7.5, 'hybrid inverter must also carry the array');
eq(S.inverterSizing({ load: 3000, pf: 0.8, margin: 25, surge: true, array: 5, type: 'offgrid' }).rec, 7.5, 'motor surge ×1.5');
ok(Number.isFinite(S.inverterSizing({ load: '', pf: '', margin: '', array: '' }).rec), 'inverter with empty input');
// roof: 40 × 30 ft, 70 % usable = 840 sq ft ; 550 W panel 27.8 sq ft × 1.8 = 50 sq ft → 16 panels = 8.8 kW
const f1 = S.roofCapacity({ len: 40, wid: 30, usable: 70, panelW: 550 });
eq(f1.count, 16, 'panels on a 40 × 30 ft flat roof');
eq(f1.kw, 8.8, 'roof capacity kW');
near(f1.use / f1.kw, S.SQFT_PER_KW, 8, 'roof calculator agrees with the 90 sq ft per kW used by the solar calculator');
ok(S.roofCapacity({ len: 40, wid: 30, usable: 70, panelW: 550, mount: 'flush' }).count > f1.count, 'flush mounting fits more panels');
eq(S.roofCapacity({ len: '', wid: '', usable: '' }).kw, 0, 'roof with empty input');
// OPEX vs CAPEX: 100 kW, ₹35 lakh, grid ₹9, PPA ₹5, tax 25 %
const oc = S.opexCapex({ kw: 100, cost: 3500000, grid: 9, ppa: 5, tax: 25, esc: 3, gen: 4.5, discount: 9 });
eq(oc.base, 164250, 'OPEX/CAPEX yearly units');
eq(oc.dep1, 350000, 'year-1 depreciation tax saving = cost × 40 % × 25 %');
ok(oc.payback > 2 && oc.payback < 5, `CAPEX payback ${oc.payback} years`);
ok(oc.capexNet > oc.opexSave && oc.opexSave > 0, 'undiscounted: owning saves more than PPA');
ok(oc.npvCapex < oc.capexNet && oc.npvOpex < oc.opexSave, 'discounting lowers both');
eq(S.opexCapex({ kw: 100, cost: 3500000, grid: 9, ppa: 9.5, tax: 25, ppaEsc: 3 }).opexSave, 0, 'PPA dearer than grid saves nothing');
eq(S.opexCapex({ kw: 100, cost: 3500000, grid: 6, ppa: 3, tax: 25, discount: 40 }).capexBetter, false, 'very high cost of capital favours OPEX');
ok(Number.isFinite(S.opexCapex({ kw: '', cost: '', grid: '', ppa: '', tax: '' }).capexNet), 'OPEX/CAPEX with empty input');

// ── 3b. default cost basis and bill savings ─────────────────────────────────
section('Default cost basis (benchmark only for benchmark-model rules) and savings never above the bill');
for (const s of STATES) {
  for (const klass of S.stateClasses(s)) {
    const p = S.subsidyPlan({ kw: 2, state: s, klass });
    const want = S.stateRule(s, klass).kind === 'benchmark' ? 'benchmark' : 'market';
    eq(p.basis, want, `${s.slug}/${klass}: default cost basis`);
    eq(p.benchmark, S.benchmarkCost(2, s.special ? S.BENCHMARK_SPECIAL : S.BENCHMARK), `${s.slug}/${klass}: benchmark still reported up to 3 kW`);
    // outside the benchmark model the subsidy calculator must agree with the tools that always use the market price
    if (want === 'market') eq(p.pay, S.subsidyPlan({ kw: 2, state: s, klass, basis: 'market' }).pay, `${s.slug}/${klass}: same "you pay" as the market-priced tools`);
  }
  for (const bill of [50, 100, 500, 1500, 3000, 8000]) {
    const r = S.rooftopPlan({ state: s, bill });
    ok(r.monthlySavings <= bill, `${s.slug}: monthly saving ${r.monthlySavings} must not exceed the bill ${bill}`);
    ok(r.annualSavings <= bill * 12 + 1 && r.exportCredit >= 0, `${s.slug}: yearly saving ${r.annualSavings} / export credit ${r.exportCredit} at bill ${bill}`);
  }
  const u = S.rooftopPlan({ state: s, units: 120, by: 'units' });
  ok(u.annualSavings <= Math.round(120 * 12 * s.tariff), `${s.slug}: saving by units never exceeds the units bought`);
}
{
  const small = S.rooftopPlan({ state: guj, bill: 500 });
  eq(small.monthlySavings, 500, 'Gujarat ₹500 bill with a 1 kW plant: the whole bill is saved, not more');
  eq(small.exportCredit, Math.round((small.annualUnits - (500 / guj.tariff) * 12) * 3), 'surplus units are reported separately at the export rate');
  eq(S.subsidyPlan({ kw: 2, state: st('andhra-pradesh'), klass: 'scst' }).basis, 'benchmark', 'Andhra Pradesh SC/ST (benchmark model) is costed at the benchmark');
  eq(S.subsidyPlan({ kw: 2, state: st('andhra-pradesh') }).basis, 'market', 'Andhra Pradesh general (no top-up) is costed at the market price');
  eq(S.subsidyPlan({ kw: 2.18, state: guj, type: 'hybrid' }).basis, 'market', 'a battery system is never costed at the benchmark');
  eq(S.subsidyPlan({ kw: 50, state: guj, category: 'society' }).basis, 'market', 'a housing society is never costed at the benchmark');
  console.log(`  ${fail ? '✗' : '✓'} cost basis per state/class, savings ≤ bill for ${STATES.length} states × 6 bills`);
}

// ── 4. edge cases the calculators hit while a visitor is typing, and rules outside the state list ─────────
section('Edge cases (vendor quotation in the size table, missing state, off-table sizes, empty fields)');
{
  // a vendor quotation changes "you pay" – the row of the chosen size in the comparison table must say the same
  const q = S.subsidyPlan({ kw: 2.18, state: guj, quote: 130000 });
  eq(q.pay, 32710, 'Gujarat 2.18 kWp with a ₹1,30,000 quotation: you pay');
  const qc = q.compare.find((r) => r.cur);
  eq(qc.pay, q.pay, 'size table, current row: pay equals the headline when a quotation is given');
  eq(qc.subsidy, q.subsidy, 'size table, current row: subsidy equals the headline when a quotation is given');
  eq(qc.basis, 'quote', 'size table, current row is priced at the quotation');
  ok(q.compare.filter((r) => !r.cur).every((r) => r.basis !== 'quote'), 'other rows of the size table keep the standard price');
  const dq = S.subsidyPlan({ kw: 3, state: st('delhi'), quote: 180000 });
  eq(dq.state, 78000, 'Delhi 3 kW at a ₹1,80,000 quotation gets the full ₹78,000 state subsidy');
  eq(dq.compare.find((r) => r.cur).pay, 24000, 'Delhi 3 kW with quotation: table row pays ₹24,000 like the headline');

  // no state chosen / unknown state: central subsidy only, all-India averages
  eq(S.stateExtra(null), null, 'stateExtra(null)');
  eq(S.stateRule(null).kind, null, 'no state → no top-up rule');
  const none = S.stateDetail(2, null);
  eq(none.amount, 0, 'no state → top-up 0');
  eq(none.reason, 'none', 'no state → reason "none"');
  const anon = S.subsidyPlan({ kw: 3 });
  eq(anon.central, 78000, 'plan without a state: central ₹78,000');
  eq(anon.state, 0, 'plan without a state: no top-up');
  eq(anon.tariff, 7, 'plan without a state: ₹7/unit average tariff');
  eq(anon.units, 4599, 'plan without a state: 3 kW × 4.2 × 365');
  eq(anon.status, 'none', 'plan without a state: status "none"');
  const rp = S.rooftopPlan({ units: 300, by: 'units' });
  eq(rp.kw, 2.5, 'rooftop plan without a state: 300 units ÷ (4.2 × 30) → 2.5 kW');
  eq(rp.tariff, 7, 'rooftop plan without a state: ₹7/unit');
  eq(rp.central, 69000, 'rooftop plan 2.5 kW: central 60,000 + 9,000');
  eq(S.fromLite(null), null, 'fromLite(null)');
  eq(S.fromLite({ s: 'x', n: 'X', t: 6, g: 4, x: { p: 1000, st: 'z' } }).extra.status, 'z', 'unknown status code is kept as it is');

  // direct engine calls (the islands always pass the central amount; other callers may not)
  eq(S.stateSubsidy(2.18, guj), 34050, 'stateSubsidy() works out the central amount itself');
  eq(S.stateSubsidy(2.18, guj, 'residential', { klass: 'scst' }), 39455, 'stateSubsidy() SC/ST');
  // "Edit rates": household share 100 % → the state has nothing left to pay
  const cov = S.stateDetail(2, guj, 'residential', { rates: { share: 100 } });
  eq(cov.amount, 0, 'household share 100 %: state pays 0');
  eq(cov.reason, 'covered', 'household share 100 %: reason "covered"');
  // an edited General share must not change a class that has its own share
  eq(S.stateDetail(2, guj, 'residential', { klass: 'scst', rates: { share: 50 } }).amount, 35000, 'edited General share leaves SC/ST (5 %) alone');
  eq(S.stateDetail(2, guj, 'residential', { klass: 'bpl', rates: { share: 50, shareScst: 50 } }).share, 10, 'a class without its own edit field keeps the state default share');
  // slab scheme that starts only at the 3rd kW: a 1 kW system gets nothing, 3 kW gets the slab
  const slab = { slug: 'x', name: 'X', tariff: 6, gen: 4, extra: { rates: [0, 0, 5000], status: 'reported' } };
  eq(S.stateDetail(1, slab).amount, 0, 'slab rule starting at the 3rd kW: 1 kW gets 0');
  eq(S.stateDetail(1, slab).reason, 'none', 'slab rule starting at the 3rd kW: reason "none"');
  eq(S.stateDetail(3, slab).amount, 5000, 'slab rule starting at the 3rd kW: 3 kW gets ₹5,000');
  const upx = S.stateDetail(2, st('uttar-pradesh'), 'residential', { existingKw: 2 });
  eq(upx.amount, 0, 'UP: 2 kW already subsidised + 2 kW new → cap of ₹30,000 is used up');
  eq(upx.reason, 'existing', 'UP: reason "existing"');
  eq(S.centralSubsidy(2, { existingKw: 2 }), 18000, '2 kW existing + 2 kW new → only the 3rd kW (₹18,000) is left');
  eq(S.centralSubsidy(2, { existingKw: 3 }), 0, '3 kW existing → no central subsidy left');

  // prices outside the table and unknown options
  eq(S.pricePerKw(1000), S.pricePerKw(500), 'price per kW is flat beyond the 500 kW end of the table');
  eq(S.pricePerKw(0), S.pricePerKw(1), 'price per kW for an empty size = 1 kW price');
  eq(S.pricePerKw(3, 'something-else'), S.pricePerKw(3, 'ongrid'), 'unknown system type is priced like on-grid');
  eq(S.systemCost(3).mid, 180000, '3 kW on-grid market price ₹1,80,000');
  const hb = S.costBreakup(100000, 'hybrid');
  eq(hb.battery, 30000, 'hybrid break-up: battery 30 %');
  eq(Object.values(hb).reduce((a, b) => a + b, 0), 100000, 'hybrid break-up adds up to the total');
  eq(S.costBreakup(100000).battery, 0, 'on-grid break-up has no battery');
  eq(S.yearlyGeneration(1, 0), 1533, 'generation with an empty sunshine figure falls back to 4.2 units/kW/day');
  eq(S.sizeFromUnits(300, 0), 2.5, 'size from units with an empty sunshine figure');
  eq(S.sizeFromUnits(0), 1, 'smallest recommended system is 1 kW');

  // returns that cannot be computed must come back as null (shown as "–"), never as a wrong number
  eq(S.irr([-100, 110]), 10, 'IRR of −100 → +110 after a year = 10 %');
  eq(S.irr([-1, 1000000]), null, 'IRR above 1000 % a year is not reported');
  eq(S.irr([-100, 10, 10]), null, 'IRR of a loss-making project is not reported');
  eq(S.irr([100, 10]), null, 'IRR without an investment is not reported');
  const never = S.roiModel({ kw: 1, netCost: 1e9, tariff: 5 });
  eq(never.payback, null, 'a ₹100 crore 1 kW plant never pays back');
  eq(never.irr, null, 'a plant that never pays back has no IRR');
  const com = S.rooftopPlan({ state: guj, bill: 50000, category: 'commercial' });
  eq(com.subsidy, 0, 'commercial plan gets no subsidy');
  eq(com.depreciation, Math.round(com.cost.mid * 0.4 * 0.25), 'commercial plan: year-1 depreciation tax saving');
  eq(S.rooftopPlan({ state: guj, bill: 3000 }).depreciation, 0, 'home plan has no depreciation benefit');

  // engineering calculators with empty / unusual fields
  const bv = S.batterySizing({ load: 800, hours: 4, volt: '', gen: 0 });
  near(bv.ah, 3200 / (48 * 0.81), 0.01, 'battery with an empty voltage uses 48 V');
  eq(bv.solarKw, 0.8, 'battery recharge size with an empty sunshine figure');
  eq(S.inverterSizing({ array: 150, type: 'ongrid' }).rec, 137, 'on-grid inverter above the standard list: next whole kW');
  eq(S.inverterSizing({ array: 3, type: 'ongrid' }).unit, 'kW', 'on-grid inverters are rated in kW');
  eq(S.inverterSizing({ load: 1000, type: 'offgrid' }).unit, 'kVA', 'off-grid inverters are rated in kVA');
  eq(S.roofCapacity({ len: 40, wid: 30, usable: 70, panelW: 500 }).count, 16, 'unknown panel wattage uses the 27.8 sq ft module');
  const s0 = S.stringSizing({ voc: 49.8, vmp: 41.9, coeff: -0.26, tmin: '', tmax: '' });
  near(s0.vocCold, 49.8 * (1 + 0.0026 * 25), 0.06, 'string sizing with an empty lowest temperature uses 0 °C');
  ok(s0.ok && s0.max >= s0.min, 'string sizing with empty temperatures still gives a range');
  eq(S.stringSizing({ voc: 0, vmp: 0 }).ok, false, 'string sizing without panel voltages is not OK');
  console.log(`  ${fail ? '✗' : '✓'} quotation row, missing state, off-table sizes and empty fields`);
}

console.log(`\n${fail ? 'FAIL' : 'PASS'} – ${pass} assertions passed, ${fail} failed`);
if (fail) console.log(fails.slice(0, 40).map((f) => ' - ' + f).join('\n'));
process.exit(fail ? 1 : 0);
