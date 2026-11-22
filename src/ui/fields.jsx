import { useId } from 'react';
import SearchSelect from './SearchSelect.jsx';

export function NumberField({ label, value, onChange, min = 0, max, step = 'any', suffix, prefix, slider, sliderMax, hint }) {
  const id = useId();
  const v = value === '' ? '' : value;
  // filled part of the slider track (pure maths → identical on server and client)
  const sMax = Number(sliderMax || max) || 100;
  const sMin = Number(min) || 0;
  const pct = Math.round(Math.min(100, Math.max(0, (((Number(v) || 0) - sMin) / (sMax - sMin || 1)) * 100)) * 10) / 10;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="inp">
        {prefix && <span className="fix">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={v}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
        {suffix && <span className="fix">{suffix}</span>}
      </div>
      {slider && (
        <input
          type="range"
          aria-label={label}
          min={min}
          max={sliderMax || max}
          step={step === 'any' ? 1 : step}
          value={Number(v) || 0}
          style={{ '--p': pct + '%' }}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}
      {hint && <small className="hint">{hint}</small>}
    </div>
  );
}

export function Segmented({ label, value, onChange, options }) {
  return (
    <div className="field">
      {label && <span className="lbl">{label}</span>}
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button type="button" key={o.value} role="radio" aria-checked={value === o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="sel" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function TextField({ label, value, onChange, area }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {area ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/** Searchable state dropdown. states = lite list [{s,n,h,...}] */
export function StateSelect({ t, states, value, onChange }) {
  const options = states.map((s) => ({ value: s.s, label: s.n, alt: s.h, hint: s.u ? 'UT' : '' }));
  return (
    <SearchSelect
      label={t.state}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={t.selectState}
      searchPlaceholder={t.search}
      noResults={t.noResults}
    />
  );
}

export function Stat({ label, value, big, accent, sub }) {
  return (
    <div className={'stat' + (big ? ' big' : '') + (accent ? ' acc' : '')}>
      <span className="sl">{label}</span>
      <strong className="sv">{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
}

export function Bar({ items }) {
  const max = Math.max(1, ...items.map((i) => Math.abs(i.value)));
  return (
    <div className="bars">
      {items.map((i) => (
        <div className="bar" key={i.label}>
          <span className="bl">{i.label}</span>
          <span className="bt"><span className={'bf ' + (i.cls || '')} style={{ width: Math.max(2, (Math.abs(i.value) / max) * 100) + '%' }} /></span>
          <span className="bv">{i.text}</span>
        </div>
      ))}
    </div>
  );
}
