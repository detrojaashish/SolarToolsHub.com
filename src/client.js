// Client entry: hydrates only the interactive islands present on the page.
// Hydration starts on the first user interaction or shortly after the page has loaded,
// so the static HTML paints instantly and React never blocks the first render.
// A click on a not-yet-hydrated calculator is captured and replayed after hydration.
import './styles.css';

const loaders = import.meta.glob('./islands/[A-Z]*.jsx');

let states = null;
const getStates = () => {
  if (!states) {
    const el = document.getElementById('st-states');
    states = el ? JSON.parse(el.textContent) : [];
  }
  return states;
};

function hydrate(el) {
  if (el.__h) return el.__h;
  const load = loaders['./islands/' + el.dataset.island + '.jsx'];
  if (!load) return Promise.resolve();
  el.__h = Promise.all([import('react'), import('react-dom/client'), load()]).then(
    ([{ createElement, useEffect }, { hydrateRoot }, mod]) =>
      new Promise((resolve) => {
        const props = JSON.parse(el.dataset.props || '{}');
        if (el.dataset.states) props.states = getStates();
        // wrapper adds no DOM; its effect fires once hydration has committed
        const Ready = () => {
          useEffect(() => { el.__ready = true; resolve(); }, []);
          return createElement(mod.default, props);
        };
        hydrateRoot(el, createElement(Ready));
      })
  );
  return el.__h;
}

let started = false;
function start() {
  if (started) return;
  started = true;
  const islands = document.querySelectorAll('[data-island]');
  if (!('IntersectionObserver' in window)) return islands.forEach(hydrate);
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); hydrate(e.target); } }),
    { rootMargin: '400px' }
  );
  islands.forEach((el) => io.observe(el));
}

const islandOf = (t) => (t && t.closest ? t.closest('[data-island]') : null);

// pointer/focus on a calculator → hydrate it right away
document.addEventListener('pointerdown', (e) => { const el = islandOf(e.target); if (el) { start(); hydrate(el); } }, { capture: true, passive: true });
document.addEventListener('focusin', (e) => { const el = islandOf(e.target); if (el) { start(); hydrate(el); } });
// click before hydration finished → hold it and replay afterwards
document.addEventListener('click', (e) => {
  const el = islandOf(e.target);
  if (!el || el.__ready) return;
  e.preventDefault();
  e.stopPropagation();
  const target = e.target;
  start();
  hydrate(el).then(() => requestAnimationFrame(() => { if (document.contains(target)) target.click(); }));
}, true);

['scroll', 'keydown', 'touchstart', 'mousemove', 'wheel'].forEach((ev) => addEventListener(ev, start, { once: true, passive: true }));
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1));
if (document.readyState === 'complete') setTimeout(() => idle(start), 3500);
else addEventListener('load', () => setTimeout(() => idle(start), 3500));

// Close the language dropdown when clicking outside
document.addEventListener('click', (e) => {
  document.querySelectorAll('details.lang[open]').forEach((d) => { if (!d.contains(e.target)) d.removeAttribute('open'); });
});
