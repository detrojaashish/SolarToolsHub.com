import { useState } from 'react';
import { NumberField, StateSelect, Stat, Bar } from '../ui/fields.jsx';
import { systemCost, opexCapex, round, COMMERCIAL_TARIFF_FACTOR } from '../lib/solar.js';
import { inrShort, inr, rs, num, fmt, dec } from '../lib/format.js';
import { findState, nz, lim, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { locStates } from './_shared.jsx';

export default function OpexCapex({ t, states: allStates, defState = 'maharashtra' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const st = findState(states, slug);
  const [kw, setKw] = useState(100);
  const [capex, setCapex] = useState(null); // null → typical commercial (non-DCR) price, no subsidy
  const [grid, setGrid] = useState(null); // null → the state's commercial tariff estimate
  const [ppa, setPpa] = useState(5);
  const [tax, setTax] = useState(25);
  const [esc, setEsc] = useState(3);
  const [disc, setDisc] = useState(9);
  const k = lim(kw, 0, 100000);
  const cost = capex ?? systemCost(k, 'ongrid', 'commercial').mid;
  const gDef = round(st.t * COMMERCIAL_TARIFF_FACTOR, 1);
  const g = grid ?? gDef;
  const gRate = nz(g) || gDef; // empty field while typing → the state's commercial tariff
  const r = opexCapex({ kw: k, cost: nz(cost), grid: gRate, ppa: nz(ppa), tax: nz(tax), esc: nz(esc), discount: nz(disc), gen: st.g });
  const better = r.capexBetter ? t.capexModel : t.opexModel;
  const yrs = r.payback ?? '–';
  const sum = fmt(t.sumOpex, { model: better, a: inrShort(r.capexBetter ? r.npvCapex : r.npvOpex), b: inrShort(r.capexBetter ? r.npvOpex : r.npvCapex), yrs });

  const pdf = () => ({
    title: t.rptOpex,
    subtitle: `${dec(k)} kW · ${st.n} · ${t.tariff} ${rs(gRate)} · ${t.ppaTariff} ${rs(nz(ppa))} · ${num(r.base)} ${t.units}${t.perYear}`,
    sections: [
      { title: t.better, rows: [[t.better, better, { tot: 1 }]] },
      { title: t.capexModel, rows: [[t.investment, inr(nz(cost))], [t.depreciation, inr(r.dep1), { sub: t.depSub }], [t.payback, yrs + ' ' + t.years], [t.savings25, inr(r.capexNet), { sub: t.afterTax }], [t.npvLbl, inr(r.npvCapex)]] },
      { title: t.opexModel, rows: [[t.investment, inr(0)], [t.savings25, inr(r.opexSave), { sub: t.afterTax }], [t.npvLbl, inr(r.npvOpex)]] },
      { title: t.pdfInputs, rows: [[t.taxRate, nz(tax) + '%'], [t.tariffEscalation, nz(esc) + '%'], [t.discountRate, nz(disc) + '%']] },
      { title: t.pdfRatesH, list: [t.opexNote, t.noSubsidyCommercial] },
    ],
    note: sum,
    filename: 'opex-vs-capex-solar.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <StateSelect t={t} states={states} value={slug} onChange={(v) => { setSlug(v); setGrid(null); }} />
        <NumberField label={t.systemSize} value={kw} onChange={(v) => { setKw(v); setCapex(null); }} suffix="kW" step={5} min={1} slider sliderMax={1000} />
        <NumberField label={t.investment + ' (CAPEX)'} value={cost} onChange={setCapex} prefix="₹" step={10000} min={0} hint={t.capexHint} />
        <div className="grid2">
          <NumberField label={t.tariff} value={g} onChange={setGrid} prefix="₹" step={0.1} min={0} max={30} hint={t.gridHint} />
          <NumberField label={t.ppaTariff} value={ppa} onChange={setPpa} prefix="₹" step={0.1} min={0} max={30} hint={t.ppaHint} />
          <NumberField label={t.taxRate} value={tax} onChange={setTax} suffix="%" step={1} min={0} max={60} />
          <NumberField label={t.tariffEscalation} value={esc} onChange={setEsc} suffix="%" step={0.5} min={0} max={20} />
        </div>
        <NumberField label={t.discountRate} value={disc} onChange={setDisc} suffix="%" step={0.5} min={0} max={50} hint={t.discHint} />
        <p className="note">{t.opexNote}</p>
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{sum}</Sum>
        <div className="hero-stat">
          <span>{t.better}</span>
          <strong className="sm">{better}</strong>
          <em>{t.annualGeneration}: {num(r.base)} {t.units}</em>
        </div>
        <h3 className="sub-h">{t.npvLbl}</h3>
        <Bar items={[{ label: t.capexModel, value: r.npvCapex, text: inrShort(r.npvCapex), cls: 'b1' }, { label: t.opexModel, value: r.npvOpex, text: inrShort(r.npvOpex), cls: 'b2' }]} />
        <h3 className="sub-h">{t.savings25} ({t.afterTax})</h3>
        <Bar items={[{ label: t.capexModel, value: r.capexNet, text: inrShort(r.capexNet), cls: 'b1' }, { label: t.opexModel, value: r.opexSave, text: inrShort(r.opexSave), cls: 'b2' }]} />
        <div className="stats">
          <Stat label={t.investment + ' (CAPEX)'} value={inrShort(nz(cost))} />
          <Stat label={t.depreciation} value={inrShort(r.dep1)} accent sub={t.depSub} />
          <Stat label={t.payback + ' (CAPEX)'} value={yrs + ' ' + t.years} />
          <Stat label={t.investment + ' (OPEX)'} value="₹0" />
        </div>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="opex-capex" />
      </div>
    </div>
  );
}
