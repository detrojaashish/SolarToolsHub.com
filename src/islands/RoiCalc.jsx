import { useState } from 'react';
import { NumberField, StateSelect, Stat } from '../ui/fields.jsx';
import { roiModel, subsidyPlan, bestSize, stateClasses, yearlyGeneration } from '../lib/solar.js';
import { inr, rs, inrShort, num, fmt, dec } from '../lib/format.js';
import { findState, toFull, nz, lim, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { ClassSelect } from './_subsidy.jsx';
import { locStates } from './_shared.jsx';

export default function RoiCalc({ t, states: allStates, defState = 'gujarat' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const st = findState(states, slug);
  const full = toFull(st);
  const [kwIn, setKw] = useState(null); // null → the state's best-value size
  const [costIn, setCost] = useState(null); // null → market price − subsidy from the subsidy engine
  const [klassIn, setKlass] = useState('general');
  const [tariff, setTariff] = useState(null);
  const [esc, setEsc] = useState(3);
  const [deg, setDeg] = useState(0.5);
  const [om, setOm] = useState(1);
  const classes = stateClasses(full);
  const klass = classes.includes(klassIn) ? klassIn : 'general';
  const kw = kwIn ?? bestSize(full, klass);
  const k = lim(kw, 0, 1000);
  const p = subsidyPlan({ kw: k, state: full, klass, basis: 'market' });
  const cost = costIn ?? p.pay;
  const net = nz(cost);
  const tf = tariff ?? st.t;
  const rate = nz(tf) || st.t; // empty field while typing → the state's tariff
  // maintenance is charged on the full (pre-subsidy) price of the plant
  const r = roiModel({ kw: k, netCost: net, grossCost: net + p.subsidy, tariff: rate, gen: st.g, escalation: nz(esc), degradation: nz(deg), om: nz(om) });
  const maxCum = Math.max(...r.rows.map((x) => Math.abs(x.cum)), 1);
  const yrs = r.payback ?? '–';
  const irr = r.irr == null ? '–' : r.irr + '%';
  const sum = fmt(r.payback == null ? t.sumRoi0 : t.sumRoi, { cost: inr(net), yrs, total: inrShort(r.total), irr: r.irr ?? '–' });

  const pdf = () => ({
    title: t.rptRoi,
    subtitle: `${dec(k)} kW · ${st.n} · ${t.netCost} ${inr(net)} · ${fmt(t.atRate, { rate: rs(rate) })}`,
    sections: [
      { title: t.results, rows: [[t.payback, yrs + ' ' + t.years], [t.savings25, inr(r.total)], [t.irrLbl, irr], [t.irr, r.roi + '%'], [t.annualGeneration, num(yearlyGeneration(k, st.g)) + ' ' + t.units], [t.firstYear, inr(r.rows[0].saving)]] },
      { title: t.pdfInputs, rows: [[t.systemCost, inr(net + p.subsidy), { sub: t.basisMarket }], [t.totalSubsidy, '− ' + inr(p.subsidy)], [t.netCost, inr(net)], [t.tariffEscalation, nz(esc) + '%'], [t.degradation, nz(deg) + '%'], [t.om, nz(om) + '%']] },
      { title: t.yearByYear, table: { head: [t.year, t.units, '₹/' + t.unit1, t.annualSavings, t.cumulative], rows: r.rows.map((x) => [x.year, num(x.units), x.tariff, inr(x.saving), inr(x.cum)]) } },
    ],
    note: sum,
    filename: `solar-roi-${dec(k)}kw.pdf`,
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <StateSelect t={t} states={states} value={slug} onChange={(v) => { setSlug(v); setTariff(null); setKw(null); setCost(null); }} />
        <ClassSelect t={t} classes={classes} value={klass} onChange={(v) => { setKlass(v); setCost(null); }} />
        <NumberField label={t.systemSize} value={kw} onChange={(v) => { setKw(v); setCost(null); }} suffix="kW" step={0.01} min={0.5} hint={t.sizeHint} />
        <NumberField label={t.netCost} value={cost} onChange={setCost} prefix="₹" step={1000} min={0} hint={fmt(t.netCostHint, { cost: inr(p.cost), sub: inr(p.subsidy) })} />
        <NumberField label={t.tariff} value={tf} onChange={setTariff} prefix="₹" step={0.1} min={0} max={30} hint={t.tariffHint} />
        <div className="grid3">
          <NumberField label={t.tariffEscalation} value={esc} onChange={setEsc} suffix="%" step={0.5} min={0} max={20} />
          <NumberField label={t.degradation} value={deg} onChange={setDeg} suffix="%" step={0.1} min={0} max={5} />
          <NumberField label={t.om} value={om} onChange={setOm} suffix="%" step={0.1} min={0} max={10} />
        </div>
        <small className="hint">{t.roiHint}</small>
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{sum}</Sum>
        <div className="hero-stat">
          <span>{t.payback}</span>
          <strong>{yrs} <small>{t.years}</small></strong>
          <em>{t.savings25}: {inrShort(r.total)}</em>
        </div>
        <div className="stats">
          <Stat label={t.savings25} value={inrShort(r.total)} accent big />
          <Stat label={t.irrLbl} value={irr} big />
          <Stat label={t.irr} value={r.roi + '%'} />
          <Stat label={t.firstYear} value={inr(r.rows[0].saving)} />
        </div>
        <div className="chart" role="img" aria-label={t.cumulative}>
          {r.rows.map((x) => (
            <span key={x.year} className={x.cum >= 0 ? 'pos' : 'neg'} style={{ height: Math.max(3, (Math.abs(x.cum) / maxCum) * 100) + '%' }} title={`${t.year} ${x.year}: ${inr(x.cum)}`} />
          ))}
        </div>
        <details className="tbl-wrap">
          <summary>{t.yearByYear}</summary>
          <div className="tscroll">
            <table className="tbl">
              <thead><tr><th>{t.year}</th><th>{t.units}</th><th>₹/{t.unit1}</th><th>{t.annualSavings}</th><th>{t.cumulative}</th></tr></thead>
              <tbody>{r.rows.map((x) => <tr key={x.year}><td>{x.year}</td><td>{num(x.units)}</td><td>{x.tariff}</td><td>{inr(x.saving)}</td><td className={x.cum >= 0 ? 'pos' : 'neg'}>{inr(x.cum)}</td></tr>)}</tbody>
            </table>
          </div>
        </details>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="roi-calculator" />
      </div>
    </div>
  );
}
