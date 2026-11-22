import { useState } from 'react';
import { NumberField, Stat } from '../ui/fields.jsx';
import { inverterSizing } from '../lib/solar.js';
import { fmt, num, dec } from '../lib/format.js';
import { nz, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';

export default function InverterCalc({ t }) {
  const [load, setLoad] = useState(3000);
  const [pf, setPf] = useState(0.8);
  const [surge, setSurge] = useState(false);
  const [margin, setMargin] = useState(25);
  const [array, setArray] = useState(3);
  const [type, setType] = useState('ongrid');
  const r = inverterSizing({ load: nz(load), pf: nz(pf, 0.8), surge, margin: nz(margin), array: nz(array), type });
  const typeLabel = { ongrid: t.onGrid, hybrid: t.hybrid, offgrid: t.offGrid }[type];
  const sum = fmt(type === 'ongrid' ? t.sumInvOn : t.sumInvOff, { rec: r.rec, unit: r.unit, array: dec(nz(array)), kva: r.kva });
  const badRatio = type === 'ongrid' && nz(array) > 0 && (r.ratio > 1.3 || r.ratio < 0.8);

  const pdf = () => ({
    title: t.rptInverter,
    subtitle: `${typeLabel} · ${t.totalLoad} ${num(nz(load))} W · ${t.powerFactor} ${nz(pf, 0.8)} · ${t.solarArray} ${dec(nz(array))} kWp`,
    sections: [
      { title: t.results, rows: [[t.inverterSize, r.rec + ' ' + r.unit, { tot: 1 }], [t.byLoad, r.kva + ' kVA'], [t.byArray, r.byArray + ' kW'], [t.dcAcRatio, r.ratio]] },
      { title: t.pdfRatesH, list: [t.inverterTip, t.phaseNote] },
    ],
    note: sum,
    filename: 'solar-inverter-size.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <Seg label={t.systemType} value={type} onChange={setType} options={[{ value: 'ongrid', label: t.onGrid }, { value: 'hybrid', label: t.hybrid }, { value: 'offgrid', label: t.offGrid }]} hint={t.invTypeHint} />
        <NumberField label={t.solarArray} value={array} onChange={setArray} suffix="kWp" step={0.01} min={0} hint={t.arrayHint} />
        <NumberField label={t.totalLoad} value={load} onChange={setLoad} suffix="W" step={100} min={0} slider sliderMax={20000} hint={t.loadHint} />
        <div className="grid2">
          <NumberField label={t.powerFactor} value={pf} onChange={setPf} step={0.05} min={0.5} max={1} hint={t.pfHint} />
          <NumberField label={t.safety} value={margin} onChange={setMargin} suffix="%" step={5} min={0} max={100} />
        </div>
        <label className="chk"><input type="checkbox" checked={surge} onChange={(e) => setSurge(e.target.checked)} /> {t.surge}</label>
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{sum}</Sum>
        <div className="hero-stat">
          <span>{t.inverterSize}</span>
          <strong>{r.rec} <small>{r.unit}</small></strong>
          <em>{t.dcAcRatio}: {r.ratio}</em>
        </div>
        <div className="stats">
          <Stat label={t.byLoad} value={r.kva + ' kVA'} accent={type !== 'ongrid'} />
          <Stat label={t.byArray} value={r.byArray + ' kW'} accent={type !== 'offgrid'} />
        </div>
        {badRatio && <p className="note warn">{fmt(t.ratioWarn, { r: r.ratio })}</p>}
        <p className="note">{t.inverterTip}</p>
        {r.rec > 5 && <p className="note">{t.phaseNote}</p>}
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="inverter-calculator" />
      </div>
    </div>
  );
}
