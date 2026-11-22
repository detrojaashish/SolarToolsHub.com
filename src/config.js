// ─── Site configuration ─────────────────────────────────────────────
// Change these values before going live.
export const SITE = {
  url: 'https://solartoolshub.com', // no trailing slash
  name: 'SolarToolsHub',
  themeColor: '#0a1120',
  twitter: '', // e.g. '@solartoolshub' (optional)
  // Google AdSense publisher id, e.g. 'ca-pub-1234567890123456'. Leave empty until approved.
  adsenseClient: '',
  // Google Analytics 4 id, e.g. 'G-XXXXXXX'. Leave empty to disable.
  gaId: '',
  // Google Search Console verification token (content of the meta tag). Optional.
  googleVerification: '',
  developer: 'TWOCOMPO TECHNOLOGIES PRIVATE LIMITED',
  developerUrl: 'https://twocompo.com',
};

// Installation / lead partner. Every "Get quote" CTA points here.
export const PARTNER = {
  name: 'Avirat Energy',
  legalName: 'Avirat Energy Pvt. Ltd.',
  url: 'https://aviratenergy.com',
  phone: '+91 99797 45444',
  tel: '+919979745444',
  whatsapp: '919979745444',
  email: 'info@aviratenergy.com',
  address: 'Plot No A-19, Jay Industrial Park, Dhoraji Road, Junagadh, Gujarat 362310',
  branches: ['Junagadh (Gujarat) – Head office', 'Lucknow (Uttar Pradesh) – Branch'],
  logo: '/partners/avirat-energy.png', // downloaded from aviratenergy.com
  stats: [
    ['6+', 'Years experience'],
    ['450+', 'Home rooftop clients'],
    ['ALMM', 'Listed panels & inverters'],
  ],
  services: ['On-grid, hybrid & off-grid rooftop solar', 'PM Surya Ghar subsidy & net-metering paperwork', 'Solar water pumps (PM-KUSUM)', 'Solar street lights & solar dryers', 'Commercial & industrial solar EPC', 'AMC, cleaning & maintenance'],
  social: {
    instagram: 'https://www.instagram.com/aviratenergy/',
    facebook: 'https://www.facebook.com/aviratenergy',
    linkedin: 'https://www.linkedin.com/company/aviratenergy',
    youtube: 'https://www.youtube.com/c/Aviratenergy',
  },
};

// External links. akdet.com: we only link out for more calculators ("Need more calculators? Visit akdet.com" – never "our other website",
// never "non-solar": akdet also has solar tools);
// this site stays 100% solar. MVPChecker: technology partner (footer credit line + About page).
export const NETWORK = {
  akdet: {
    name: 'akdet',
    url: 'https://akdet.com',
    all: 'https://akdet.com/calculators/',
    tools: [
      ['EMI Calculator', 'https://akdet.com/emi-calculator/'],
      ['SIP Calculator', 'https://akdet.com/sip-calculator/'],
      ['FD Calculator', 'https://akdet.com/fd-calculator/'],
      ['PPF Calculator', 'https://akdet.com/ppf-calculator/'],
      ['Income Tax Calculator', 'https://akdet.com/income-tax-calculator/'],
      ['GST Calculator', 'https://akdet.com/gst-calculator/'],
      ['Salary Slip Generator', 'https://akdet.com/salary-slip-generator/'],
    ],
  },
  mvpchecker: { name: 'MVPChecker', url: 'https://mvpchecker.com', role: 'Technology partner' },
  twocompo: { name: 'TWOCOMPO TECHNOLOGIES PRIVATE LIMITED', url: 'https://twocompo.com' },
};

export const partnerLink = (campaign = 'cta') =>
  `${PARTNER.url}/?utm_source=solartoolshub&utm_medium=referral&utm_campaign=${encodeURIComponent(campaign)}`;

// Pre-filled WhatsApp chat with Avirat Energy
export const partnerWhatsApp = (text = 'Hi Avirat Energy, I found you on SolarToolsHub.com and want a rooftop solar quote.') =>
  `https://wa.me/${PARTNER.whatsapp}?text=${encodeURIComponent(text)}`;
