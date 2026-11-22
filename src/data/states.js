// Last reviewed: 2026-11-22. Values are approximate; always verify on official portals.
// `extra` = state top-up rule in the shape of docs/CONTRACT.md §4 (status, asOf, source, note + rule fields). Sources: docs/CONTRACT.md §4
// PMSG: central CFA per MNRE guidelines (OM 318/17/2024, 7 Jun 2024). benchmark = MNRE benchmark cost per kW (first 2 kW / 3rd kW).
export const PMSG = { general: { first2: 30000, third: 18000, max: 78000 }, special: { first2: 33000, third: 19800, max: 85800 }, rwaPerKw: 18000, rwaPerKwSpecial: 19800, rwaMaxKw: 500, rwaKwPerHouse: 3, benchmark: { general: { first2: 50000, above2: 45000 }, special: { first2: 55000, above2: 49500 } }, endDate: '2027-03-31', portal: 'https://pmsuryaghar.gov.in' };
export const STATES = [
  {
    slug: 'andaman-and-nicobar-islands',
    name: 'Andaman and Nicobar Islands',
    hindi: 'अंडमान और निकोबार द्वीपसमूह',
    type: 'ut',
    special: true,
    capital: 'Sri Vijaya Puram',
    tariff: 4.5,
    gen: 4.2,
    discoms: ['Electricity Department, A&N Administration'],
    nodal: 'Electricity Department, Andaman & Nicobar Administration',
    nodalUrl: 'https://vidyut.andamannicobar.gov.in',
    serc: 'JERC (Goa & UTs)',
    netMetering: 'The Electricity Department issues the NOC and net meter for grid-connected rooftop systems under JERC net metering regulations, generally up to the sanctioned load. Because island grids are diesel-heavy and small, feasibility checks on the local feeder can take longer than on the mainland.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://vidyut.andamannicobar.gov.in/doc/23-01-2025_172Notification%20For%20Additional%20UT%20Subsidy.pdf',
      note: 'The A&N Administration notified an extra UT subsidy on 23 Oct 2024 for home systems up to 3 kWp: up to Rs 45,000 per kWp for the first 2 kWp and up to Rs 27,000 for the third kWp (maximum Rs 1,17,000), on top of the central Rs 85,800. It is not a fixed amount – the UT pays what is left of the vendor price after the central subsidy and your own minimum share of Rs 20,000 per kWp (Rs 27,000 for the third kWp), up to those limits. Because it depends on the vendor price, the calculator does not add it; ask the Electricity Department (NRSE Division) for your figure.'
    },
    highlights: [
      'Special-category UT under PM Surya Ghar, so central support is 10% higher than in most states, and the Administration adds its own UT subsidy of up to Rs 1,17,000 for 3 kW (notified October 2024).',
      'The Electricity Department floated a tender for about 30 MW of 2 kW home systems (roughly 15,000 houses) under the scheme.',
      'Most island power still comes from diesel generators, so every rooftop kWh displaces costly fuel shipped from the mainland.',
      'Humid, salty coastal air means corrosion-resistant mounting structures are worth paying for.'
    ],
    faqs: [
      { q: 'How much central subsidy can a household in Andaman and Nicobar get?', a: 'As a special-category UT, homes get Rs 33,000 per kW for the first 2 kW and Rs 19,800 for the third kW, capped at Rs 85,800 for 3 kW and above.' },
      { q: 'Who approves the net meter in the islands?', a: 'The Electricity Department of the A&N Administration checks feasibility, issues the NOC and installs the net meter after you apply on the PM Surya Ghar portal.' },
      { q: 'Does rooftop solar work well during the monsoon in Sri Vijaya Puram?', a: 'Output drops during the long May to November rainy spells, but the dry months from December to April are very sunny, so annual generation is still around 4 kWh per kW per day.' }
    ]
  },
  {
    slug: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    hindi: 'आंध्र प्रदेश',
    type: 'state',
    special: false,
    capital: 'Amaravati',
    tariff: 6.0,
    gen: 4.6,
    discoms: ['APSPDCL', 'APEPDCL', 'APCPDCL'],
    nodal: 'New & Renewable Energy Development Corporation of Andhra Pradesh (NREDCAP)',
    nodalUrl: 'https://nredcap.in',
    serc: 'APERC',
    netMetering: 'APERC regulations (Regulation 4 of 2023, amended in December 2025) allow net metering up to 500 kWp, and single-phase homes can now install up to 5 kW. Since February 2026 the DISCOMs settle surplus energy every month and pay it into the consumer bank account at the APERC-approved rate. Application and net-meter fees are waived for home systems up to 10 kW.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://theprint.in/india/solar-rooftop-works-to-be-accelerated-across-andhra-under-pm-surya-ghar-scheme/2905972/',
      note: 'No state top-up for general households. Eligible SC/ST households get a 2 kW system installed free by the DISCOM under a utility-led model (installation and 5 years of maintenance included); the state bears whatever the central subsidy does not cover, shown here on the MNRE benchmark cost. It is not a cash subsidy you can claim – the DISCOM picks the beneficiaries. A Rs 20,000 top-up per 2 kW system for BC households was still only a proposal sent to the Centre in Nov 2026.',
      general: false, classes: { scst: { maxKw: 2, benchmark: { first2: 50000, above2: 45000 }, share: 0 } }
    },
    highlights: [
      'The state runs a utility-led aggregation model that installs free 2 kW systems for eligible SC and ST households.',
      'Andhra Pradesh has been among the top few states for PM Surya Ghar installations.',
      'Coastal Andhra and Rayalaseema get strong sunshine for most of the year outside the monsoon.',
      'Backward Class households have been promised a separate subsidy model; check NREDCAP for its status.'
    ],
    faqs: [
      { q: 'Is rooftop solar free for SC and ST families in Andhra Pradesh?', a: 'Eligible SC and ST households with modest consumption can get a 2 kW system at no cost through the DISCOM aggregation model, with the state paying what the central subsidy does not cover.' },
      { q: 'Which DISCOM handles my net meter in Andhra Pradesh?', a: 'It depends on your district: APSPDCL (south), APEPDCL (east) or APCPDCL (central). You choose it while applying on the PM Surya Ghar portal.' },
      { q: 'How many units will a 3 kW system make in Andhra Pradesh?', a: 'At about 4.6 kWh per kW per day, a 3 kW system produces roughly 13-14 units a day, or about 400-420 units a month.' }
    ]
  },
  {
    slug: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    hindi: 'अरुणाचल प्रदेश',
    type: 'state',
    special: true,
    capital: 'Itanagar',
    tariff: 4.0,
    gen: 3.7,
    discoms: ['Department of Power, Arunachal Pradesh'],
    nodal: 'Arunachal Pradesh Energy Development Agency (APEDA)',
    nodalUrl: 'https://power.arunachal.gov.in',
    serc: 'APSERC',
    netMetering: 'APSERC net metering rules let domestic consumers connect rooftop systems through the Department of Power, generally up to their sanctioned load. Exported units are adjusted against imports in each bill, with yearly surplus settled at the commission-approved rate.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://power.arunachal.gov.in',
      note: 'No state top-up was found as of Nov 2026. Households get the higher special-category central rate, up to Rs 85,800 for 3 kW.'
    },
    highlights: [
      'Special-category state with central aid of Rs 33,000/kW for the first 2 kW.',
      'APEDA has solarised government buildings, including a 1 MW rooftop project at the Itanagar Civil Secretariat implemented with SJVN.',
      'Hilly terrain and frequent cloud cover mean generation is lower than in the plains, so size systems a little larger.',
      'Remote villages benefit from rooftop solar because long distribution lines make grid supply less reliable.'
    ],
    faqs: [
      { q: 'What is the maximum PM Surya Ghar subsidy in Arunachal Pradesh?', a: 'Up to Rs 85,800 for a 3 kW or larger system, because Arunachal is a special-category state.' },
      { q: 'Does cloudy weather in Arunachal make solar not worth it?', a: 'Output is lower, about 3.5-4 units per kW per day, but the higher subsidy keeps the payback reasonable, especially for homes with steady daytime use.' },
      { q: 'Who installs the net meter in Arunachal Pradesh?', a: 'The state Department of Power, which is also the electricity distributor, inspects the system and fits the net meter.' }
    ]
  },
  {
    slug: 'assam',
    name: 'Assam',
    hindi: 'असम',
    type: 'state',
    special: true,
    capital: 'Dispur',
    tariff: 6.4,
    gen: 3.9,
    discoms: ['APDCL'],
    nodal: 'Assam Energy Development Agency (AEDA)',
    nodalUrl: 'https://aeda.assam.gov.in',
    serc: 'AERC',
    netMetering: 'AERC rules allow residential net metering through APDCL, normally up to the sanctioned load. Surplus units carry forward within the settlement period and any balance at year end is paid at the AERC-approved rate.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://www.apdcl.org/website/docs/tender_2024_25/BidDocumentRTSPMSGMBY.pdf',
      note: 'Assam adds Rs 15,000 per kW up to 3 kW – Rs 15,000 / Rs 30,000 / Rs 45,000 for 1 / 2 / 3 kW and above (Power Department notification of 14 Mar 2024, paid by APDCL after the central subsidy). Systems below 3 kW do qualify. Important: payment is badly delayed – homes that installed from January 2025 were mostly still waiting in Nov 2026 (dues above Rs 150 crore) and APDCL gave no timeline, so plan your budget without it.',
      perKw: 15000, max: 45000
    },
    highlights: [
      'Special-category state, so the central subsidy alone reaches Rs 85,800 for 3 kW.',
      'With the state top-up, combined support for a 3 kW home system can approach Rs 1.3 lakh.',
      'APDCL is the single distribution company for the whole state, which keeps the approval process uniform.',
      'Long monsoon months reduce output, but residential tariffs are among the higher ones in the North East.'
    ],
    faqs: [
      { q: 'How much total subsidy can I get for a 3 kW system in Assam?', a: 'Up to Rs 85,800 from the Centre plus up to Rs 45,000 from the state, roughly Rs 1.3 lakh in all, if you meet the eligibility conditions.' },
      { q: 'When is the Assam state subsidy paid?', a: 'APDCL pays it after the central subsidy, but payments have been badly delayed: most homes that installed from January 2025 were still waiting in November 2026, so do not count on a date.' },
      { q: 'Are hybrid or off-grid systems eligible in Assam?', a: 'No. Both the central and state subsidies are for grid-connected, net-metered rooftop systems.' }
    ]
  },
  {
    slug: 'bihar',
    name: 'Bihar',
    hindi: 'बिहार',
    type: 'state',
    special: false,
    capital: 'Patna',
    tariff: 7.4,
    gen: 4.2,
    discoms: ['NBPDCL', 'SBPDCL'],
    nodal: 'Bihar Renewable Energy Development Agency (BREDA)',
    nodalUrl: 'https://breda.bih.nic.in',
    serc: 'BERC',
    netMetering: 'BERC regulations provide net metering for domestic rooftop systems through NBPDCL or SBPDCL, generally up to the sanctioned load. The state has also discussed buying back annual surplus generation from rooftop owners; check the latest BERC order for the settlement rate.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://state.bihar.gov.in/energy/CitizenHome.html',
      note: 'Bihar pays Rs 10,000 per kW, up to Rs 20,000 per consumer, on top of the central subsidy (Energy Department Sankalp BSP(H)CL-10/2026-03 dated 14 Aug 2026): Rs 10,000 for 1 kW and Rs 20,000 for 2 kW or more. It is paid by DBT only after the central subsidy is received, runs for one year and is limited to 5 lakh homes; homes whose central subsidy was already paid or is in process also get it. Separately, Kutir Jyoti (BPL) consumers are being given 1.1 kW systems free by the DISCOMs under a RESCO model – that is not a cash subsidy you can apply for.',
      perKw: 10000, max: 20000
    },
    highlights: [
      'A 2026 state top-up raises total support for a 3 kW system to about Rs 98,000.',
      'The state budgeted around Rs 1,000 crore for the additional rooftop subsidy.',
      'Bihar announced 125 free units a month for domestic consumers from August 2025, which changes the payback maths for small users.',
      'Two DISCOMs split the state: NBPDCL in the north and SBPDCL in the south.'
    ],
    faqs: [
      { q: 'What is the Bihar state solar subsidy in 2026?', a: 'Rs 10,000 per kW, capped at Rs 20,000 per household, paid on top of the PM Surya Ghar central subsidy.' },
      { q: 'Is rooftop solar worth it in Bihar if I already get free units?', a: 'If your use stays under the free limit, savings are small. Households using well above it, or planning AC or EV loads, still gain from net metering.' },
      { q: 'How do I know whether NBPDCL or SBPDCL serves me?', a: 'It is printed on your electricity bill; districts north of the Ganga are mostly NBPDCL and those to the south are SBPDCL.' }
    ]
  },
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    hindi: 'चंडीगढ़',
    type: 'ut',
    special: false,
    capital: 'Chandigarh',
    tariff: 4,
    gen: 4.4,
    discoms: ['Chandigarh Power Distribution Ltd (CPDL)'],
    nodal: 'Chandigarh Renewal Energy and Science & Technology Promotion Society (CREST)',
    nodalUrl: 'https://crest.chd.gov.in',
    serc: 'JERC (Goa & UTs)',
    netMetering: 'JERC net metering regulations apply, letting homes offset imports with rooftop exports, generally up to the sanctioned load. Chandigarh building rules make rooftop solar mandatory on larger residential plots (500 sq yd and above).',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://www.tribuneindia.com/news/chandigarh/chandigarh-administration-mulls-additional-30000-subsidy-on-rooftop-solar-plants',
      note: 'No UT top-up is in force. A flat Rs 30,000 top-up for 3 kW systems was sent to the Ministry of Home Affairs in Oct 2025, and no approval had been reported by Nov 2026. Only the central subsidy of up to Rs 78,000 is certain.'
    },
    highlights: [
      'One of the earliest cities to mandate rooftop solar on bigger houses.',
      'All government buildings in the UT have been solarised, according to the administration.',
      'Electricity distribution moved from the UT Electricity Department to a private licensee, CPDL, in 2025.',
      'Flat, planned sectors with large roofs suit rooftop systems well.'
    ],
    faqs: [
      { q: 'Is rooftop solar compulsory in Chandigarh?', a: 'Yes for larger residential plots, generally 500 square yards and above, under the UT building bylaws. Smaller homes can opt in voluntarily.' },
      { q: 'Does Chandigarh give any extra subsidy over PM Surya Ghar?', a: 'A Rs 30,000 top-up has been proposed but was not confirmed as approved by Nov 2026, so only the central subsidy of up to Rs 78,000 is certain.' },
      { q: 'Where can I get help with rooftop solar in Chandigarh?', a: 'CREST, the UT renewable energy agency, handles promotion and guidance, while applications go through the PM Surya Ghar portal.' }
    ]
  },
  {
    slug: 'chhattisgarh',
    name: 'Chhattisgarh',
    hindi: 'छत्तीसगढ़',
    type: 'state',
    special: false,
    capital: 'Raipur',
    tariff: 5.6,
    gen: 4.5,
    discoms: ['CSPDCL'],
    nodal: 'Chhattisgarh State Renewable Energy Development Agency (CREDA)',
    nodalUrl: 'https://www.creda.co.in',
    serc: 'CSERC',
    netMetering: 'CSERC regulations allow domestic net metering through CSPDCL, generally up to the sanctioned load. Vendors must be empanelled with CSPDCL for the state subsidy, and surplus units are settled as per the CSERC tariff order.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://theprint.in/india/chhattisgarh-dual-subsidy-makes-installing-solar-power-units-affordable-under-pm-surya-ghar-scheme/2703422',
      note: 'CSPDCL adds Rs 15,000 for a 1 kW plant and Rs 30,000 for 3 kW or more (3 kW total Rs 1,08,000 with central aid). The state cabinet approved it in mid-2025 with funds for 2025-26 and 2026-27. Figures are from a PTI report of an official statement, which does not give the 2 kW amount; we apply Rs 15,000 per kW up to Rs 30,000, so confirm a 2 kW case with CSPDCL. A CSPDCL-empanelled vendor is required.',
      perKw: 15000, max: 30000
    },
    highlights: [
      'A dual subsidy brings total support for a 1 kW system to about Rs 45,000.',
      'CSPDCL targeted 70,000 rooftop installations for 2026-27.',
      'The state revised its half-bill scheme in 2025 and pushed households toward rooftop solar instead.',
      'Central India sunshine gives solid generation outside July to September.'
    ],
    faqs: [
      { q: 'How much extra subsidy does Chhattisgarh give?', a: 'Reports say Rs 15,000 for a 1 kW plant and up to Rs 30,000 for bigger plants, in addition to the PM Surya Ghar central subsidy.' },
      { q: 'Do I need a specific vendor in Chhattisgarh?', a: 'Yes. To claim the state amount you should use a vendor empanelled with CSPDCL and registered on the national portal.' },
      { q: 'How much will a 2 kW system save in Raipur?', a: 'Producing roughly 270 units a month, a 2 kW system can save about Rs 1,400-1,600 monthly at typical domestic tariffs.' }
    ]
  },
  {
    slug: 'dadra-and-nagar-haveli-and-daman-and-diu',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    hindi: 'दादरा और नगर हवेली और दमन और दीव',
    type: 'ut',
    special: false,
    capital: 'Daman',
    tariff: 3.0,
    gen: 4.7,
    discoms: ['DNH & DD Power Distribution Corporation Ltd (Torrent Power)'],
    nodal: 'DNH & DD Power Distribution Corporation Ltd',
    nodalUrl: 'https://www.dnhddpdcl.co.in',
    serc: 'JERC (Goa & UTs)',
    netMetering: 'JERC net metering regulations apply to homes in Silvassa, Daman and Diu, with the Torrent-run distribution company installing the bidirectional meter. Because domestic tariffs here are among the lowest in India, savings per unit are modest.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://www.dnhddpdcl.co.in',
      note: 'No UT top-up was found as of Nov 2026. Households get the central subsidy of up to Rs 78,000.'
    },
    highlights: [
      'Distribution was privatised to a Torrent Power company in 2022.',
      'Very low domestic tariffs mean payback is slower than in most states despite good sunshine.',
      'Daman and Diu are coastal, while Dadra and Nagar Haveli is inland and industrial.',
      'Government buildings in Daman and Diu have met their rooftop solar targets.'
    ],
    faqs: [
      { q: 'Is rooftop solar worth it in Daman or Silvassa with cheap power?', a: 'Payback is longer because tariffs are low, but the central subsidy still covers a large share of a 1-3 kW system, so it pays back within the panel lifetime.' },
      { q: 'Who installs net meters in DNH and DD?', a: 'The DNH & DD Power Distribution Corporation, operated by Torrent Power, handles feasibility and net meter installation.' },
      { q: 'Which subsidy rate applies here?', a: 'The general PM Surya Ghar rate: Rs 30,000/kW for the first 2 kW and Rs 18,000 for the third, up to Rs 78,000.' }
    ]
  },
  {
    slug: 'delhi',
    name: 'Delhi',
    hindi: 'दिल्ली',
    type: 'ut',
    special: false,
    capital: 'New Delhi',
    tariff: 5.5,
    gen: 4.3,
    discoms: ['BSES Rajdhani (BRPL)', 'BSES Yamuna (BYPL)', 'Tata Power-DDL', 'NDMC'],
    nodal: 'Energy Efficiency & Renewable Energy Management Centre (EE&REM), GNCTD',
    nodalUrl: 'https://solar.delhi.gov.in',
    serc: 'DERC',
    netMetering: 'DERC net metering regulations and the Delhi Solar Energy Policy 2023 let homes net-meter rooftop systems through their DISCOM; check with your DISCOM whether your system must stay within the sanctioned load. For new home systems the earlier per-unit generation incentive (GBI) has been replaced by a higher upfront state subsidy.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://solar.delhi.gov.in/page/state-subsidy',
      note: 'Delhi Solar Energy Policy 2023, Second Amendment (Gazette, 17 Sep 2026): state capital subsidy of Rs 26,000 per kW for home systems up to 3 kW, maximum Rs 78,000 – or the tendered cost minus the central subsidy if that is lower, so central plus state can never exceed the system cost. First 2,20,000 homes, first come first served; the Delhi Solar Portal lists a closing date of 28 Feb 2027. The earlier Rs 10,000 per kW (max Rs 30,000) rate is superseded and the per-unit generation incentive (GBI) is no longer paid on new home systems. Homes using up to 400 units a month can get up to 3 kW at zero upfront cost through the DISCOM route. Capacity above 3 kW gets no extra state subsidy.',
      perKw: 26000, max: 78000
    },
    highlights: [
      'Delhi Solar Energy Policy 2023 (notified March 2024) targets 4,500 MW of solar by 2027.',
      'After amendments, combined central and state support for a 3 kW home can reach about Rs 1.56 lakh.',
      'Since the September 2026 amendment the per-unit generation incentive (GBI) is folded into the upfront state subsidy for new home systems; existing GBI consumers keep it.',
      'Four distribution utilities serve the city, so check your bill for BRPL, BYPL, TPDDL or NDMC.'
    ],
    faqs: [
      { q: 'What is the Delhi state solar subsidy in 2026?', a: 'The official portal lists up to Rs 26,000 per kW for residential systems up to 3 kW, capped at Rs 78,000, in addition to the PM Surya Ghar central subsidy.' },
      { q: 'Can a Delhi home get rooftop solar at zero upfront cost?', a: 'Under the DISCOM trusteeship model, the combined subsidies can cover most or all of a small system cost. Confirm the current terms on solar.delhi.gov.in.' },
      { q: 'Is solar worth it if I already get 200 free units in Delhi?', a: 'If you stay under 200 units, savings are small. Homes with summer AC loads that push them well past 400 units benefit the most.' }
    ]
  },
  {
    slug: 'goa',
    name: 'Goa',
    hindi: 'गोवा',
    type: 'state',
    special: false,
    capital: 'Panaji',
    tariff: 3.8,
    gen: 4.6,
    discoms: ['Goa Electricity Department'],
    nodal: 'Goa Energy Development Agency (GEDA)',
    nodalUrl: 'https://geda.goa.gov.in',
    serc: 'JERC (Goa & UTs)',
    netMetering: 'Goa follows JERC net metering regulations, and the new state scheme requires systems to use net metering, group net metering or virtual net metering through the Electricity Department. A permanent consumer account number is needed to apply.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://dip.goa.gov.in/government-launches-state-subsidy-scheme-for-installation-of-rooftop-solar-systems-under-pm-surya-ghar-muft-bijli-yojana/',
      note: 'Goa State Subsidy Scheme for rooftop solar (through GEDA, valid 1 Apr 2026 to 31 Mar 2028) pays up to 50% of the MNRE benchmark cost on top of the central subsidy for home systems up to 10 kWp. Published figures are Rs 20,000 for 1 kW, Rs 1,07,500 for 5 kW and Rs 2,20,000 for 10 kW (the cap); in between we apply Rs 20,000 per kW for the first 2 kW and Rs 22,500 per kW after that. The scheme is official (government press note, 14 Aug 2026) but the rupee amounts come from press and installer reports, so confirm with GEDA. A permanent consumer account number and net metering are required.',
      rates: [20000, 20000, 22500, 22500, 22500, 22500, 22500, 22500, 22500, 22500], max: 220000
    },
    highlights: [
      'A 2026 state scheme pays up to half the benchmark cost for home systems up to 10 kWp, over and above PM Surya Ghar.',
      'Goa set a target of 21,200 rooftop systems and about 65 MW by 2027.',
      'Housing societies, RWAs and schools can also claim support for projects up to 90 kWp.',
      'Domestic power is cheap in Goa, which is why the state subsidy matters so much for payback.'
    ],
    faqs: [
      { q: 'How much state subsidy does Goa give for rooftop solar?', a: 'Reports put it at 50% of the benchmark cost, about Rs 20,000 for a 1 kW home system, rising to around Rs 2.2 lakh for 10 kW, on top of the central subsidy.' },
      { q: 'How long is the Goa scheme open?', a: 'It runs from 1 April 2026 to 31 March 2028, subject to budget availability.' },
      { q: 'Do I need a GEDA-approved vendor in Goa?', a: 'Yes. Use a vendor registered on the national portal and approved by GEDA to stay eligible for both subsidies.' }
    ]
  },
  {
    slug: 'gujarat',
    name: 'Gujarat',
    hindi: 'गुजरात',
    type: 'state',
    special: false,
    capital: 'Gandhinagar',
    tariff: 7.3,
    gen: 4.7,
    discoms: ['UGVCL', 'MGVCL', 'PGVCL', 'DGVCL', 'Torrent Power'],
    nodal: 'Gujarat Energy Development Agency (GEDA)',
    nodalUrl: 'https://geda.gujarat.gov.in',
    serc: 'GERC',
    netMetering: 'GERC notified new Grid Interactive Distributed Renewable Energy Sources Regulations on 30 October 2026, replacing the 2016 rooftop rules. Home systems from 1 kW get net metering with all exported units adjusted in the bill and no banking charges, and surplus left over is bought by the DISCOM at Rs 2.25 per kWh unless GERC fixes another rate. Ask your DISCOM how the new rules treat capacity above your sanctioned load.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://www.energetica-india.net/news/gujarat-announces-additional-state-subsidy-for-rts-up-to-2-18-kwp-under-pm-surya-ghar',
      note: 'Gujarat GR No. EPCD/BUD/e-file/20/2025/2435/B1 dated 22 Oct 2026: for a new home system of up to 2.18 kWp commissioned on or after 22 Oct 2026, the household pays only 10% of the MNRE benchmark cost (5% for SC/ST) and the state pays whatever is left after the central subsidy. Example, 2.18 kWp: benchmark Rs 1,08,100, central Rs 63,240, state Rs 34,050, you pay Rs 10,810 (SC/ST Rs 5,405). No income limit. Paid by DBT through UGVCL, MGVCL, PGVCL, DGVCL or Torrent Power for as long as PM Surya Ghar runs. If your total DC capacity (old plus new) is above 2.18 kWp you get no state subsidy, and you cannot add capacity for 3 years. Any price above the benchmark is yours to pay.',
      maxKw: 2.18, benchmark: { first2: 50000, above2: 45000 }, share: 10, classes: { scst: { share: 5 } }
    },
    highlights: [
      'Gujarat leads India in rooftop solar, with the largest share of PM Surya Ghar installations.',
      'A new Rs 1,000 crore state top-up (Oct 2026) targets more than 3 lakh small households.',
      'Five DISCOMs: four state-owned (UGVCL, MGVCL, PGVCL, DGVCL) plus Torrent Power in Ahmedabad and Surat.',
      'New GERC distributed-solar regulations (October 2026) keep full net metering for homes, with no banking charges.'
    ],
    faqs: [
      { q: 'What is the new Gujarat state solar subsidy?', a: 'For systems up to about 2 kW commissioned from 22 October 2026, the state pays the gap between the benchmark cost, the central subsidy and a 10% consumer share (5% for SC/ST).' },
      { q: 'Does a 3 kW system get the Gujarat top-up?', a: 'No. Systems above 2.18 kWp still get the central PM Surya Ghar subsidy, but not the additional state amount.' },
      { q: 'What rate does the DISCOM pay for surplus solar units in Gujarat?', a: 'Rs 2.25 per unit under the GERC regulations notified in October 2026, unless GERC fixes another rate.' }
    ]
  },
  {
    slug: 'haryana',
    name: 'Haryana',
    hindi: 'हरियाणा',
    type: 'state',
    special: false,
    capital: 'Chandigarh',
    tariff: 4.5,
    gen: 4.4,
    discoms: ['UHBVN', 'DHBVN'],
    nodal: 'Haryana Renewable Energy Development Agency (HAREDA)',
    nodalUrl: 'https://hareda.gov.in',
    serc: 'HERC',
    netMetering: 'HERC net metering regulations allow domestic rooftop systems through UHBVN or DHBVN, generally up to the sanctioned load. Surplus energy banked over the year is settled as per the HERC-approved rate.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://psuwatch.com/newsupdates/haryana-govt-sets-target-to-install-rooftop-solar-systems-on-222-lakh-households',
      note: 'No cash top-up for general households. Antyodaya families (Family ID income up to Rs 1.80 lakh, under 2,400 units a year, no dues) get state assistance of Rs 25,000 per kW or 40% of the cost, whichever is lower, for systems up to 2 kWp (max Rs 50,000). Families with income of Rs 1.80–3 lakh get Rs 10,000 per kW plus an interest-free advance of Rs 9,500 per kWp. Other non-defaulting consumers and state employees can only take an interest-free advance of Rs 19,500 per kWp (up to 5 kWp) that is recovered through bills over 24 months – a loan, not a subsidy. As stated by UHBVN in Feb 2026 (eligibility eased in June 2026); first come, first served.',
      general: false, classes: { bpl: { perKw: 25000, max: 50000, maxKw: 2 } }
    },
    highlights: [
      'Haryana targets rooftop solar on 2.22 lakh households by 31 March 2027.',
      'The Solar Energy Promotion Scheme offers state assistance to low-income Antyodaya families.',
      'Model solar villages are being developed under PM Surya Ghar in each district.',
      'Northern Haryana is served by UHBVN and southern Haryana by DHBVN.'
    ],
    faqs: [
      { q: 'Does Haryana give extra solar subsidy to poor families?', a: 'Yes. Antyodaya families identified through Parivar Pehchan Patra can get state financial assistance for systems up to 2 kW, in addition to the central subsidy.' },
      { q: 'Is there a state subsidy for middle-income homes in Haryana?', a: 'No universal state top-up was confirmed as of Nov 2026, so most households get only the PM Surya Ghar central subsidy.' },
      { q: 'How much does a 3 kW system generate in Gurugram or Karnal?', a: 'About 13 units a day on average, or roughly 390-400 units a month, with lower output in foggy winter weeks.' }
    ]
  },
  {
    slug: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    hindi: 'हिमाचल प्रदेश',
    type: 'state',
    special: true,
    capital: 'Shimla',
    tariff: 5.0,
    gen: 4.3,
    discoms: ['HPSEBL'],
    nodal: 'Himachal Pradesh Energy Development Agency (HIMURJA)',
    nodalUrl: 'https://himurja.hp.gov.in',
    serc: 'HPERC',
    netMetering: 'HPERC regulations allow net metering for domestic rooftop systems through HPSEBL, generally up to the sanctioned load. Because hill feeders are long, HPSEBL may check transformer capacity before approval.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://himurja.hp.gov.in',
      note: 'No state top-up for home rooftop solar was found as of Nov 2026 (the small HIMURJA subsidy of earlier years is not part of PM Surya Ghar). Himachal homes get the higher special-category central rate, up to Rs 85,800.'
    },
    highlights: [
      'Special-category state with central aid up to Rs 85,800 for 3 kW.',
      'Cold, clear high-altitude days help panel efficiency, though snow and monsoon cloud reduce output in some months.',
      'HIMURJA is the state nodal agency for renewable energy, including small hydro and solar.',
      'Most homes are served by a single utility, HPSEBL.'
    ],
    faqs: [
      { q: 'Does solar work in Shimla winters?', a: 'Yes. Cold temperatures improve panel efficiency, and clear winter days can be productive, but snow must be cleared from panels after heavy falls.' },
      { q: 'What subsidy applies in Himachal Pradesh?', a: 'The special-category PM Surya Ghar rate: Rs 33,000/kW for the first 2 kW and Rs 19,800 for the third, capped at Rs 85,800.' },
      { q: 'Should I tilt panels more in the hills?', a: 'A steeper tilt, close to the local latitude of about 31-32 degrees, helps snow slide off and improves winter output.' }
    ]
  },
  {
    slug: 'jammu-and-kashmir',
    name: 'Jammu and Kashmir',
    hindi: 'जम्मू और कश्मीर',
    type: 'ut',
    special: true,
    capital: 'Srinagar (summer), Jammu (winter)',
    tariff: 3.8,
    gen: 4.3,
    discoms: ['JPDCL', 'KPDCL'],
    nodal: 'Jammu & Kashmir Energy Development Agency (JAKEDA)',
    nodalUrl: 'https://jakeda.jk.gov.in',
    serc: 'JERC (J&K and Ladakh)',
    netMetering: 'The Joint Electricity Regulatory Commission for J&K and Ladakh sets net metering rules, under which JPDCL and KPDCL connect rooftop systems up to the sanctioned load. The UT share of the subsidy is credited with the central subsidy after commissioning is uploaded on the national portal.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://greaterkashmir.com/business/jk-govt-approves-additional-subsidy-for-pm-surya-ghar-scheme',
      note: 'J&K adds Rs 3,000 per kW up to 3 kW – Rs 3,000 / Rs 6,000 / Rs 9,000 – approved by the Administrative Council on 27 Jul 2024 and unchanged in Nov 2026, so a 3 kW system gets Rs 94,800 in all. It is reimbursed after commissioning and payouts have been slow. A separate plan to give free 2 kW plants to Antyodaya (AAY) families through the DISCOMs was still at tender stage in Oct 2026 and is not a top-up you can claim.',
      perKw: 3000, max: 9000
    },
    highlights: [
      'Special-category UT, with a small UT top-up raising total support for 3 kW to Rs 94,800.',
      'Tens of thousands of J&K households had installed rooftop systems by mid-2026.',
      'Jammu division is served by JPDCL and Kashmir division by KPDCL.',
      'Solar helps during winter power cuts in the Valley when hydro output falls.'
    ],
    faqs: [
      { q: 'What is the total solar subsidy in J&K for 3 kW?', a: 'Up to Rs 94,800: Rs 85,800 from the Centre plus Rs 9,000 from the UT.' },
      { q: 'Does solar work in Kashmir winters?', a: 'Short days and snow cut output in winter, but clear, cold days are efficient and summer generation is strong.' },
      { q: 'How is the UT share paid in J&K?', a: 'It is credited directly to the consumer bank account along with the MNRE subsidy after commissioning details are uploaded on the national portal.' }
    ]
  },
  {
    slug: 'jharkhand',
    name: 'Jharkhand',
    hindi: 'झारखंड',
    type: 'state',
    special: false,
    capital: 'Ranchi',
    tariff: 7.9,
    gen: 4.3,
    discoms: ['JBVNL', 'Tata Steel UISL (Jamshedpur)', 'DVC (command area)'],
    nodal: 'Jharkhand Renewable Energy Development Agency (JREDA)',
    nodalUrl: 'https://jreda.com',
    serc: 'JSERC',
    netMetering: 'JSERC rooftop solar regulations allow net metering for domestic consumers, mainly through JBVNL, generally up to the sanctioned load. Surplus units are carried forward and settled at the end of the year at the commission-approved rate.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://www.jreda.com',
      note: 'No state top-up for home rooftop solar was found as of Nov 2026. Households get the central subsidy of up to Rs 78,000.'
    },
    highlights: [
      'Jharkhand offers free electricity up to 200 units a month for domestic consumers, which affects solar payback.',
      'JBVNL is the main distributor, with Tata Steel UISL serving Jamshedpur.',
      'The plateau climate gives steady sunshine from October to May.',
      'JREDA promotes rooftop and off-grid solar across the state.'
    ],
    faqs: [
      { q: 'Is rooftop solar useful if I use under 200 units in Jharkhand?', a: 'Savings are limited while your bill is already zero. Solar makes more sense for homes consistently above the free limit.' },
      { q: 'Who approves net metering in Ranchi?', a: 'JBVNL checks feasibility and installs the net meter after you apply on the PM Surya Ghar portal.' },
      { q: 'What does a 2 kW system produce in Jharkhand?', a: 'About 8-9 units a day, or around 260 units a month on average.' }
    ]
  },
  {
    slug: 'karnataka',
    name: 'Karnataka',
    hindi: 'कर्नाटक',
    type: 'state',
    special: false,
    capital: 'Bengaluru',
    tariff: 8.5,
    gen: 4.7,
    discoms: ['BESCOM', 'MESCOM', 'HESCOM', 'GESCOM', 'CESC Mysore'],
    nodal: 'Karnataka Renewable Energy Development Ltd (KREDL)',
    nodalUrl: 'https://kredl.karnataka.gov.in',
    serc: 'KERC',
    netMetering: 'KERC issued new Grid Interactive Distributed Solar PV Plants Regulations in August 2026, and domestic rooftop systems connect through the five ESCOMs under a 25-year agreement. For home systems of 1-10 kW commissioned from 25 August 2026, surplus energy is paid at Rs 3.89 per unit if no subsidy was taken, or Rs 1.96 (1-2 kW), Rs 2.14 (above 2-3 kW) and Rs 2.58 (above 3 kW) per unit with the PM Surya Ghar subsidy.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://kredl.karnataka.gov.in',
      note: 'No state top-up for home rooftop solar was found as of Nov 2026. Households get the central subsidy of up to Rs 78,000.'
    },
    highlights: [
      'Karnataka is one of the largest solar states in India by utility-scale capacity.',
      'Gruha Jyothi gives free power up to an eligible limit (about 200 units), so solar helps mainly above that level.',
      'Five ESCOMs serve the state, led by BESCOM in Bengaluru.',
      'The Deccan plateau has high irradiance and mild temperatures that suit panels.'
    ],
    faqs: [
      { q: 'Does Karnataka add any subsidy to PM Surya Ghar?', a: 'No state top-up was confirmed as of Nov 2026, so the central subsidy of up to Rs 78,000 is the main support.' },
      { q: 'How much solar can a Bengaluru home install on net metering?', a: 'Generally up to the sanctioned load on your BESCOM connection; increase the load first if you want a bigger system.' },
      { q: 'Is solar worth it under Gruha Jyothi?', a: 'If your use is above the free limit or you plan EV charging, rooftop solar cuts the extra units, which are billed at regular tariffs.' }
    ]
  },
  {
    slug: 'kerala',
    name: 'Kerala',
    hindi: 'केरल',
    type: 'state',
    special: false,
    capital: 'Thiruvananthapuram',
    tariff: 6.8,
    gen: 4.1,
    discoms: ['KSEB Ltd', 'Thrissur Corporation Electricity Department'],
    nodal: 'Agency for New and Renewable Energy Research and Technology (ANERT)',
    nodalUrl: 'https://anert.gov.in',
    serc: 'KSERC',
    netMetering: 'KSERC Renewable Energy and Related Matters Regulations, 2025 keep net metering for home systems up to 20 kW. No battery is needed up to 10 kW; systems above 10 kW must add storage to stay on net metering and pay a grid support charge on banked units. The Kerala High Court stayed the new rules in November 2025 and the case was still pending in August 2026, so confirm the current position with KSEB before sizing.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://anert.gov.in',
      note: 'No state top-up on PM Surya Ghar for general households was found as of Nov 2026. ANERT has run separate free-plant programmes for selected LIFE Mission and SC households; they are not a cash top-up you can add to the central subsidy.'
    },
    highlights: [
      'Kerala was an early rooftop leader through the KSEB Soura programme.',
      'The 2025 KSERC rules keep net metering for homes up to 20 kW but ask for a battery above 10 kW; they are under a High Court stay.',
      'Heavy monsoon rain lowers output from June to September, but panels stay clean.',
      'ANERT is the nodal agency for renewable energy promotion.'
    ],
    faqs: [
      { q: 'Did Kerala change net metering in 2025?', a: 'Yes. The KSERC 2025 regulations keep net metering for homes up to 20 kW, with battery storage needed above 10 kW. A High Court stay on the new rules was still in force in 2026, so confirm with KSEB.' },
      { q: 'Is there a Kerala state solar subsidy?', a: 'No separate state subsidy was confirmed as of Nov 2026; households use the PM Surya Ghar central subsidy.' },
      { q: 'How much does the monsoon reduce output in Kerala?', a: 'Monthly output can fall by 30-40% in peak monsoon, but the annual average remains around 4 units per kW per day.' }
    ]
  },
  {
    slug: 'ladakh',
    name: 'Ladakh',
    hindi: 'लद्दाख',
    type: 'ut',
    special: true,
    capital: 'Leh',
    tariff: 3.0,
    gen: 5.2,
    discoms: ['Ladakh Power Development Department (LPDD)'],
    nodal: 'Ladakh Renewable Energy Development Agency (LREDA)',
    nodalUrl: 'https://ladakh.gov.in',
    serc: 'JERC (J&K and Ladakh)',
    netMetering: 'Net metering follows the Joint Electricity Regulatory Commission for J&K and Ladakh, with LPDD installing meters and connecting systems up to the sanctioned load. Neither the Centre nor the UT gives subsidy for capacity beyond 3 kWp.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://ladakh.gov.in/ut-administration-approves-top-up-subsidy-on-the-pm-surya-ghar-muft-bijli-yojana-2/',
      note: 'Ladakh adds Rs 20,000 per kWp for the first 2 kWp and Rs 10,000 for the third kWp (maximum Rs 50,000), approved by the UT Administration on 26 Jun 2024, so a 3 kW system gets Rs 1,35,800 in all. Nothing is paid for capacity above 3 kWp.',
      rates: [20000, 20000, 10000], max: 50000
    },
    highlights: [
      'Ladakh has some of the highest solar irradiance in India, with cold, thin air that boosts panel efficiency.',
      'A UT top-up of up to Rs 50,000 sits on the special-category central rate, so 3 kW can attract around Rs 1.36 lakh.',
      'Rooftop solar reduces dependence on long transmission lines and diesel backup in winter.',
      'Snow loads and extreme cold need sturdier mounting and cold-rated inverters.'
    ],
    faqs: [
      { q: 'What is the total rooftop solar subsidy in Ladakh?', a: 'For 3 kW, up to Rs 85,800 from the Centre plus Rs 50,000 from the UT, roughly Rs 1.36 lakh in all.' },
      { q: 'Why is solar output so high in Leh?', a: 'High altitude, dry air and many clear days give strong sunlight, and low temperatures improve panel efficiency.' },
      { q: 'Is there subsidy above 3 kW in Ladakh?', a: 'No. Both the central and UT subsidies stop at 3 kWp; you can install more, but the extra capacity is unsubsidised.' }
    ]
  },
  {
    slug: 'lakshadweep',
    name: 'Lakshadweep',
    hindi: 'लक्षद्वीप',
    type: 'ut',
    special: true,
    capital: 'Kavaratti',
    tariff: 5.3,
    gen: 4.6,
    discoms: ['Electricity Department, UT Lakshadweep'],
    nodal: 'Electricity Department, UT Lakshadweep',
    nodalUrl: 'https://powerlak.gov.in',
    serc: 'JERC (Goa & UTs)',
    netMetering: 'JERC net metering regulations apply, with the UT Electricity Department connecting rooftop systems on each island grid. Small island grids limit how much rooftop capacity a feeder can take, so feasibility approval is essential.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://risingkashmir.com/top-stories/pm-surya-ghar-jks-additional-solar-subsidy-among-lowest-12807886',
      note: 'One press report (Nov 2026) lists Lakshadweep with the same UT top-up as Andaman & Nicobar – up to Rs 45,000 per kW for the first 2 kW and Rs 27,000 for the third – but no Lakshadweep notification could be found, so the calculator does not add it. Ask the Department of Electricity before you count on it. The special-category central rate (up to Rs 85,800) is certain.'
    },
    highlights: [
      'Island power depends heavily on diesel, making rooftop solar valuable for cutting fuel imports.',
      'Special-category UT with central support up to Rs 85,800.',
      'Each inhabited island runs its own small grid managed by the Electricity Department.',
      'Strong tropical sunshine, but salt spray calls for marine-grade fittings.'
    ],
    faqs: [
      { q: 'Can I get PM Surya Ghar subsidy in Lakshadweep?', a: 'Yes. As a special-category UT, households get Rs 33,000/kW for the first 2 kW and Rs 19,800 for the third.' },
      { q: 'Who connects rooftop solar in Kavaratti?', a: 'The Electricity Department of the UT Administration handles feasibility, net metering and grid connection.' },
      { q: 'What maintenance do island systems need?', a: 'Rinse panels regularly to remove salt deposits and check clamps and earthing for corrosion every few months.' }
    ]
  },
  {
    slug: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    hindi: 'मध्य प्रदेश',
    type: 'state',
    special: false,
    capital: 'Bhopal',
    tariff: 8.7,
    gen: 4.6,
    discoms: ['MP Poorv Kshetra VVCL (Jabalpur)', 'MP Madhya Kshetra VVCL (Bhopal)', 'MP Paschim Kshetra VVCL (Indore)'],
    nodal: 'Madhya Pradesh Urja Vikas Nigam Ltd (MPUVNL)',
    nodalUrl: 'https://mpuvn.mp.gov.in',
    serc: 'MPERC',
    netMetering: 'MPERC net metering regulations allow domestic rooftop systems through the three regional DISCOMs, generally up to the sanctioned load. Surplus units are carried forward and settled annually as per MPERC.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://mpuvnl.mp.gov.in',
      note: 'No state top-up for home rooftop solar was found as of Nov 2026. Households get the central subsidy of up to Rs 78,000.'
    },
    highlights: [
      'Home to the Rewa Ultra Mega Solar park, one of the best-known solar projects in India.',
      'Three DISCOMs cover the east, central and west zones of the state.',
      'Atal Griha Jyoti gives subsidised power to small domestic users, so solar suits mid and high users most.',
      'Central India sunshine gives good output outside the monsoon.'
    ],
    faqs: [
      { q: 'Does Madhya Pradesh give a state rooftop subsidy?', a: 'No universal top-up was confirmed as of Nov 2026, so the PM Surya Ghar central subsidy is the main support.' },
      { q: 'Which DISCOM serves Indore, Bhopal and Jabalpur?', a: 'Indore is under the Paschim (West) DISCOM, Bhopal under Madhya (Central) and Jabalpur under Poorv (East).' },
      { q: 'How much will a 3 kW system make in Bhopal?', a: 'About 13-14 units a day on average, or roughly 410 units a month.' }
    ]
  },
  {
    slug: 'maharashtra',
    name: 'Maharashtra',
    hindi: 'महाराष्ट्र',
    type: 'state',
    special: false,
    capital: 'Mumbai',
    tariff: 11.5,
    gen: 4.6,
    discoms: ['MSEDCL (Mahavitaran)', 'Tata Power (Mumbai)', 'Adani Electricity Mumbai', 'BEST'],
    nodal: 'Maharashtra Energy Development Agency (MEDA)',
    nodalUrl: 'https://www.mahaurja.maharashtra.gov.in',
    serc: 'MERC',
    netMetering: 'MERC Grid Interactive Rooftop Renewable Energy regulations allow residential net metering up to the sanctioned load through MSEDCL or the Mumbai utilities. Under the current MERC tariff order, home rooftop connections are exempt from the solar-hour (time-of-day) banking limits and systems up to 10 kW are exempt from the grid support charge. Surplus banked at the end of the financial year is paid at the MERC-specified rate.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://renewablewatch.in/2025/10/10/maharashtra-launches-smart-scheme-to-promote-rooftop-solar-adoption/',
      note: 'No top-up for ordinary households. Under the SMART scheme (state GR of Oct 2025, runs to March 2027) MSEDCL installs 1 kW systems for homes using under 100 units a month: the state adds Rs 17,500 for BPL families, Rs 15,000 for SC/ST families and Rs 10,000 for other low-use families on top of the Rs 30,000 central subsidy, so they pay about Rs 2,500, Rs 5,000 and Rs 10,000. MERC cleared the rollout for 2.11 lakh homes in Aug 2026 and MSEDCL appoints the vendor. Figures are from press reports of the GR.',
      general: false, minKw: 1, maxKw: 1, classes: { bpl: { flat: 17500 }, scst: { flat: 15000 } }
    },
    highlights: [
      'High residential tariffs make Maharashtra one of the fastest-payback states for rooftop solar.',
      'The SMART (Swayampurna Maharashtra Residential Rooftop) scheme targets low-income households with up to 95% support.',
      'MSEDCL covers most of the state, while Mumbai has Tata Power, Adani Electricity and BEST.',
      'Maharashtra ranks among the top states for PM Surya Ghar installations.'
    ],
    faqs: [
      { q: 'What is the SMART solar scheme in Maharashtra?', a: 'A MSEDCL programme giving 1 kW rooftop systems to BPL and SC/ST EWS households using under 100 units a month, with the state paying most of the cost left after central aid.' },
      { q: 'Why is payback so fast in Maharashtra?', a: 'MSEDCL domestic tariffs above 100 units a month are among the highest in India, so each solar unit saves more money.' },
      { q: 'Can Mumbai flat owners get rooftop solar?', a: 'Individual flats usually go through the housing society, which can claim the RWA/GHS subsidy of Rs 18,000 per kW for common facilities.' }
    ]
  },
  {
    slug: 'manipur',
    name: 'Manipur',
    hindi: 'मणिपुर',
    type: 'state',
    special: true,
    capital: 'Imphal',
    tariff: 6.5,
    gen: 3.9,
    discoms: ['MSPDCL'],
    nodal: 'Manipur Renewable Energy Development Agency (MANIREDA)',
    nodalUrl: 'https://manireda.mn.gov.in',
    serc: 'MnERC (Manipur)',
    netMetering: 'The Manipur Electricity Regulatory Commission (MnERC), which took over from the earlier joint commission with Mizoram in 2024, sets net metering rules, and MSPDCL connects domestic rooftop systems, generally up to the sanctioned load.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://manireda.mn.gov.in',
      note: 'No state top-up was found as of Nov 2026. Households get the higher special-category central rate, up to Rs 85,800 for 3 kW.'
    },
    highlights: [
      'Special-category state with central aid up to Rs 85,800 for 3 kW.',
      'The Imphal valley gets more sunshine than the surrounding hill districts.',
      'MSPDCL is the single distribution company for the state.',
      'MANIREDA promotes solar for homes, institutions and remote areas.'
    ],
    faqs: [
      { q: 'What solar subsidy is available in Manipur?', a: 'The special-category PM Surya Ghar subsidy: Rs 33,000/kW for the first 2 kW and Rs 19,800 for the third.' },
      { q: 'Which regulator covers Manipur net metering?', a: 'The Manipur Electricity Regulatory Commission (MnERC), which replaced the earlier joint commission with Mizoram in 2024.' },
      { q: 'How much will 2 kW produce in Imphal?', a: 'About 7-8 units a day on average, with lower output during the monsoon.' }
    ]
  },
  {
    slug: 'meghalaya',
    name: 'Meghalaya',
    hindi: 'मेघालय',
    type: 'state',
    special: true,
    capital: 'Shillong',
    tariff: 6.2,
    gen: 3.6,
    discoms: ['MePDCL'],
    nodal: 'Meghalaya New and Renewable Energy Development Agency (MNREDA)',
    nodalUrl: 'https://mnreda.gov.in',
    serc: 'MSERC',
    netMetering: 'MSERC net metering regulations let MePDCL consumers connect rooftop systems, generally up to the sanctioned load, with surplus adjusted in later bills and settled annually.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://mnreda.gov.in',
      note: 'No state top-up on PM Surya Ghar was found as of Nov 2026. The CM Solar Mission is a separate state scheme for battery-backed (hybrid and off-grid) systems and is not added to the central rooftop subsidy.'
    },
    highlights: [
      'Meghalaya is one of the wettest regions on Earth, so solar output is lower than the national average.',
      'Special-category subsidy of up to Rs 85,800 improves the economics despite clouds.',
      'MePDCL is the state distribution utility.',
      'Cool temperatures in Shillong help panel efficiency on sunny days.'
    ],
    faqs: [
      { q: 'Does solar make sense in rainy Meghalaya?', a: 'Output is about 3.5 units per kW per day, lower than most states, but the higher subsidy and decent tariffs still give a reasonable payback.' },
      { q: 'What is the maximum subsidy in Meghalaya?', a: 'Up to Rs 85,800 for a 3 kW or bigger system under the special-category rate.' },
      { q: 'Should I add more panels in Shillong?', a: 'Many households size systems slightly larger to make up for cloudy months, staying within their sanctioned load.' }
    ]
  },
  {
    slug: 'mizoram',
    name: 'Mizoram',
    hindi: 'मिज़ोरम',
    type: 'state',
    special: true,
    capital: 'Aizawl',
    tariff: 5.2,
    gen: 3.8,
    discoms: ['Power & Electricity Department, Mizoram'],
    nodal: 'Zoram Energy Development Agency (ZEDA)',
    nodalUrl: 'https://zeda.mizoram.gov.in',
    serc: 'JERC (Manipur & Mizoram)',
    netMetering: 'Net metering is governed by the Joint Electricity Regulatory Commission for Manipur and Mizoram, with the Power and Electricity Department connecting home systems up to the sanctioned load.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://zeda.mizoram.gov.in',
      note: 'No state top-up was found as of Nov 2026. Households get the higher special-category central rate, up to Rs 85,800 for 3 kW.'
    },
    highlights: [
      'Special-category state with central support up to Rs 85,800.',
      'ZEDA has promoted renewable energy in Mizoram since 1999.',
      'Steep hillside homes often have limited flat roof space, so panel layout needs planning.',
      'The state department itself acts as the distribution utility.'
    ],
    faqs: [
      { q: 'What subsidy can an Aizawl home get?', a: 'Rs 33,000 per kW for the first 2 kW and Rs 19,800 for the third kW, up to Rs 85,800.' },
      { q: 'Who installs the net meter in Mizoram?', a: 'The Power and Electricity Department, Government of Mizoram.' },
      { q: 'Can I mount panels on a sloped tin roof?', a: 'Yes. Rail-mounted systems on metal sheet roofs are common in the hills; ensure the structure is rated for local wind loads.' }
    ]
  },
  {
    slug: 'nagaland',
    name: 'Nagaland',
    hindi: 'नागालैंड',
    type: 'state',
    special: true,
    capital: 'Kohima',
    tariff: 6.2,
    gen: 3.8,
    discoms: ['Department of Power, Nagaland'],
    nodal: 'Department of New & Renewable Energy, Nagaland',
    nodalUrl: 'https://nre.nagaland.gov.in',
    serc: 'NERC (Nagaland)',
    netMetering: 'The Nagaland Electricity Regulatory Commission sets net metering rules, and the Department of Power connects domestic systems, generally up to the sanctioned load.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://www.dopn.gov.in/dopn-portal/static/images/pdf/Operational%20guidelines-PMSG.pdf',
      note: 'Nagaland adds Rs 20,000 per kW, up to Rs 50,000 per consumer – Rs 20,000 / Rs 40,000 / Rs 50,000 for 1 / 2 / 3 kW and above (Notification PWR/NSM-24/25 dated 10 Apr 2025), so a 3 kW system gets Rs 1,35,800 in all. The Department of Power reimburses it within about 30 days of the central subsidy, for grid-connected systems of at least 1 kW.',
      perKw: 20000, max: 50000, minKw: 1
    },
    highlights: [
      'A dedicated Department of New and Renewable Energy, created in 2009, is the state nodal agency.',
      'Special-category state with central support up to Rs 85,800, plus a state top-up of up to Rs 50,000 notified in April 2025.',
      'Dimapur in the plains gets more sun than hill towns like Kohima.',
      'The Department of Power is both distributor and net metering authority.'
    ],
    faqs: [
      { q: 'What is the PM Surya Ghar subsidy in Nagaland?', a: 'The special-category central rate of up to Rs 85,800 for 3 kW and above, plus a state subsidy of Rs 20,000 per kW (maximum Rs 50,000) paid by the Department of Power.' },
      { q: 'Which office handles rooftop solar in Kohima?', a: 'The Department of New and Renewable Energy promotes it, while the Department of Power handles grid connection and net metering.' },
      { q: 'How many units does 1 kW produce in Nagaland?', a: 'Roughly 3.5-4 units a day on average across the year.' }
    ]
  },
  {
    slug: 'odisha',
    name: 'Odisha',
    hindi: 'ओडिशा',
    type: 'state',
    special: false,
    capital: 'Bhubaneswar',
    tariff: 5.2,
    gen: 4.3,
    discoms: ['TPCODL', 'TPSODL', 'TPWODL', 'TPNODL'],
    nodal: 'Odisha Renewable Energy Development Agency (OREDA)',
    nodalUrl: 'https://oredaodisha.com',
    serc: 'OERC',
    netMetering: 'OERC rules allow net metering for domestic rooftop systems through the four Tata Power DISCOMs, generally up to the sanctioned load. Surplus energy is settled as per the OERC order.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://inpr.odisha.gov.in/sites/default/files/2026-07/News-Energy_08072026EEEE.pdf',
      note: 'Odisha adds Rs 25,000 per kW for the first 2 kW and Rs 10,000 for the third kW – Rs 25,000 / Rs 50,000 / Rs 60,000 for 1 / 2 / 3 kW and above – so a 3 kW system gets Rs 1,38,000 in all. Cabinet-approved for 2024-25 to 2026-27, with Rs 495 crore budgeted for 2026-27; since July 2026 it is also offered to PMAY and other housing-scheme beneficiaries.',
      rates: [25000, 25000, 10000], max: 60000
    },
    highlights: [
      'One of the most generous state top-ups in India, raising 3 kW support to about Rs 1.38 lakh.',
      'All four DISCOMs are run by Tata Power joint ventures.',
      'Odisha has become one of the fastest-growing rooftop solar markets.',
      'DISCOMs also launched a low-cost 1 kW scheme under a utility-led aggregation model.'
    ],
    faqs: [
      { q: 'How much extra subsidy does Odisha give?', a: 'Rs 25,000 per kW for the first 2 kW and Rs 10,000 for the third kW, up to Rs 60,000, on top of central aid.' },
      { q: 'Which DISCOM serves Bhubaneswar?', a: 'TPCODL (Tata Power Central Odisha Distribution Ltd) serves Bhubaneswar and Cuttack.' },
      { q: 'How fast is payback in Odisha?', a: 'With combined subsidies covering most of the cost of a small system, payback can be just a few years.' }
    ]
  },
  {
    slug: 'puducherry',
    name: 'Puducherry',
    hindi: 'पुडुचेरी',
    type: 'ut',
    special: false,
    capital: 'Puducherry',
    tariff: 3.6,
    gen: 4.5,
    discoms: ['Electricity Department, Puducherry'],
    nodal: 'Electricity Department, Government of Puducherry',
    nodalUrl: 'https://electricity.py.gov.in',
    serc: 'JERC (Goa & UTs)',
    netMetering: 'JERC net metering regulations apply; the UT Electricity Department connects rooftop systems and lists registered vendors. Applications go through the PM Surya Ghar portal.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://electricity.py.gov.in/sites/default/files/Subsidy%20-%20PM%20Suryaghar%20-%20Press%20Release.pdf',
      note: 'The Puducherry Government pays an extra subsidy of up to Rs 30,000 to the first 13,000 domestic consumers who receive the central subsidy, including those who installed earlier (Electricity Department release, 21 May 2026). Press reports give the slabs as Rs 10,000 / Rs 20,000 / Rs 30,000 for 1 / 2 / 3 kW and above. The first payout (Oct 2026) went to homes with 3 kW or bigger plants; apply through your vendor or the Electricity Department with your bank details.',
      perKw: 10000, max: 30000
    },
    highlights: [
      'The UT started releasing its Rs 30,000 rooftop solar share to consumers in October 2026.',
      'The territory includes Puducherry, Karaikal, Mahe and Yanam, each with its own sunshine profile.',
      'Low domestic tariffs make the UT top-up important for payback.',
      'The Electricity Department publishes the list of registered PM Surya Ghar vendors.'
    ],
    faqs: [
      { q: 'Does Puducherry give extra solar subsidy?', a: 'Yes. The UT pays about Rs 10,000 per kW, up to Rs 30,000, in addition to the central subsidy.' },
      { q: 'Who connects rooftop solar in Puducherry?', a: 'The Electricity Department, Government of Puducherry, which is also the distributor.' },
      { q: 'How much can a 3 kW system save in Puducherry?', a: 'It makes about 400 units a month; savings are smaller than in high-tariff states, but subsidies cover most of the cost.' }
    ]
  },
  {
    slug: 'punjab',
    name: 'Punjab',
    hindi: 'पंजाब',
    type: 'state',
    special: false,
    capital: 'Chandigarh',
    tariff: 6.5,
    gen: 4.4,
    discoms: ['PSPCL'],
    nodal: 'Punjab Energy Development Agency (PEDA)',
    nodalUrl: 'https://www.peda.gov.in',
    serc: 'PSERC',
    netMetering: 'PSERC net metering regulations allow domestic rooftop systems through PSPCL, generally up to the sanctioned load. Banked surplus is settled at the end of the year as per PSERC.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://www.peda.gov.in',
      note: 'No state top-up for home rooftop solar was found as of Nov 2026. Households get the central subsidy of up to Rs 78,000; PSERC has waived application and meter-testing fees for home systems up to 10 kW.'
    },
    highlights: [
      'Punjab gives 300 free units a month to domestic consumers (since July 2022), so solar mainly helps heavy users.',
      'PSPCL is the single state distribution utility.',
      'Hot, clear summers give high output, while winter fog lowers generation for a few weeks.',
      'PEDA is the state nodal agency for rooftop and agricultural solar.'
    ],
    faqs: [
      { q: 'Should I install solar if I get 300 free units in Punjab?', a: 'Only if you regularly exceed 300 units, for example with ACs in summer; otherwise savings are limited.' },
      { q: 'What subsidy is available in Punjab?', a: 'The PM Surya Ghar central subsidy: up to Rs 78,000 for 3 kW.' },
      { q: 'Does fog in Punjab affect solar?', a: 'Yes. Dense December-January fog can cut daily output sharply, but annual averages are still about 4.4 units per kW per day.' }
    ]
  },
  {
    slug: 'rajasthan',
    name: 'Rajasthan',
    hindi: 'राजस्थान',
    type: 'state',
    special: false,
    capital: 'Jaipur',
    tariff: 8.8,
    gen: 5.0,
    discoms: ['JVVNL (Jaipur)', 'AVVNL (Ajmer)', 'JdVVNL (Jodhpur)'],
    nodal: 'Rajasthan Renewable Energy Corporation Ltd (RRECL)',
    nodalUrl: 'https://energy.rajasthan.gov.in/rrecl',
    serc: 'RERC',
    netMetering: 'RERC regulations allow net metering for domestic consumers through the three DISCOMs up to the sanctioned load (overall limit 1 MW). Banked surplus is settled at the end of the year at the notified rate, Rs 3.26 per unit for net metering under the October 2025 order.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://powerline.net.in/2025/12/19/rajasthan-to-provide-rs-17000-additional-subsidy-for-rooftop-solar-consumers/',
      note: 'No top-up for ordinary households. Consumers registered under the Mukhyamantri Nishulk Bijli Yojana (the 100-free-units scheme) who give consent and install a rooftop system of 1.1 kW or more get a flat Rs 17,000 from the state (announced Nov 2025; DISCOMs began paying in Dec 2025). The amount stays Rs 17,000 for bigger systems. Once it is credited the 100 free units stop, and the solar plant is meant to cover about 150 units a month instead. Based on press reports of DISCOM statements – confirm on your DISCOM or BijliMitra portal.',
      general: false, classes: { free: { flat: 17000, minKw: 1.1 } }
    },
    highlights: [
      'Rajasthan has the best solar resource in India, with more than 300 sunny days a year.',
      'A Rs 17,000 state add-on is linked to the Mukhyamantri Nishulk Bijli Yojana free-power scheme.',
      'The state crossed 1 lakh rooftop systems, with more than 10,000 installed in some months.',
      'Three DISCOMs cover the Jaipur, Ajmer and Jodhpur zones.'
    ],
    faqs: [
      { q: 'What is the Rs 17,000 solar subsidy in Rajasthan?', a: 'Households registered under the Mukhyamantri Nishulk Bijli Yojana get Rs 17,000 from the state for rooftop systems of 1.1 kW and above, in addition to the central subsidy.' },
      { q: 'How much does 1 kW generate in Jaipur?', a: 'About 5 units a day on average, or roughly 150 units a month.' },
      { q: 'Do dust storms affect solar in Rajasthan?', a: 'Dust reduces output, so clean the panels every week or two in dry months.' }
    ]
  },
  {
    slug: 'sikkim',
    name: 'Sikkim',
    hindi: 'सिक्किम',
    type: 'state',
    special: true,
    capital: 'Gangtok',
    tariff: 3.6,
    gen: 3.5,
    discoms: ['Energy & Power Department, Sikkim'],
    nodal: 'Sikkim Renewable Energy Development Agency (SREDA)',
    nodalUrl: 'https://sikkimsreda.in',
    serc: 'SSERC',
    netMetering: 'The Sikkim State Electricity Regulatory Commission sets net metering rules, and the Energy and Power Department connects rooftop systems, generally up to the sanctioned load.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://sikkimsreda.in',
      note: 'No state top-up was found as of Nov 2026. Households get the higher special-category central rate, up to Rs 85,800 for 3 kW.'
    },
    highlights: [
      'SREDA, under the Energy and Power Department, implements PM Surya Ghar in Sikkim.',
      'Special-category state with central support up to Rs 85,800.',
      'Mostly hydro-powered grid with low domestic tariffs.',
      'Awareness camps have been held across districts to raise applications.'
    ],
    faqs: [
      { q: 'Who implements PM Surya Ghar in Sikkim?', a: 'SREDA, the Sikkim Renewable Energy Development Agency, now under the Energy and Power Department.' },
      { q: 'Is solar viable in Gangtok?', a: 'Output is modest, about 3.5 units per kW per day, but the higher subsidy keeps upfront costs low.' },
      { q: 'What subsidy applies in Sikkim?', a: 'Rs 33,000/kW for the first 2 kW and Rs 19,800 for the third kW.' }
    ]
  },
  {
    slug: 'tamil-nadu',
    name: 'Tamil Nadu',
    hindi: 'तमिलनाडु',
    type: 'state',
    special: false,
    capital: 'Chennai',
    tariff: 4.6,
    gen: 4.6,
    discoms: ['TNPDCL (formerly TANGEDCO)'],
    nodal: 'Tamil Nadu Green Energy Corporation Ltd (TNGECL), with TEDA as programme agency',
    nodalUrl: 'https://www.tngecl.org',
    serc: 'TNERC',
    netMetering: 'TNERC allows net metering for domestic rooftop systems through TNPDCL, generally up to the sanctioned load. The work completion report is filed on the TNPDCL unified rooftop portal before the net meter is fitted.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://www.tnebltd.gov.in/usrp/',
      note: 'Tamil Nadu adds Rs 5,000 for 1 kW, Rs 10,000 for 2 kW and Rs 22,000 for 3 kW and above (3 kW total Rs 1,00,000), launched on 21 Sep 2026 with Rs 50 crore. TEDA pays it by DBT only after the central subsidy is credited; the system must use DCR, ALMM-listed modules and a TEDA-empanelled vendor. The official TNEB rooftop portal lists these amounts but still showed the scheme G.O. reference as pending on 30 Oct 2026. The portal lists whole-kW slabs only; sizes in between are pro-rated here.',
      rates: [5000, 5000, 12000], max: 22000
    },
    highlights: [
      'A 2026 state top-up brings total support for 3 kW to about Rs 1 lakh, with Rs 50 crore budgeted.',
      'Tamil Nadu is one of the leading wind-power states and has large solar capacity too.',
      'Domestic consumers get 100 free units in every two-month bill (raised to 200 units from May 2026 for homes using up to 500 units per bill), which lowers bills for small users.',
      'TANGEDCO was restructured, and distribution is now handled by TNPDCL.'
    ],
    faqs: [
      { q: 'What is the Tamil Nadu rooftop solar subsidy in 2026?', a: 'The state adds up to Rs 22,000 for a 3 kW system on top of the Rs 78,000 central subsidy, for about Rs 1 lakh in total.' },
      { q: 'Do I need Indian-made panels in Tamil Nadu?', a: 'Yes. Panels must carry a Domestic Content Requirement certificate to claim subsidies.' },
      { q: 'Where do I submit documents in Tamil Nadu?', a: 'Apply on the PM Surya Ghar portal choosing TNPDCL, then upload the work completion report on the TNPDCL rooftop portal.' }
    ]
  },
  {
    slug: 'telangana',
    name: 'Telangana',
    hindi: 'तेलंगाना',
    type: 'state',
    special: false,
    capital: 'Hyderabad',
    tariff: 6.4,
    gen: 4.7,
    discoms: ['TGSPDCL', 'TGNPDCL'],
    nodal: 'Telangana Renewable Energy Development Corporation (TGREDCO)',
    nodalUrl: 'https://tgredco.telangana.gov.in',
    serc: 'TGERC',
    netMetering: 'TGERC Rooftop Solar PV Grid Interactive Systems Regulations, 2025 govern net metering through TGSPDCL and TGNPDCL: up to 500 kWp overall, home systems up to 100% of the sanctioned load, with automatic approval up to 10 kW and group and virtual net metering allowed.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://tgredco.telangana.gov.in',
      note: 'No state top-up for home rooftop solar was found as of Nov 2026. A state plan to give free 2 kW systems to poor households was reported in 2026 but no approved scheme or order was found.'
    },
    highlights: [
      'New TGERC rooftop solar regulations were issued in 2025.',
      'Gruha Jyothi gives free power up to 200 units to eligible households.',
      'Hyderabad and the south are served by TGSPDCL; the north by TGNPDCL.',
      'State agencies and DISCOMs were renamed from TS to TG in 2024.'
    ],
    faqs: [
      { q: 'Does Telangana add a state subsidy?', a: 'No universal top-up was confirmed as of Nov 2026, so households rely on the PM Surya Ghar central subsidy.' },
      { q: 'Is solar useful under Gruha Jyothi?', a: 'Mainly for homes using over 200 units; beyond that limit, solar savings are significant.' },
      { q: 'How much will 3 kW generate in Hyderabad?', a: 'About 14 units a day on average, or roughly 420 units a month.' }
    ]
  },
  {
    slug: 'tripura',
    name: 'Tripura',
    hindi: 'त्रिपुरा',
    type: 'state',
    special: true,
    capital: 'Agartala',
    tariff: 6.4,
    gen: 3.9,
    discoms: ['TSECL'],
    nodal: 'Tripura Renewable Energy Development Agency (TREDA)',
    nodalUrl: 'https://treda.tripura.gov.in',
    serc: 'TERC',
    netMetering: 'TERC net metering regulations allow domestic systems through TSECL, generally up to the sanctioned load, with surplus settled annually.',
    extra: {
      status: 'none', asOf: '2026-11-22', source: 'https://treda.tripura.gov.in',
      note: 'No state top-up for ordinary households was found as of Nov 2026. In May 2026 the state announced 1 kW systems for a Rs 1,000 contribution for about 1.5 lakh poor homes using under 50 units a month, chosen by local bodies; no order or installations had been reported by Nov 2026.'
    },
    highlights: [
      'PM Surya Ghar progress in Tripura was highlighted in Mann Ki Baat in 2026.',
      'Special-category state with central support up to Rs 85,800.',
      'TSECL is the single distribution utility.',
      'Agartala plains get better sunshine than the hilly north and south.'
    ],
    faqs: [
      { q: 'What subsidy can I get in Tripura?', a: 'Up to Rs 85,800 for 3 kW under the special-category rate.' },
      { q: 'Who approves net metering in Agartala?', a: 'TSECL, the Tripura State Electricity Corporation.' },
      { q: 'How much does 1 kW produce in Tripura?', a: 'About 3.5-4 units a day on average.' }
    ]
  },
  {
    slug: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    hindi: 'उत्तर प्रदेश',
    type: 'state',
    special: false,
    capital: 'Lucknow',
    tariff: 6.9,
    gen: 4.4,
    discoms: ['PVVNL', 'MVVNL', 'DVVNL', 'PuVVNL', 'KESCo', 'NPCL (Greater Noida)'],
    nodal: 'Uttar Pradesh New & Renewable Energy Development Agency (UPNEDA)',
    nodalUrl: 'https://upneda.org.in',
    serc: 'UPERC',
    netMetering: 'UPERC Rooftop Solar PV Grid Interactive Systems Regulations allow net metering for domestic consumers, generally up to the sanctioned load. Surplus is settled annually as per UPERC.',
    extra: {
      status: 'confirmed', asOf: '2026-11-22', source: 'https://upneda.org.in/Pages/SolarRooftopResidential',
      note: 'UP Solar Energy Policy 2022: state subsidy of Rs 15,000 per kW, up to Rs 30,000 per consumer, on top of the central subsidy (3 kW total Rs 1,08,000). UPNEDA releases it after the central subsidy is paid through the national portal – no separate application. It depends on state funds, so it can arrive later than the central amount.',
      perKw: 15000, max: 30000
    },
    highlights: [
      'UP Solar Energy Policy 2022 backs a state top-up of Rs 15,000/kW.',
      'UP ranks among the top states for rooftop solar installations.',
      'Several DISCOMs serve different regions, plus KESCo in Kanpur and NPCL in Greater Noida.',
      'Combined support for 3 kW can reach about Rs 1.08 lakh.'
    ],
    faqs: [
      { q: 'How much subsidy is available in UP?', a: 'Up to Rs 78,000 from the Centre plus up to Rs 30,000 from the state, about Rs 1.08 lakh in total.' },
      { q: 'Which DISCOM serves Lucknow?', a: 'MVVNL (Madhyanchal) serves Lucknow and central UP.' },
      { q: 'How many units does 3 kW make in Lucknow?', a: 'About 13 units a day, or roughly 400 units a month on average.' }
    ]
  },
  {
    slug: 'uttarakhand',
    name: 'Uttarakhand',
    hindi: 'उत्तराखंड',
    type: 'state',
    special: true,
    capital: 'Dehradun',
    tariff: 5.9,
    gen: 4.2,
    discoms: ['UPCL'],
    nodal: 'Uttarakhand Renewable Energy Development Agency (UREDA)',
    nodalUrl: 'https://ureda.uk.gov.in',
    serc: 'UERC',
    netMetering: 'UERC net metering regulations allow UPCL consumers to connect rooftop systems, generally up to the sanctioned load, with surplus settled annually.',
    extra: {
      status: 'unconfirmed', asOf: '2026-11-22', source: 'https://ureda.uk.gov.in',
      note: 'The old state top-up of Rs 17,000 per kW (max Rs 51,000) is reported to have stopped for systems commissioned from 1 Apr 2025; in March 2026 the cabinet is reported to have cleared pending claims only for systems running by 31 Mar 2025. No UREDA or UPCL order confirming a state subsidy for new systems was found, so none is counted here. Ask UREDA or UPCL before you budget for it.'
    },
    highlights: [
      'Special-category state with central support up to Rs 85,800.',
      'UPCL received national recognition for its PM Surya Ghar performance.',
      'Uttarakhand crossed 1 GW of solar capacity.',
      'The plains districts of Dehradun, Haridwar and Udham Singh Nagar get the best output.'
    ],
    faqs: [
      { q: 'Does Uttarakhand still give a state subsidy?', a: 'The earlier Rs 17,000 per kW state subsidy is reported to have stopped for systems commissioned from 1 April 2025, with only pending older claims being cleared. No order confirming a state subsidy for new systems was found, so check with UREDA or UPCL.' },
      { q: 'What central subsidy applies in Uttarakhand?', a: 'The special-category rate: up to Rs 85,800 for 3 kW.' },
      { q: 'Who connects rooftop solar in Dehradun?', a: 'UPCL, the state distribution company.' }
    ]
  },
  {
    slug: 'west-bengal',
    name: 'West Bengal',
    hindi: 'पश्चिम बंगाल',
    type: 'state',
    special: false,
    capital: 'Kolkata',
    tariff: 7.6,
    gen: 4.0,
    discoms: ['WBSEDCL', 'CESC (Kolkata)'],
    nodal: 'West Bengal Renewable Energy Development Agency (WBREDA)',
    nodalUrl: 'https://www.wbreda.org',
    serc: 'WBERC',
    netMetering: 'WBERC Grid Interactive Rooftop Solar PV System for Prosumers Regulations, 2025 let any consumer with a sanctioned load of 1 kW or more choose net metering, net billing or gross metering, up to the sanctioned load (maximum 500 kW), with automatic approval up to 10 kW. Under net metering, surplus is carried forward within the year and lapses at year end without payment, so size the system to your own use.',
    extra: {
      status: 'reported', asOf: '2026-11-22', source: 'https://www.energetica-india.net/news/west-bengal-sets-target-of-5-lakh-rooftop-solar-households-under-pm-surya-ghar-scheme-by-2027',
      note: 'Announced at the state launch on 23 Jul 2026: West Bengal adds Rs 5,000 for 1 kW, Rs 10,000 for 2 kW and Rs 15,000 for 3 kW and above (3 kW total Rs 93,000). SC/ST households are reported to get a further Rs 15,000 – but the June 2026 budget speech mentioned Rs 5,000, so confirm the SC/ST amount with WBSEDCL or CESC. Rs 100 crore is budgeted for 2026-27. No government order was found, so treat these as reported figures.',
      rates: [5000, 5000, 5000], max: 15000, classes: { scst: { rates: [20000, 5000, 5000], max: 30000 } }
    },
    highlights: [
      'High domestic tariffs in West Bengal give good savings per solar unit.',
      'Kolkata is served by CESC and most of the rest of the state by WBSEDCL.',
      'Humid weather and monsoon cloud reduce output compared with western India.',
      'The state launched PM Surya Ghar in July 2026 with its own top-up and a target of 5 lakh rooftop homes by March 2027.'
    ],
    faqs: [
      { q: 'What subsidy applies in West Bengal?', a: 'The PM Surya Ghar central subsidy of up to Rs 78,000, plus a state top-up announced in July 2026 of Rs 5,000 per kW up to Rs 15,000 (reported; SC/ST households are reported to get more).' },
      { q: 'Does CESC offer net metering in Kolkata?', a: 'Yes. CESC consumers can apply on the national portal and CESC installs the net meter.' },
      { q: 'How much does 2 kW produce in Kolkata?', a: 'About 8 units a day on average, or roughly 240 units a month.' }
    ]
  }
];
export const stateBySlug = Object.fromEntries(STATES.map(s => [s.slug, s]));
