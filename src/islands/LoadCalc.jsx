import { useState } from 'react';
import { StateSelect, Stat } from '../ui/fields.jsx';
import { round, sizeFromUnits, subsidyPlan } from '../lib/solar.js';
import { num, inr, rs, fmt, dec } from '../lib/format.js';
import { findState, toFull, nz, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { locStates } from './_shared.jsx';

// [watts, quantity, hours per day] – names come from t.appl (same order) so they are translated
const DEFAULTS = [
  [9, 8, 6], // LED bulb
  [30, 4, 10], // BLDC ceiling fan
  [150, 1, 10], // refrigerator (compressor runs ~10 h a day)
  [80, 1, 5], // LED TV
  [1400, 1, 6], // 1.5 ton inverter AC
  [500, 1, 1], // washing machine
  [750, 1, 1], // 1 HP water pump
  [60, 2, 8], // laptop / Wi-Fi
];

export default function LoadCalc({ t, states: allStates, defState = 'gujarat' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const st = findState(states, slug);
  const [rows, setRows] = useState(DEFAULTS.map(([w, q, h], i) => ({ id: i, n: (t.appl || [])[i] || '', w, q, h })));
  // keep what the user typed ('' while editing); numbers are read with nz() when calculating
  const upd = (id, k, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
  const wh = (r) => (nz(r.w) * nz(r.q) * Math.min(24, nz(r.h))) / 1000;
  const daily = rows.reduce((s, r) => s + wh(r), 0);
  const peak = rows.reduce((s, r) => s + nz(r.w) * nz(r.q), 0);
  const kw = sizeFromUnits(daily * 30, st.g);
  const inv = Math.ceil(((peak * 1.25) / 0.8 / 1000) * 2) / 2;
  const bill = Math.round(daily * 30 * st.t);
  const p = subsidyPlan({ kw, state: toFull(st), basis: 'market' });
  const sum = fmt(t.sumLoad, { daily: round(daily, 1), monthly: num(daily * 30), kw: dec(kw), pay: inr(p.pay), sub: inr(p.subsidy) });

  const pdf = () => ({
    title: t.rptLoad,
    subtitle: `${st.n} · ${fmt(t.genLine, { g: st.g })}`,
    sections: [
      { title: t.appliance, table: { head: [t.appliance, t.watts, t.qty, t.hours, 'kWh'], rows: rows.map((r) => [r.n, nz(r.w), nz(r.q), nz(r.h), round(wh(r), 2)]) } },
      { title: t.results, rows: [[t.dailyEnergy, round(daily, 2) + ' kWh'], [t.monthlyUnits, num(daily * 30)], [t.estBill, inr(bill)], [t.peakLoad, num(peak) + ' W'], [t.recommendedSize, dec(kw) + ' kW', { tot: 1 }], [t.inverterSize, inv + ' kVA', { sub: t.offGrid + ' / ' + t.hybrid }], [t.youPay, inr(p.pay), { sub: '− ' + inr(p.subsidy) + ' ' + t.totalSubsidy }]] },
    ],
    note: sum,
    filename: 'solar-load-calculation.pdf',
  });

  return (
    <div className="calc calc-wide">
      <div className="calc-in">
        <StateSelect t={t} states={states} value={slug} onChange={setSlug} />
        <div className="tscroll">
          <table className="tbl load">
            <thead><tr><th>{t.appliance}</th><th>{t.watts}</th><th>{t.qty}</th><th>{t.hours}</th><th aria-label={t.remove} /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td><input aria-label={t.appliance} value={r.n} onChange={(e) => upd(r.id, 'n', e.target.value)} /></td>
                  <td><input aria-label={t.watts} type="number" inputMode="decimal" min="0" value={r.w} onChange={(e) => upd(r.id, 'w', e.target.value)} /></td>
                  <td><input aria-label={t.qty} type="number" inputMode="numeric" min="0" value={r.q} onChange={(e) => upd(r.id, 'q', e.target.value)} /></td>
                  <td><input aria-label={t.hours} type="number" inputMode="decimal" min="0" max="24" step="0.5" value={r.h} onChange={(e) => upd(r.id, 'h', e.target.value)} /></td>
                  <td><button type="button" className="x" aria-label={t.remove} onClick={() => setRows((x) => x.filter((y) => y.id !== r.id))}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="btn btn-ghost" onClick={() => setRows((r) => [...r, { id: Date.now(), n: '', w: 100, q: 1, h: 2 }])}>+ {t.addAppliance}</button>
        <small className="hint">{t.loadTip}</small>
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{sum}</Sum>
        <div className="hero-stat">
          <span>{t.recommendedSize}</span>
          <strong>{dec(kw)} <small>kW</small></strong>
          <em>{t.inverterSize}: {inv} kVA</em>
        </div>
        <div className="stats">
          <Stat label={t.dailyEnergy} value={round(daily, 2) + ' kWh'} accent />
          <Stat label={t.monthlyUnits} value={num(daily * 30)} />
          <Stat label={t.estBill} value={inr(bill)} sub={fmt(t.atRate, { rate: rs(st.t) })} />
          <Stat label={t.peakLoad} value={num(peak) + ' W'} />
          <Stat label={t.youPay} value={inr(p.pay)} big sub={'− ' + inr(p.subsidy) + ' ' + t.totalSubsidy} />
        </div>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="load-calculator" />
      </div>
    </div>
  );
}
