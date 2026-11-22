import { useState } from 'react';
import { NumberField, StateSelect, Stat, TextField } from '../ui/fields.jsx';
import { subsidyPlan, bestSize, benchmarkRates, PMSG_RATES } from '../lib/solar.js';
import { inr, rs, num, fmt, dec } from '../lib/format.js';
import { PARTNER } from '../config.js';
import { findState, toFull, nz, lim, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { ClassSelect, Breakdown, StateStatus, BestTip, CompareTable, klassLabel, pdfBreakdown, ruleText, tipText, stateLabel, rwaNote } from './_subsidy.jsx';
import { locStates } from './_shared.jsx';

// optional details that are printed on the PDF only (never sent anywhere): [state key, label]
const details = (t) => [['name', t.dName], ['consumer', t.dConsumer], ['discom', t.dDiscom], ['installer', t.dInstaller], ['ref', t.dRef], ['address', t.dAddress]];

// notes (optional): { <state slug>: note in the page language } – replaces the English note of data/states.js
export default function SubsidyCalc({ t, states: allStates, defState = 'gujarat', notes }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const [category, setCategory] = useState('residential');
  const [klassIn, setKlass] = useState('general');
  const [kwIn, setKw] = useState(null); // null → the size that earns the highest subsidy in this state
  const [existing, setExisting] = useState(0);
  const [houses, setHouses] = useState(20);
  const [quote, setQuote] = useState('');
  const [tariffIn, setTariff] = useState(null);
  const [rt, setRt] = useState({}); // edited rates (only the keys the user changed)
  const [info, setInfo] = useState({ name: '', consumer: '', discom: '', installer: PARTNER.legalName, ref: '', address: '', notes: '' });

  const st = findState(states, slug);
  const full = toFull(st);
  const name = st.n;
  const home = category === 'residential';
  const def = subsidyPlan({ kw: 1, state: full }); // this state's defaults for general consumers
  const klass = home && def.classes.includes(klassIn) ? klassIn : 'general';
  const kw = kwIn ?? (home ? bestSize(full, klass) : 50);
  const k = lim(kw, 0, home ? 10 : 500);
  const tariff = tariffIn ?? st.t;
  const flats = lim(houses, 1, 100000, 1);

  // rates shown in "Edit rates": the user's value, else the default of this state
  const cDef = full.special ? PMSG_RATES.special : PMSG_RATES.general;
  const gRule = def.stateInfo;
  const bench = gRule.kind === 'benchmark';
  const bDef = benchmarkRates(full.special, gRule.rule && gRule.rule.benchmark);
  const dflt = { c2: cDef.first2, c3: cDef.third, b2: bDef.first2, b3: bDef.above2, sh: gRule.share, shS: subsidyPlan({ kw: 1, state: full, klass: 'scst' }).stateInfo.share, mk: def.limit };
  const rv = (key) => (key in rt ? rt[key] : dflt[key] ?? '');
  const setR = (key) => (v) => setRt((o) => ({ ...o, [key]: v }));
  const edited = Object.keys(rt).length > 0;
  const rates = edited ? { central: { first2: rv('c2'), third: rv('c3') }, benchmark: { first2: rv('b2'), above2: rv('b3') }, share: rv('sh'), shareScst: rv('shS'), maxKw: rv('mk') } : undefined;

  const p = subsidyPlan({ kw: k, state: full, category, klass, existingKw: home ? lim(existing, 0, 10) : 0, houses: home ? 0 : flats, quote: nz(quote), tariff: nz(tariff), rates });
  const locNote = (notes && notes[st.s]) || '';
  if (locNote) p.note = locNote;
  const limit = home ? p.limit || def.limit : null;
  const chips = home ? [...new Set([1, 2, limit, 3, 5].filter(Boolean))].sort((a, b) => a - b) : [10, 25, 50, 100, 200];
  const over = p.basis === 'quote' && p.benchmark != null ? p.cost - p.benchmark : 0;
  const reset = (v) => { setSlug(v); setKw(null); setTariff(null); setRt({}); };
  const payback = p.payback == null ? '–' : p.payback + ' ' + t.years;
  const std = p.compare.filter((r) => r.basis !== 'quote');
  const mixed = std.some((r) => r.basis !== std[0].basis); // table mixes benchmark (≤ 3 kW) and market prices
  const quoted = p.basis === 'quote' && p.compare.some((r) => r.cur); // the row of the chosen size uses the quotation
  const rwa = rwaNote(t, full);
  const ben = t.benefits || [];

  const pdf = (lang) => {
    const det = details(t).map(([key, lbl]) => [lbl, info[key].trim()]).filter((r) => r[1]);
    const tip = tipText(t, p, name);
    return {
      title: t.rptSubsidy,
      subtitle: `${name} · ${dec(k)} kWp · ${home ? klassLabel(t, klass) : t.society}`,
      sections: [
        ...(det.length ? [{ title: t.pdfDetailsH, rows: det }] : []),
        { title: t.pdfInputs, rows: [
          [t.state, name],
          [t.newCapacity, dec(k) + ' kWp'],
          home ? [t.consumerClass, klassLabel(t, klass)] : [t.houses, flats],
          ...(p.existingKw ? [[t.existingKw, dec(p.existingKw) + ' kWp']] : []),
        ] },
        pdfBreakdown(t, p, name),
        { title: t.annualSavings, rows: [[t.annualGeneration, num(p.units) + ' ' + t.units], [t.yearlySaving, inr(p.saving), { sub: fmt(t.atRate, { rate: rs(p.tariff) }) }], [t.simplePayback, payback]] },
        ...(p.compare.length ? [{ title: t.cmpTitle, table: { head: [t.cmpSize, t.youPay, t.totalSubsidy, t.cmpCentral, t.cmpState], rows: p.compare.map((r) => [dec(r.kw) + ' kW' + (r.best ? ' ★' : ''), inr(r.pay), inr(r.subsidy), inr(r.central), inr(r.state)]) } }] : []),
        { title: t.pdfRatesH, list: [
          home ? fmt(t.rateCentral, { a: inr(nz(rv('c2'), cDef.first2)), b: inr(nz(rv('c3'), cDef.third)) }) : rwa,
          ...(home ? [fmt(t.rateBench, { a: inr(nz(rv('b2'), bDef.first2)), b: inr(nz(rv('b3'), bDef.above2)) })] : []),
          ...(home ? [`${stateLabel(t, name)}: ${ruleText(t, p)}`] : []),
          ...(home && p.note && (lang === 'en' || locNote) ? [p.note] : []),
          ...(p.basis === 'market' && home && p.benchmark == null ? [t.noBench] : []),
          ...(mixed ? [t.cmpNote] : []),
          ...(quoted ? [t.cmpQuote] : []),
          ...(tip ? [tip] : []),
          t.applyAt,
          ...(info.notes.trim() ? [t.dNotes + ': ' + info.notes.trim()] : []),
        ] },
        { title: t.benTitle, list: ben.map(([a, b]) => `${a} – ${b}`) },
      ],
      filename: `solar-subsidy-${dec(k)}kw-${st.s}.pdf`,
    };
  };

  return (
    <div className="calc">
      <div className="calc-in">
        <StateSelect t={t} states={states} value={slug} onChange={reset} />
        <Seg label={t.category} value={category} onChange={(v) => { setCategory(v); setKw(null); }} options={[{ value: 'residential', label: t.residential }, { value: 'society', label: t.society }]} />
        {home && <ClassSelect t={t} classes={def.classes} value={klass} onChange={(v) => { setKlass(v); setKw(null); }} />}
        <NumberField label={t.newCapacity} value={kw} onChange={setKw} suffix="kWp" step={0.01} min={0.5} max={home ? 10 : 500} slider sliderMax={home ? 10 : 500} hint={limit ? fmt(t.capHintLimit, { state: name, kw: dec(limit) }) : t.capHint} />
        <div className="chips">
          {chips.map((c) => {
            const on = Math.abs(c - k) < 0.005;
            return <button type="button" key={c} className={'chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setKw(c)}>{dec(c)} kW{c === limit ? ' *' : ''}</button>;
          })}
        </div>
        {home && <NumberField label={t.existingKw} value={existing} onChange={setExisting} suffix="kWp" step={0.01} min={0} max={10} hint={t.existingHint} />}
        {!home && <NumberField label={t.houses} value={houses} onChange={setHouses} step={1} min={1} hint={t.housesHint} />}
        <NumberField label={t.vendorQuote} value={quote} onChange={setQuote} prefix="₹" step={1000} hint={home && p.stateInfo.kind === 'benchmark' ? t.quoteHint : t.quoteHint0} />
        <NumberField label={t.tariffPay} value={tariff} onChange={setTariff} prefix="₹" step={0.1} min={0} max={30} hint={t.tariffHint} />
        {full.special && home && <p className="note ok">★ {t.specialCat}</p>}
        {!home && <p className="note">{rwa}</p>}
        {home && (
          <details className="adv">
            <summary>{t.advRates}</summary>
            <p className="hint">{t.advHint}</p>
            <div className="grid2">
              <NumberField label={t.rC2} value={rv('c2')} onChange={setR('c2')} prefix="₹" step={500} />
              <NumberField label={t.rC3} value={rv('c3')} onChange={setR('c3')} prefix="₹" step={500} />
              <NumberField label={t.rB2} value={rv('b2')} onChange={setR('b2')} prefix="₹" step={500} />
              <NumberField label={t.rB3} value={rv('b3')} onChange={setR('b3')} prefix="₹" step={500} />
              {bench && <NumberField label={t.rSh} value={rv('sh')} onChange={setR('sh')} suffix="%" step={1} max={100} />}
              {bench && def.classes.includes('scst') && <NumberField label={t.rShS} value={rv('shS')} onChange={setR('shS')} suffix="%" step={1} max={100} />}
              {dflt.mk ? <NumberField label={t.rMk} value={rv('mk')} onChange={setR('mk')} suffix="kWp" step={0.01} /> : null}
            </div>
            <button type="button" className="btn btn-ghost" onClick={() => setRt({})} disabled={!edited}>{t.resetRates}</button>
          </details>
        )}
        <details className="adv">
          <summary>{t.pdfDetails}</summary>
          <p className="hint">{t.pdfPrivacy}</p>
          <div className="grid2">
            {details(t).map(([key, lbl]) => <TextField key={key} label={lbl} value={info[key]} onChange={(v) => setInfo((o) => ({ ...o, [key]: v }))} />)}
          </div>
          <TextField label={t.dNotes} value={info.notes} onChange={(v) => setInfo((o) => ({ ...o, notes: v }))} area />
        </details>
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{fmt(p.payback == null ? t.sumSubsidy0 : t.sumSubsidy, { kw: dec(k), state: name, sub: inr(p.subsidy), pay: inr(p.pay), save: inr(p.saving), yrs: p.payback })}</Sum>
        <div className="hero-stat">
          <span>{t.youPay}</span>
          <strong>{inr(p.pay)}</strong>
          <em>{t.totalSubsidy}: {inr(p.subsidy)} · {dec(k)} kWp · {name}</em>
        </div>
        <div className="stats">
          <Stat label={t.centralSubsidy} value={inr(p.central)} accent />
          {home && <Stat label={stateLabel(t, name)} value={inr(p.state)} accent={p.state > 0} />}
          <Stat label={t.totalSubsidy} value={inr(p.subsidy)} big sub={fmt(t.ofCost, { pct: p.pct })} />
          <Stat label={p.benchmark != null ? t.basisBench : t.bdCost} value={inr(p.benchmark != null ? p.benchmark : p.cost)} sub={dec(k) + ' kWp'} />
        </div>
        <Breakdown t={t} p={p} name={name} />
        {over > 0 && <p className="note warn">{fmt(t.quoteOver, { amt: inr(over) })}</p>}
        {p.capped && <p className="note warn">{t.capNote}</p>}
        {home && p.basis === 'market' && p.benchmark == null && <p className="note">{t.noBench}</p>}
        {home && <StateStatus t={t} p={p} name={name} />}
        <div className="stats">
          <Stat label={t.annualGeneration} value={num(p.units) + ' ' + t.units} />
          <Stat label={t.yearlySaving} value={inr(p.saving)} accent />
          <Stat label={t.simplePayback} value={payback} big />
        </div>
        <BestTip t={t} p={p} name={name} />
        {p.compare.length > 0 && <h3 className="sub-h">{t.cmpTitle}</h3>}
        <CompareTable t={t} p={p} />
        {mixed && <small className="hint">{t.cmpNote}</small>}
        {quoted && <small className="hint">{t.cmpQuote}</small>}
        <h3 className="sub-h">{t.benTitle}</h3>
        <ul className="ben">{ben.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="subsidy-calculator" />
      </div>
    </div>
  );
}
