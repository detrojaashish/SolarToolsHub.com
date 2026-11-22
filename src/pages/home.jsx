import Island from '../components/Island.jsx';
import { Faq, AdSlot, ToolCard, Icon, Partner, ReadGuide, ux, linkPhone } from '../components/ui.jsx';
import { lp } from '../i18n/index.js';
import { islandT, pickerT, langState } from './tools.jsx';
import { STATES } from '../data/states.js';
import { POSTS } from '../data/posts.js';
import { maxSubsidy } from './states.jsx';
import { inr } from '../lib/format.js';
import { PARTNER } from '../config.js';

const SEG_ORDER = ['home', 'housing-society', 'hospital', 'hotel', 'restaurant', 'school', 'office', 'warehouse', 'factory', 'agriculture'];
const SEG_ICON = { home: 'roof-area-calculator', 'housing-society': 'building', agriculture: 'leaf' };

export default function Home({ d, lang }) {
  const L = (p) => lp(p, lang);
  const h = d.home;
  const u = ux(d);
  const [first, ...quick] = d.groups.quick;
  return (
    <>
      <section className="hero dk">
        <div className="hero-bg" aria-hidden="true"><i /></div>
        <div className="wrap hero-in">
          <div className="hero-txt">
            <span className="badge"><i /> {h.badge}</span>
            <h1>{h.h1}</h1>
            <p className="lead">{linkPhone(h.lead)}</p>
            <div className="hero-btns">
              <a className="btn btn-sun btn-lg" href="#calc">{h.primary} <Icon name="arrow" size={18} /></a>
              <a className="btn btn-line btn-lg" href={L('/solar-subsidy-calculator')}>{h.secondary}</a>
            </div>
          </div>
          <ul className="hstats">
            {h.stats.map((s) => <li key={s.l}><b>{s.v}</b> <span>{s.l}</span></li>)}
            <li className="hs-call">
              <a href={'tel:' + PARTNER.tel} data-cta="hero-call"><span>{u.callAvirat}</span> <b>{PARTNER.phone}</b></a>
            </li>
          </ul>
          <div className="hero-card lt" id="calc">
            <Island name="SolarCalc" states props={{ t: islandT(d), title: 'Rooftop Solar Report', defState: langState(lang) }} />
          </div>
        </div>
      </section>

      <div className="wrap">
        <ReadGuide d={d} />

        <section className="sec">
          <div className="sec-h">
            <div><h2>{h.quickTitle}</h2><p>{h.quickLead}</p></div>
            <a className="more" href={L('/tools')}>{d.nav.allTools} <Icon name="arrow" size={16} /></a>
          </div>
          <div className="tgrid bento">
            <ToolCard slug={first} d={d} lang={lang} feature />
            {quick.map((s) => <ToolCard key={s} slug={s} d={d} lang={lang} />)}
            <a className="tcard all" href={L('/tools')}>
              <span className="tc-t">{d.nav.allTools}</span>
              <span className="tc-d">{h.techTitle}</span>
              <Icon name="arrow" size={18} className="tc-a" />
            </a>
          </div>
        </section>

        <section className="sec states-band">
          <div className="sb-h">
            <div>
              <h2>{h.statesTitle}</h2>
              <p>{h.statesLead}</p>
            </div>
            <div className="picker-row">
              <span className="picker-l"><Icon name="state" size={18} /> {h.pickState}</span>
              <Island name="StatePicker" states props={{ t: pickerT(d), base: L('/state/') }} />
            </div>
          </div>
          <div className="chips scroll">
            {STATES.map((s) => (
              <a key={s.slug} href={L('/state/' + s.slug)} className="chip">
                {s.name}{' '}
                <small>{inr(maxSubsidy(s))}</small>
              </a>
            ))}
          </div>
          <a className="more" href={L('/states')}>{d.nav.allStates} <Icon name="arrow" size={16} /></a>
        </section>

        <AdSlot d={d} />

        <section className="sec">
          <div className="sec-h"><h2>{h.whyTitle}</h2></div>
          <div className="why">
            {h.why.map((w, i) => (
              <div key={i} className="why-c"><span className="why-n">0{i + 1}</span> <h3>{w.t}</h3><p>{w.d}</p></div>
            ))}
          </div>
        </section>

        <Partner d={d} variant="full" campaign="home" id="installer" />

        <section className="sec">
          <div className="sec-h"><h2>{h.techTitle}</h2></div>
          <div className="tgrid">{d.groups.technical.concat(d.groups.business).map((s) => <ToolCard key={s} slug={s} d={d} lang={lang} />)}</div>
        </section>

        <section className="sec">
          <div className="sec-h"><div><h2>{h.bizTitle}</h2><p>{h.bizLead}</p></div></div>
          <div className="segs">
            {SEG_ORDER.map((s) => (
              <a key={s} className="seg-c" href={L('/solar-for/' + s)}>
                <Icon name={SEG_ICON[s] || 'building'} size={20} />
                <span>{d.segments[s].name}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="sec how">
          <div className="sec-h"><h2>{h.howTitle}</h2></div>
          <ol className="how-l">
            {h.how.map((s, i) => <li key={i}><b>{s.t}</b> <p>{s.d}</p></li>)}
          </ol>
        </section>

        <section className="sec">
          <div className="sec-h"><h2>{h.blogTitle}</h2><a className="more" href="/blog">{d.nav.blog} <Icon name="arrow" size={16} /></a></div>
          <div className="posts">
            {POSTS.slice(0, 3).map((p) => (
              <a key={p.slug} className="post-c" href={'/blog/' + p.slug}>
                <span className="pc-cat">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <small>{p.readMins} {d.blogPage.minRead}</small>
              </a>
            ))}
          </div>
        </section>

        <Faq items={h.faqs} title={h.faqTitle} />
      </div>
    </>
  );
}
