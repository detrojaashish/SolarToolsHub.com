import { renderToString } from 'react-dom/server';
import Layout from './components/Layout.jsx';
import { DICTS, LANGS, DEFAULT_LANG, lp, getDict } from './i18n/index.js';
import { SITE, PARTNER, NETWORK } from './config.js';
import { STATES } from './data/states.js';
import { POSTS } from './data/posts.js';
import { STATES_LITE } from './data/lite.js';
import { localizeState } from './data/states-i18n.js';
import Home from './pages/home.jsx';
import { ToolPage, ToolsIndex, TOOL_SLUGS } from './pages/tools.jsx';
import * as StatesMod from './pages/states.jsx';
import { Pmsg, Kusum, SegmentsIndex, Segment, SEGMENTS, QuotePage, NotFound } from './pages/misc.jsx';
import { BlogIndex, BlogPost, StaticPage, STATIC } from './pages/content.jsx';
import { PricePage, PriceHub, ApplyGuide, SolarTypes, SubsidyList, StateMore, SegmentMore, GuideLinksWrap, PRICE_SIZES, priceSlug, GUIDE, priceModel, priceFaqs, subsidyListFaqs, stateQa, stateName, stateModel, globalTokens, fillDict } from './pages/guides.jsx';
import { fmt, inr } from './lib/format.js';

export { STATES_LITE };

const { StatesIndex, StatePage } = StatesMod;
const TODAY = '2026-11-22';
const GUIDES_PUBLISHED = '2026-11-22';
const TITLE_MAX = 60;
const DESC_MAX = 155;
const abs = (p) => SITE.url + p;
const ogKey = (path) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
const chars = (s) => [...String(s)].length;
/** first candidate that fits the limit, otherwise the last (shortest) one */
const fit = (cands, max) => cands.find((c) => chars(c) <= max) || cands[cands.length - 1];

// Dictionaries with the global tokens ({phone}, {cost3}, {range3}, {net3} …) filled from config + lib/solar.js,
// so prices quoted in titles, FAQs and guides always match what the calculators show.
const DICT = {};
for (const code of Object.keys(DICTS)) {
  const raw = getDict(code);
  DICT[code] = fillDict(raw, globalTokens(raw));
}
const dict = (lang) => DICT[lang] || DICT[DEFAULT_LANG];

/** Highest combined subsidy for a home in a state – the same helper the state pages display */
const SIZES = [1, 1.5, 2, 2.18, 2.5, 3];
const maxSub = (s) => (typeof StatesMod.maxSubsidy === 'function' ? StatesMod.maxSubsidy(s) : Math.max(...SIZES.map((k) => stateModel(s, k).sub)));

const ORG_ID = SITE.url + '/#org';
const WEB_ID = SITE.url + '/#web';
const ORG = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: SITE.url + '/',
  logo: { '@type': 'ImageObject', url: SITE.url + '/icons/icon-512.png', width: 512, height: 512 },
  // same roles as the visible footer credit: "A project by MVPChecker · Developed by TWOCOMPO"
  parentOrganization: { '@type': 'Organization', name: NETWORK.mvpchecker.name, url: NETWORK.mvpchecker.url },
};
const CREATOR = { '@type': 'Organization', name: NETWORK.twocompo.name, url: NETWORK.twocompo.url };
const AUTHOR = { '@type': 'Organization', name: 'SolarToolsHub Team', url: SITE.url + '/about' };

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});
const faqLd = (faqs) => (faqs && faqs.length ? { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null);
/** full ISO 8601 date-time with the India offset (Google recommends a time zone on Article dates) */
const isoDate = (dt) => (/T/.test(dt) ? dt : dt + 'T00:00:00+05:30');
const articleLd = (type, { path, headline, description, published, modified, lang }) => ({
  '@type': type,
  headline: chars(headline) > 110 ? [...headline].slice(0, 109).join('') + '…' : headline,
  description,
  datePublished: isoDate(published),
  dateModified: isoDate(modified),
  inLanguage: lang,
  mainEntityOfPage: abs(path),
  image: abs('/og/' + ogKey(path) + '.jpg'),
  author: AUTHOR,
  publisher: { '@id': ORG_ID },
});

// ─── Route table ───────────────────────────────────────────────────────
function build() {
  const R = [];
  const add = (r) => R.push({ priority: 0.6, changefreq: 'monthly', lastmod: TODAY, ...r });

  for (const lang of Object.keys(DICTS)) {
    const d = dict(lang);
    const L = (p) => lp(p, lang);
    const home = { name: d.nav.home, path: L('/') };
    const common = { lang, localized: true };
    const more = <GuideLinksWrap d={d} lang={lang} />;

    add({
      ...common, base: '/', path: L('/'), title: d.home.title, description: d.home.description, ogTitle: d.home.h1, priority: 1, changefreq: 'weekly',
      jsonLd: [
        ORG,
        { '@type': 'WebSite', '@id': WEB_ID, url: SITE.url + '/', name: SITE.name, description: d.site.defaultDescription, inLanguage: d.htmlLang, publisher: { '@id': ORG_ID }, creator: CREATOR },
        faqLd(d.home.faqs),
      ],
      render: () => <><Home d={d} lang={lang} />{more}</>,
    });

    add({ ...common, base: '/tools', path: L('/tools'), title: d.toolsPage.title, description: d.toolsPage.description, ogTitle: d.toolsPage.h1, priority: 0.8, jsonLd: [ORG, crumbs([home, { name: d.nav.tools, path: L('/tools') }])], render: () => <><ToolsIndex d={d} lang={lang} />{more}</> });

    for (const slug of TOOL_SLUGS) {
      const tl = d.tools[slug];
      const path = L('/' + slug);
      add({
        ...common, base: '/' + slug, path, title: tl.title, description: tl.description, ogTitle: tl.name, priority: slug === 'solar-calculator' || slug === 'solar-subsidy-calculator' ? 0.95 : 0.85, changefreq: 'monthly',
        jsonLd: [
          ORG,
          { '@type': 'WebApplication', name: tl.name, url: abs(path), description: tl.description, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', inLanguage: d.htmlLang, isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, publisher: { '@id': ORG_ID } },
          crumbs([home, { name: d.nav.tools, path: L('/tools') }, { name: tl.name, path }]),
          faqLd(tl.faqs),
        ],
        render: () => <><ToolPage d={d} lang={lang} slug={slug} />{more}</>,
      });
    }

    add({ ...common, base: '/states', path: L('/states'), title: d.statesPage.title, description: d.statesPage.description, ogTitle: d.statesPage.h1, priority: 0.9, jsonLd: [ORG, crumbs([home, { name: d.nav.states, path: L('/states') }])], render: () => <><StatesIndex d={d} lang={lang} />{more}</> });

    for (const s of STATES) {
      const sp = d.statePage;
      const name = stateName(d, s);
      // native-script state name on hi / gu / mr pages (people search "गुजरात सोलर सब्सिडी", "ગુજરાત સોલાર સબસિડી");
      // the English name moves to the kicker line so both spellings are on the page
      // state-specific text (highlights, FAQs, net metering, subsidy note) comes from data/states-i18n.js, English is the fallback
      const sLoc = lang === DEFAULT_LANG ? s : { ...localizeState(s, lang), name, hindi: s.name };
      const v = { state: name, max: inr(maxSub(s)), tariff: s.tariff, gen: s.gen };
      const path = L('/state/' + s.slug);
      add({
        ...common, base: '/state/' + s.slug, path,
        title: fit([fmt(sp.title, v), fmt(sp.titleShort, v)], TITLE_MAX),
        description: fit([fmt(sp.description, v), fmt(sp.descriptionShort, v)], DESC_MAX),
        ogTitle: fmt(sp.titleShort, v), priority: 0.85,
        jsonLd: [ORG, crumbs([home, { name: d.nav.states, path: L('/states') }, { name: sLoc.name, path }]), faqLd([...(sLoc.faqs || []), ...stateQa(d, s)])],
        render: () => <><StatePage d={d} lang={lang} s={sLoc} /><StateMore d={d} lang={lang} s={s} /></>,
      });
    }

    add({ ...common, base: '/pm-surya-ghar-yojana', path: L('/pm-surya-ghar-yojana'), title: d.pmsg.title, description: d.pmsg.description, ogTitle: d.pmsg.h1, priority: 0.95, changefreq: 'weekly', jsonLd: [ORG, crumbs([home, { name: d.nav.pmsg, path: L('/pm-surya-ghar-yojana') }]), faqLd(d.pmsg.faqs)], render: () => <><Pmsg d={d} lang={lang} />{more}</> });
    add({ ...common, base: '/pm-kusum-yojana', path: L('/pm-kusum-yojana'), title: d.kusum.title, description: d.kusum.description, ogTitle: d.kusum.h1, priority: 0.8, jsonLd: [ORG, crumbs([home, { name: d.nav.kusum, path: L('/pm-kusum-yojana') }]), faqLd(d.kusum.faqs)], render: () => <Kusum d={d} lang={lang} /> });
    add({ ...common, base: '/solar-for', path: L('/solar-for'), title: d.segmentsPage.title, description: d.segmentsPage.description, ogTitle: d.segmentsPage.h1, priority: 0.7, jsonLd: [ORG, crumbs([home, { name: d.nav.business, path: L('/solar-for') }])], render: () => <><SegmentsIndex d={d} lang={lang} />{more}</> });
    for (const sg of SEGMENTS) {
      const s = d.segments[sg];
      const path = L('/solar-for/' + sg);
      add({ ...common, base: '/solar-for/' + sg, path, title: s.title, description: s.description, ogTitle: s.h1, priority: 0.75, jsonLd: [ORG, crumbs([home, { name: d.nav.business, path: L('/solar-for') }, { name: s.name, path }]), faqLd(s.faqs)], render: () => <><Segment d={d} lang={lang} slug={sg} /><SegmentMore d={d} lang={lang} slug={sg} /></> });
    }
    add({ ...common, base: '/get-solar-quote', path: L('/get-solar-quote'), title: d.quotePage.title, description: d.quotePage.description, ogTitle: d.quotePage.h1, priority: 0.7, jsonLd: [ORG, crumbs([home, { name: d.nav.getQuote, path: L('/get-solar-quote') }])], render: () => <><QuotePage d={d} lang={lang} />{more}</> });

    // ── guides: price list, size-wise price pages, apply online, on-grid vs off-grid ──
    const g = d.guides;
    const guide = { ...common, ogType: 'article', published: GUIDES_PUBLISHED };
    const hubPath = L(GUIDE.hub);
    const hubCrumb = { name: g.price.crumb, path: hubPath };
    add({
      ...guide, base: GUIDE.hub, path: hubPath, title: g.price.hub.title, description: g.price.hub.description, ogTitle: g.price.hub.title, priority: 0.9,
      jsonLd: [ORG, articleLd('Article', { path: hubPath, headline: g.price.hub.h1, description: g.price.hub.description, published: GUIDES_PUBLISHED, modified: TODAY, lang: d.htmlLang }), crumbs([home, hubCrumb]), faqLd(g.price.hub.faqs)],
      render: () => <PriceHub d={d} lang={lang} />,
    });
    for (const kw of PRICE_SIZES) {
      const base = '/' + priceSlug(kw);
      const path = L(base);
      const v = priceModel(kw, d).vars;
      const title = fmt(g.price.title, v);
      const description = fmt(g.price.description, v);
      add({
        ...guide, base, path, title, description, ogTitle: title, priority: 0.9,
        jsonLd: [ORG, articleLd('Article', { path, headline: fmt(g.price.h1, v), description, published: GUIDES_PUBLISHED, modified: TODAY, lang: d.htmlLang }), crumbs([home, hubCrumb, { name: fmt(g.price.sizeLink, v), path }]), faqLd(priceFaqs(d, kw))],
        render: () => <PricePage d={d} lang={lang} kw={kw} />,
      });
    }
    const applyPath = L(GUIDE.apply);
    add({
      ...guide, base: GUIDE.apply, path: applyPath, title: g.apply.title, description: g.apply.description, ogTitle: g.apply.title, priority: 0.9,
      jsonLd: [ORG, articleLd('Article', { path: applyPath, headline: g.apply.h1, description: g.apply.description, published: GUIDES_PUBLISHED, modified: TODAY, lang: d.htmlLang }), crumbs([home, { name: d.nav.pmsg, path: L('/pm-surya-ghar-yojana') }, { name: g.apply.crumb, path: applyPath }]), faqLd(g.apply.faqs)],
      render: () => <ApplyGuide d={d} lang={lang} />,
    });
    const typesPath = L(GUIDE.types);
    add({
      ...guide, base: GUIDE.types, path: typesPath, title: g.types.title, description: g.types.description, ogTitle: g.types.title, priority: 0.8,
      jsonLd: [ORG, articleLd('Article', { path: typesPath, headline: g.types.h1, description: g.types.description, published: GUIDES_PUBLISHED, modified: TODAY, lang: d.htmlLang }), crumbs([home, { name: g.types.crumb, path: typesPath }]), faqLd(g.types.faqs)],
      render: () => <SolarTypes d={d} lang={lang} />,
    });
    const listPath = L(GUIDE.list);
    add({
      ...guide, base: GUIDE.list, path: listPath, title: g.subsidyList.title, description: g.subsidyList.description, ogTitle: g.subsidyList.title, priority: 0.9,
      jsonLd: [ORG, articleLd('Article', { path: listPath, headline: g.subsidyList.h1, description: g.subsidyList.description, published: GUIDES_PUBLISHED, modified: TODAY, lang: d.htmlLang }), crumbs([home, { name: d.nav.states, path: L('/states') }, { name: g.subsidyList.crumb, path: listPath }]), faqLd(subsidyListFaqs(d))],
      render: () => <SubsidyList d={d} lang={lang} />,
    });
  }

  // English-only content
  const d = dict(DEFAULT_LANG);
  const home = { name: d.nav.home, path: '/' };
  const en = { lang: 'en', localized: false };
  add({ ...en, base: '/blog', path: '/blog', title: d.blogPage.title, description: d.blogPage.description, ogTitle: d.blogPage.h1, priority: 0.7, changefreq: 'weekly', jsonLd: [ORG, crumbs([home, { name: d.nav.blog, path: '/blog' }])], render: () => <BlogIndex d={d} /> });
  for (const p of POSTS) {
    const path = '/blog/' + p.slug;
    add({
      ...en, base: path, path, title: p.title, description: p.description, ogTitle: p.title, ogType: 'article', priority: 0.7, lastmod: p.updated || p.date, published: p.date,
      jsonLd: [
        ORG,
        articleLd('BlogPosting', { path, headline: p.title, description: p.description, published: p.date, modified: p.updated || p.date, lang: 'en-IN' }),
        crumbs([home, { name: d.nav.blog, path: '/blog' }, { name: p.title, path }]),
        faqLd(p.faqs),
      ],
      render: () => <BlogPost d={d} p={p} />,
    });
  }
  const PAGE_TYPE = { about: 'AboutPage', contact: 'ContactPage' };
  for (const slug of Object.keys(STATIC)) {
    const pg = STATIC[slug];
    const path = '/' + slug;
    add({
      ...en, base: path, path, title: pg.title, description: pg.description, ogTitle: pg.h1, priority: 0.3, changefreq: 'yearly',
      jsonLd: [ORG, { '@type': PAGE_TYPE[slug] || 'WebPage', name: pg.h1, url: abs(path), description: pg.description, inLanguage: 'en-IN' }, crumbs([home, { name: pg.h1, path }])],
      render: () => <StaticPage d={d} slug={slug} />,
    });
  }
  add({ ...en, base: '/404', path: '/404', title: 'Page not found (404) | SolarToolsHub', description: 'The page you are looking for does not exist. Use the solar calculators or go back to the SolarToolsHub home page.', ogTitle: 'Page not found', noindex: true, render: () => <NotFound d={d} /> });

  for (const r of R) {
    r.og = '/og/' + ogKey(r.path) + '.jpg';
    r.ogKey = ogKey(r.path);
  }
  return R;
}

export const routes = build();

// ─── HTML head ─────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function headFor(r) {
  const d = dict(r.lang);
  const url = abs(r.path);
  const tags = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}">`,
    `<link rel="canonical" href="${url}">`,
    r.noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">',
  ];
  if (r.localized && !r.noindex) {
    for (const l of LANGS) tags.push(`<link rel="alternate" hreflang="${l.htmlLang}" href="${abs(lp(r.base, l.code))}">`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${abs(r.base)}">`);
  }
  tags.push(
    `<meta property="og:type" content="${r.ogType || 'website'}">`,
    `<meta property="og:site_name" content="${SITE.name}">`,
    `<meta property="og:title" content="${esc(r.title)}">`,
    `<meta property="og:description" content="${esc(r.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${abs(r.og)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(r.ogTitle || r.title)}">`,
    `<meta property="og:locale" content="${d.ogLocale}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(r.title)}">`,
    `<meta name="twitter:description" content="${esc(r.description)}">`,
    `<meta name="twitter:image" content="${abs(r.og)}">`
  );
  if (r.localized) for (const l of LANGS) if (l.code !== r.lang) tags.push(`<meta property="og:locale:alternate" content="${dict(l.code).ogLocale}">`);
  if (SITE.twitter) tags.push(`<meta name="twitter:site" content="${SITE.twitter}">`);
  if (r.published) tags.push(`<meta property="article:published_time" content="${isoDate(r.published)}">`, `<meta property="article:modified_time" content="${isoDate(r.lastmod)}">`);
  const ld = (r.jsonLd || []).filter(Boolean);
  if (ld.length) tags.push(`<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld }).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n');
}

export function renderRoute(r) {
  const d = dict(r.lang);
  const body = renderToString(
    <Layout d={d} lang={r.lang} base={r.base} localized={r.localized} states={STATES}>
      {r.render()}
    </Layout>
  );
  return { body, head: headFor(r), htmlLang: d.htmlLang };
}

export { PARTNER };
