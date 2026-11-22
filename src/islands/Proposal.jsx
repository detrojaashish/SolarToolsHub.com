import { useEffect, useState } from 'react';
import { NumberField, StateSelect, TextField } from '../ui/fields.jsx';
import { subsidyPlan, bestSize, stateClasses, systemCost, roiModel, inverterSizing } from '../lib/solar.js';
import { inr, num, fmt, dec } from '../lib/format.js';
import { findState, toFull, nz, lim, PdfButton, QuoteCta } from './_shared.jsx';
import { ClassSelect, linesText, ruleText, stateLabel } from './_subsidy.jsx';
import { locStates } from './_shared.jsx';

export default function Proposal({ t, states: allStates, defState = 'gujarat' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const st = findState(states, slug);
  const full = toFull(st);
  const name = st.n;
  // kw / price / inverter stay null until the installer types them, so they follow the state and size
  const [f, setF] = useState({ customer: t.pDefCustomer || 'Mr. Sharma', address: t.pDefAddress || 'Ahmedabad', company: t.pDefCompany || 'Your Solar Company', kw: null, panel: '545 Wp TOPCon DCR (ALMM)', inverter: null, price: null, validity: 15, warranty: t.pDefWarranty || 'Panels: 25-yr performance, Inverter: 8 yr, Workmanship: 5 yr', notes: t.pDefNotes || 'Includes structure, DC/AC cabling, earthing, lightning arrester, net-meter application and subsidy paperwork.' });
  const [klassIn, setKlass] = useState('general');
  const set = (key) => (v) => setF((o) => ({ ...o, [key]: v }));
  const classes = stateClasses(full);
  const klass = classes.includes(klassIn) ? klassIn : 'general';
  const kwV = f.kw ?? bestSize(full, klass);
  const kw = lim(kwV, 0, 1000);
  const priceV = f.price ?? systemCost(kw).mid;
  const price = nz(priceV);
  const inverter = f.inverter ?? fmt(t.pDefInverter || '{kw} kW on-grid string inverter', { kw: inverterSizing({ array: kw }).rec });
  // same subsidy engine as the subsidy calculator, applied to the quoted price
  const p = subsidyPlan({ kw, state: full, klass, quote: price, basis: 'market' });
  const sub = p.subsidy;
  const units = p.units;
  const roi = roiModel({ kw, netCost: p.pay, grossCost: price, tariff: st.t, gen: st.g });
  // dates are set after mount so server HTML and client hydration match
  const [now, setNow] = useState(null);
  useEffect(() => setNow(Date.now()), []);
  const today = new Date(now || 0);
  const valid = new Date(today.getTime() + lim(f.validity, 0, 3650) * 864e5);
  const d = (x, lang = 'en') => (now ? x.toLocaleDateString(lang + '-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
  const yrs = roi.payback ?? '–';

  const pdf = (lang) => ({
    title: `${t.proposalTitle} – ${dec(kw)} kWp ${t.onGrid}`,
    subtitle: `${t.preparedFor}: ${f.customer}, ${f.address}, ${name}  ·  ${t.preparedBy}: ${f.company}  ·  ${t.validTill}: ${d(valid, lang)}`,
    sections: [
      { title: t.scope, rows: [[t.systemSize, dec(kw) + ' kWp ' + t.onGrid], [t.panelBrand, f.panel], [t.inverterBrand, inverter], [t.warranty, f.warranty]] },
      { title: t.financials, rows: [
        [t.price, inr(price)],
        [t.centralSubsidy, '− ' + inr(p.central), { sub: linesText(t, p) }],
        [stateLabel(t, name), '− ' + inr(p.state), { sub: ruleText(t, p) }],
        [t.netCost, inr(p.pay), { tot: 1 }],
        [t.annualGeneration, num(units) + ' ' + t.units],
        [t.annualSavings, inr(roi.rows[0].saving)],
        [t.payback, yrs + ' ' + t.years],
        [t.savings25, inr(roi.total)],
      ] },
      { title: t.notes, list: [f.notes, t.subsidyCredit].filter(Boolean) },
    ],
    filename: `solar-proposal-${(f.customer || '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'customer'}.pdf`,
  });

  return (
    <div className="calc calc-wide">
      <div className="calc-in">
        <div className="grid2">
          <TextField label={t.customer} value={f.customer} onChange={set('customer')} />
          <TextField label={t.address} value={f.address} onChange={set('address')} />
          <TextField label={t.company} value={f.company} onChange={set('company')} />
          <NumberField label={t.systemSize} value={kwV} onChange={(v) => setF((o) => ({ ...o, kw: v, price: null }))} suffix="kW" step={0.01} min={0.5} />
          <TextField label={t.panelBrand} value={f.panel} onChange={set('panel')} />
          <TextField label={t.inverterBrand} value={inverter} onChange={set('inverter')} />
          <NumberField label={t.price} value={priceV} onChange={set('price')} prefix="₹" step={1000} min={0} hint={t.priceHint} />
          <NumberField label={t.validity} value={f.validity} onChange={set('validity')} step={1} min={0} />
        </div>
        <StateSelect t={t} states={states} value={slug} onChange={setSlug} />
        <ClassSelect t={t} classes={classes} value={klass} onChange={setKlass} />
        <TextField label={t.warranty} value={f.warranty} onChange={set('warranty')} />
        <TextField label={t.notes} value={f.notes} onChange={set('notes')} area />
      </div>
      <div className="calc-out">
        <h2 className="out-h">{t.preview}</h2>
        <article className="proposal" id="print-area">
          <header>
            <div>
              <strong>{f.company}</strong>
              <small>{t.proposalTitle} · {dec(kw)} kW</small>
            </div>
            <span>{t.date}: {d(today)}</span>
          </header>
          <div className="pg2">
            <p><small>{t.preparedFor}</small><b>{f.customer}</b><br />{f.address}, {name}</p>
            <p><small>{t.validTill}</small><b>{d(valid)}</b></p>
          </div>
          <h3>{t.scope}</h3>
          <table className="tbl">
            <tbody>
              <tr><th>{t.systemSize}</th><td>{dec(kw)} kWp {t.onGrid}</td></tr>
              <tr><th>{t.panelBrand}</th><td>{f.panel}</td></tr>
              <tr><th>{t.inverterBrand}</th><td>{inverter}</td></tr>
              <tr><th>{t.warranty}</th><td>{f.warranty}</td></tr>
            </tbody>
          </table>
          <h3>{t.financials}</h3>
          <table className="tbl">
            <tbody>
              <tr><th>{t.price}</th><td>{inr(price)}</td></tr>
              <tr><th>{t.centralSubsidy}</th><td>− {inr(p.central)}</td></tr>
              <tr><th>{stateLabel(t, name)}</th><td>− {inr(p.state)}</td></tr>
              <tr className="hl"><th>{t.netCost}</th><td>{inr(p.pay)}</td></tr>
              <tr><th>{t.annualGeneration}</th><td>{num(units)} {t.units}</td></tr>
              <tr><th>{t.payback}</th><td>{yrs} {t.years}</td></tr>
              <tr><th>{t.savings25}</th><td>{inr(roi.total)}</td></tr>
            </tbody>
          </table>
          <p className="pnotes">{f.notes}</p>
          <p className="pnotes">{fmt(t.subsidyLine, { sub: inr(sub) })} {t.subsidyCredit}</p>
          <footer><span>{t.signature}</span><span>{f.company}</span></footer>
        </article>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="proposal-generator" />
      </div>
    </div>
  );
}
