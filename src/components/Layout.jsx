import { LANGS, lp } from '../i18n/index.js';
import { PARTNER, SITE, NETWORK, partnerLink, partnerWhatsApp } from '../config.js';
import { Logo, Icon, PartnerLogo, NetworkStrip, ux } from './ui.jsx';
import { fmt } from '../lib/format.js';

const TOP_STATES = ['gujarat', 'maharashtra', 'rajasthan', 'uttar-pradesh', 'karnataka', 'tamil-nadu', 'delhi', 'madhya-pradesh'];

export default function Layout({ d, lang, base, localized, states, children }) {
  const L = (p) => lp(p, lang);
  const t = d.tools;
  const u = ux(d);
  const year = new Date().getFullYear();
  const stateName = Object.fromEntries((states || []).map((s) => [s.slug, s.name]));
  const tel = 'tel:' + PARTNER.tel;
  // guide pages (price list, size-wise prices, apply online, system types, state-wise subsidy list)
  const sizeLink = (kw) => ['/' + kw + 'kw-solar-system-price', fmt((d.guides && d.guides.price && d.guides.price.sizeLink) || '{kw} kW solar system price', { kw })];
  const guideTop = [['/solar-panel-price', d.nav.priceList], ['/solar-subsidy-state-wise', d.nav.subsidyList], ['/pm-surya-ghar-apply-online', d.nav.applyOnline], ['/on-grid-vs-off-grid-solar', d.nav.solarTypes]].filter((x) => x[1]);
  const guideAll = [...guideTop, ...[1, 2, 3, 4, 5, 10].map(sizeLink)];
  // emoji are drawn as tiny inline SVGs: no emoji-font lookup during first layout, and the flag also shows on Windows
  const madeFor = d.site.madeFor.split(/(❤️?|🇮🇳)/).map((x, i) =>
    x.charCodeAt(0) === 0x2764 ? (
      <svg key={i} className="em" viewBox="0 0 24 24" role="img" aria-label="love"><path fill="#ff5a79" d="M12 21s-8-5.2-8-11a4.6 4.6 0 018-3 4.6 4.6 0 018 3c0 5.8-8 11-8 11z" /></svg>
    ) : x.charCodeAt(0) === 0xd83c ? (
      <svg key={i} className="em" viewBox="0 0 24 24" aria-hidden="true"><path fill="#f93" d="M2 5h20v5H2z" /><path fill="#fff" d="M2 10h20v4H2z" /><path fill="#128807" d="M2 14h20v5H2z" /><circle cx="12" cy="12" r="1.6" fill="none" stroke="#008" strokeWidth=".8" /></svg>
    ) : x
  );
  return (
    <>
      <a className="skip" href="#main">{d.site.skip}</a>
      <header className="top dk">
        <div className="wrap top-in">
          <a href={L('/')} className="brand" aria-label={SITE.name + ' – ' + d.nav.home}>
            <Logo />
          </a>
          <input type="checkbox" id="nav-t" className="nav-t" aria-label={d.nav.menu} />
          <label htmlFor="nav-t" className="burger" aria-hidden="true"><span /><span /><span /></label>
          <nav className="nav" aria-label="Main">
            <div className="dd">
              <a href={L('/tools')} className="nl">{d.nav.tools} <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg></a>
              <div className="mega">
                <div>
                  <b>{d.nav.quickTools}</b>
                  {d.groups.quick.map((s) => <a key={s} href={L('/' + s)}><Icon name={s} size={16} />{t[s].name}</a>)}
                </div>
                <div>
                  <b>{d.nav.technical}</b>
                  {d.groups.technical.map((s) => <a key={s} href={L('/' + s)}><Icon name={s} size={16} />{t[s].name}</a>)}
                  {d.groups.business.map((s) => <a key={s} href={L('/' + s)}><Icon name={s} size={16} />{t[s].name}</a>)}
                </div>
                <div>
                  <b>{d.nav.guides || d.nav.subsidy}</b>
                  {[...guideTop, sizeLink(3), sizeLink(5)].map(([p, n]) => <a key={p} href={L(p)}>{n}</a>)}
                </div>
              </div>
            </div>
            <a href={L('/pm-surya-ghar-yojana')} className="nl">{d.nav.subsidy}</a>
            <a href={L('/states')} className="nl">{d.nav.states}</a>
            <a href={L('/solar-for')} className="nl">{d.nav.business}</a>
            <a href="/blog" className="nl">{d.nav.blog}</a>
            <details className="lang">
              <summary aria-label={d.nav.language}>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                {d.langName}
              </summary>
              <div className="lang-pop">
                {LANGS.map((l) => (
                  <a key={l.code} href={lp(localized ? base : '/', l.code)} hrefLang={l.htmlLang} lang={l.htmlLang} aria-current={l.code === lang ? 'true' : undefined}>{l.name}</a>
                ))}
              </div>
            </details>
            <a href={L('/get-solar-quote')} className="btn btn-line nav-cta">{d.nav.getQuote}</a>
            <a href={tel} className="btn btn-sun nav-call" data-cta="header-call" aria-label={u.callAvirat + ' ' + PARTNER.phone}>
              <Icon name="phone" size={16} /><span className="nc-l">{u.call}</span> <b>{PARTNER.phone}</b>
            </a>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="foot dk">
        <div className="wrap">
          <div className="f-top">
            <div className="f-brand">
              <Logo />
              <p>{d.site.footerAbout}</p>
            </div>
            <div className="f-pt">
              <PartnerLogo small />
              <div className="f-pt-n">
                <small>{d.common.partner}</small>{' '}
                <b>{PARTNER.legalName}</b>{' '}
                <span>{u.partnerLine}</span>
              </div>
              <div className="f-pt-c">
                <a className="f-tel" href={tel} data-cta="footer-call"><Icon name="phone" size={18} />{PARTNER.phone}</a>
                <a href={partnerWhatsApp()} target="_blank" rel="noopener" data-cta="footer-whatsapp">{u.whatsapp}</a>
                <a href={'mailto:' + PARTNER.email}>{PARTNER.email}</a>
                <a href={partnerLink('footer')} target="_blank" rel="noopener">aviratenergy.com <Icon name="ext" size={14} /></a>
              </div>
              <address>{PARTNER.address}</address>
            </div>
          </div>
          <div className="f-cols">
            <div>
              <h2>{d.nav.quickTools}</h2>
              {d.groups.quick.map((s) => <a key={s} href={L('/' + s)}>{t[s].name}</a>)}
              <a href={L('/states')}>{d.nav.allStates}</a>
            </div>
            <div>
              <h2>{d.nav.businessSolar}</h2>
              {['hospital', 'hotel', 'restaurant', 'warehouse', 'factory', 'school', 'housing-society'].map((s) => <a key={s} href={L('/solar-for/' + s)}>{d.segments[s].name}</a>)}
            </div>
            <div>
              <h2>{d.nav.technical}</h2>
              {d.groups.technical.slice(3).concat(d.groups.business).map((s) => <a key={s} href={L('/' + s)}>{t[s].name}</a>)}
              <h2 className="mt">{d.nav.schemes}</h2>
              <a href={L('/pm-surya-ghar-yojana')}>{d.nav.pmsg}</a>
              <a href={L('/pm-kusum-yojana')}>{d.nav.kusum}</a>
            </div>
            <div>
              <h2>{d.nav.guides || d.nav.subsidy}</h2>
              {guideAll.map(([p, n]) => <a key={p} href={L(p)}>{n}</a>)}
            </div>
            <div>
              <h2>{d.nav.states}</h2>
              {TOP_STATES.map((s) => <a key={s} href={L('/state/' + s)}>{stateName[s] || s}</a>)}
            </div>
            <div>
              <h2>{d.nav.company}</h2>
              <a href="/about">{d.nav.about}</a>
              <a href="/blog">{d.nav.blog}</a>
              <a href="/contact">{d.nav.contact}</a>
              <a href="/advertise">{d.nav.advertise}</a>
              <a href="/privacy-policy">{d.nav.privacy}</a>
              <a href="/terms">{d.nav.terms}</a>
              <a href="/disclaimer">{d.nav.disclaimer}</a>
              <h2 className="mt">{u.moreFromUs}</h2>
              <a href={NETWORK.mvpchecker.url} target="_blank" rel="noopener">{NETWORK.mvpchecker.name} <Icon name="ext" size={14} /></a>
              <a href={NETWORK.akdet.url} target="_blank" rel="noopener">akdet.com <Icon name="ext" size={14} /></a>
            </div>
          </div>
          <NetworkStrip d={d} compact />
          <div className="f-bot">
            <span>© {year} SolarToolsHub.com · {d.site.rights}</span>{' '}
            <span>{madeFor}</span>{' '}
            <span>{u.devBy} <a href={NETWORK.twocompo.url} target="_blank" rel="noopener">{NETWORK.twocompo.name}</a></span>
          </div>
        </div>
      </footer>

      <nav className="mbar" aria-label={u.quickContact}>
        <a className="mb-call" href={tel} data-cta="bar-call"><Icon name="phone" size={18} />{u.call}</a>
        <a className="mb-wa" href={partnerWhatsApp()} target="_blank" rel="noopener" data-cta="bar-whatsapp"><Icon name="wa" size={18} />{u.whatsapp}</a>
        <a className="mb-q" href={L('/get-solar-quote')} data-cta="bar-quote">{u.freeQuote}</a>
      </nav>
    </>
  );
}
