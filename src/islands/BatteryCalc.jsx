import { useState } from 'react';
import { NumberField, Stat } from '../ui/fields.jsx';
import { batterySizing, round } from '../lib/solar.js';
import { fmt, num } from '../lib/format.js';
import { nz, Seg, Sum, PdfButton, QuoteCta } from './_shared.jsx';

export default function BatteryCalc({ t }) {
  const [load, setLoad] = useState(800);
  const [hours, setHours] = useState(4);
  const [type, setType] = useState('lithium');
  const [volt, setVolt] = useState('48');
  const b = batterySizing({ load: nz(load), hours: nz(hours), type, volt });
  const kwh = round(b.wh / 1000, 1);
  const bank = `${b.count} × ${b.unitV} V ${b.sizeAh} Ah` + (b.series > 1 ? ` (${b.series}S${b.parallel > 1 ? b.parallel + 'P' : ''})` : b.parallel > 1 ? ` (${b.parallel}P)` : '');
  const typeLabel = type === 'lithium' ? t.lithium : t.leadAcid;
  const sum = fmt(t.sumBattery, { load: num(nz(load)), hours: nz(hours), kwh, type: typeLabel, bank });

  const pdf = () => ({
    title: t.rptBattery,
    subtitle: `${num(nz(load))} W · ${nz(hours)} h · ${typeLabel} · ${volt} V`,
    sections: [
      { title: t.results, rows: [[t.usableEnergy, round(b.need / 1000, 2) + ' kWh'], [t.batteryCapacity, round(b.wh / 1000, 2) + ' kWh', { tot: 1 }], [t.batteryVoltage, Math.ceil(b.ah) + ' Ah @ ' + volt + ' V'], [t.batteryBank, bank], [t.dodLbl, Math.round(b.dod * 100) + '%'], [t.effLbl, Math.round(b.eff * 100) + '%'], [t.rechargeKw, b.solarKw + ' kW']] },
      { title: t.pdfRatesH, list: [t.batTypeHint, t.voltHint, ...(b.highAmps ? [fmt(t.highAmps, { amps: b.amps })] : [])] },
    ],
    note: sum,
    filename: 'solar-battery-size.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <NumberField label={t.totalLoad} value={load} onChange={setLoad} suffix="W" step={50} min={0} slider sliderMax={10000} hint={t.loadHint} />
        <NumberField label={t.backupHours} value={hours} onChange={setHours} suffix="h" step={0.5} min={0} max={72} slider sliderMax={24} />
        <Seg label={t.batteryType} value={type} onChange={setType} options={[{ value: 'lithium', label: t.lithium }, { value: 'lead', label: t.leadAcid }]} hint={t.batTypeHint} />
        <Seg label={t.batteryVoltage} value={volt} onChange={setVolt} options={['12', '24', '48', '96'].map((v) => ({ value: v, label: v + ' V' }))} hint={t.voltHint} />
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{sum}</Sum>
        <div className="hero-stat">
          <span>{t.batteryCapacity}</span>
          <strong>{kwh} <small>kWh</small></strong>
          <em>{Math.ceil(b.ah)} Ah @ {volt} V</em>
        </div>
        <div className="stats">
          <Stat label={t.batteryBank} value={bank} big accent />
          <Stat label={t.usableEnergy} value={round(b.need / 1000, 2) + ' kWh'} />
          <Stat label={t.dodLbl} value={Math.round(b.dod * 100) + '%'} />
          <Stat label={t.rechargeKw} value={b.solarKw + ' kW'} />
        </div>
        {b.highAmps && <p className="note warn">{fmt(t.highAmps, { amps: b.amps })}</p>}
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="battery-calculator" />
      </div>
    </div>
  );
}
