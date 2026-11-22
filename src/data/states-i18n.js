// Hindi / Gujarati / Marathi versions of the state-specific text in states.js
// (highlights, FAQs, net-metering paragraph and the state-subsidy note).
// Shape: STATES_I18N = { hi: { <slug>: { highlights: [...], faqs: [{ q, a }], netMetering, note } }, gu: {...}, mr: {...} }
// The text lives in ./states-i18n/<lang>-<part>.js; English (states.js) is the fallback for anything missing.
// Numbers and amounts must stay identical to states.js – check with `node qa/seoqa/tr/check.mjs <lang> <part>`.
const mods = import.meta.glob('./states-i18n/*.js', { eager: true });

export const STATES_I18N = { hi: {}, gu: {}, mr: {} };
for (const [file, m] of Object.entries(mods)) {
  const lang = (file.match(/\/(hi|gu|mr)-[^/]*\.js$/) || [])[1];
  if (lang && m.default) Object.assign(STATES_I18N[lang], m.default);
}

const sameLen = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.length > 0;

/** State object (same shape as in states.js) with the translated text for `lang` merged in. */
export function localizeState(s, lang) {
  const t = STATES_I18N[lang] && STATES_I18N[lang][s.slug];
  if (!t) return s;
  return {
    ...s,
    highlights: sameLen(t.highlights, s.highlights) ? t.highlights : s.highlights,
    faqs: sameLen(t.faqs, s.faqs) ? t.faqs : s.faqs,
    netMetering: t.netMetering || s.netMetering,
    extra: s.extra ? { ...s.extra, note: t.note || s.extra.note } : s.extra,
  };
}
