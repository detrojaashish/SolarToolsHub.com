import { useState } from 'react';
import { NumberField, Stat } from '../ui/fields.jsx';
import { cableSize } from '../lib/solar.js';
import { fmt } from '../lib/format.js';
import { nz, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';

export default function WireCalc({ t }) {
  const [current, setCurrent] = useState(13);
  const [voltage, setVoltage] = useState(400);
  const [length, setLength] = useState(25);
  const [drop, setDrop] = useState(1.5);
  const [material, setMaterial] = useState('copper');
  const [phase, setPhase] = useState('1');
  const r = cableSize({ current: nz(current), voltage: nz(voltage), length: nz(length), drop: nz(drop), material, phase });
  const matLabel = material === 'copper' ? t.copper : t.aluminium;
  const sum = r.ok ? fmt(t.sumWire, { size: r.size, material: matLabel, pct: r.dropPct, loss: r.loss }) : t.wireBad;

  const pdf = () => ({
    title: t.rptWire,
    subtitle: `${nz(current)} A · ${nz(voltage)} V · ${nz(length)} m · ${nz(drop)}% · ${matLabel} · ${phase === '3' ? t.c3ph : t.cDc}`,
    sections: [
      { title: t.results, rows: [[t.cableSize, r.size + ' mm²', { tot: 1 }], [t.minArea, r.area + ' mm²'], [t.actualDrop, `${r.dropV} V (${r.dropPct}%)`], [t.powerLoss, r.loss + ' W']] },
      { title: t.pdfRatesH, list: [t.currentHint, t.dropHint, t.wireNote] },
    ],
    note: sum,
    filename: 'solar-cable-size.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <Seg label={t.circuit} value={phase} onChange={setPhase} options={[{ value: '1', label: t.cDc }, { value: '3', label: t.c3ph }]} />
        <div className="grid2">
          <NumberField label={t.current} value={current} onChange={setCurrent} suffix="A" step={0.5} min={0} hint={t.currentHint} />
          <NumberField label={t.voltage} value={voltage} onChange={setVoltage} suffix="V" step={1} min={0} hint={t.voltageHint} />
        </div>
        <NumberField label={t.length} value={length} onChange={setLength} suffix="m" step={1} min={0} slider sliderMax={200} hint={t.lengthHint} />
        <NumberField label={t.dropAllowed} value={drop} onChange={setDrop} suffix="%" step={0.5} min={0.1} max={10} hint={t.dropHint} />
        <Seg label={t.material} value={material} onChange={setMaterial} options={[{ value: 'copper', label: t.copper }, { value: 'aluminium', label: t.aluminium }]} />
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        {r.ok && <Sum>{sum}</Sum>}
        <div className="hero-stat">
          <span>{t.cableSize}</span>
          <strong>{r.size} <small>mm²</small></strong>
          <em>{matLabel}</em>
        </div>
        <div className="stats">
          <Stat label={t.actualDrop} value={`${r.dropV} V (${r.dropPct}%)`} accent />
          <Stat label={t.powerLoss} value={r.loss + ' W'} />
          <Stat label={t.minArea} value={r.area + ' mm²'} />
        </div>
        {!r.ok && <p className="note warn">{t.wireBad}</p>}
        <p className="note">{t.wireNote}</p>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="wire-calculator" />
      </div>
    </div>
  );
}
