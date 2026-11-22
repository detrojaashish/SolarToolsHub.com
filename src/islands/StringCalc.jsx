import { useState } from 'react';
import { NumberField, Stat } from '../ui/fields.jsx';
import { stringSizing } from '../lib/solar.js';
import { fmt } from '../lib/format.js';
import { nz, Sum, PdfButton, QuoteCta } from './_shared.jsx';

export default function StringCalc({ t }) {
  const [v, setV] = useState({ voc: 49.8, vmp: 41.9, coeff: -0.26, tmin: 5, tmax: 45, vmax: 1000, mpptMin: 200, mpptMax: 850 });
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }));
  const r = stringSizing({ voc: nz(v.voc), vmp: nz(v.vmp), coeff: nz(v.coeff, 0, true), tmin: nz(v.tmin, 0, true), tmax: nz(v.tmax, 0, true), vmax: nz(v.vmax), mpptMin: nz(v.mpptMin), mpptMax: nz(v.mpptMax) });
  const verdict = r.ok ? fmt(t.stringOk, { min: r.min, max: r.max }) : t.stringBad;
  const maxV = Math.round(r.vocCold * r.max);

  const pdf = () => ({
    title: t.rptString,
    subtitle: `Voc ${nz(v.voc)} V · Vmp ${nz(v.vmp)} V · ${nz(v.coeff, 0, true)} %/°C · ${nz(v.tmin, 0, true)} – ${nz(v.tmax, 0, true)} °C · ${nz(v.vmax)} V · MPPT ${nz(v.mpptMin)} – ${nz(v.mpptMax)} V`,
    sections: [
      { title: t.results, rows: [[t.maxPanels, r.max, { tot: 1 }], [t.minPanels, r.min], [t.vocCold, r.vocCold + ' V'], [t.vmpHot, r.vmpHot + ' V'], [t.maxStringV, maxV + ' V', { sub: t.invMaxV + ': ' + nz(v.vmax) + ' V' }]] },
      { title: t.pdfRatesH, list: [t.stringHint, t.stringHint2] },
    ],
    note: verdict,
    filename: 'solar-string-sizing.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <div className="grid2">
          <NumberField label={t.panelVoc} value={v.voc} onChange={set('voc')} suffix="V" step={0.1} min={0} />
          <NumberField label={t.panelVmp} value={v.vmp} onChange={set('vmp')} suffix="V" step={0.1} min={0} />
          <NumberField label={t.tempCoeff} value={v.coeff} onChange={set('coeff')} suffix="%/°C" step={0.01} min={-1} max={0} />
          <NumberField label={t.invMaxV} value={v.vmax} onChange={set('vmax')} suffix="V" step={50} min={0} />
          <NumberField label={t.minTemp} value={v.tmin} onChange={set('tmin')} suffix="°C" step={1} min={-40} max={40} />
          <NumberField label={t.maxTemp} value={v.tmax} onChange={set('tmax')} suffix="°C" step={1} min={0} max={60} />
          <NumberField label={t.mpptMin} value={v.mpptMin} onChange={set('mpptMin')} suffix="V" step={10} min={0} />
          <NumberField label={t.mpptMax} value={v.mpptMax} onChange={set('mpptMax')} suffix="V" step={10} min={0} />
        </div>
        <small className="hint">{t.stringHint}</small>
        <small className="hint">{t.stringHint2}</small>
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <div className={'verdict ' + (r.ok ? 'v-fair' : 'v-high')}>{verdict}</div>
        {r.ok && <Sum>{fmt(t.sumString, { min: r.min, max: r.max, v: maxV, vmax: nz(v.vmax) })}</Sum>}
        <div className="stats">
          <Stat label={t.maxPanels} value={r.max} big accent />
          <Stat label={t.minPanels} value={r.min} big />
          <Stat label={t.vocCold} value={r.vocCold + ' V'} />
          <Stat label={t.vmpHot} value={r.vmpHot + ' V'} />
        </div>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="string-calculator" />
      </div>
    </div>
  );
}
