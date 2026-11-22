import { useState } from 'react';
import { NumberField, StateSelect, Stat, Bar } from '../ui/fields.jsx';
import { emi, subsidyPlan, bestSize } from '../lib/solar.js';
import { inr, fmt, dec } from '../lib/format.js';
import { findState, toFull, nz, lim, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { locStates } from './_shared.jsx';

// `states` is optional: with it the state top-up, tariff and sunshine of the chosen state are used,
// without it the central subsidy and all-India averages (₹7/unit, 4.2 units/kW/day).
export default function EmiCalc({ t, states: allStates, defState = 'gujarat' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const st = states && states.length ? findState(states, slug) : null;
  const full = st ? toFull(st) : null;
  const [kwIn, setKw] = useState(null);
  const [costIn, setCost] = useState(null); // null → typical market price of this size
  const [downIn, setDown] = useState(null); // null → 10 % margin money
  const [subIn, setSub] = useState(null); // null → subsidy from the subsidy engine
  const [saveIn, setSave] = useState(null); // null → expected monthly saving of this size
  const [rateIn, setRate] = useState(null); // null → PM Surya Ghar scheme rate for the loan size
  const [years, setYears] = useState(5);
  const kw = kwIn ?? (full ? bestSize(full) : 3);
  const k = lim(kw, 0, 1000);
  const p = subsidyPlan({ kw: k, state: full, basis: 'market' });
  const cost = costIn ?? p.cost;
  const down = downIn ?? Math.round((nz(cost) * 0.1) / 1000) * 1000;
  const sub = subIn ?? p.subsidy;
  const save = saveIn ?? Math.round(p.saving / 12 / 10) * 10;
  const P = Math.max(0, nz(cost) - nz(down));
  // repo + 0.5 % (6 %) for collateral-free loans up to ₹2 lakh; bigger loans are at normal bank rates
  const rate = rateIn ?? (P > 200000 ? 8.15 : 6);
  const yr = lim(years, 1, 20, 1);
  const e = emi(P, nz(rate), yr);
  // the subsidy reaches the bank account after commissioning – prepaying the loan with it lowers the EMI
  const e2 = emi(Math.max(0, P - nz(sub)), nz(rate), yr);
  const pct = e.emi ? Math.round((nz(save) / e.emi) * 100) : 0;
  const pct2 = e2.emi ? Math.round((nz(save) / e2.emi) * 100) : 100;

  const pdf = () => ({
    title: t.rptEmi,
    subtitle: `${dec(k)} kW · ${t.systemCost} ${inr(nz(cost))} · ${nz(rate)}% · ${yr} ${t.years}`,
    sections: [
      { title: t.loanAmount, rows: [[t.systemCost, inr(nz(cost))], [t.downPayment, '− ' + inr(nz(down))], [t.loanAmount, inr(P), { tot: 1 }], [t.interestRate, nz(rate) + '%'], [t.tenure, yr]] },
      { title: t.emi, rows: [[t.emi, inr(e.emi), { tot: 1 }], [t.totalInterest, inr(e.interest)], [t.totalPayment, inr(e.total)], [t.subsidyExp, inr(nz(sub))], [t.emiAfter, inr(e2.emi), { sub: t.subsidyExpHint }]] },
      { title: t.emiVsSavings, rows: [[t.monthlySavings, inr(nz(save)), { sub: `${t.emi}: ${fmt(t.emiCovered, { pct })} ${t.emiAfter}: ${fmt(t.emiCovered, { pct: pct2 })}` }]] },
      { title: t.pdfRatesH, list: [t.rateHint, t.downHint] },
    ],
    filename: 'solar-loan-emi.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        {st && <StateSelect t={t} states={states} value={slug} onChange={(v) => { setSlug(v); setKw(null); setCost(null); setSub(null); setSave(null); }} />}
        <NumberField label={t.systemSize} value={kw} onChange={(v) => { setKw(v); setCost(null); setDown(null); setSub(null); setSave(null); }} suffix="kW" step={0.01} min={0.5} hint={t.sizeHint} />
        <NumberField label={t.systemCost} value={cost} onChange={(v) => { setCost(v); setDown(null); }} prefix="₹" step={1000} min={0} slider sliderMax={1000000} hint={t.costHintEmi} />
        <div className="grid2">
          <NumberField label={t.downPayment} value={down} onChange={setDown} prefix="₹" step={1000} min={0} hint={t.downHint} />
          <NumberField label={t.subsidyExp} value={sub} onChange={setSub} prefix="₹" step={1000} min={0} hint={t.subsidyExpHint} />
          <NumberField label={t.interestRate} value={rate} onChange={setRate} suffix="%" step={0.05} min={0} max={30} />
          <NumberField label={t.tenure} value={years} onChange={setYears} suffix={t.years} step={1} min={1} max={20} />
        </div>
        <small className="hint">{t.rateHint}</small>
        <NumberField label={t.monthlySavings} value={save} onChange={setSave} prefix="₹" step={100} min={0} hint={t.saveHint} />
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{fmt(t.sumEmi, { emi: inr(e.emi), yrs: yr, pct, emi2: inr(e2.emi), sub: inr(nz(sub)) })}</Sum>
        <div className="hero-stat">
          <span>{t.emi}</span>
          <strong>{inr(e.emi)}<small>{t.perMonth}</small></strong>
          <em>{t.loanAmount}: {inr(P)}</em>
        </div>
        <div className="stats">
          <Stat label={t.emiAfter} value={inr(e2.emi)} accent big sub={'− ' + inr(nz(sub))} />
          <Stat label={t.totalInterest} value={inr(e.interest)} />
          <Stat label={t.totalPayment} value={inr(e.total)} />
        </div>
        <h3 className="sub-h">{t.emiVsSavings}</h3>
        <Bar items={[{ label: t.emi, value: e.emi, text: inr(e.emi), cls: 'b2' }, { label: t.emiAfter, value: e2.emi, text: inr(e2.emi), cls: 'b3' }, { label: t.monthlySavings, value: nz(save), text: inr(nz(save)), cls: 'b1' }]} />
        <p className={'note ' + (pct >= 100 ? 'ok' : '')}>{fmt(t.emiCovered, { pct })}</p>
        {P > 200000 && <p className="note warn">{t.loanNote}</p>}
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="emi-calculator" />
      </div>
    </div>
  );
}
