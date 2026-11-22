import { useMemo, useState } from 'react';
import { NumberField, StateSelect, Stat, Bar } from '../ui/fields.jsx';
import { rooftopPlan, stateClasses, round, COMMERCIAL_TARIFF_FACTOR } from '../lib/solar.js';
import { inr, rs, inrShort, num, fmt, dec } from '../lib/format.js';
import { findState, toFull, nz, lim, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { ClassSelect, Breakdown, BestTip, klassLabel, pdfBreakdown, tipText, rwaNote } from './_subsidy.jsx';
import { locStates } from './_shared.jsx';

export default function SolarCalc({ t, states: allStates, defState = 'gujarat', bill: defBill = 3000, mode = 'residential', title = 'Rooftop Solar Report' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const [by, setBy] = useState('bill');
  const [bill, setBill] = useState(defBill);
  const [units, setUnits] = useState(400);
  const [category, setCategory] = useState(mode);
  const [klassIn, setKlass] = useState('general');
  const [houses, setHouses] = useState(20);
  const st = findState(states, slug);
  const name = st.n;
  const home = category === 'residential';
  const baseTariff = category === 'commercial' ? round(st.t * COMMERCIAL_TARIFF_FACTOR, 1) : st.t;
  const [tariffEdit, setTariffEdit] = useState(null);
  const tariff = tariffEdit ?? baseTariff;
  const classes = useMemo(() => stateClasses(toFull(st)), [st]);
  const klass = home && classes.includes(klassIn) ? klassIn : 'general';

  const flats = category === 'society' ? lim(houses, 1, 100000, 1) : 0;
  const r = useMemo(() => rooftopPlan({ state: toFull(st), bill: nz(bill), units: nz(units), by, category, tariff: lim(tariff, 1, 50, baseTariff), klass, houses: flats }), [st, bill, units, by, category, tariff, baseTariff, klass, flats]);
  const p = r.plan;
  const yrs = r.payback ?? '–';
  const catLabel = { residential: t.residential, society: t.society, commercial: t.commercial }[category];

  const pdf = (lang) => ({
    title: lang === 'en' ? title : t.rptSolar,
    subtitle: `${name} · ${catLabel} · ${by === 'bill' ? t.monthlyBill + ' ' + inr(nz(bill)) : t.monthlyUnits + ' ' + num(nz(units))} · ${fmt(t.atRate, { rate: rs(r.tariff) })}`,
    sections: [
      { title: t.recommendedSize, rows: [[t.systemSize, dec(r.kw) + ' kW'], [t.panels + ' (550 W)', r.panels], [t.roofArea, num(r.roofSqft) + ' ' + t.sqft], [t.annualGeneration, num(r.annualUnits) + ' ' + t.units], [t.coverage, r.coverage + '%']] },
      category === 'commercial'
        ? { title: t.systemCost, rows: [[t.systemCost, inr(r.cost.mid), { sub: t.basisMarket }], [t.depreciation, inr(r.depreciation)], [t.youPay, inr(r.net), { tot: 1 }]] }
        : pdfBreakdown(t, p, name),
      { title: t.annualSavings, rows: [[t.monthlySavings, inr(r.monthlySavings)], [t.annualSavings, inr(r.annualSavings), r.exportCredit > 0 ? { sub: fmt(t.surplusLine, { amt: inr(r.exportCredit) }) } : {}], [t.payback, yrs + ' ' + t.years], [t.savings25, inr(r.savings25)], [t.co2, r.co2 + ' ' + t.tonnes]] },
      { title: t.pdfRatesH, list: [
        fmt(t.marketBasis, { cost: inr(r.cost.mid) }),
        ...(r.benchPay != null ? [fmt(t.benchLine, { bench: inr(p.benchmark), pay: inr(r.benchPay) })] : []),
        ...(category === 'society' ? [rwaNote(t, toFull(st)), t.houses + ': ' + flats] : []),
        ...(home && klass !== 'general' ? [t.consumerClass + ': ' + klassLabel(t, klass)] : []),
        ...(tipText(t, p, name) ? [tipText(t, p, name)] : []),
        category === 'commercial' ? t.noSubsidyCommercial : t.applyAt,
      ] },
    ],
    filename: `solar-plan-${dec(r.kw)}kw-${st.s}.pdf`,
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <StateSelect t={t} states={states} value={slug} onChange={(v) => { setSlug(v); setTariffEdit(null); }} />
        <Seg
          label={t.category}
          value={category}
          onChange={(v) => { setCategory(v); setTariffEdit(null); }}
          options={[{ value: 'residential', label: t.residential }, { value: 'society', label: t.society }, { value: 'commercial', label: t.commercial }]}
        />
        {home && <ClassSelect t={t} classes={classes} value={klass} onChange={setKlass} />}
        <Seg label={t.inputBy} value={by} onChange={setBy} options={[{ value: 'bill', label: t.byBill }, { value: 'units', label: t.byUnits }]} />
        {by === 'bill' ? (
          <NumberField label={t.monthlyBill} value={bill} onChange={setBill} prefix="₹" step={100} slider sliderMax={home ? 20000 : 500000} hint={t.billHint} />
        ) : (
          <NumberField label={t.monthlyUnits} value={units} onChange={setUnits} suffix="kWh" step={10} slider sliderMax={home ? 2000 : 50000} hint={t.unitsHint} />
        )}
        <NumberField label={t.tariff} value={tariff} onChange={setTariffEdit} prefix="₹" step={0.1} min={0} max={30} hint={t.tariffHint} />
        {st.sp && home ? <p className="note ok">★ {t.specialCat}</p> : null}
        {category === 'commercial' && <p className="note">{t.noSubsidyCommercial}</p>}
        {category === 'society' && <NumberField label={t.houses} value={houses} onChange={setHouses} step={1} min={1} hint={t.housesHint} />}
        {category === 'society' && <p className="note">{rwaNote(t, toFull(st))}</p>}
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{fmt(r.subsidy > 0 ? t.sumSolar : t.sumSolar0, { kw: dec(r.kw), cov: r.coverage, pay: inrShort(r.net), sub: inr(r.subsidy), yrs })}</Sum>
        <div className="hero-stat">
          <span>{t.recommendedSize}</span>
          <strong>{dec(r.kw)} <small>kW</small></strong>
          <em>{r.panels} × 550 W · {num(r.roofSqft)} {t.sqft}</em>
        </div>
        <div className="stats">
          <Stat label={t.youPay} value={inrShort(r.net)} big sub={r.subsidy > 0 ? '− ' + inr(r.subsidy) + ' ' + t.totalSubsidy : t.basisMarket} />
          <Stat label={t.monthlySavings} value={inr(r.monthlySavings)} big accent sub={r.exportCredit > 0 ? fmt(t.surplusLine, { amt: inr(r.exportCredit) }) : undefined} />
          <Stat label={t.payback} value={yrs + ' ' + t.years} />
          <Stat label={t.savings25} value={inrShort(r.savings25)} />
          <Stat label={t.annualGeneration} value={num(r.annualUnits) + ' ' + t.units} sub={fmt(t.coversPct, { pct: r.coverage })} />
          <Stat label={t.co2} value={r.co2 + ' ' + t.tonnes} sub={'🌳 ' + num(r.trees)} />
        </div>
        {category === 'commercial' ? (
          <div className="stats">
            <Stat label={t.systemCost} value={inrShort(r.cost.mid)} sub={t.basisMarket} />
            <Stat label={t.depreciation} value={inrShort(r.depreciation)} accent />
          </div>
        ) : (
          <Breakdown t={t} p={p} name={name} />
        )}
        {r.benchPay != null && <p className="note">{fmt(t.benchLine, { bench: inr(p.benchmark), pay: inr(r.benchPay) })}</p>}
        {home && <BestTip t={t} p={p} name={name} />}
        <Bar
          items={[
            { label: t.systemCost, value: r.cost.mid, text: inrShort(r.cost.mid), cls: 'b2' },
            { label: t.totalSubsidy, value: r.subsidy, text: inrShort(r.subsidy), cls: 'b1' },
            { label: t.youPay, value: r.net, text: inrShort(r.net), cls: 'b3' },
          ]}
        />
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="solar-calculator" />
      </div>
    </div>
  );
}
