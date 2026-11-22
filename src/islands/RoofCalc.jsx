import { useState } from 'react';
import { NumberField, Stat, StateSelect } from '../ui/fields.jsx';
import { roofCapacity, yearlyGeneration, PANEL_WATTS } from '../lib/solar.js';
import { num, fmt, dec } from '../lib/format.js';
import { findState, nz, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';
import { locStates } from './_shared.jsx';

export default function RoofCalc({ t, states: allStates, defState = 'gujarat' }) {
  const states = locStates(t, allStates);
  const [slug, setSlug] = useState(defState);
  const st = findState(states, slug);
  const [len, setLen] = useState(40);
  const [wid, setWid] = useState(30);
  const [usable, setUsable] = useState(70);
  const [w, setW] = useState('550');
  const [mount, setMount] = useState('flat');
  const r = roofCapacity({ len: nz(len), wid: nz(wid), usable: nz(usable), panelW: w, mount });
  const units = yearlyGeneration(r.kw, st.g);
  const mountLabel = mount === 'flat' ? t.mountFlat : t.mountSlope;
  const sum = fmt(r.count ? t.sumRoof : t.sumRoof0, { kw: dec(r.kw), count: r.count, w, units: num(units) });

  const pdf = () => ({
    title: t.rptRoof,
    subtitle: `${nz(len)} ft × ${nz(wid)} ft · ${nz(usable)}% · ${w} W · ${mountLabel} · ${st.n}`,
    sections: [
      { title: t.results, rows: [[t.roofTotal, num(r.total) + ' ' + t.sqft], [t.usable, num(r.use) + ' ' + t.sqft], [t.areaPerPanel, r.per + ' ' + t.sqft, { sub: mountLabel }], [t.fitPanels, r.count], [t.capacity, dec(r.kw) + ' kW', { tot: 1 }], [t.annualGeneration, num(units) + ' ' + t.units]] },
      { title: t.pdfRatesH, list: [t.mountHint, t.usableHint] },
    ],
    note: sum,
    filename: 'roof-solar-capacity.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <div className="grid2">
          <NumberField label={t.roofLength} value={len} onChange={setLen} suffix="ft" step={1} min={0} />
          <NumberField label={t.roofWidth} value={wid} onChange={setWid} suffix="ft" step={1} min={0} />
        </div>
        <NumberField label={t.usable} value={usable} onChange={setUsable} suffix="%" step={5} min={10} max={100} slider sliderMax={100} hint={t.usableHint} />
        <Seg label={t.mount} value={mount} onChange={setMount} options={[{ value: 'flat', label: t.mountFlat }, { value: 'flush', label: t.mountSlope }]} hint={t.mountHint} />
        <Seg label={t.panelWattage} value={w} onChange={setW} options={PANEL_WATTS.map((k) => ({ value: k, label: k + ' W' }))} />
        <StateSelect t={t} states={states} value={slug} onChange={setSlug} />
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{sum}</Sum>
        <div className="hero-stat">
          <span>{t.capacity}</span>
          <strong>{dec(r.kw)} <small>kW</small></strong>
          <em>{r.count} × {w} W</em>
        </div>
        <div className="stats">
          <Stat label={t.roofTotal} value={num(r.total) + ' ' + t.sqft} />
          <Stat label={t.usable} value={num(r.use) + ' ' + t.sqft} />
          <Stat label={t.fitPanels} value={r.count} accent />
          <Stat label={t.annualGeneration} value={num(units) + ' ' + t.units} />
        </div>
        {r.kw > 3 && <p className="note tip">{t.roofTip}</p>}
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="roof-calculator" />
      </div>
    </div>
  );
}
