import { useState } from 'react';
import { NumberField, StateSelect, Stat, Bar } from '../ui/fields.jsx';
import { subsidyPlan, bestSize, stateClasses, systemCost, costBreakup, pricePerKw } from '../lib/solar.js';
import { inr, inrShort, fmt, dec } from '../lib/format.js';
import { findState, toFull, lim, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { ClassSelect, Breakdown, BestTip, pdfBreakdown } from './_subsidy.jsx';
import { locStates } from './_shared.jsx';

export default function PriceCalc({ t, states: allStates, defState = 'gujarat' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const [kwIn, setKw] = useState(null); // null → the state's best-value size
  const [type, setType] = useState('ongrid');
  const [category, setCategory] = useState('residential');
  const [klassIn, setKlass] = useState('general');
  const st = findState(states, slug);
  const full = toFull(st);
  const name = st.n;
  const home = category === 'residential';
  const classes = stateClasses(full);
  const klass = home && classes.includes(klassIn) ? klassIn : 'general';
  const kw = kwIn ?? (home ? bestSize(full, klass) : 50);
  const k = lim(kw, 0.5, 1000, 0.5);
  const c = systemCost(k, type, category);
  const p = subsidyPlan({ kw: k, state: full, category, klass, type, basis: 'market' });
  const b = costBreakup(c.mid, type);
  const typeLabel = { ongrid: t.onGrid, offgrid: t.offGrid, hybrid: t.hybrid };
  const compare = ['ongrid', 'hybrid', 'offgrid'].map((ty) => ({ ty, v: systemCost(k, ty, category).mid }));
  const perKw = pricePerKw(k, type, category);
  const sub = p.subsidy;

  const pdf = () => ({
    title: t.rptPrice,
    subtitle: `${dec(k)} kW · ${typeLabel[type]} · ${name} · ${home ? t.residential : t.commercial}`,
    sections: [
      { title: t.priceRange, rows: [[t.priceRange, `${inr(c.low)} – ${inr(c.high)}`], [t.systemCost, inr(c.mid), { sub: t.basisMarket }], [t.pricePerKw, inr(perKw)], ...(p.benchmark != null ? [[t.basisBench, inr(p.benchmark)]] : [])] },
      pdfBreakdown(t, p, name),
      { title: t.breakup, rows: [[t.panelsCost, inr(b.panels)], [t.inverterCost, inr(b.inverter)], ...(b.battery ? [[t.batteryCost, inr(b.battery)]] : []), [t.bosCost, inr(b.bos)], [t.installCost, inr(b.install)]] },
      { title: t.systemType, table: { head: [t.systemType, t.systemCost, t.pricePerKw], rows: compare.map((x) => [typeLabel[x.ty], inr(x.v), inr(x.v / k)]) } },
      { title: t.pdfRatesH, list: [t.gstNote, t.typeHint] },
    ],
    filename: `solar-price-${dec(k)}kw-${type}.pdf`,
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <NumberField label={t.systemSize} value={kw} onChange={setKw} suffix="kW" step={0.01} min={0.5} slider sliderMax={home ? 10 : 200} hint={t.sizeHint} />
        <Seg label={t.systemType} value={type} onChange={setType} options={[{ value: 'ongrid', label: t.onGrid }, { value: 'hybrid', label: t.hybrid }, { value: 'offgrid', label: t.offGrid }]} hint={t.typeHint} />
        <Seg label={t.category} value={category} onChange={(v) => { setCategory(v); setKw(null); }} options={[{ value: 'residential', label: t.residential }, { value: 'commercial', label: t.commercial }]} />
        <StateSelect t={t} states={states} value={slug} onChange={(v) => { setSlug(v); setKw(null); }} />
        {home && type !== 'offgrid' && <ClassSelect t={t} classes={classes} value={klass} onChange={setKlass} />}
        <p className="note">{t.gstNote}</p>
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{fmt(sub > 0 ? t.sumPrice : t.sumPrice0, { kw: dec(k), type: typeLabel[type], low: inrShort(c.low), high: inrShort(c.high), sub: inr(sub), pay: inrShort(p.pay) })}</Sum>
        <div className="hero-stat">
          <span>{t.priceRange} · {typeLabel[type]}</span>
          <strong>{inrShort(c.low)} – {inrShort(c.high)}</strong>
          <em>{t.pricePerKw}: {inr(perKw)}</em>
        </div>
        <div className="stats">
          <Stat label={t.systemCost} value={inr(c.mid)} sub={t.basisMarket} />
          <Stat label={t.totalSubsidy} value={inr(sub)} accent />
          <Stat label={t.youPay} value={inr(p.pay)} big />
          {p.benchmark != null ? <Stat label={t.basisBench} value={inr(p.benchmark)} /> : null}
        </div>
        {sub > 0 ? <Breakdown t={t} p={p} name={name} /> : <p className="note">{type === 'offgrid' ? t.rsOffgrid : t.noSubsidyCommercial}</p>}
        {home && type !== 'offgrid' && <BestTip t={t} p={p} name={name} />}
        <h3 className="sub-h">{t.breakup}</h3>
        <Bar items={[
          { label: t.panelsCost, value: b.panels, text: inrShort(b.panels), cls: 'b1' },
          { label: t.inverterCost, value: b.inverter, text: inrShort(b.inverter), cls: 'b2' },
          ...(b.battery ? [{ label: t.batteryCost, value: b.battery, text: inrShort(b.battery), cls: 'b3' }] : []),
          { label: t.bosCost, value: b.bos, text: inrShort(b.bos), cls: 'b4' },
          { label: t.installCost, value: b.install, text: inrShort(b.install), cls: 'b5' },
        ]} />
        <h3 className="sub-h">{t.systemType}</h3>
        <Bar items={compare.map((x) => ({ label: typeLabel[x.ty], value: x.v, text: inrShort(x.v), cls: x.ty === type ? 'b1' : 'b4' }))} />
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="price-estimator" />
      </div>
    </div>
  );
}
