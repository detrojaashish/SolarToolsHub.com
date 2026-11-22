import { useState } from 'react';
import { PARTNER, partnerLink, partnerWhatsApp } from '../config.js';
import { fromLite } from '../lib/solar.js';

// State list in the language of the page: `n` becomes the native-script name (it is what the dropdown and every result
// text print), `en` keeps the English name and `h` carries English + Hindi so the search still finds "Gujarat" / "गुजरात".
// The language comes from the island's own strings (t.stLang), so server render and hydration always agree.
const locCache = new WeakMap();
export function locStates(t, states) {
  const lang = t && t.stLang;
  if (!states || !lang || lang === 'en') return states;
  let byLang = locCache.get(states);
  if (!byLang) locCache.set(states, (byLang = {}));
  if (!byLang[lang]) {
    byLang[lang] = states.map((s) => {
      const n = (lang === 'hi' ? s.h : lang === 'gu' ? s.gj : s.m || s.h) || s.n;
      return n === s.n ? s : { ...s, n, en: s.n, h: [s.n, s.h].filter(Boolean).join(' ') };
    });
  }
  return byLang[lang];
}

export const findState = (states, slug) => states.find((s) => s.s === slug) || states.find((s) => s.s === 'gujarat') || states[0];

// lite state -> shape expected by lib/solar.js
export const toFull = fromLite;

/** value of a number field → safe number: '' while typing / NaN → fallback, negatives → 0 unless `signed` */
export const nz = (v, d = 0, signed = false) => {
  const n = v === '' || v == null || !Number.isFinite(Number(v)) ? d : Number(v);
  return signed ? n : Math.max(0, n);
};
export const lim = (v, a, b, d = a) => Math.min(b, Math.max(a, nz(v, d)));

/** Segmented control with an optional hint (same markup/classes as ui/fields.jsx Segmented) */
export function Seg({ label, value, onChange, options, hint }) {
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
      {hint && <small className="hint">{hint}</small>}
    </div>
  );
}

/** One plain-language sentence above the numbers */
export const Sum = ({ children }) => <p className="sum">{children}</p>;

/** report language = language of the page ('en' | 'hi' | 'gu' | 'mr') – only read on click, never during render */
const pageLang = () => (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();

export function PdfButton({ t, build }) {
  const [busy, setBusy] = useState(false);
  const click = async () => {
    setBusy(true);
    try {
      const lang = pageLang();
      const { downloadReport } = await import('../ui/pdf.js');
      await downloadReport(build(lang), { t, lang });
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="act-row">
      <button type="button" className="btn btn-dark" onClick={click} disabled={busy} title={t.pdfNote}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {busy ? '…' : t.downloadPdf}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => window.print()}>{t.print}</button>
    </div>
  );
}

// Call-first partner CTA shown under every calculator result: phone + WhatsApp are primary, website is secondary.
export function QuoteCta({ t, campaign }) {
  return (
    <div className="mini-cta">
      <div className="mc-t">
        <strong>{t.ctaTitle}</strong>
        <small>{PARTNER.legalName} · {t.partnerLine}</small>
      </div>
      <div className="mc-a">
        <a className="btn btn-call" href={'tel:' + PARTNER.tel} data-cta={campaign + '-call'}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{t.callNow}: <b>{PARTNER.phone}</b></span>
        </a>
        <a className="btn btn-wa" href={partnerWhatsApp()} target="_blank" rel="noopener" data-cta={campaign + '-whatsapp'}>{t.whatsapp}</a>
        <a className="mc-link" href={partnerLink(campaign)} target="_blank" rel="noopener">{t.visitSite} ↗</a>
      </div>
    </div>
  );
}
