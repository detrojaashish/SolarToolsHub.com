import Island from '../components/Island.jsx';
import { Breadcrumbs, Faq, Cta, AdSlot, ToolCard, PageHead, Icon, NetworkStrip, ReadGuide } from '../components/ui.jsx';
import { lp } from '../i18n/index.js';
import EN from '../i18n/en.js';
import { STATES_I18N } from '../data/states-i18n.js';

export const TOOL_ISLANDS = {
  'solar-calculator': ['SolarCalc', true],
  'solar-subsidy-calculator': ['SubsidyCalc', true],
  'solar-system-price-estimator': ['PriceCalc', true],
  'solar-quote-checker': ['QuoteCheck', true],
  'solar-roi-calculator': ['RoiCalc', true],
  'solar-emi-calculator': ['EmiCalc', true],
  'solar-inverter-size-calculator': ['InverterCalc', false],
  'solar-battery-calculator': ['BatteryCalc', false],
  'solar-load-calculator': ['LoadCalc', true],
  'roof-area-calculator': ['RoofCalc', true],
  'solar-string-sizing-calculator': ['StringCalc', false],
  'solar-wire-size-calculator': ['WireCalc', false],
  'ev-charging-cost-calculator': ['EvCalc', false],
  'opex-vs-capex-calculator': ['OpexCapex', true],
  'solar-proposal-generator': ['Proposal', true],
};
export const TOOL_SLUGS = Object.keys(TOOL_ISLANDS);

/** Strings sent to calculator islands. The long page-only strings (d.ux.pg) are left out to keep the HTML small. */
export const islandT = (d) => {
  const { pg, ...short } = d.ux;
  return { ...d.calc, ...d.common, ...short };
};

/** Default state by page language – undefined keeps the calculator's own default (Gujarat). */
export const langState = (lang) => ({ mr: 'maharashtra' }[lang]);

/** The state jump-box (StatePicker) uses only these strings; stLang makes it show native state names. */
export const pickerT = (d) => ({ selectState: d.common.selectState, search: d.common.search, noResults: d.common.noResults, stLang: d.calc.stLang });

/** SubsidyCalc `notes` prop: only the translated note of the state the calculator opens with, to keep the props small. */
export const subsidyNotes = (lang, st = langState(lang) || 'gujarat') => (lang === 'en' ? undefined : { [st]: STATES_I18N[lang]?.[st]?.note });

// tools whose result is about money: show the 'how to read your result' explainer
const MONEY = ['solar-calculator', 'solar-subsidy-calculator', 'solar-roi-calculator', 'solar-system-price-estimator'];

const RELATED = {
  'solar-calculator': ['solar-subsidy-calculator', 'solar-system-price-estimator', 'solar-roi-calculator', 'roof-area-calculator'],
  'solar-subsidy-calculator': ['solar-calculator', 'solar-system-price-estimator', 'solar-emi-calculator', 'solar-quote-checker'],
  'solar-system-price-estimator': ['solar-quote-checker', 'solar-subsidy-calculator', 'solar-emi-calculator', 'solar-roi-calculator'],
  'solar-quote-checker': ['solar-system-price-estimator', 'solar-subsidy-calculator', 'solar-proposal-generator', 'solar-roi-calculator'],
  'solar-roi-calculator': ['solar-emi-calculator', 'solar-calculator', 'opex-vs-capex-calculator', 'solar-subsidy-calculator'],
  'solar-emi-calculator': ['solar-roi-calculator', 'solar-system-price-estimator', 'solar-subsidy-calculator', 'solar-calculator'],
  'solar-inverter-size-calculator': ['solar-battery-calculator', 'solar-load-calculator', 'solar-string-sizing-calculator', 'solar-wire-size-calculator'],
  'solar-battery-calculator': ['solar-inverter-size-calculator', 'solar-load-calculator', 'solar-system-price-estimator', 'solar-calculator'],
  'solar-load-calculator': ['solar-inverter-size-calculator', 'solar-battery-calculator', 'solar-calculator', 'roof-area-calculator'],
  'roof-area-calculator': ['solar-calculator', 'solar-load-calculator', 'solar-system-price-estimator', 'solar-subsidy-calculator'],
  'solar-string-sizing-calculator': ['solar-wire-size-calculator', 'solar-inverter-size-calculator', 'solar-proposal-generator', 'solar-load-calculator'],
  'solar-wire-size-calculator': ['solar-string-sizing-calculator', 'solar-inverter-size-calculator', 'solar-battery-calculator', 'solar-proposal-generator'],
  'ev-charging-cost-calculator': ['solar-calculator', 'solar-roi-calculator', 'solar-load-calculator', 'solar-subsidy-calculator'],
  'opex-vs-capex-calculator': ['solar-roi-calculator', 'solar-system-price-estimator', 'solar-proposal-generator', 'solar-emi-calculator'],
  'solar-proposal-generator': ['solar-quote-checker', 'solar-system-price-estimator', 'solar-string-sizing-calculator', 'opex-vs-capex-calculator'],
};

export function ToolPage({ d, lang, slug }) {
  const tl = d.tools[slug];
  const [island, needStates] = TOOL_ISLANDS[slug];
  const L = (p) => lp(p, lang);
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.tools, href: L('/tools') }, { name: tl.name }]} />
      <PageHead kicker={d.nav.tools} h1={tl.h1} lead={tl.intro} dock />
      <Island name={island} states={needStates} className="dock-in" props={{ t: islandT(d), title: EN.tools[slug].name, defState: needStates ? langState(lang) : undefined, ...(island === 'SubsidyCalc' ? { notes: subsidyNotes(lang) } : {}) }} />
      <p className="disc">{d.common.disclaimerShort} <small>{d.common.pdfNote}</small></p>
      {MONEY.includes(slug) && <ReadGuide d={d} />}
      <AdSlot d={d} />
      <div className="cols">
        <article className="prose">
          <h2>{d.common.howTo}</h2>
          <ol className="steps">{tl.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <Faq items={tl.faqs} title={d.common.faqTitle} />
        </article>
        <aside className="side">
          <h2 className="side-h">{d.common.related}</h2>
          <div className="side-list">{RELATED[slug].map((s) => <ToolCard key={s} slug={s} d={d} lang={lang} />)}</div>
          <a className="side-link" href={L('/states')}><Icon name="state" size={18} /> {d.nav.allStates}</a>
        </aside>
      </div>
      {slug === 'solar-emi-calculator' && <NetworkStrip d={d} />}
      <Cta d={d} campaign={slug} />
    </div>
  );
}

export function ToolsIndex({ d, lang }) {
  const L = (p) => lp(p, lang);
  const groups = [
    [d.nav.quickTools, d.groups.quick],
    [d.nav.technical, d.groups.technical],
    [d.nav.businessSolar, d.groups.business],
  ];
  let n = 0;
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.tools }]} />
      <PageHead h1={d.toolsPage.h1} lead={d.toolsPage.lead} />
      {groups.map(([title, list]) => (
        <section key={title} className="sec">
          <div className="sec-h"><h2>{title}</h2></div>
          <div className="tgrid">{list.map((s) => <ToolCard key={s} slug={s} d={d} lang={lang} n={++n} />)}</div>
        </section>
      ))}
      <AdSlot d={d} />
      <Cta d={d} campaign="tools" />
      <NetworkStrip d={d} />
    </div>
  );
}
