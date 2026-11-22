// Compact state list shipped to the browser for calculators (keeps JS tiny).
// Names: n English · h Hindi · gj Gujarati · m Marathi (only when different from h) – see locStates() in islands/_shared.jsx.
// Subsidy rule of each state (`extra`, docs/CONTRACT.md §4) is packed into `x` with short keys:
//   p perKw · m max · r rates · f flat · b [benchmark first2, above2] · sh share % · mn minKw · mk maxKw
//   st status (c confirmed · r reported · u unconfirmed · n none) · a asOf · nt note · g0 general:false
//   c { scst|bpl|free: partial rule }
// `fromLite()` in src/lib/solar.js turns an entry back into the full shape.
import { STATES } from './states.js';
import { packRule, stateExtra } from '../lib/solar.js';
import hi from '../i18n/hi.js';
import gu from '../i18n/gu.js';
import mr from '../i18n/mr.js';

// native-script names for the state dropdown and the result text: h = Hindi, gj = Gujarati, m = Marathi (only where
// it differs from Hindi). The dictionaries' stateNames are the same names the hi / gu / mr pages print.
const nat = (d, s) => (d.stateNames && d.stateNames[s.slug]) || '';

export const STATES_LITE = STATES.map((s) => {
  const o = { s: s.slug, n: s.name, h: nat(hi, s) || s.hindi, t: s.tariff, g: s.gen };
  if (nat(gu, s)) o.gj = nat(gu, s);
  if (nat(mr, s) && nat(mr, s) !== o.h) o.m = nat(mr, s);
  if (s.special) o.sp = 1;
  if (s.type === 'ut') o.u = 1;
  const e = stateExtra(s);
  if (e) {
    const x = packRule(e);
    const c = {};
    for (const [k, v] of Object.entries(e.classes || {})) if (v) c[k] = packRule(v);
    if (Object.keys(c).length) x.c = c;
    if (e.general === false) x.g0 = 1;
    // status, note and date are only useful in the calculator when the state has (or may have) a top-up
    const live = Object.keys(x).length > 0 || (e.status && e.status !== 'none');
    if (live && e.status) x.st = e.status[0];
    if (live && e.note) x.nt = e.note;
    if (live && e.asOf) x.a = e.asOf;
    if (Object.keys(x).length) o.x = x;
  }
  return o;
});
