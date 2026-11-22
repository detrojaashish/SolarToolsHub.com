import Island from '../components/Island.jsx';
import { Breadcrumbs, Faq, Cta, AdSlot, PageHead, Icon, ToolCard, Partner, PartnerLogo, PartnerCall, PartnerInfo, partnerFacts, ux } from '../components/ui.jsx';
import { lp } from '../i18n/index.js';
import { islandT, subsidyNotes } from './tools.jsx';
import { partnerLink, PARTNER } from '../config.js';

export function Pmsg({ d, lang }) {
  const L = (p) => lp(p, lang);
  const p = d.pmsg;
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.pmsg }]} />
      <PageHead kicker={d.nav.schemes} h1={p.h1} lead={p.lead} />
      <div className="cols">
        <article className="prose">
          <h2>{p.subsidyTitle}</h2>
          <div className="tscroll"><table className="tbl"><thead><tr>{p.th.map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{p.subsidyTable.map((r) => <tr key={r[0]}>{r.map((c, i) => (i ? <td key={i}>{c}</td> : <th key={i}>{c}</th>))}</tr>)}</tbody></table></div>
          <p className="disc">{p.specialNote}</p>
          <h2>{p.sizeTitle}</h2>
          <div className="tscroll"><table className="tbl"><thead><tr>{p.sizeTh.map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{p.sizeTable.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody></table></div>
          <h2>{p.eligTitle}</h2>
          <ul className="ticks">{p.elig.map((x) => <li key={x}>{x}</li>)}</ul>
          <h2>{p.docsTitle}</h2>
          <ul className="pills">{p.docs.map((x) => <li key={x}>{x}</li>)}</ul>
          <h2>{p.stepsTitle}</h2>
          <ol className="steps">{p.steps.map((x) => <li key={x}>{x}</li>)}</ol>
          <h2>{p.loanTitle}</h2>
          <p>{p.loanText} <a href={L('/solar-emi-calculator')}>{d.tools['solar-emi-calculator'].name} →</a></p>
          <p><a className="btn btn-dark" href="https://pmsuryaghar.gov.in" target="_blank" rel="noopener nofollow">pmsuryaghar.gov.in <Icon name="ext" size={14} /></a></p>
        </article>
        <aside className="side">
          <h2 className="side-h">{d.common.related}</h2>
          <div className="side-list">{['solar-subsidy-calculator', 'solar-calculator', 'solar-emi-calculator', 'solar-quote-checker'].map((x) => <ToolCard key={x} slug={x} d={d} lang={lang} />)}</div>
        </aside>
      </div>
      <section className="sec">
        <div className="sec-h"><h2>{d.tools['solar-subsidy-calculator'].h1}</h2></div>
        <Island name="SubsidyCalc" states props={{ t: islandT(d), notes: subsidyNotes(lang, 'gujarat') }} />
      </section>
      <AdSlot d={d} />
      <Faq items={p.faqs} title={d.common.faqTitle} />
      <Cta d={d} campaign="pm-surya-ghar" />
    </div>
  );
}

export function Kusum({ d, lang }) {
  const L = (p) => lp(p, lang);
  const k = d.kusum;
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.kusum }]} />
      <PageHead kicker={d.nav.schemes} h1={k.h1} lead={k.lead} />
      <article className="prose wide">
        <h2>{k.components}</h2>
        <div className="why">{k.comp.map((c, i) => <div key={i} className="why-c"><span className="why-n">{String.fromCharCode(65 + i)}</span><h3>{c.t}</h3><p>{c.d}</p></div>)}</div>
        <h2>{k.benefitsTitle}</h2>
        <ul className="ticks">{k.benefits.map((x) => <li key={x}>{x}</li>)}</ul>
        <h2>{k.applyTitle}</h2>
        <p>{k.apply}</p>
        <p><a className="btn btn-dark" href="https://pmkusum.mnre.gov.in" target="_blank" rel="noopener nofollow">pmkusum.mnre.gov.in <Icon name="ext" size={14} /></a></p>
      </article>
      <AdSlot d={d} />
      <Faq items={k.faqs} title={d.common.faqTitle} />
      <Cta d={d} campaign="pm-kusum" />
    </div>
  );
}

export const SEGMENTS = ['home', 'housing-society', 'hospital', 'hotel', 'restaurant', 'school', 'office', 'warehouse', 'factory', 'agriculture'];

export function SegmentsIndex({ d, lang }) {
  const L = (p) => lp(p, lang);
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.business }]} />
      <PageHead h1={d.segmentsPage.h1} lead={d.segmentsPage.lead} />
      <div className="tgrid">
        {SEGMENTS.map((s) => (
          <a key={s} className="tcard" href={L('/solar-for/' + s)}>
            <span className="tc-ic"><Icon name={s === 'agriculture' ? 'leaf' : s === 'home' ? 'roof-area-calculator' : 'building'} /></span>
            <span className="tc-t">{d.segments[s].name}</span>
            <span className="tc-d">{d.segments[s].sizing}</span>
            <Icon name="arrow" size={16} className="tc-a" />
          </a>
        ))}
      </div>
      <AdSlot d={d} />
      <Cta d={d} campaign="segments" />
    </div>
  );
}

export function Segment({ d, lang, slug }) {
  const L = (p) => lp(p, lang);
  const s = d.segments[slug];
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.business, href: L('/solar-for') }, { name: s.name }]} />
      <PageHead kicker={d.nav.businessSolar} h1={s.h1} lead={s.intro} />
      <section className="seg-top">
        <ul className="benefits">{s.benefits.map((b) => <li key={b}><Icon name="check" size={18} /> {b}</li>)}</ul>
        <p className="note tip">{s.sizing}</p>
      </section>
      <Island name="SolarCalc" states props={{ t: islandT(d), mode: s.mode, bill: s.bill, title: 'Solar Plan - ' + slug }} />
      <AdSlot d={d} />
      <section className="sec">
        <div className="sec-h"><h2>{d.common.related}</h2></div>
        <div className="tgrid">
          {(slug === 'agriculture' ? ['solar-load-calculator', 'solar-system-price-estimator', 'solar-roi-calculator'] : s.mode === 'commercial' ? ['opex-vs-capex-calculator', 'solar-roi-calculator', 'solar-system-price-estimator'] : ['solar-subsidy-calculator', 'solar-emi-calculator', 'roof-area-calculator']).map((x) => <ToolCard key={x} slug={x} d={d} lang={lang} />)}
          {slug === 'agriculture' && <a className="tcard" href={L('/pm-kusum-yojana')}><span className="tc-ic"><Icon name="leaf" /></span><span className="tc-t">{d.nav.kusum}</span><span className="tc-d">{d.kusum.lead}</span></a>}
        </div>
      </section>
      <Cta d={d} campaign={'segment-' + slug} />
    </div>
  );
}

export function QuotePage({ d, lang }) {
  const L = (p) => lp(p, lang);
  const q = d.quotePage;
  const u = ux(d);
  const f = partnerFacts(d);
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: L('/') }, { name: d.nav.getQuote }]} />
      <header className="phead dk qhero">
        <div>
          <span className="kicker">{d.common.partner} · {PARTNER.legalName}</span>
          <h1>{q.h1}</h1>
          <p className="lead">{u.pText}</p>
          <ul className="pb-stats">{f.stats.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}</ul>
        </div>
        <div className="qh-card">
          <PartnerLogo />
          <PartnerCall d={d} campaign="quote-page" />
        </div>
      </header>

      <section className="sec">
        <div className="sec-h"><h2>{u.pServicesTitle}</h2></div>
        <ul className="svc">{f.services.map((x, i) => <li key={x}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {x}</li>)}</ul>
      </section>

      <section className="sec how">
        <div className="sec-h"><h2>{u.pStepsTitle}</h2></div>
        <ol className="how-l">{u.pSteps.map((x) => <li key={x.t}><b>{x.t}</b> <p>{x.d}</p></li>)}</ol>
      </section>

      <section className="sec">
        <div className="sec-h"><h2>{u.pWhyTitle}</h2></div>
        <ul className="benefits">{q.points.map((b) => <li key={b}><Icon name="check" size={18} /> {b}</li>)}</ul>
      </section>

      <Partner d={d} variant="full" campaign="quote-contact" title={u.pContactTitle} text={q.lead} id="contact">
        <p className="pb-x"><a className="btn btn-line" href={partnerLink('quote-page')} target="_blank" rel="noopener">{q.btn} <Icon name="ext" size={16} /></a></p>
        <PartnerInfo d={d} />
        <p className="disc">{q.note}</p>
      </Partner>

      <section className="sec">
        <div className="sec-h"><h2>{d.home.quickTitle}</h2><a className="more" href={L('/tools')}>{d.nav.allTools} <Icon name="arrow" size={16} /></a></div>
        <div className="tgrid">{d.groups.quick.slice(0, 4).map((s) => <ToolCard key={s} slug={s} d={d} lang={lang} />)}</div>
      </section>
    </div>
  );
}

export function NotFound({ d }) {
  const u = ux(d);
  return (
    <div className="wrap">
      <div className="nf">
        <span className="nf-n" aria-hidden="true">4<i />4</span>
        <h1>{u.notFound}</h1>
        <p className="lead">{u.notFoundText} पेज नहीं मिला।</p>
        <p className="nf-b"><a className="btn btn-sun" href="/">{d.nav.home}</a> <a className="btn btn-line" href="/tools">{d.nav.tools}</a> <a className="btn btn-line" href="/states">{d.nav.states}</a></p>
      </div>
      <div className="tgrid">{d.groups.quick.slice(0, 4).map((s) => <ToolCard key={s} slug={s} d={d} lang="en" />)}</div>
    </div>
  );
}
