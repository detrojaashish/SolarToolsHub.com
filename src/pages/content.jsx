import { Breadcrumbs, Faq, Cta, AdSlot, PageHead, ToolCard } from '../components/ui.jsx';
import { POSTS } from '../data/posts.js';
import { partnerLink, partnerWhatsApp, PARTNER, SITE, NETWORK } from '../config.js';
import { GuideLinks, GUIDE } from './guides.jsx';

const dateFmt = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export function BlogIndex({ d }) {
  const b = d.blogPage;
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: '/' }, { name: d.nav.blog }]} />
      <PageHead h1={b.h1} lead={b.lead} />
      <div className="posts">
        {POSTS.map((p) => (
          <a key={p.slug} className="post-c" href={'/blog/' + p.slug}>
            <span className="pc-cat">{p.category}</span>
            <h2>{p.title}</h2>
            <p>{p.excerpt}</p>
            <small>{dateFmt(p.updated || p.date)} · {p.readMins} {b.minRead}</small>
          </a>
        ))}
      </div>
      <AdSlot d={d} />
      <Cta d={d} campaign="blog" />
      <GuideLinks d={d} lang="en" />
    </div>
  );
}

const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** adds id="…" to every <h2> and returns the list for the "On this page" links */
function withAnchors(html) {
  const toc = [];
  const seen = {};
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    let id = slugify(inner) || 'section';
    if (seen[id]) id += '-' + ++seen[id];
    else seen[id] = 1;
    toc.push({ id, text: inner.replace(/<[^>]+>/g, '') });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

function splitForAd(html) {
  // place an ad after roughly the middle h2 (keeps content first for readers)
  const parts = html.split('<h2');
  if (parts.length < 4) return [html, ''];
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join('<h2'), '<h2' + parts.slice(mid).join('<h2')];
}

export function BlogPost({ d, p }) {
  const { html, toc } = withAnchors(p.html);
  const [a, b] = splitForAd(html);
  const related = (p.related ? p.related.map((s) => POSTS.find((x) => x.slug === s)).filter(Boolean) : POSTS.filter((x) => x.slug !== p.slug && x.category === p.category).concat(POSTS.filter((x) => x.slug !== p.slug && x.category !== p.category))).slice(0, 3);
  // the intro (everything before the first h2) stays above the contents list
  const cut = a.indexOf('<h2');
  const intro = cut > 0 ? a.slice(0, cut) : '';
  const rest = cut > 0 ? a.slice(cut) : a;
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: '/' }, { name: d.nav.blog, href: '/blog' }, { name: p.title }]} />
      <div className="cols">
        <article className="prose post">
          <header className="post-h">
            <span className="pc-cat">{p.category}</span>
            <h1>{p.title}</h1>
            <p className="meta">{d.common.lastUpdated}: <time dateTime={p.updated || p.date}>{dateFmt(p.updated || p.date)}</time> · {p.readMins} {d.blogPage.minRead} · <a href="/about">SolarToolsHub Team</a></p>
          </header>
          {intro && <div dangerouslySetInnerHTML={{ __html: intro }} />}
          {toc.length > 2 && (
            <nav aria-label={d.common.onThisPage}>
              <p><strong>{d.common.onThisPage}</strong></p>
              <ul className="links">{toc.map((t) => <li key={t.id}><a href={'#' + t.id}>{t.text}</a></li>)}</ul>
            </nav>
          )}
          <div dangerouslySetInnerHTML={{ __html: rest }} />
          <AdSlot d={d} format="fluid" />
          {b && <div dangerouslySetInnerHTML={{ __html: b }} />}
          <Faq items={p.faqs} title={d.common.faqTitle} />
          <p className="disc">{d.common.notGovt} {d.common.disclaimerShort}</p>
        </article>
        <aside className="side">
          <h2 className="side-h">{d.home.quickTitle}</h2>
          <div className="side-list">{(p.tools || ['solar-calculator', 'solar-subsidy-calculator', 'solar-system-price-estimator']).map((s) => <ToolCard key={s} slug={s} d={d} lang="en" />)}</div>
          <a className="side-link" href={GUIDE.hub}>{d.nav.priceList}</a>
          <a className="side-link" href={GUIDE.apply}>{d.nav.applyOnline}</a>
        </aside>
      </div>
      <Cta d={d} campaign={'blog-' + p.slug} />
      <section className="sec">
        <h2>{d.home.blogTitle}</h2>
        <div className="posts">
          {related.map((r) => (
            <a key={r.slug} className="post-c" href={'/blog/' + r.slug}>
              <span className="pc-cat">{r.category}</span>
              <h3>{r.title}</h3>
              <p>{r.excerpt}</p>
            </a>
          ))}
        </div>
      </section>
      <GuideLinks d={d} lang="en" />
    </div>
  );
}

// ─── Static (English) pages required for trust & AdSense ─────────────
const host = SITE.url.replace('https://', '');
const DEV = NETWORK.twocompo;
const MVP = NETWORK.mvpchecker; // "A project by MVPChecker"
const UPDATED = '22 November 2026';
const ext = (href, text, nofollow = false) => `<a href="${href}" target="_blank" rel="noopener${nofollow ? ' nofollow' : ''}">${text}</a>`;
const devLink = ext(DEV.url, DEV.name);
const byLine = 'a project by ' + ext(MVP.url, MVP.name) + ', developed and maintained by ' + devLink;
const devSites = ext(DEV.url, 'twocompo.com') + ' or ' + ext(MVP.url, 'mvpchecker.com');
const partnerSite = (c) => ext(partnerLink(c), 'aviratenergy.com');

/** Full partner contact block – call first, then WhatsApp, email, website, address */
const partnerBlock = (campaign) => `<ul class="links">
<li><strong>Phone (fastest):</strong> <a href="tel:${PARTNER.tel}">${PARTNER.phone}</a></li>
<li><strong>WhatsApp:</strong> ${ext(partnerWhatsApp(), 'Chat with ' + PARTNER.name + ' on WhatsApp')}</li>
<li><strong>Email:</strong> <a href="mailto:${PARTNER.email}">${PARTNER.email}</a></li>
<li><strong>Website:</strong> ${partnerSite(campaign)}</li>
<li><strong>Address:</strong> ${PARTNER.legalName}, ${PARTNER.address}</li>
<li><strong>Offices:</strong> ${PARTNER.branches.join('; ')}</li>
</ul>`;

export const STATIC = {
  about: {
    title: 'About SolarToolsHub – Free Solar Calculators for India',
    description: 'SolarToolsHub is an independent website with free solar calculators and subsidy guides for India. Who runs it, how we calculate and how we are funded.',
    h1: 'About SolarToolsHub',
    html: `<p>SolarToolsHub.com is an independent information website that helps people across India plan rooftop solar with confidence. We publish free calculators for system size, price, subsidy, savings, loans and engineering checks, and plain-language guides to government schemes such as PM Surya Ghar Muft Bijli Yojana and PM-KUSUM – in English, Hindi, Gujarati and Marathi.</p>
<p><strong>SolarToolsHub is not a government website.</strong> We do not accept subsidy applications or payments. The only official portal for the rooftop solar subsidy is ${ext('https://pmsuryaghar.gov.in', 'pmsuryaghar.gov.in', true)}.</p>
<h2>What you will find here</h2>
<ul><li><strong>15 free calculators</strong> for homeowners, housing societies, businesses, installers and engineers – from a simple <a href="/solar-calculator">solar calculator</a> and <a href="/solar-subsidy-calculator">subsidy calculator</a> to string sizing and cable sizing.</li><li><strong>Price guides</strong> – a <a href="${GUIDE.hub}">solar panel price list</a> and size-wise pages from 1 kW to 10 kW that use the same maths as the calculators.</li><li><strong>State guides</strong> – tariff, DISCOMs, net-metering rules and any extra state subsidy for all <a href="/states">28 states and 8 union territories</a>.</li><li><strong>Scheme guides and articles</strong> – how to <a href="${GUIDE.apply}">apply online</a>, what the rules say, and how to judge an installer's quote, in our <a href="/blog">blog</a>.</li></ul>
<h2>How we calculate</h2>
<p>Every number on the site comes from one shared set of formulas, so a price on a guide page matches what the calculator shows.</p>
<ul><li><strong>Subsidy</strong> – the central financial assistance slabs published by the Ministry of New and Renewable Energy (MNRE) for PM Surya Ghar: ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, with 10% more in special-category states. State top-ups are taken from state government and DISCOM notifications; each state page says how firmly a figure is confirmed.</li><li><strong>Prices</strong> – typical installed prices for systems with DCR panels, including GST, reviewed against published installer prices and quotations. They are ranges, not offers.</li><li><strong>Generation</strong> – average units per kW per day for each state, based on solar irradiance data and typical system losses.</li><li><strong>Savings and payback</strong> – your state's average residential tariff, a 3% yearly tariff increase, 0.5% yearly panel degradation and 1% yearly maintenance, unless you change them.</li></ul>
<p>Tariffs, subsidies and prices change. We review the data regularly – this page and the data behind the calculators were last reviewed on ${UPDATED} – but you should always confirm final figures with your DISCOM and installer. If you spot a figure that is out of date, please tell us through the websites listed below.</p>
<h2>How the site is funded</h2>
<p>The calculators are free and need no login. The site is paid for in two ways, and we want you to know both:</p>
<ul><li><strong>Advertising.</strong> Pages may show advertisements, clearly labelled “Advertisement”, served by Google AdSense. Advertisers have no say in our content.</li><li><strong>Partner referrals.</strong> When you call, message or visit our installation partner from this site, we may receive a referral benefit. This does not change the price you pay, and you are free to choose any registered installer.</li></ul>
<h2>Installation partner – ${PARTNER.legalName}</h2>
<p>SolarToolsHub does not sell or install solar systems. For site surveys, quotations, subsidy paperwork and installation we refer readers to ${PARTNER.legalName}, which supplies and installs rooftop solar for homes and businesses across India.</p>
${partnerBlock('about')}
<h2>Who builds and maintains SolarToolsHub</h2>
<p>SolarToolsHub is ${byLine}. For anything about the website itself – corrections, technical problems, advertising or partnerships – please contact the team through ${devSites}.</p>
<h2>Other calculators</h2>
<p>Need more calculators – EMI, SIP, FD, PPF, income tax, GST and many others? Visit ${ext(NETWORK.akdet.all, 'akdet.com')}.</p>`,
  },
  contact: {
    title: 'Contact Us – SolarToolsHub & Avirat Energy',
    description: `Solar quote or installation: call Avirat Energy on ${PARTNER.phone}. Website, corrections and ads: contact the team via twocompo.com or mvpchecker.com.`,
    h1: 'Contact us',
    html: `<p>Thank you for using SolarToolsHub. Please pick the right contact below so that your message reaches the people who can help.</p>
<h2>Solar quotes, site surveys and installation</h2>
<p>SolarToolsHub is an information website – we do not install solar ourselves. All solar enquiries (quotation, site survey, PM Surya Ghar subsidy paperwork, installation, service) are handled by our installation partner <strong>${PARTNER.legalName}</strong>, which serves customers across India. Calling is the fastest way to get an answer.</p>
${partnerBlock('contact')}
<h2>Website, corrections and technical issues</h2>
<p>SolarToolsHub is ${byLine}. If a calculator misbehaves, a tariff or subsidy figure looks out of date, or you have a suggestion for a new tool, please write to the team through ${devSites} and mention “SolarToolsHub” and the page address.</p>
<h2>Advertising and partnerships</h2>
<p>For advertising, sponsorship or data partnerships, see <a href="/advertise">Advertise with us</a> and contact the team through ${devSites}.</p>
<h2>Privacy requests</h2>
<p>Our calculators do not collect personal data. If you still have a question or request about your data, see the <a href="/privacy-policy">Privacy Policy</a> and reach the team through ${devSites}.</p>
<h2>Please note</h2>
<ul><li>We are <strong>not a government office</strong> and cannot check, approve or speed up a subsidy application. For that, log in at ${ext('https://pmsuryaghar.gov.in', 'pmsuryaghar.gov.in', true)}, call the scheme helpline 15555 or contact your DISCOM.</li><li>We never ask for a registration fee, OTP or bank details.</li><li>Need more calculators? Visit ${ext(NETWORK.akdet.all, 'akdet.com')}.</li></ul>`,
  },
  advertise: {
    title: 'Advertise With Us – Reach Solar Buyers in India',
    description: 'Advertise solar products and services to people actively planning rooftop solar in India. Formats, audience and our advertising rules on SolarToolsHub.',
    h1: 'Advertise with SolarToolsHub',
    html: `<p>SolarToolsHub is used by homeowners, housing societies, businesses and installers who are planning a rooftop solar system right now – sizing it, checking the subsidy, comparing prices and verifying quotes. The site is available in English, Hindi, Gujarati and Marathi and covers every state and union territory.</p>
<h2>Who uses the site</h2>
<ul><li><strong>Homeowners</strong> checking size, price, subsidy and payback before they call an installer.</li><li><strong>Businesses and institutions</strong> comparing CAPEX and OPEX and estimating savings.</li><li><strong>Installers and engineers</strong> using the proposal generator, string-sizing and cable-sizing tools in their daily work.</li></ul>
<h2>What we can offer</h2>
<ul><li>Display advertising on calculator, guide and state pages.</li><li>Sponsorship of a calculator or a state guide, clearly marked as sponsored.</li><li>Brand information for manufacturers of panels, inverters, batteries and mounting structures.</li></ul>
<h2>Where advertisements appear</h2>
<p>Advertisements are placed inside the page content, below the calculator or the first section of a guide – never above the page heading, never next to a button, menu or form control, and never in a pop-up. Each one sits in a reserved box under the word “Advertisement”, so the page does not jump while it loads. We keep the number of advertisements per page low, because the calculators have to stay quick on a mobile phone.</p>
<h2>Our advertising rules</h2>
<ul><li>Advertisements are always labelled and kept separate from our content.</li><li>Advertisers and sponsors do not influence calculator results, price ranges or subsidy information.</li><li>We do not accept advertisements that imitate government portals, promise guaranteed subsidies or ask users for registration fees.</li><li>Installation enquiries from the site go to our installation partner, ${PARTNER.legalName}; this relationship is disclosed on every page.</li></ul>
<h2>Get in touch</h2>
<p>Advertising on SolarToolsHub is handled by the team behind the site – ${byLine}. Please contact them through ${devSites} with your brand, the pages or states you are interested in and your timeline.</p>
<p>Looking for a solar installer instead? Call ${PARTNER.legalName} on <a href="tel:${PARTNER.tel}">${PARTNER.phone}</a> or see <a href="/get-solar-quote">Get a free solar quote</a>.</p>`,
  },
  'privacy-policy': {
    title: 'Privacy Policy – SolarToolsHub',
    description: 'How SolarToolsHub.com handles your data: calculators that run in your browser, Google AdSense advertising cookies, analytics, opt-outs and your rights.',
    h1: 'Privacy Policy',
    html: `<p><em>Last updated: ${UPDATED}</em></p>
<p>This Privacy Policy explains what information is processed when you use ${host} (“SolarToolsHub”, “the website”, “we”). The website is ${byLine}. In short: our calculators work in your browser and we do not ask you to create an account or give us personal details.</p>
<h2>Information you enter into calculators</h2>
<p>The numbers and text you type into a calculator – bill amount, system size, a customer name on a proposal and so on – are processed <strong>in your browser only</strong>. They are not sent to or stored on our servers. PDF reports are generated on your own device. We do not use first-party cookies or browser storage to remember what you entered.</p>
<h2>Information collected automatically</h2>
<p>Like every website, the servers and content-delivery network that host SolarToolsHub automatically process technical data such as your IP address, browser type, device type, the page requested and the date and time. This is used to deliver the pages, keep the service secure and understand overall traffic. We do not use it to identify you.</p>
<h2>Advertising – Google AdSense and cookies</h2>
<p>We use Google AdSense to show advertisements. Please note:</p>
<ul><li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</li><li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.</li><li>You may opt out of personalised advertising by visiting ${ext('https://www.google.com/settings/ads', 'Google Ads Settings', true)}. You can also opt out of some third-party vendors' use of cookies for personalised advertising at ${ext('https://www.aboutads.info/choices/', 'www.aboutads.info', true)}.</li><li>Google and its advertising partners may collect or receive information such as your IP address, cookie identifiers and device information from this website. See ${ext('https://policies.google.com/technologies/partner-sites', 'how Google uses information from sites that use its services', true)} and ${ext('https://policies.google.com/technologies/ads', "Google’s advertising policies", true)}.</li></ul>
<p>Where the law requires your consent for advertising cookies or personalised ads, a consent message will ask for your choice before they are used, and you can change that choice at any time. If you decline, you may still see ads, but they will not be based on your interests.</p>
<h2>Analytics</h2>
<p>We may use Google Analytics to count visits and see which pages are useful. It uses cookies or similar identifiers and reports to us only in aggregate. You can install the ${ext('https://tools.google.com/dlpage/gaoptout', 'Google Analytics opt-out browser add-on', true)} to prevent your visits being counted.</p>
<h2>Managing cookies</h2>
<p>You can block or delete cookies in your browser settings. The calculators keep working without cookies.</p>
<h2>When you contact our installation partner</h2>
<p>Buttons such as “Call”, “WhatsApp” and “Visit website” connect you directly to ${PARTNER.legalName}. Tapping them opens your phone dialler, WhatsApp or their website; SolarToolsHub does not receive your phone number or your message. Whatever you share with ${PARTNER.name} is handled under their own privacy policy. Links to their website carry a campaign tag that tells them the visit came from SolarToolsHub – it contains no personal information.</p>
<h2>Links to other websites</h2>
<p>We link to government portals, to ${ext(MVP.url, 'mvpchecker.com')} and ${ext(DEV.url, 'twocompo.com')}, to ${ext(NETWORK.akdet.url, 'akdet.com')} for more calculators, and to other sources. Their privacy policies apply once you leave this website.</p>
<h2>Sharing and retention</h2>
<p>We do not sell personal data. Technical logs are kept by our hosting providers for a limited period for security and troubleshooting and are then deleted or anonymised. Advertising and analytics data are retained by Google according to its own policies.</p>
<h2>Children</h2>
<p>The website is meant for adults who make decisions about an electricity connection. We do not knowingly collect personal data from children under 18.</p>
<h2>Your rights under Indian law</h2>
<p>Under the Digital Personal Data Protection Act, 2023 and the rules made under it, you have the right to obtain information about personal data being processed, to have it corrected or erased, to withdraw consent, to nominate another person to exercise your rights and to have a grievance addressed. Because our tools do not collect personal data, in most cases we hold none about you. To make a request or raise a grievance, contact the team through ${devSites} and mention “SolarToolsHub privacy”. If you are not satisfied with the response, you may approach the Data Protection Board of India.</p>
<h2>Changes to this policy</h2>
<p>We may update this policy when our practices or the law change. The current version is always on this page, with the date of the last update at the top.</p>`,
  },
  terms: {
    title: 'Terms & Conditions – SolarToolsHub',
    description: 'Terms of use for SolarToolsHub.com: free solar calculators and guides for information only, no professional advice, third-party services and liability.',
    h1: 'Terms & Conditions',
    html: `<p><em>Last updated: ${UPDATED}</em></p>
<p>By using ${host} (“SolarToolsHub”, “the website”) you agree to these terms. If you do not agree, please do not use the website.</p>
<h2>1. What the website is</h2>
<p>SolarToolsHub is an independent information website with free solar calculators, guides and articles. It is not a government website and is not affiliated with the Ministry of New and Renewable Energy, any state agency or any DISCOM. It does not sell or install solar systems.</p>
<h2>2. Using the calculators and content</h2>
<p>You may use the calculators and read the content free of charge for your own personal or business planning, and installers may use the tools and PDF reports in their work with customers. You may not copy or republish substantial parts of the website, scrape it in bulk, or present its content as your own without written permission.</p>
<h2>3. Estimates, not advice</h2>
<p>All results – system size, price, subsidy, generation, savings, payback, EMI, cable and string sizes – are estimates based on typical conditions and published rules. They are not engineering, financial, tax or legal advice and are not an offer to sell. Before you buy, get a site survey and a written quotation from a qualified installer, and have electrical designs checked by a competent engineer.</p>
<h2>4. Government schemes</h2>
<p>Subsidy rules, tariffs and procedures are set by the government and can change without notice. Eligibility and the amount you receive are decided only by the authorities through the official portal. We are not responsible for an application being delayed or rejected.</p>
<h2>5. Installation partner and other third parties</h2>
<p>The website refers solar enquiries to ${PARTNER.legalName} and may receive a referral benefit. Any quotation, contract, payment, installation or warranty is strictly between you and the installer you choose. Links to government portals and other websites are provided for convenience; we do not control and are not responsible for their content or services.</p>
<h2>6. Advertising</h2>
<p>The website may display third-party advertisements. An advertisement is not a recommendation by SolarToolsHub, and we are not responsible for the products or claims of advertisers.</p>
<h2>7. Intellectual property</h2>
<p>The design, text, calculators and code of the website belong to its owner and developer. Names and logos of third parties, including ${PARTNER.name}, belong to their respective owners.</p>
<h2>8. Limitation of liability</h2>
<p>The website is provided “as is”, without warranties of any kind. To the extent permitted by law, SolarToolsHub, ${DEV.name} and ${MVP.name} are not liable for any loss or damage arising from the use of, or reliance on, the website, its calculators or its content.</p>
<h2>9. Changes and governing law</h2>
<p>We may change the website or these terms at any time; the date at the top shows the latest version. These terms are governed by the laws of India, and the courts of competent jurisdiction in India will have jurisdiction over any dispute.</p>
<h2>10. Contact</h2>
<p>Questions about these terms can be sent to the team through ${devSites}. See also our <a href="/privacy-policy">Privacy Policy</a> and <a href="/disclaimer">Disclaimer</a>.</p>`,
  },
  disclaimer: {
    title: 'Disclaimer – SolarToolsHub Is Not a Government Website',
    description: 'SolarToolsHub is an independent website, not a government portal. Calculator results, subsidy amounts and prices are estimates. Partner and ad disclosure.',
    h1: 'Disclaimer',
    html: `<p><em>Last updated: ${UPDATED}</em></p>
<p>The information on SolarToolsHub.com is published in good faith for general information only. Please read the points below before you rely on anything on this website.</p>
<h2>Not a government website</h2>
<p>SolarToolsHub is a privately run, independent website. It is <strong>not</strong> the official website of PM Surya Ghar Muft Bijli Yojana, PM-KUSUM, the Ministry of New and Renewable Energy (MNRE) or any state agency or DISCOM, and it is not affiliated with or endorsed by them. We do not accept applications, documents, fees or OTPs. The official portals are ${ext('https://pmsuryaghar.gov.in', 'pmsuryaghar.gov.in', true)} and ${ext('https://pmkusum.mnre.gov.in', 'pmkusum.mnre.gov.in', true)}.</p>
<h2>Estimates only</h2>
<ul><li><strong>Calculators:</strong> system sizes, prices, savings, payback, EMI and generation figures are estimates based on typical conditions. Your actual results depend on your roof, shading, equipment, usage and tariff.</li><li><strong>Prices:</strong> price ranges are indicative market prices, not quotations or offers.</li><li><strong>Subsidies:</strong> amounts follow the PM Surya Ghar guidelines and the state notifications known to us on the date shown. Schemes change and state funds can run out; eligibility is decided only by the authorities.</li><li><strong>Tariffs:</strong> electricity tariffs are approximate averages and vary by slab, DISCOM and consumer category.</li><li><strong>Technical tools:</strong> string, cable, inverter and battery results are aids for trained people. Final designs must follow the applicable standards and the manufacturer's datasheets.</li></ul>
<h2>Installation partner disclosure</h2>
<p>${PARTNER.legalName} is our installation partner. “Call”, “WhatsApp” and “Get quote” buttons on this website connect you to them, and we may receive a referral benefit for enquiries. Any purchase is a contract between you and the installer; SolarToolsHub is not a party to it and gives no warranty for products or workmanship. You are free to use any installer registered with your DISCOM.</p>
<h2>Advertising disclosure</h2>
<p>This website may show advertisements from Google AdSense and other advertisers, labelled “Advertisement”. Advertisers do not influence our calculators or content, and an advertisement is not an endorsement.</p>
<h2>External links</h2>
<p>We link to official portals and other sources to help you verify information. We are not responsible for the content of external websites.</p>
<h2>No liability</h2>
<p>We work to keep the information accurate and current, but we make no warranty that it is complete or error-free, and we accept no liability for decisions made on the basis of this website. See the full <a href="/terms">Terms &amp; Conditions</a>.</p>
<p>The website is ${byLine}. To report an error, contact the team through ${devSites}.</p>`,
  },
};

export function StaticPage({ d, slug }) {
  const pg = STATIC[slug];
  return (
    <div className="wrap">
      <Breadcrumbs d={d} items={[{ name: d.nav.home, href: '/' }, { name: pg.h1 }]} />
      <article className="prose wide static">
        <h1>{pg.h1}</h1>
        <div dangerouslySetInnerHTML={{ __html: pg.html }} />
      </article>
      {(slug === 'contact' || slug === 'about') && <Cta d={d} campaign={slug} />}
    </div>
  );
}
