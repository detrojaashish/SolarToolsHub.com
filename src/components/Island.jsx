// Server-side island wrapper: renders the component to HTML and marks it for client hydration.
import { STATES_LITE } from '../data/lite.js';

const comps = import.meta.glob('../islands/[A-Z]*.jsx', { eager: true });
const byName = Object.fromEntries(Object.entries(comps).map(([p, m]) => [p.split('/').pop().replace('.jsx', ''), m.default]));

// ─── String pruning ─────────────────────────────────────────────────────
// Pages hand every island the whole calculator dictionary (`t`). Shipping all of it in `data-props`
// would add ~30 KB to each page, so we keep only the keys an island can actually read: any dictionary
// key that occurs as a word in the island's source or in a module it imports (followed transitively).
const SRC = import.meta.glob(['../islands/*.jsx', '../ui/*.js', '../ui/*.jsx', '../lib/*.js'], { eager: true, query: '?raw', import: 'default' });

function resolve(from, spec) {
  if (!spec.startsWith('.')) return null;
  const parts = from.split('/').slice(0, -1);
  for (const seg of spec.split('/')) {
    if (seg === '.' || seg === '') continue;
    if (seg === '..' && parts.length && parts[parts.length - 1] !== '..') parts.pop();
    else parts.push(seg);
  }
  const p = parts.join('/');
  return [p, p + '.js', p + '.jsx'].find((k) => k in SRC) || null;
}

const wordCache = {};
function wordsFor(name) {
  if (wordCache[name]) return wordCache[name];
  const seen = new Set();
  const words = new Set();
  let dynamic = false;
  const walk = (key) => {
    if (!key || seen.has(key)) return;
    seen.add(key);
    const code = SRC[key];
    for (const w of code.match(/[A-Za-z_$][\w$]*/g) || []) words.add(w);
    // t[someVariable] cannot be resolved statically → keep every string for this island
    if (/\bt\[\s*[^'"`\s]/.test(code)) dynamic = true;
    for (const m of code.matchAll(/(?:from\s*|import\s*\(\s*)['"]([^'"]+)['"]/g)) walk(resolve(key, m[1]));
  };
  walk(`../islands/${name}.jsx`);
  return (wordCache[name] = { words, dynamic });
}

function pruneT(name, t) {
  const { words, dynamic } = wordsFor(name);
  if (dynamic) return t;
  const out = {};
  for (const k of Object.keys(t)) if (words.has(k) || !/^[A-Za-z_$][\w$]*$/.test(k)) out[k] = t[k];
  return out;
}

export default function Island({ name, props = {}, states = false, className }) {
  const Comp = byName[name];
  if (!Comp) throw new Error('Unknown island ' + name);
  // the same pruned props are used for the server render and for hydration, so both always match
  const lean = props.t ? { ...props, t: pruneT(name, props.t) } : props;
  const full = states ? { ...lean, states: STATES_LITE } : lean;
  return (
    <div className={'island ' + (className || '')} data-island={name} data-states={states ? '1' : undefined} data-props={JSON.stringify(lean)}>
      <Comp {...full} />
    </div>
  );
}
