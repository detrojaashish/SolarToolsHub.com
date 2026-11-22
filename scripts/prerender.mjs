// Static site generation: renders every route to dist/<path>/index.html
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.OUT || 'dist';
const dist = path.join(root, OUT);
const distServer = path.join(root, OUT + '-server');
const { routes, renderRoute, STATES_LITE } = await import(pathToFileURL(path.join(distServer, 'entry-server.js')).href);
const { SITE } = await import(pathToFileURL(path.join(root, 'src', 'config.js')).href);

const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.vite', 'manifest.json'), 'utf8'));
const entry = manifest['src/client.js'];
const cssFiles = entry.css && entry.css.length
  ? entry.css
  : fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.css')).map((f) => 'assets/' + f);
const css = cssFiles.map((f) => fs.readFileSync(path.join(dist, f), 'utf8')).join('\n');
const statesJson = JSON.stringify(STATES_LITE).replace(/</g, '\\u003c');

const adsense = SITE.adsenseClient
  ? `<meta name="google-adsense-account" content="${SITE.adsenseClient}"><script>(function(){var l=0;function g(){if(l)return;l=1;var s=document.createElement('script');s.async=1;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}';s.onload=function(){document.querySelectorAll('ins.adsbygoogle').forEach(function(){(window.adsbygoogle=window.adsbygoogle||[]).push({})})};document.head.appendChild(s)}['scroll','pointerdown','keydown','touchstart','mousemove'].forEach(function(e){addEventListener(e,g,{once:1,passive:1})})})()</script>`
  : '';
const ga = SITE.gaId
  ? `<script>(function(){var l=0;function g(){if(l)return;l=1;var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${SITE.gaId}')}['scroll','pointerdown','keydown','touchstart','mousemove'].forEach(function(e){addEventListener(e,g,{once:1,passive:1})});setTimeout(g,8000)})()</script>`
  : '';
const verify = SITE.googleVerification ? `<meta name="google-site-verification" content="${SITE.googleVerification}">` : '';

function page(r) {
  const { body, head, htmlLang } = renderRoute(r);
  const islands = body.includes('data-island=');
  const needStates = body.includes('data-states="1"');
  return `<!doctype html><html lang="${htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="${SITE.themeColor}">${head}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest">${verify}
<style>${css}</style>${adsense}${ga}</head><body>${body}${needStates ? `<script type="application/json" id="st-states">${statesJson}</script>` : ''}${islands ? `<script type="module" src="/${entry.file}"></script>` : ''}</body></html>`;
}

let n = 0;
for (const r of routes) {
  const html = page(r);
  const file = r.path === '/404' ? path.join(dist, '404.html') : path.join(dist, r.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  n++;
}
// CSS is inlined into every page – remove the separate file
for (const f of cssFiles) fs.rmSync(path.join(dist, f), { force: true });

// ─── sitemap.xml with hreflang alternates ─────────────────────────────
const byBase = {};
for (const r of routes) if (r.localized) (byBase[r.base] ||= []).push(r);
const urls = routes
  .filter((r) => !r.noindex)
  .map((r) => {
    const alts = r.localized
      ? byBase[r.base].map((a) => `<xhtml:link rel="alternate" hreflang="${a.lang === 'en' ? 'en-IN' : a.lang + '-IN'}" href="${SITE.url}${a.path}"/>`).join('') + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${r.base}"/>`
      : '';
    return `<url><loc>${SITE.url}${r.path}</loc><lastmod>${r.lastmod}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority>${alts}</url>`;
  });
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /404\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
if (SITE.adsenseClient) fs.writeFileSync(path.join(dist, 'ads.txt'), `google.com, ${SITE.adsenseClient.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);

// route list for the OG image generator
fs.writeFileSync(path.join(distServer, 'routes.json'), JSON.stringify(routes.map((r) => ({ key: r.ogKey, lang: r.lang, title: r.ogTitle || r.title, path: r.path }))));

fs.rmSync(path.join(dist, '.vite'), { recursive: true, force: true });
console.log(`Prerendered ${n} pages · CSS ${(css.length / 1024).toFixed(1)} KB inline · sitemap ${urls.length} URLs`);
