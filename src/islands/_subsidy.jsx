// Shared subsidy UI: consumer-class selector, itemised receipt, status tag, best-value tip, size comparison.
// All numbers come from subsidyPlan() in lib/solar.js so every calculator shows the same subsidy.
import { inr, fmt, dec } from '../lib/format.js';
import { PMSG_RATES } from '../lib/solar.js';
import { Seg } from './_shared.jsx';

export const klassLabel = (t, k) => ({ general: t.clGeneral, scst: t.clScst, bpl: t.clBpl, free: t.clFree }[k] || k);

/** Consumer-class selector – shown only when the state really treats some classes differently */
export function ClassSelect({ t, classes, value, onChange }) {
  if (!classes || classes.length < 2) return null;
  return <Seg label={t.consumerClass} value={value} onChange={onChange} options={classes.map((k) => ({ value: k, label: klassLabel(t, k) }))} hint={t.classHint} />;
}

export const basisText = (t, p) => ({ quote: t.basisQuote, benchmark: t.basisBench, market: t.basisMarket }[p.basis]);

/** "2 kW × ₹30,000 + 0.18 kW × ₹18,000" */
export const linesText = (t, p) => (p.lines.length ? p.lines.map((l) => `${dec(l.kw)} kW × ${inr(l.rate)}`).join(' + ') : t.bdNoCentral);

/** the state's rule (or the reason there is no top-up) in plain words */
export function ruleText(t, p) {
  const s = p.stateInfo;
  const r = s.rule || {};
  if (!s.reason) {
    if (s.kind === 'benchmark') return fmt(t.ruleBench, { share: s.share, amt: inr(s.shareAmt) });
    if (s.kind === 'flat') return r.minKw ? fmt(t.ruleFlat, { min: dec(r.minKw) }) : t.ruleFlat0;
    if (s.kind === 'rates') return fmt(t.ruleRates, { list: r.rates.map(inr).join(' + ') });
    return r.max ? fmt(t.rulePerKw, { rate: inr(r.perKw), max: inr(r.max) }) : fmt(t.rulePerKw0, { rate: inr(r.perKw) });
  }
  return fmt({ none: t.rsNone, class: t.rsClass, category: t.rsCategory, below: t.rsBelow, above: t.rsAbove, existing: t.rsExisting, covered: t.rsCovered, offgrid: t.rsOffgrid, manual: t.rsManual, unconfirmed: t.rsUnconfirmed }[s.reason] || t.rsNone, { min: dec(r.minKw), max: dec(r.maxKw) });
}

/** RWA / housing-society rule in words, with the rate of the state (₹18,000, special category ₹19,800) */
export const rwaNote = (t, full) => fmt(t.rwaNote, { rate: inr(full && full.special ? PMSG_RATES.rwaPerKwSpecial : PMSG_RATES.rwaPerKw) });

export const stateLabel = (t, name) => fmt(t.bdState, { state: name });

/** Itemised receipt: cost − central − state = you pay */
export function Breakdown({ t, p, name }) {
  return (
    <div className="bd">
      <div className="bd-h">{t.bdTitle}</div>
      <div className="bd-row"><span>{t.bdCost} <small>{basisText(t, p)}</small></span><b>{inr(p.cost)}</b></div>
      <div className="bd-row minus"><span>{t.centralSubsidy} <small>{linesText(t, p)}</small></span><b>− {inr(p.central)}</b></div>
      <div className="bd-row minus"><span>{stateLabel(t, name)} <small>{ruleText(t, p)}</small></span><b>− {inr(p.state)}</b></div>
      <div className="bd-row tot"><span>{t.youPay}</span><b>{inr(p.pay)}</b></div>
    </div>
  );
}

const TAG_CLASS = { confirmed: 'ok', reported: 'warn', unconfirmed: 'warn', none: '' };

/** How sure we are about the state rule: status tag, the rule in the page language, then the state's own note */
export function StateStatus({ t, p, name }) {
  const tag = { confirmed: t.stConfirmed, reported: t.stReported, unconfirmed: t.stUnconfirmed, none: t.stNone }[p.status];
  if (!tag && !p.note) return null;
  return (
    <p className="note">
      {tag ? <span className={'tag ' + TAG_CLASS[p.status]}>{tag}</span> : null} <b>{stateLabel(t, name)}:</b> {ruleText(t, p)}.
      {p.note ? <small> {p.note}</small> : null}
      {p.asOf ? <small> ({fmt(t.asOf, { date: p.asOf })})</small> : null}
    </p>
  );
}

export function tipText(t, p, name) {
  const tip = p.tip;
  if (!tip) return '';
  const v = { kw: dec(tip.kw), cur: dec(p.kw), state: name, sub: inr(tip.subsidy), extra: inr(tip.extra), more: inr(tip.more) };
  return fmt({ best: t.tipBest, more: t.tipMore, limit: t.tipLimit, cap: t.tipCap }[tip.id], v);
}

/** Best-value hint, e.g. "Gujarat's extra subsidy stops above 2.18 kWp – at 3 kW you pay ₹56,190 more" */
export function BestTip({ t, p, name }) {
  const s = tipText(t, p, name);
  return s ? <p className="note tip">{s}</p> : null;
}

/** Size comparison for 1 / 2 / state limit / 3 / 5 kW: what you pay, total subsidy, then its central and state parts */
export function CompareTable({ t, p }) {
  if (!p.compare.length) return null;
  return (
    <div className="tscroll">
      <table className="tbl cmp">
        <thead>
          <tr><th>{t.cmpSize}</th><th>{t.youPay}</th><th>{t.totalSubsidy}</th><th>{t.cmpCentral}</th><th>{t.cmpState}</th></tr>
        </thead>
        <tbody>
          {p.compare.map((r) => (
            <tr key={r.kw} className={[r.best && 'best', r.cur && 'cur'].filter(Boolean).join(' ') || undefined}>
              <th scope="row">{dec(r.kw)} kW{r.best ? <small> ★ {t.bestValue}</small> : null}</th>
              <td><b>{inr(r.pay)}</b></td>
              <td>{inr(r.subsidy)}</td>
              <td>{inr(r.central)}</td>
              <td>{inr(r.state)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Rows for the PDF: the same receipt, itemised */
export const pdfBreakdown = (t, p, name) => ({
  title: t.bdTitle,
  rows: [
    [t.bdCost, inr(p.cost), { sub: basisText(t, p) }],
    [t.centralSubsidy, '− ' + inr(p.central), { sub: linesText(t, p) }],
    [stateLabel(t, name), '− ' + inr(p.state), { sub: ruleText(t, p) }],
    [t.totalSubsidy, inr(p.subsidy), { sub: fmt(t.ofCost, { pct: p.pct }) }],
    [t.youPay, inr(p.pay), { tot: 1 }],
  ],
});
