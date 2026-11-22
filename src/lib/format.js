// Indian number formatting helpers (lakh / crore)
const nf = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 });

const fin = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);

export const num = (n, d = 0) => (d ? nf1 : nf).format(fin(n));
const neg = (n) => (n < 0 ? '−' : '');
export const inr = (n) => neg(Math.round(fin(n))) + '₹' + nf.format(Math.abs(Math.round(fin(n))));
export const inrPdf = (n) => 'Rs. ' + nf.format(Math.round(fin(n)));

/** ₹1.65 lakh style */
export function inrShort(n) {
  n = Math.round(fin(n));
  const a = Math.abs(n);
  if (a >= 1e7) return neg(n) + '₹' + nf1.format(a / 1e7) + ' Cr';
  if (a >= 1e5) return neg(n) + '₹' + nf1.format(a / 1e5) + ' lakh';
  return inr(n);
}

/** plain decimal without trailing zeros: 2.18 → "2.18", 2 → "2" (used for kW / kWp) */
export const dec = (n, d = 2) => String(Math.round(fin(n) * 10 ** d) / 10 ** d);

/** rupee amount that keeps decimals: 6.2 → "₹6.2" (tariffs, per-unit prices) */
export const rs = (n) => neg(fin(n)) + '₹' + dec(Math.abs(fin(n)));

export const fmt = (str, vars = {}) => String(str || '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
