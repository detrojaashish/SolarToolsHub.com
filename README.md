# SolarToolsHub.com

Free rooftop-solar calculators, subsidy and state guides for India. Built with **React 18 + Vite**, pre-rendered to static HTML ("islands" architecture): every page is plain HTML with inline CSS, and React hydrates only the calculator on that page. That's why it scores 100 on PageSpeed and Google can read every page.

## What's inside
- **New design (Nov 2026)**: dark ink + solar-yellow identity, call-first Avirat Energy CTAs (+91 99797 45444, WhatsApp) on every page, sticky mobile action bar.
- **15 calculators**: Rooftop solar, Subsidy (PM Surya Ghar + state top-up), Price estimator, Quote checker, ROI/payback, EMI, Inverter, Battery, Load, Roof area, String sizing, Wire size, EV charging, OPEX vs CAPEX, Proposal generator. Every one can **download a PDF** report in the page language (en/hi/gu/mr), including the installation partner box.
- **Subsidy engine**: PM Surya Ghar central CFA, MNRE benchmark cost, all 36 state top-ups with consumer classes (General / SC-ST / BPL / free-electricity), existing capacity, vendor quotation, editable rates. Default: Gujarat 2.18 kWp → you pay ₹10,810. Rules, dates and source URLs live in `src/data/states.js` (each state's `extra`); the data contract is in `docs/CONTRACT.md`.
- **36 state/UT guide pages** (tariff, DISCOMs, net metering, state subsidy, FAQs) with a searchable state dropdown.
- **4 languages**: English, हिन्दी (`/hi/`), ગુજરાતી (`/gu/`), मराठी (`/mr/`), with `hreflang` tags and a multilingual sitemap.
- PM Surya Ghar and PM-KUSUM guides, 10 "Solar for business" pages, 10 blog articles, kW price pages (1–10 kW), state-wise subsidy list, apply-online guide, and About, Contact, Privacy, Terms, Disclaimer and Advertise pages (needed for AdSense).
- SEO: unique title, description and canonical on every page, Open Graph/Twitter cards, a **unique OG image per page and language**, JSON-LD (Organization, WebSite, WebApplication, FAQPage, BreadcrumbList, BlogPosting), `sitemap.xml`, `robots.txt`.
- All "Get quote" CTAs go to **AviratEnergy.com** (UTM-tagged).

## Commands (Node 18+; Laragon: `C:\laragonnew\bin\nodejs\node-v18`)
```bash
npm install
npm run build      # client + server build + pre-render 330 pages into dist/
npm run og         # favicons + OG images (run after build; use --force to regenerate all)
npm run preview    # http://localhost:4173
npm test                      # 299k calculator assertions
npm run coverage              # c8 coverage gate (≥95 %) for src/lib + src/data
node scripts/check.mjs        # browser QA: hydration, overflow, interactions, fuzz, PDFs
node scripts/lighthouse.mjs   # Lighthouse scores (mobile)
```

## Docker + Cloudflare tunnel preview
```bash
npm run build && npm run og
docker compose up -d --build
docker logs solartoolshub-tunnel 2>&1 | grep trycloudflare   # public preview URL
```
The site is served by nginx on `http://localhost:8080`. A quick-tunnel URL is temporary and is automatically marked `noindex` by Cloudflare.
For the real domain, create a named tunnel in Cloudflare Zero Trust and replace the tunnel command with `tunnel --no-autoupdate run --token <TOKEN>`.

## Going live – checklist
1. `src/config.js`: confirm `url`, then add `adsenseClient` (ca-pub-…) after approval, plus `gaId` and `googleVerification` if needed. `ads.txt` is generated automatically.
2. `npm run build && npm run og`, then deploy `dist/`. Any static host works: Cloudflare Pages, nginx (Docker), or Apache/cPanel (`.htaccess` included).
3. Submit `https://solartoolshub.com/sitemap.xml` in Google Search Console.

## Updating data
- Subsidy rules / state data: `src/data/states.js` (`extra.perKw`, `max`, `rates` slabs, `maxKw`).
- Prices: `PRICE_TABLE` in `src/lib/solar.js`.
- Text and translations: `src/i18n/{en,hi,gu,mr}.js`. To add a language, drop in another file with the same shape and add its tagline to `scripts/og-images.mjs`.
- Blog: `src/data/posts.js`.

Developed by TWOCOMPO TECHNOLOGIES PRIVATE LIMITED.
