import { useState } from 'react';
import { NumberField, Stat, Bar } from '../ui/fields.jsx';
import { round, sizeFromUnits, clamp } from '../lib/solar.js';
import { inr, rs, fmt, num, dec } from '../lib/format.js';
import { nz, Sum, PdfButton, QuoteCta } from './_shared.jsx';

export default function EvCalc({ t }) {
  const [v, setV] = useState({ kwh: 30, range: 250, from: 20, to: 100, eff: 90, home: 8, pub: 22, solar: 2.5, petrol: 104, mileage: 15, km: 1200 });
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }));
  const x = Object.fromEntries(Object.entries(v).map(([k, val]) => [k, Math.max(0, nz(val))]));
  const span = Math.max(0, clamp(x.to, 0, 100) - clamp(x.from, 0, 100)) / 100; // share of the battery filled per charge
  const energy = (x.kwh * span) / (clamp(x.eff, 50, 100) / 100); // units drawn from the socket, incl. charger losses
  const kmPerCharge = x.range * span;
  const unitsPerKm = kmPerCharge ? energy / kmPerCharge : 0;
  const perKm = (rate) => unitsPerKm * rate;
  const monthly = (rate) => perKm(rate) * x.km;
  const petrolKm = x.mileage ? x.petrol / x.mileage : 0;
  const petrolMonth = petrolKm * x.km;
  const unitsMonth = unitsPerKm * x.km;
  const solarKw = sizeFromUnits(unitsMonth);
  const items = [
    { label: t.homeCharging, rate: x.home, cls: 'b2' },
    { label: t.publicCharging, rate: x.pub, cls: 'b3' },
    { label: t.solarCharging, rate: x.solar, cls: 'b1' },
  ];
  const sum = fmt(t.sumEv, { km: num(x.km), home: inr(monthly(x.home)), solar: inr(monthly(x.solar)), petrol: inr(petrolMonth), save: inr(Math.max(0, petrolMonth - monthly(x.home))) });

  const pdf = () => ({
    title: t.rptEv,
    subtitle: `${x.kwh} kWh · ${x.range} km · ${num(x.km)} km${t.perMonth}`,
    sections: [
      { title: t.costPerCharge, rows: [[t.energyPerCharge, round(energy, 1) + ' kWh', { sub: `${x.from}% → ${x.to}% · ${round(kmPerCharge)} km` }], ...items.map((i) => [i.label, inr(energy * i.rate), { sub: fmt(t.atRate, { rate: rs(i.rate) }) }])] },
      { title: t.monthlyCost, rows: [...items.map((i) => [i.label, inr(monthly(i.rate))]), [t.petrolCar, inr(petrolMonth)], [t.evSave, inr(Math.max(0, petrolMonth - monthly(x.home))), { tot: 1 }]] },
      { title: t.costPerKm, rows: [...items.map((i) => [i.label, '₹' + round(perKm(i.rate), 2)]), [t.petrolCar, '₹' + round(petrolKm, 2)]] },
    ],
    note: sum + ' ' + fmt(t.evSolarTip, { kw: dec(solarKw) }),
    filename: 'ev-charging-cost.pdf',
  });

  return (
    <div className="calc">
      <div className="calc-in">
        <div className="grid2">
          <NumberField label={t.batteryKwh} value={v.kwh} onChange={set('kwh')} suffix="kWh" step={1} min={0} hint={t.evBatHint} />
          <NumberField label={t.range} value={v.range} onChange={set('range')} suffix="km" step={10} min={0} hint={t.rangeHint} />
          <NumberField label={t.chargeFrom} value={v.from} onChange={set('from')} suffix="%" step={5} min={0} max={100} />
          <NumberField label={t.chargeTo} value={v.to} onChange={set('to')} suffix="%" step={5} min={0} max={100} />
          <NumberField label={t.homeTariff} value={v.home} onChange={set('home')} prefix="₹" step={0.5} min={0} />
          <NumberField label={t.publicTariff} value={v.pub} onChange={set('pub')} prefix="₹" step={0.5} min={0} />
          <NumberField label={t.solarCost} value={v.solar} onChange={set('solar')} prefix="₹" step={0.5} min={0} hint={t.solarCostHint} />
          <NumberField label={t.chargerEff} value={v.eff} onChange={set('eff')} suffix="%" step={1} min={50} max={100} hint={t.effHint} />
          <NumberField label={t.petrolPrice} value={v.petrol} onChange={set('petrol')} prefix="₹" step={1} min={0} />
          <NumberField label={t.mileage} value={v.mileage} onChange={set('mileage')} suffix="km/l" step={1} min={0} />
        </div>
        <NumberField label={t.monthlyKm} value={v.km} onChange={set('km')} suffix="km" step={50} min={0} slider sliderMax={5000} />
      </div>
      <div className="calc-out" aria-live="polite">
        <h2 className="out-h">{t.results}</h2>
        <Sum>{sum}</Sum>
        <div className="hero-stat">
          <span>{t.costPerCharge} · {t.homeCharging}</span>
          <strong>{inr(energy * x.home)}</strong>
          <em>{round(energy, 1)} kWh · {round(kmPerCharge)} km</em>
        </div>
        <h3 className="sub-h">{t.monthlyCost}</h3>
        <Bar items={[...items.map((i) => ({ label: i.label, value: monthly(i.rate), text: inr(monthly(i.rate)), cls: i.cls })), { label: t.petrolCar, value: petrolMonth, text: inr(petrolMonth), cls: 'b5' }]} />
        <div className="stats">
          {items.map((i) => <Stat key={i.label} label={t.costPerKm + ' · ' + i.label} value={'₹' + round(perKm(i.rate), 2)} />)}
          <Stat label={t.costPerKm + ' · ' + t.petrolCar} value={'₹' + round(petrolKm, 2)} />
        </div>
        <p className="note ok">{fmt(t.evSolarTip, { kw: dec(solarKw) })}</p>
        <PdfButton t={t} build={pdf} />
        <QuoteCta t={t} campaign="ev-calculator" />
      </div>
    </div>
  );
}
