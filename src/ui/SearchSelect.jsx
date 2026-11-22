import { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * Lightweight, accessible searchable dropdown (Select2-style combobox).
 * options: [{ value, label, hint? }]
 */
export default function SearchSelect({ label, value, onChange, options, placeholder = 'Select…', searchPlaceholder = 'Type to search…', noResults = 'No match found', name }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const wrap = useRef(null);
  const input = useRef(null);
  const list = useRef(null);

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => (o.label + ' ' + (o.hint || '') + ' ' + (o.alt || '')).toLowerCase().includes(s));
  }, [q, options]);

  useEffect(() => {
    if (!open) return;
    const close = (e) => wrap.current && !wrap.current.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', close);
    setTimeout(() => input.current && input.current.focus(), 0);
    const i = Math.max(0, filtered.findIndex((o) => o.value === value));
    setActive(i);
    return () => document.removeEventListener('pointerdown', close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const el = list.current && list.current.children[active];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const pick = (o) => {
    onChange(o.value);
    setOpen(false);
    setQ('');
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) pick(filtered[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div className="field ss" ref={wrap}>
      {label && <label id={id + 'l'} htmlFor={id + 'b'}>{label}</label>}
      <button
        type="button"
        id={id + 'b'}
        className={'ss-btn' + (open ? ' open' : '')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? id + 'l ' + id + 'b' : undefined}
        onClick={() => setOpen((o) => !o)}
        name={name}
      >
        <span className={selected ? '' : 'ph'}>{selected ? selected.label : placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      {open && (
        <div className="ss-pop">
          <input
            ref={input}
            className="ss-search"
            type="search"
            value={q}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            aria-controls={id + 'list'}
            aria-activedescendant={filtered[active] ? id + 'o' + active : undefined}
            role="combobox"
            aria-expanded="true"
            autoComplete="off"
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={onKey}
          />
          <ul className="ss-list" role="listbox" id={id + 'list'} ref={list}>
            {filtered.length === 0 && <li className="ss-empty">{noResults}</li>}
            {filtered.map((o, i) => (
              <li
                key={o.value}
                id={id + 'o' + i}
                role="option"
                aria-selected={o.value === value}
                className={(i === active ? 'act ' : '') + (o.value === value ? 'sel' : '')}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(o)}
              >
                <span>{o.label}</span>
                {o.hint && <small>{o.hint}</small>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
