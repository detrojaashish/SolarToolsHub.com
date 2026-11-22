// Server-side only: loads every language and merges with English fallback.
import en from './en.js';
import CALC_X from './extra/calc.js';
import UI_X from './extra/ui.js';

const mods = import.meta.glob('./*.js', { eager: true });

function deepMerge(base, over) {
  if (Array.isArray(base)) return Array.isArray(over) && over.length === base.length ? over.map((v, i) => deepMerge(base[i], v)) : base;
  if (base && typeof base === 'object') {
    const out = {};
    for (const k of Object.keys(base)) out[k] = over && k in over ? deepMerge(base[k], over[k]) : base[k];
    return out;
  }
  return over === undefined || over === null || over === '' ? base : over;
}

// Order shown in the language switcher
const ORDER = ['en', 'hi', 'gu', 'mr', 'ta', 'te', 'bn', 'kn', 'ml', 'pa', 'or'];

export const DICTS = {};
for (const [path, mod] of Object.entries(mods)) {
  const code = path.slice(2, -3);
  if (code === 'index' || !mod.default) continue;
  const dct = code === 'en' ? { ...en } : deepMerge(en, mod.default);
  // extra strings live in ./extra/*.js so they can be edited independently of the big dictionaries
  dct.calc = { ...dct.calc, ...CALC_X.en, ...(CALC_X[code] || {}) };
  dct.ux = { ...UI_X.en, ...(UI_X[code] || {}) };
  DICTS[code] = dct;
}
export const LANGS = ORDER.filter((c) => DICTS[c]).map((c) => ({ code: c, name: DICTS[c].langName, htmlLang: DICTS[c].htmlLang }));

export const DEFAULT_LANG = 'en';
export const getDict = (lang) => DICTS[lang] || DICTS.en;

/** '/solar-calculator' + 'hi' -> '/hi/solar-calculator' */
export function lp(path, lang) {
  if (!lang || lang === DEFAULT_LANG) return path;
  return path === '/' ? `/${lang}/` : `/${lang}${path}`;
}
