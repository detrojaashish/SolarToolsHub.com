import { useState } from 'react';
import { NumberField, StateSelect, Stat } from '../ui/fields.jsx';
import { systemCost, subsidyPlan, bestSize } from '../lib/solar.js';
import { inr, inrShort, fmt, dec } from '../lib/format.js';
import { findState, toFull, nz, lim, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { Breakdown, pdfBreakdown } from './_subsidy.jsx';
import { locStates } from './_shared.jsx';

export default function QuoteCheck({ t, states: allStates, defState = 'gujarat' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const [kwIn, setKw] = useState(null); // null → the state's best-value size
  const [priceIn, setPrice] = useState(null); // null → a typical market price, so the page opens on a "fair" example
  const [type, setType] = useState('ongrid');
  const st = findState(states, slug);
  const full = toFull(st);
  const name = st.n;
  const kw = kwIn ?? bestSize(full);
  const k = lim(kw, 0.5, 1000, 0.5);
  const c = systemCost(k, type);
  const price = priceIn ?? Math.round(c.mid / 1000) * 1000;
  const lo = Math.round(c.low * 0.95);
  const hi = Math.round(c.high * 1.05);
  const q = nz(price);
  const verdict = q < lo ? 'low' : q > hi ? 'high' : 'fair';
  const span = hi * 1.3 - lo * 0.7;
  const at = (v) => Math.min(100, Math.max(0, ((v - lo * 0.7) / span) * 100));
  const vText = { low: t.verdictLow, high: t.verdictHigh, fair: t.verdictFair }[verdict];
  // what the household really pays for this quotation after central + state subsidy
  const p = subsidyPlan({ kw: k, state: full, type, quote: q, basis: 'market' });
  const typeLabel = { ongrid: t.onGrid, offgrid: t.offGrid, hybrid: t.hybrid }[type];
  const checks = t.checklistItems || [];
  const sum = fmt(t.sumQuote, { perKw: inr(q / k), kw: dec(k), lo: inrShort(lo), hi: inrShort(hi) }) + (p.subsidy > 0 ? ' ' + fmt(t.sumQuoteSub, { sub: inr(p.subsidy), pay: inr(p.pay) }) : '');

  const pdf = () => ({
    title: t.rptQuote,
    subtitle: `${dec(k)} kW · ${typeLabel} · ${name}`,
    sections: [
      { title: t.results, rows: [[t.yourQuote, inr(q)], [t.pricePerKw, inr(q / k)], [t.market, `${inr(lo)} – ${inr(hi)}`], ...(p.benchmark != null ? [[t.basisBench, inr(p.benchmark)]] : [])] },
      { title: t.verdictH, list: [vText] },
      ...(p.subsidy > 0 ? [pdfBreakdown(t, p, name)] : []),
      { title: t.checklist, list: checks.map((x) => '□  ' + x) },
    ],
    filename: `solar-quote-check-${dec(k)}kw.pdf`,
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <NumberField label={t.systemSize} value={kw} onChange={(v) => { setKw(v); setPrice(null); }} suffix="kW" step={0.01} min={0.5} hint={t.sizeHint} />
        <NumberField label={t.quotedPrice} value={price} onChange={setPrice} prefix="₹" step={1000} min={0} hint={t.quotedHint} />
        <Seg label={t.systemType} value={type} onChange={(v) => { setType(v); setPrice(null); }} options={[{ value: 'ongrid', label: t.onGrid }, { value: 'hybrid', label: t.hybrid }, { value: 'offgrid', label: t.offGrid }]} hint={t.typeHint} />
        <StateSelect t={t} states={states} value={slug} onChange={(v) => { setSlug(v); if (kwIn == null) setPrice(null); }} />
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <div className={'verdict v-' + verdict}>{vText}</div>
        <Sum>{sum}</Sum>
        <div className="gauge" aria-hidden="true">
          <span className="g-fair" style={{ left: at(lo) + '%', right: 100 - at(hi) + '%' }} />
          <i style={{ left: at(q) + '%' }} />
        </div>
        <div className="stats">
          <Stat label={t.yourQuote} value={inr(q)} big />
          <Stat label={t.pricePerKw} value={inr(q / k)} />
          <Stat label={t.market} value={inrShort(lo) + ' – ' + inrShort(hi)} accent />
          {p.benchmark != null ? <Stat label={t.basisBench} value={inr(p.benchmark)} /> : null}
        </div>
        {p.subsidy > 0 && <Breakdown t={t} p={p} name={name} />}
        <h3 className="sub-h">{t.checklist}</h3>
        <ul className="checks">{checks.map((x) => <li key={x}>{x}</li>)}</ul>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="quote-checker" />
      </div>
    </div>
  );
}
