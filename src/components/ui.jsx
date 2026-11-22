// Static (server-only) UI building blocks.
import { SITE, PARTNER, NETWORK, partnerLink, partnerWhatsApp } from '../config.js';
import { lp } from '../i18n/index.js';

export const ICONS = {
  'solar-calculator': 'M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4M12 7a5 5 0 100 10 5 5 0 000-10z',
  'solar-subsidy-calculator': 'M6 4h12M6 9h12M6 4h3.5a4.5 4.5 0 010 9H6l7.5 8',
  'solar-system-price-estimator': 'M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8zM7 7h.01',
  'solar-quote-checker': 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
  'solar-roi-calculator': 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  'solar-emi-calculator': 'M3 5h18v14H3zM3 10h18M7 15h4',
  'solar-inverter-size-calculator': 'M4 4h16v16H4zM9 9h6v6H9zM9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 5h3M1 9h3m-3 5h3',
  'solar-battery-calculator': 'M2 7h16v10H2zM22 11v2M6 10v4m4-4v4',
  'solar-load-calculator': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'roof-area-calculator': 'M3 11l9-8 9 8M5 10v10h14V10M9 20v-6h6v6',
  'solar-string-sizing-calculator': 'M4 6h6v12H4zM14 6h6v12h-6zM10 12h4',
  'solar-wire-size-calculator': 'M3 12c3-6 6 6 9 0s6 6 9 0',
  'ev-charging-cost-calculator': 'M5 17h14l-1.5-6.5A2 2 0 0015.6 9H8.4a2 2 0 00-1.9 1.5L5 17zm0 0v2m14-2v2M7 14h.01M17 14h.01M12 2l-2 4h4l-2 4',
  'opex-vs-capex-calculator': 'M12 3v18M3 7h7M3 12h7M14 9l3-3 3 3M14 15l3 3 3-3',
  'solar-proposal-generator': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5',
  state: 'M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  arrow: 'M5 12h14m-6-6l6 6-6 6',
  check: 'M20 6L9 17l-5-5',
  building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1M9 13h1m4 0h1M9 17h1m4 0h1',
  leaf: 'M11 20A7 7 0 014 13c0-6 8-10 16-10 0 8-4 16-10 16zM4 21c3-3 6-6 9-8',
  phone: 'M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z',
  wa: 'M20.5 11.6a8.5 8.5 0 01-12.7 7.4L3.5 20.5l1.5-4.2A8.5 8.5 0 1120.5 11.6zM9.3 8.2c-.5 3.2 2.9 6.7 6.3 6.5',
  mail: 'M3 5h18v14H3zM3 7l9 6 9-6',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5',
  wallet: 'M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0V6a2 2 0 012-2h11M16 13.5h.01',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 7v5l3 2',
};

export function Icon({ name, size = 22, className = '' }) {
  return (
    <svg className={'ic ' + className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name] || ICONS.arrow} />
    </svg>
  );
}

/** Brand mark: three PV cells + one sun in a 2×2 grid. Cells use currentColor so it works on any surface. */
export function Logo() {
  return (
    <span className="logo">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d="M1 4a3 3 0 013-3h7a3 3 0 013 3v7a3 3 0 01-3 3H4a3 3 0 01-3-3zM1 21a3 3 0 013-3h7a3 3 0 013 3v7a3 3 0 01-3 3H4a3 3 0 01-3-3zM18 21a3 3 0 013-3h7a3 3 0 013 3v7a3 3 0 01-3 3h-7a3 3 0 01-3-3z" />
        <circle cx="24.5" cy="7.5" r="6.5" fill="#ffd400" />
      </svg>
      <span>Solar<b>ToolsHub</b></span>
    </span>
  );
}

/** Turns the partner phone number inside a sentence into a tel: link (the rest of the text is returned unchanged). */
export function linkPhone(text) {
  const s = String(text == null ? '' : text);
  if (!s.includes(PARTNER.phone)) return s;
  return s.split(PARTNER.phone).flatMap((part, i) => (i ? [<a key={i} className="tel" href={'tel:' + PARTNER.tel}>{PARTNER.phone}</a>, part] : [part]));
}

export function Breadcrumbs({ items, d }) {
  return (
    <nav className="crumbs dk" aria-label={d.common.breadcrumb}>
      <ol>
        {items.map((it, i) => (
          <li key={i}>{it.href && i < items.length - 1 ? <a href={it.href}>{it.name}</a> : <span aria-current="page">{it.name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function Faq({ items, title }) {
  if (!items || !items.length) return null;
  return (
    <section className="faq" id="faq">
      <h2>{title}</h2>
      {items.map((f, i) => (
        <details key={i} open={i === 0}>
          <summary>{f.q}</summary>
          <p>{linkPhone(f.a)}</p>
        </details>
      ))}
    </section>
  );
}

/** All designer strings: short ones (d.ux.*) + page-only ones (d.ux.pg.*). */
export const ux = (d) => ({ ...d.ux, ...d.ux.pg });

const same = (arr, ref) => (Array.isArray(arr) && arr.length === ref.length ? arr : null);
/** Partner facts in the page language (config holds the English originals). */
export function partnerFacts(d) {
  const u = ux(d);
  const labels = same(u.pStats, PARTNER.stats);
  return {
    stats: PARTNER.stats.map(([v, l], i) => [v, labels ? labels[i] : l]),
    services: same(u.pServices, PARTNER.services) || PARTNER.services,
    branches: same(u.pBranches, PARTNER.branches) || PARTNER.branches,
  };
}

/** Avirat Energy logo on a light chip (the PNG has dark-grey text). */
export function PartnerLogo({ small }) {
  return (
    <span className={'p-logo' + (small ? ' sm' : '')}>
      <img src={PARTNER.logo} alt={PARTNER.legalName} width={small ? 98 : 137} height={small ? 40 : 56} loading="lazy" decoding="async" />
    </span>
  );
}

/** Call-first action slab: big tap-to-call number, WhatsApp, website. */
export function PartnerCall({ d, campaign = 'partner' }) {
  const u = ux(d);
  return (
    <div className="pb-call">
      <span className="pb-k">{u.talkTitle}</span>{' '}
      <a className="pb-tel" href={'tel:' + PARTNER.tel} data-cta={campaign + '-call'}>{PARTNER.phone}</a>{' '}
      <span className="pb-s">{u.talkSub}</span>{' '}
      <div className="pb-btns">
        <a className="btn btn-ink" href={'tel:' + PARTNER.tel} data-cta={campaign + '-call-btn'}><Icon name="phone" size={18} />{u.callNow}</a>
        <a className="btn btn-paper" href={partnerWhatsApp()} target="_blank" rel="noopener" data-cta={campaign + '-whatsapp'}><Icon name="wa" size={18} />{u.whatsapp}</a>
      </div>
      <a className="pb-web" href={partnerLink(campaign)} target="_blank" rel="noopener">{u.visitSite}: aviratenergy.com <Icon name="ext" size={14} /></a>
    </div>
  );
}

/** Contact details list (email, address, offices, socials). */
export function PartnerInfo({ d }) {
  const u = ux(d);
  const f = partnerFacts(d);
  return (
    <dl className="pb-info">
      <div><dt>{u.email}</dt> <dd><a href={'mailto:' + PARTNER.email}>{PARTNER.email}</a></dd></div>
      <div><dt>{u.address}</dt> <dd>{PARTNER.address}</dd></div>
      <div><dt>{u.branches}</dt> <dd>{f.branches.map((b) => <span key={b}>{b} </span>)}</dd></div>
      <div><dt>{u.follow}</dt><dd className="pb-soc">{Object.entries(PARTNER.social).map(([k, v]) => <a key={k} href={v} target="_blank" rel="noopener">{k[0].toUpperCase() + k.slice(1)} </a>)}</dd></div>
    </dl>
  );
}

/**
 * Reusable Avirat Energy block.
 * variant "compact" – headline + call slab (used by <Cta> on every page)
 * variant "full"    – adds stats, services and contact details (home, quote page); children replace the stats/services
 */
export function Partner({ d, variant = 'compact', campaign = 'partner', title, text, id, children }) {
  const u = ux(d);
  const full = variant === 'full';
  const f = partnerFacts(d);
  return (
    <section className={'pb dk' + (full ? ' pb-full' : '')} id={id}>
      <div className="pb-main">
        <div className="pb-id">
          <PartnerLogo />
          <span><small>{d.common.partner}</small> <b>{PARTNER.legalName}</b></span>
        </div>
        <h2>{title || u.pTitle}</h2>
        <p>{linkPhone(text || u.pText)}</p>
        {children}
        {full && !children && (
          <>
            <ul className="pb-stats">{f.stats.map(([v, l]) => <li key={l}><b>{v}</b> <span>{l}</span></li>)}</ul>
            <h3>{u.pServicesTitle}</h3>
            <ul className="pb-svc">{f.services.map((s) => <li key={s}>{s}</li>)}</ul>
          </>
        )}
      </div>
      <div className="pb-side">
        <PartnerCall d={d} campaign={campaign} />
        {full && !children && <PartnerInfo d={d} />}
      </div>
    </section>
  );
}

export function Cta({ d, campaign = 'page' }) {
  return <Partner d={d} campaign={campaign} title={d.common.ctaTitle} text={d.common.ctaText} />;
}

/** Secondary block: "Need more calculators? Visit akdet.com" – links only (we build only solar tools here). */
export function NetworkStrip({ d, compact }) {
  const u = ux(d);
  const a = NETWORK.akdet;
  return (
    <aside className={'net' + (compact ? ' net-sm' : '')} aria-label={u.nonSolarTitle}>
      <div className="net-t">
        <b>{u.nonSolarTitle}</b>{' '}
        {!compact && <span>{u.nonSolarText}</span>}
      </div>
      <ul>
        {a.tools.map(([n, href]) => <li key={href}><a href={href} target="_blank" rel="noopener">{n}</a>{' '}</li>)}
        <li><a className="net-all" href={a.all} target="_blank" rel="noopener">{u.allCalcs} <Icon name="ext" size={14} /></a></li>
      </ul>
    </aside>
  );
}

// Layout QA only: `AD_DEMO=1 OUT=dist-design npm run build` draws placeholder boxes with the reserved ad size.
const AD_DEMO = typeof process !== 'undefined' && !!(process.env && process.env.AD_DEMO);

/**
 * Ad slot – renders only when an AdSense client id is configured.
 * The unit has a fixed, CSS-reserved height per breakpoint (no CLS) and carries the "Advertisement" label.
 */
export function AdSlot({ d, format = 'auto', slot = '' }) {
  if (!SITE.adsenseClient && !AD_DEMO) return null;
  const fixed = format === 'auto';
  return (
    <aside className={'ad' + (fixed ? '' : ' ad-fluid')} aria-label={d.common.advert}>
      <span className="ad-l">{d.common.advert}</span>
      {SITE.adsenseClient ? (
        <ins className="adsbygoogle ad-u" data-ad-client={SITE.adsenseClient} data-ad-slot={slot || undefined} data-ad-format={fixed ? undefined : format} />
      ) : (
        <div className="ad-u ad-demo" />
      )}
    </aside>
  );
}

export function ToolCard({ slug, d, lang, feature, n }) {
  const tl = d.tools[slug];
  return (
    <a className={'tcard' + (feature ? ' feat' : '')} href={lp('/' + slug, lang)}>
      <span className="tc-ic"><Icon name={slug} size={feature ? 30 : 22} /></span>
      <span className="tc-t">{tl.name}</span>{' '}
      <span className="tc-d">{feature ? tl.description || tl.short : tl.short}</span>{' '}
      {feature && <span className="tc-go">{d.common.open} <Icon name="arrow" size={16} /></span>}
      {n ? <span className="tc-n" aria-hidden="true">{String(n).padStart(2, '0')}</span> : <Icon name="arrow" size={16} className="tc-a" />}
    </a>
  );
}

export function PageHead({ kicker, h1, lead, children, dock }) {
  return (
    <header className={'phead dk' + (dock ? ' dock' : '')}>
      {kicker && <span className="kicker">{kicker}</span>}
      <h1>{h1}</h1>
      {lead && <p className="lead">{linkPhone(lead)}</p>}
      {children}
    </header>
  );
}

/** Three-point explainer for non-technical readers: what you pay, what you save, when you recover it. */
export function ReadGuide({ d }) {
  const u = ux(d);
  const ic = ['wallet', 'solar-roi-calculator', 'clock'];
  return (
    <section className="rg" aria-label={u.readTitle}>
      <h2>{u.readTitle}</h2>
      <ol>
        {u.read.map((x, i) => <li key={i}><Icon name={ic[i]} size={20} /><b>{x.t}</b> <span>{x.d}</span></li>)}
      </ol>
    </section>
  );
}
