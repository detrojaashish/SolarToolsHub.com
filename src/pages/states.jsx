import Island from '../components/Island.jsx';
import { Breadcrumbs, Faq, Cta, AdSlot, PageHead, Icon, ToolCard, ux } from '../components/ui.jsx';
import { lp } from '../i18n/index.js';
import { islandT, pickerT } from './tools.jsx';
import { STATES } from '../data/states.js';
import { centralSubsidy, stateSubsidy, systemCost, yearlyGeneration, roiModel, bestSize, subsidyPlan } from '../lib/solar.js';
import { inr, inrShort, num, fmt } from '../lib/format.js';

const SIZES = [1, 1.5, 2, 2.18, 2.5, 3];
/** Highest combined (central + state) subsidy a home can get, checked across common sizes */
export const maxSubsidy = (s) => Math.max(...SIZES.map((k) => centralSubsidy(k, { special: s.special }) + stateSubsidy(k, s)));
/** Highest state top-up alone */
export const maxExtra = (s) => Math.max(...SIZES.map((k) => stateSubsidy(k, s)));

export function stateCalc(s, kw) {
  const cost = systemCost(kw).mid;
  const sub = Math.min(cost, centralSubsidy(kw, { special: s.special }) + stateSubsidy(kw, s));
  const units = yearlyGeneration(kw, s.gen);
  const net = cost - sub;
  const r = roiModel({ kw, netCost: net, grossCost: cost, tariff: s.tariff, gen: s.gen });
  return { cost, sub, net, units, savings: Math.round(units * s.tariff), payback: r.payback };
}

export function StatesIndex({ d, lang }) {
  const L = (p) => lp(p, lang);
  const sp = d.statesPage;
  const u = ux(d);
  const list = (type) => STATES.filter((s) => s.type === type);
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.states }]} />
      <PageHead h1={sp.h1} lead={sp.lead}>
        <div className="picker-row">
          <Island name="StatePicker" states props={{ t: pickerT(d), base: L('/state/') }} />
        </div>
      </PageHead>
      {[['state', sp.statesLabel], ['ut', sp.utsLabel]].map(([type, label]) => (
        <section className="sec" key={type}>
          <div className="sec-h"><h2>{label}</h2></div>
          <div className="tscroll">
            <table className="tbl big">
              <thead><tr><th>{sp.table.name}</th><th className="num">{sp.table.tariff}</th><th className="num">{sp.table.gen}</th><th className="num">{sp.table.subsidy}</th></tr></thead>
              <tbody>
                {list(type).map((s) => (
                  <tr key={s.slug}>
                    <td><a href={L('/state/' + s.slug)}><b>{s.name}</b></a> {s.special && <span className="tag ok" title={u.special}>★</span>}</td>
                    <td className="num">₹{s.tariff}</td>
                    <td className="num">{s.gen}</td>
                    <td className="num pos">{inr(maxSubsidy(s))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <p className="disc"><span className="tag ok">★</span> {d.pmsg.specialNote}</p>
      <AdSlot d={d} />
      <Cta d={d} campaign="states" />
    </div>
  );
}

export function StatePage({ d, lang, s }) {
  const L = (p) => lp(p, lang);
  const sp = d.statePage;
  const v = { state: s.name, nodal: s.nodal };
  const ex = stateCalc(s, 3);
  const sizes = [1, 2, 3, 4, 5, 10];
  const others = STATES.filter((x) => x.slug !== s.slug);
  const extraAmt = maxExtra(s);
  const u = ux(d);
  const ex2 = s.extra || {};
  const bestKw = bestSize(s);
  const low = subsidyPlan({ kw: bestKw, state: s });
  const stTag = { confirmed: ['ok', u.stConfirmed], reported: ['warn', u.stReported], unconfirmed: ['warn', u.stUnconfirmed] }[ex2.status];
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.states, href: L('/states') }, { name: s.name }]} />
      <PageHead kicker={s.hindi + ' · ' + (s.type === 'ut' ? d.statesPage.utsLabel : d.statesPage.statesLabel)} h1={fmt(sp.h1, v)} lead={fmt(sp.lead, v)} dock />

      <section className="facts dock-in">
        <div className="fact"><span>{sp.maxSubsidy}</span> <b>{inr(maxSubsidy(s))}</b></div>
        <div className="fact"><span>{sp.avgTariff}</span> <b>₹{s.tariff}/unit</b></div>
        <div className="fact"><span>{sp.generation}</span> <b>{s.gen} units/kW/day</b></div>
        <div className="fact"><span>{sp.stateExtra}</span> <b>{extraAmt ? inr(extraAmt) : '—'}</b></div>
      </section>
      {low.pay > 0 && low.subsidy > 0 && (
        <p className="payhl">
          <span>{u.payOnly}</span>{' '}
          <b>{inr(low.pay)}</b>{' '}
          <small>{fmt(u.payOnlySub, { state: s.name, kw: bestKw, sub: inr(low.subsidy), cost: inr(low.cost) })}</small>
        </p>
      )}
      {s.special && <p className="note ok">★ {fmt(sp.specialYes, v)}</p>}

      <section className="sec">
        <div className="sec-h"><h2>{fmt(sp.calcTitle, v)}</h2></div>
        <Island name="SolarCalc" states props={{ t: islandT(d), defState: s.slug, title: 'Rooftop Solar Report - ' + s.name }} />
      </section>

      <AdSlot d={d} />

      <div className="cols">
        <article className="prose">
          <h2>{fmt(sp.exampleTitle, v)}</h2>
          <p>{fmt(sp.exampleText, { ...v, units: num(ex.units), tariff: s.tariff, savings: inr(ex.savings), subsidy: inr(ex.sub), net: inr(ex.net), payback: ex.payback })}</p>

          <h2>{fmt(sp.sizeTable, v)}</h2>
          <div className="tscroll">
            <table className="tbl">
              <thead><tr><th>{sp.size}</th><th>{sp.cost}</th><th>{sp.subsidy}</th><th>{sp.net}</th><th>{sp.gen}</th></tr></thead>
              <tbody>
                {sizes.map((k) => {
                  const c = stateCalc(s, k);
                  return <tr key={k}><td><b>{k} kW</b></td><td>{inrShort(c.cost)}</td><td>{inr(c.sub)}</td><td>{inrShort(c.net)}</td><td>{num(c.units)}</td></tr>;
                })}
              </tbody>
            </table>
          </div>

          <h2>{sp.highlights}</h2>
          <ul className="ticks">{s.highlights.map((x, i) => <li key={i}>{x}</li>)}</ul>

          <h2>{sp.stateExtra} {stTag && <span className={'tag ' + stTag[0]}>{stTag[1]}</span>}</h2>
          <p>{ex2.note}</p>
          {(ex2.asOf || ex2.source) && (
            <p className="disc">
              {ex2.asOf && <>{u.asOf}: <time dateTime={ex2.asOf}>{ex2.asOf}</time></>}
              {ex2.asOf && ex2.source && ' · '}
              {ex2.source && <a href={ex2.source} target="_blank" rel="noopener nofollow">{u.source} <Icon name="ext" size={14} /></a>}
            </p>
          )}

          <h2>{fmt(sp.netMetering, v)}</h2>
          <p>{s.netMetering}</p>

          <h2>{sp.discoms}</h2>
          <ul className="pills">{s.discoms.map((x) => <li key={x}>{x}</li>)}</ul>

          <h2>{fmt(sp.howToApply, v)}</h2>
          <ol className="steps">{sp.applySteps.map((x, i) => <li key={i}>{fmt(x, v)}</li>)}</ol>

          <h2>{sp.officialLinks}</h2>
          <ul className="links">
            <li><a href="https://pmsuryaghar.gov.in" target="_blank" rel="noopener nofollow">pmsuryaghar.gov.in</a> – PM Surya Ghar portal</li>
            {s.nodalUrl && <li><a href={s.nodalUrl} target="_blank" rel="noopener nofollow">{s.nodal}</a> – {sp.nodal}</li>}
            <li>{sp.regulator}: {s.serc}</li>
          </ul>
          <p className="disc">{fmt(sp.verifyNote, v)}</p>

          <Faq items={s.faqs} title={d.common.faqTitle} />
        </article>
        <aside className="side">
          <h2 className="side-h">{d.common.related}</h2>
          <div className="side-list">
            {['solar-subsidy-calculator', 'solar-system-price-estimator', 'solar-roi-calculator', 'solar-emi-calculator'].map((x) => <ToolCard key={x} slug={x} d={d} lang={lang} />)}
          </div>
        </aside>
      </div>

      <Cta d={d} campaign={'state-' + s.slug} />

      <section className="sec">
        <div className="sec-h"><h2>{sp.otherStates}</h2></div>
        <div className="chips scroll">{others.map((o) => <a key={o.slug} className="chip" href={L('/state/' + o.slug)}>{o.name}</a>)}</div>
      </section>
    </div>
  );
}

export { Icon };
