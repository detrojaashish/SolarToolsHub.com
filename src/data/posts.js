// Blog articles (English). Tokens such as {cost3}, {range3}, {net3}, {phone} are filled at the bottom of this file
// from lib/solar.js and config.js, so prices quoted in articles always match the calculators and price pages.
import { PARTNER } from '../config.js';
import { globalTokens, fillDict, typeRange } from '../pages/guides.jsx';

const RAW = [
  {
    slug: 'pm-surya-ghar-muft-bijli-yojana-guide',
    title: 'PM Surya Ghar Eligibility 2026: Who Can Apply, DCR, Loans',
    description: 'Who can apply for PM Surya Ghar Muft Bijli Yojana in 2026? Eligibility, subsidy per kW (up to ₹78,000), the DCR panel rule, loans and mistakes to avoid.',
    category: 'Subsidy',
    date: '2026-09-08',
    updated: '2026-11-20',
    readMins: 7,
    excerpt: 'Everything a homeowner needs to know about the central rooftop solar subsidy in 2026, from eligibility and subsidy slabs to loans and the DCR rule.',
    html: `<p>PM Surya Ghar: Muft Bijli Yojana is the central government's flagship rooftop solar scheme for homes. It was approved by the Union Cabinet on 29 February 2024 with a total outlay of about ₹75,021 crore, and its stated aim is to put rooftop solar on one crore households by FY 2026–27. By August 2026 the ministry reported that more than 50 lakh households had already installed rooftop solar under it. For a typical family, the scheme does two things: it pays a fixed subsidy (called Central Financial Assistance, or CFA) directly into your bank account, and it lets you export surplus power to your DISCOM under net metering so that your monthly bill drops sharply, in many cases close to zero.</p>
<p>This guide explains who can apply, how much subsidy you actually get, what the rules on panels and vendors are, and the mistakes that most often delay a subsidy payment.</p>

<h2>Who is eligible?</h2>
<p>The scheme is meant for residential electricity consumers. In practice, you should meet these conditions before you start:</p>
<ul>
<li><strong>You are an Indian citizen</strong> and the household owns a house with a roof that is suitable for solar panels (a terrace, sloped roof or other structure with enough shadow-free space).</li>
<li><strong>You have a valid domestic electricity connection</strong> in your name (or the name in which the bill is issued). The consumer number on the bill is the key that links your application to your DISCOM.</li>
<li><strong>You have not already taken a central subsidy</strong> for rooftop solar on the same connection. The subsidy is limited to 3 kW per connection in total, so capacity that was subsidised earlier is counted.</li>
<li><strong>You buy the system yourself</strong> (the capex model). The CFA is not available on leasing or pay-per-unit (RESCO) arrangements for individual homes.</li>
</ul>
<p>Housing societies and Resident Welfare Associations (RWAs) can also apply for common facilities such as lift, pumps and corridor lighting. They get a separate rate, explained below.</p>

<h2>How much subsidy do you get?</h2>
<p>The subsidy is fixed per kilowatt (kW) of installed capacity, not a percentage of your bill. For general-category states, the CFA is ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW. Capacity above 3 kW is allowed, but the subsidy stops increasing at 3 kW, so the maximum for an individual home is ₹78,000.</p>
<table>
<thead><tr><th>System size</th><th>Central subsidy (general states)</th><th>Central subsidy (special-category states/UTs)</th></tr></thead>
<tbody>
<tr><td>1 kW</td><td>₹30,000</td><td>₹33,000</td></tr>
<tr><td>2 kW</td><td>₹60,000</td><td>₹66,000</td></tr>
<tr><td>3 kW or more</td><td>₹78,000 (maximum)</td><td>₹85,800 (maximum)</td></tr>
<tr><td>RWA / Group Housing Society (common facilities)</td><td>₹18,000 per kW, up to 500 kW</td><td>₹19,800 per kW, up to 500 kW</td></tr>
</tbody>
</table>
<p>Special-category regions are the North-Eastern states including Sikkim, Uttarakhand, Himachal Pradesh, Jammu and Kashmir, Ladakh, Andaman and Nicobar Islands and Lakshadweep. There, the rates are ₹33,000 per kW for the first 2 kW and ₹19,800 for the third kW.</p>
<p>Several states also add their own top-up subsidy on top of the central CFA, and the rules and caps differ widely. Check your state's page on our <a href="/states">state-wise solar guide</a> and run your numbers in the <a href="/solar-subsidy-calculator">solar subsidy calculator</a> to see the combined figure.</p>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify current subsidy rates, caps and state top-ups on the official portal pmsuryaghar.gov.in and your DISCOM's website before you sign a contract.</blockquote>

<h2>What size should a household choose?</h2>
<p>The scheme broadly links system size to monthly consumption. A rough rule of thumb used by many DISCOMs and installers is:</p>
<ul>
<li>Up to about 150 units a month: 1–2 kW</li>
<li>About 150–300 units a month: 2–3 kW</li>
<li>Above 300 units a month: 3 kW or more</li>
</ul>
<p>Each kW of well-installed rooftop solar in India typically generates around 3.5 to 4.5 units a day, depending on your city, roof orientation and shading. Our article on <a href="/blog/how-many-solar-panels-for-home">how many solar panels you need</a> walks through a full sizing example, and the <a href="/solar-calculator">solar calculator</a> does it from your bill in seconds.</p>

<h2>The DCR rule: why the panel brand matters</h2>
<p>To qualify for the CFA, your installer must use <strong>DCR (Domestic Content Requirement) modules</strong>, meaning panels made in India using solar cells that are also made in India. Imported panels, or Indian-assembled panels with imported cells, are cheaper per watt but do not qualify. Ask the vendor to name the module manufacturer and model on the quote, and confirm it is a DCR product. Our comparison of <a href="/blog/topcon-vs-mono-perc-vs-bifacial-panels">TOPCon, Mono PERC and bifacial panels</a> explains how DCR fits with panel technology choices, and <a href="/blog/dcr-vs-non-dcr-solar-panels">DCR vs non-DCR panels</a> shows how to check what you are being sold.</p>

<h2>Loans under the scheme</h2>
<p>If you do not want to pay upfront, public sector banks offer collateral-free loans under the scheme for systems up to 3 kW, generally up to about ₹2 lakh, at a concessional, floating interest rate of the RBI repo rate plus 0.5% – about 6% a year in November 2026. Larger home systems can borrow up to about ₹6 lakh at normal bank rates, from about 8.15%; our <a href="/blog/solar-loan-for-home-interest-rate-emi">solar loan guide</a> has the details. You can start the loan application from the national portal, which connects to the JanSamarth platform. Rates and tenures change, so confirm them with the bank. Use the <a href="/solar-emi-calculator">solar EMI calculator</a> to compare your EMI with the bill savings; for many families the monthly saving is close to, or higher than, the EMI.</p>

<h2>How to apply: the short version</h2>
<ol>
<li>Register on pmsuryaghar.gov.in with your state, DISCOM, consumer number and mobile number.</li>
<li>Submit the rooftop solar application and wait for DISCOM approval (systems up to 10 kW do not need a technical feasibility study).</li>
<li>Choose a registered vendor and agree on the price and specifications.</li>
<li>Get the system installed, then submit installation details and apply for the net meter.</li>
<li>DISCOM installs the net meter, inspects the system and issues the commissioning report.</li>
<li>Submit your bank details on the portal; the subsidy is credited to your account.</li>
</ol>
<p>Each step has its own documents and pitfalls. Our <a href="/pm-surya-ghar-apply-online">step-by-step guide to applying online</a> walks through each one, the <a href="/blog/how-to-apply-solar-subsidy-online">application troubleshooting article</a> covers what to do when a stage gets stuck, and the <a href="/pm-surya-ghar-yojana">PM Surya Ghar Yojana page</a> has the subsidy tables and a calculator.</p>

<h2>Is it worth it? A quick example</h2>
<p>Suppose a family in a general-category state uses about 300 units a month and installs a <a href="/3kw-solar-system-price">3 kW on-grid system</a> for about {cost3}. The central subsidy of ₹78,000 brings the net cost to about {net3}. If the system generates roughly 360 units a month and the family's average tariff is ₹7 per unit, the saving is roughly ₹2,500 a month, or about ₹30,000 a year. That gives a simple payback of under four years on panels that are warranted for 25 years or more. Your numbers will differ with tariff slabs and generation, so check them in the <a href="/solar-roi-calculator">solar ROI calculator</a>.</p>

<h2>Common mistakes that delay the subsidy</h2>
<ul>
<li><strong>Name mismatch:</strong> the name on the electricity bill, bank account and application should match, or you will be asked for extra documents.</li>
<li><strong>Non-DCR panels:</strong> if the inspection finds non-DCR modules, the subsidy claim can be rejected.</li>
<li><strong>Installing before approval:</strong> wait for DISCOM feasibility before the installer starts work.</li>
<li><strong>Unregistered vendor:</strong> only vendors registered on the portal for your DISCOM can upload installation details.</li>
<li><strong>Overpaying:</strong> prices are agreed directly between you and the vendor, so compare quotes. The <a href="/solar-quote-checker">solar quote checker</a> helps you spot an inflated price.</li>
</ul>

<h2>Next steps</h2>
<p>Start by estimating your system size and net cost with the <a href="/solar-system-price-estimator">solar system price estimator</a>. When you are ready for a site survey and a detailed proposal, call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a>, and compare it against other quotes before you decide.</p>`,
    faqs: [
      { q: "What is the maximum subsidy under PM Surya Ghar Muft Bijli Yojana?", a: "For an individual home in a general-category state, the central subsidy is ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, capped at ₹78,000 for systems of 3 kW and above. Special-category states and UTs get higher rates, up to about ₹85,800. Figures are indicative; verify on pmsuryaghar.gov.in." },
      { q: "Can I install more than 3 kW and still get the subsidy?", a: "Yes. You can install a larger system, but the central subsidy is capped at the 3 kW level, so the extra capacity is paid for entirely by you." },
      { q: "Do I need DCR panels to get the subsidy?", a: "Yes. The subsidy is available only when the system uses Domestic Content Requirement modules, which are made in India with Indian-made solar cells. Confirm the module make and model with your vendor before installation." },
      { q: "Is the subsidy available for flats and housing societies?", a: "Individual flat owners usually cannot install on a shared roof alone, but RWAs and group housing societies can apply for common facilities at ₹18,000 per kW, for capacity up to 500 kW, subject to the scheme rules." }
    ]
  },
  {
    slug: 'how-to-apply-solar-subsidy-online',
    title: 'Solar Subsidy Application Stuck? Stages, Status & Fixes',
    description: 'What happens at each stage of a PM Surya Ghar subsidy application, how to check its status, and how to fix the problems that delay or reject the subsidy.',
    category: 'Subsidy',
    date: '2026-09-15',
    updated: '2026-11-18',
    readMins: 7,
    excerpt: 'What each stage of a PM Surya Ghar application involves, how to track it on the portal, and how to fix the errors that hold up or reject a subsidy.',
    html: `<p>Applying for the rooftop solar subsidy under PM Surya Ghar: Muft Bijli Yojana is done entirely online on the national portal, pmsuryaghar.gov.in. The process is not difficult, but it has several hand-offs between you, your DISCOM and your installer, and a small error at one stage can hold up the subsidy for weeks. This guide walks through every stage in order, with the documents you need and what to check before moving on.</p>
<p>If you are still deciding whether the scheme suits you, read our <a href="/blog/pm-surya-ghar-muft-bijli-yojana-guide">PM Surya Ghar guide</a> first. It covers eligibility and the subsidy slabs. For a short checklist in English, Hindi, Gujarati and Marathi, see <a href="/pm-surya-ghar-apply-online">how to apply for PM Surya Ghar online, step by step</a>; this article goes deeper into what happens at each stage and what to do when one of them stalls.</p>

<h2>Before you start: keep these ready</h2>
<ul>
<li><strong>Latest electricity bill</strong> showing your consumer number and the name on the connection.</li>
<li><strong>Mobile number and email</strong> that you can access for OTPs and updates.</li>
<li><strong>Bank account details</strong> and a cancelled cheque or passbook copy, ideally in the same name as the electricity connection.</li>
<li><strong>A rough idea of system size.</strong> Use the <a href="/solar-calculator">solar calculator</a> with your last 12 months of units, and check usable space with the <a href="/roof-area-calculator">roof area calculator</a>.</li>
<li><strong>Proof of ownership or consent</strong> for the roof if the house is jointly owned or the connection is in a family member's name. Requirements vary by DISCOM.</li>
</ul>

<h2>Step 1: Register on the national portal</h2>
<p>On pmsuryaghar.gov.in, choose the option to apply for rooftop solar. Select your state and your DISCOM, enter the electricity consumer number exactly as printed on your bill, and verify your mobile number with an OTP. The portal fetches your connection details from the DISCOM, so check that the name and address shown are correct. If they are wrong, fix them with the DISCOM first; changing them later is harder.</p>

<h2>Step 2: Log in and submit the rooftop solar application</h2>
<p>Log in with your consumer number and mobile number, then fill in the rooftop solar application form. You will be asked for the proposed capacity in kW and some basic details about the premises. Choose a capacity that matches your consumption and sanctioned load; DISCOMs may question a system that is much larger than your usage justifies. If your sanctioned load is lower than the system you want, you may need a load enhancement first. The <a href="/solar-load-calculator">solar load calculator</a> helps you work out your actual connected load.</p>

<h2>Step 3: Wait for DISCOM feasibility approval</h2>
<p>The DISCOM checks whether the local distribution transformer and network can take the solar connection. Under the Electricity (Rights of Consumers) Amendment Rules, 2024, systems up to 10 kW are exempt from a technical feasibility study and complete applications are treated as accepted, while larger systems have a fixed time limit for the study. Your state's rules decide the exact process, so watch the application status on the portal. <strong>Do not let the installer start work until feasibility is approved.</strong></p>

<h2>Step 4: Choose a registered vendor and finalise the system</h2>
<p>Only vendors registered on the portal for your DISCOM can carry your application forward. You agree the price directly with the vendor, so this is where you protect your wallet. Get at least two or three quotes and compare them on the same basis:</p>
<ul>
<li>Panel make, model, wattage and confirmation that the panels are <strong>DCR</strong> (needed for the subsidy).</li>
<li>Inverter brand, capacity and warranty.</li>
<li>Mounting structure material (hot-dip galvanised steel or aluminium), height and wind rating.</li>
<li>Earthing, lightning arrestor, AC and DC distribution boxes and cable specifications.</li>
<li>Who pays for net meter fees, and what after-sales service is included.</li>
</ul>
<p>Paste the quote into the <a href="/solar-quote-checker">solar quote checker</a> to see whether the price per kW is in a reasonable range, and see our <a href="/blog/solar-panel-price-in-india">2026 solar price guide</a> for benchmarks. If you want a professional proposal to compare against, call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a>.</p>
<p>If you need a loan, this is also the time to apply. The portal links to the JanSamarth platform for collateral-free loans from public sector banks for systems up to 3 kW, at about 6% a year in November 2026. Check the EMI with the <a href="/solar-emi-calculator">solar EMI calculator</a>.</p>

<h2>Step 5: Installation and uploading details</h2>
<p>After installation, the vendor (or you, depending on how your DISCOM's flow is set up) submits the installation details on the portal: plant capacity, panel and inverter serial numbers, and photographs. Keep copies of the invoice, panel serial numbers and warranty cards. Make sure the capacity on the invoice matches the capacity in your application, because a mismatch is a common reason for queries.</p>

<h2>Step 6: Apply for the net meter</h2>
<p>Once installation details are in, the application for net metering moves to the DISCOM. You may need to pay a net meter testing or installation fee, depending on your state. The DISCOM then installs a bi-directional (net) meter that records both the units you import and the units you export. Our explainer on <a href="/blog/net-metering-in-india-explained">net metering in India</a> shows how your bill is calculated afterwards.</p>

<h2>Step 7: DISCOM inspection and commissioning</h2>
<p>A DISCOM official inspects the installation, checks that the equipment matches what was declared and that safety items such as earthing and protection devices are in place, and confirms the net meter is working. The DISCOM then issues a commissioning report on the portal. This report is the document that unlocks your subsidy.</p>

<h2>Step 8: Submit bank details and receive the subsidy</h2>
<p>After commissioning, log in and submit your bank account details with a cancelled cheque or passbook copy. The CFA is then released to your account through the portal. Under the scheme's design, the subsidy is meant to be credited within about 30 days of the bank details being submitted, but in practice timing depends on verification. You can track the status on the portal at every step.</p>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify on official portals. Subsidy amounts, timelines, fees and document lists can change, and DISCOMs differ in the details. Always confirm on pmsuryaghar.gov.in and with your DISCOM.</blockquote>

<h2>How to check your application status</h2>
<p>Log in on pmsuryaghar.gov.in with your consumer number and the OTP sent to your registered mobile. The dashboard shows which stage the application has reached: application submitted, feasibility approved, vendor selected, installation details submitted, inspection completed, commissioning certificate generated, subsidy requested and subsidy released. Each stage shows a date, so you can see exactly where it has stopped.</p>
<ul>
<li><strong>Stuck before installation:</strong> the matter is with the DISCOM. Contact its rooftop solar cell or sub-division office with your application number.</li>
<li><strong>Stuck after installation:</strong> ask your vendor first, because the vendor uploads the plant details and the net-meter request.</li>
<li><strong>Subsidy requested but not received after 30 days:</strong> check that the bank account is active, in the same name as the application and correctly entered, then call the scheme helpline on 15555.</li>
</ul>

<h2>Typical timeline</h2>
<table>
<thead><tr><th>Stage</th><th>What usually happens</th></tr></thead>
<tbody>
<tr><td>Registration and application</td><td>Same day, if your bill details are correct</td></tr>
<tr><td>Feasibility approval</td><td>Deemed or quick for small systems; longer if a study is needed</td></tr>
<tr><td>Installation</td><td>One to three days on site for a typical home system</td></tr>
<tr><td>Net meter and inspection</td><td>Depends on the DISCOM's workload; often the longest wait</td></tr>
<tr><td>Subsidy credit</td><td>After commissioning and bank detail verification</td></tr>
</tbody>
</table>

<h2>Troubleshooting common problems</h2>
<ul>
<li><strong>Consumer number not found:</strong> check the format on your bill, including leading zeros, and the selected DISCOM.</li>
<li><strong>Application stuck at feasibility:</strong> contact the DISCOM sub-division office with your application number.</li>
<li><strong>Subsidy rejected:</strong> the usual causes are non-DCR panels, a bank name mismatch or a capacity mismatch. Read the remark on the portal, correct the issue and resubmit.</li>
<li><strong>Vendor not listed:</strong> pick a different vendor, because an unregistered vendor cannot complete your claim.</li>
</ul>
<p>Once you are approved, use the <a href="/solar-subsidy-calculator">solar subsidy calculator</a> to confirm the amount you should receive, and the <a href="/solar-roi-calculator">ROI calculator</a> to see when the system pays for itself.</p>`,
    faqs: [
      { q: "Can I apply for the solar subsidy without an installer?", a: "You can register and submit the application yourself, but the installation must be done by a vendor registered on the national portal for your DISCOM, and that vendor's installation details are needed to complete the claim." },
      { q: "When is the subsidy credited to my account?", a: "The subsidy is released after the DISCOM issues the commissioning report and you submit your bank details. The scheme aims to credit it within about 30 days, but verification can take longer. Check the status on pmsuryaghar.gov.in." },
      { q: "What if my electricity bill is in my father's name?", a: "The application is linked to the consumer number, so the name on the connection matters. Many DISCOMs ask for a name transfer or a consent document. Sort this out before applying to avoid a mismatch with the bank account." },
      { q: "How do I check the status of my solar subsidy?", a: "Log in on pmsuryaghar.gov.in with your consumer number and mobile OTP. The dashboard shows the stage your application and subsidy payment have reached. If the subsidy has been requested for more than 30 days, check your bank details and call the helpline 15555." },
      { q: "Can I install first and apply later?", a: "It is risky. Installing before DISCOM feasibility approval and without a registered vendor can make you ineligible for the subsidy. Apply first, then install." }
    ]
  },
  {
    slug: 'solar-panel-price-in-india',
    title: 'Solar Panel Installation Cost in India 2026: Full Break-up',
    description: 'Solar panel installation cost in India in 2026: what 1 kW to 10 kW systems cost, where the money goes component by component, GST and how to judge a quote.',
    category: 'Pricing',
    date: '2026-09-24',
    updated: '2026-11-20',
    readMins: 8,
    excerpt: 'What it costs to install rooftop solar in 2026, what you pay after subsidy, and the line items – panels, inverter, structure, GST – that push a quote up or down.',
    html: `<p>The most common question before going solar is simple: how much will it cost? The honest answer is a range, because the price of a rooftop solar system in India depends on its size, type, panel technology, roof, city and installer. This guide gives indicative 2026 price ranges for homes, explains what you pay after subsidy, and breaks down the factors that move a quote.</p>
<p>All prices below are for complete, installed systems including panels, inverter, mounting structure, cabling, protection devices and installation. They are market ranges compiled from published installer prices and typical quotes, not fixed rates, so use them as a benchmark and then check your own quote.</p>

<h2>Indicative on-grid system prices in 2026</h2>
<p>On-grid systems with DCR panels (required for the central subsidy) cost the most per kW at the smallest sizes: about {cost1} for 1 kW, {cost3} for 3 kW and {cost5} for 5 kW. The price per kW falls as the system gets bigger, because fixed costs such as design, labour, inverter overheads and net-meter paperwork are spread over more capacity.</p>
<table>
<thead><tr><th>System size</th><th>Typical price before subsidy</th><th>Central subsidy (general states)</th><th>Typical price after subsidy</th></tr></thead>
<tbody>
<tr><td><a href="/1kw-solar-system-price">1 kW</a></td><td>{range1}</td><td>₹30,000</td><td>about {net1}</td></tr>
<tr><td><a href="/2kw-solar-system-price">2 kW</a></td><td>{range2}</td><td>₹60,000</td><td>about {net2}</td></tr>
<tr><td><a href="/3kw-solar-system-price">3 kW</a></td><td>{range3}</td><td>₹78,000</td><td>about {net3}</td></tr>
<tr><td><a href="/5kw-solar-system-price">5 kW</a></td><td>{range5}</td><td>₹78,000</td><td>about {net5}</td></tr>
<tr><td><a href="/10kw-solar-system-price">10 kW</a></td><td>{range10}</td><td>₹78,000</td><td>about {net10}</td></tr>
</tbody>
</table>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify on official portals. Subsidy amounts are the central CFA under PM Surya Ghar for general-category states; special-category states get more, and some states add their own top-up. Confirm current rates on pmsuryaghar.gov.in.</blockquote>
<p>The <a href="/solar-panel-price">solar panel price list</a> has every size from 1 kW to 10 kW with the units each one generates and the bill it suits. For your exact size and state, the <a href="/solar-system-price-estimator">solar system price estimator</a> gives a tailored range, and the <a href="/solar-subsidy-calculator">subsidy calculator</a> shows the central and state support you may qualify for.</p>

<h2>Off-grid and hybrid prices</h2>
<p>On-grid systems are the cheapest because they have no batteries. Adding storage changes the picture considerably:</p>
<ul>
<li><strong>Hybrid systems</strong> (grid-connected, with a hybrid inverter and a battery for backup) typically cost about one and a half times an on-grid system of the same size – roughly {hybrid3} for 3 kW – depending heavily on battery size and chemistry.</li>
<li><strong>Off-grid systems</strong> (panels, an off-grid inverter and batteries sized for your night load, with no grid connection) fall in a similar band – roughly {offgrid3} for 3 kW – and cost much more if you need long backup hours.</li>
</ul>
<p>Lithium-ion (LFP) batteries cost more upfront than lead-acid but last much longer and need almost no maintenance, so the cost per cycle is often lower. Size your battery properly with the <a href="/solar-battery-calculator">solar battery calculator</a>, and read our comparison of <a href="/blog/on-grid-vs-off-grid-vs-hybrid-solar">on-grid, off-grid and hybrid systems</a> before you decide; the <a href="/on-grid-vs-off-grid-solar">on-grid vs off-grid vs hybrid</a> page has a price table for each size. Note that subsidy eligibility depends on the system being grid-connected under net metering with DCR panels; check the portal rules for your configuration.</p>

<h2>What drives the cost of a solar system?</h2>
<h3>1. Panels (about 35–50% of cost)</h3>
<p>Panels are the biggest single item. DCR panels, made in India with Indian cells, cost noticeably more per watt than <a href="/blog/dcr-vs-non-dcr-solar-panels">non-DCR panels</a>, but they are mandatory for the subsidy, and the subsidy more than covers the difference on systems up to 3 kW. Technology also matters: n-type TOPCon panels usually cost a little more than Mono PERC but deliver more units per kW in Indian heat. See our <a href="/blog/topcon-vs-mono-perc-vs-bifacial-panels">panel technology comparison</a>.</p>
<h3>2. Inverter (about 10–20%)</h3>
<p>A good on-grid string inverter with a long warranty costs more than a basic one, and hybrid inverters cost more again. The inverter should be sized to your panel capacity; the <a href="/solar-inverter-size-calculator">inverter size calculator</a> shows the right range.</p>
<h3>3. Mounting structure (about 10–15%)</h3>
<p>A standard low-height structure on an RCC roof is cheapest. Elevated structures (to keep the terrace usable or clear a water tank), long spans, tin-shed mounts and high-wind designs for coastal areas all add cost. Structure is also where corners are most often cut, so ask for the material, coating and thickness in writing.</p>
<h3>4. Balance of system and installation</h3>
<p>Cables, AC and DC distribution boxes, surge protection, earthing, lightning arrestor, conduits and labour make up the rest. Long cable runs from roof to meter, or a meter far from the inverter, raise costs. Correct cable sizing matters for safety and losses; you can check it with the <a href="/solar-wire-size-calculator">solar wire size calculator</a>.</p>
<h3>5. GST and fees</h3>
<p>GST on solar modules and many renewable energy devices was cut from 12% to 5% from 22 September 2025. A supply-and-installation contract is treated as 70% goods at 5% and 30% services at 18%, so the effective GST on a complete rooftop system works out to about 8.9%. Ask whether the quote includes GST. Net meter charges, DISCOM fees and any load enhancement charges are extra in some states.</p>
<h3>6. Location and access</h3>
<p>Prices vary by city because of competition, labour rates and transport. A third-floor roof with no staircase access, or a site far from the installer's base, will cost more.</p>

<h2>How to tell if a quote is fair</h2>
<ul>
<li>Compare <strong>price per kW</strong>, not the total, and only between quotes with similar panels, inverter and structure.</li>
<li>Insist on brand and model names for panels and inverter, and confirm DCR status for subsidy systems.</li>
<li>Check what is included: net meter fees, earthing, lightning protection, monitoring and annual maintenance.</li>
<li>Be wary of quotes far below the market range; the saving is usually in the structure, cables or protection devices.</li>
</ul>
<p>Our <a href="/solar-quote-checker">solar quote checker</a> compares your quote with typical ranges and flags missing items. If you would like a detailed, itemised proposal, call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a>, and compare it with other offers.</p>

<h2>Payback and financing</h2>
<p>For a home paying ₹7 to ₹9 per unit at the margin, a subsidised 3 kW on-grid system often pays back in roughly three to five years. Businesses without the residential subsidy typically see longer paybacks but much larger absolute savings, especially at commercial tariffs. Check your own numbers in the <a href="/solar-roi-calculator">solar ROI calculator</a>. If you would rather not pay upfront, read our <a href="/blog/solar-loan-for-home-interest-rate-emi">solar loan guide</a> and compare a loan using the <a href="/solar-emi-calculator">EMI calculator</a>, and businesses weighing ownership against a PPA or lease can use the <a href="/opex-vs-capex-calculator">OPEX vs CAPEX calculator</a>.</p>`,
    faqs: [
      { q: "What is the price of a 3 kW solar system in India in 2026?", a: "A 3 kW on-grid system with DCR panels typically costs about {range3} before subsidy. After the central subsidy of ₹78,000 in general-category states, the net cost is roughly {net3}. Figures are indicative; verify on official portals." },
      { q: "Why are DCR panels more expensive?", a: "DCR panels must use solar cells made in India, and domestic cell production costs more than imports. They are required for the PM Surya Ghar subsidy, and on systems up to 3 kW the subsidy is far larger than the price difference." },
      { q: "Is a hybrid system worth the extra cost?", a: "Only if you face frequent power cuts or need backup for critical loads. For most city homes with reliable grid supply, an on-grid system gives the fastest payback." },
      { q: "Does the price include GST?", a: "Not always, so ask. Solar panels and complete solar systems attract 5% GST; on a supply-and-install contract the effective rate works out to about 8.9%." }
    ]
  },
  {
    slug: 'on-grid-vs-off-grid-vs-hybrid-solar',
    title: 'Is a Hybrid Solar System Worth It? On-Grid vs Hybrid Guide',
    description: 'Should you pay extra for a hybrid solar system with battery backup or stay on-grid? Costs, backup, subsidy rules and a simple way to decide for your home.',
    category: 'Guides',
    date: '2026-10-02',
    updated: '2026-11-15',
    readMins: 7,
    excerpt: 'When battery backup is worth the extra money and when a plain on-grid system is the smarter buy, with advice for city homes, villages and small businesses.',
    html: `<p>Every rooftop solar system in India falls into one of three types: on-grid, off-grid or hybrid. They use similar panels, but they behave very differently during a power cut, cost very different amounts, and are treated differently for subsidy and net metering. Choosing the wrong type is one of the most expensive mistakes a homeowner can make, so this guide looks at how each one behaves and when the extra cost of batteries is justified. For a quick table with current prices for every size, see <a href="/on-grid-vs-off-grid-solar">on-grid vs off-grid vs hybrid solar systems</a>.</p>

<h2>On-grid (grid-tied) solar</h2>
<p>An on-grid system connects your panels to the DISCOM grid through an on-grid inverter. During the day, your home uses solar power first. Any surplus flows into the grid and is recorded by a bi-directional net meter; at night or on cloudy days you draw power from the grid as usual. There are no batteries.</p>
<ul>
<li><strong>Pros:</strong> lowest cost per kW, highest efficiency, very little maintenance, fastest payback, and it is the configuration the PM Surya Ghar subsidy is built around.</li>
<li><strong>Cons:</strong> it shuts down during a power cut. This is a safety feature called anti-islanding, which stops your system from feeding power into lines that linemen may be repairing.</li>
</ul>
<p>On-grid suits most urban and semi-urban homes with reasonably reliable supply, and businesses whose main goal is to cut the bill. Our <a href="/blog/net-metering-in-india-explained">net metering explainer</a> shows how exported units are credited.</p>

<h2>Off-grid (standalone) solar</h2>
<p>An off-grid system is not connected to the DISCOM grid at all. Panels charge a battery bank through a charge controller or off-grid inverter, and the home runs on the battery and panels alone.</p>
<ul>
<li><strong>Pros:</strong> works where there is no grid or the grid is very unreliable; complete independence.</li>
<li><strong>Cons:</strong> much higher cost because of batteries; you must size the system for your worst days (cloudy monsoon weeks); surplus power on sunny days is wasted once the batteries are full; batteries need replacement during the system's life; not eligible for net metering.</li>
</ul>
<p>Off-grid makes sense for farmhouses, remote homes, telecom sites and places where getting a grid connection is impractical. For agricultural pumps, look at the separate <a href="/pm-kusum-yojana">PM-KUSUM scheme</a> instead.</p>

<h2>Hybrid solar</h2>
<p>A hybrid system is grid-connected like an on-grid system but also has a battery, managed by a hybrid inverter. During the day it powers the home, charges the battery and exports surplus. During a power cut, it switches to the battery and keeps selected loads running.</p>
<ul>
<li><strong>Pros:</strong> backup during outages, lower bills, and the option to store daytime solar for evening use where that helps.</li>
<li><strong>Cons:</strong> higher upfront cost than on-grid; batteries add maintenance and eventual replacement cost; more complex design and paperwork.</li>
</ul>
<p>Hybrid suits homes and shops with frequent cuts, people working from home, clinics, and anyone who would otherwise buy a separate inverter-battery set and a diesel generator.</p>

<h2>Side-by-side comparison</h2>
<table>
<thead><tr><th>Feature</th><th>On-grid</th><th>Off-grid</th><th>Hybrid</th></tr></thead>
<tbody>
<tr><td>Grid connection</td><td>Yes</td><td>No</td><td>Yes</td></tr>
<tr><td>Battery</td><td>No</td><td>Yes (essential)</td><td>Yes</td></tr>
<tr><td>Works during power cut</td><td>No</td><td>Yes</td><td>Yes (backed-up loads)</td></tr>
<tr><td>Net metering</td><td>Yes</td><td>No</td><td>Usually yes</td></tr>
<tr><td>Indicative cost per kW</td><td>Lowest</td><td>Highest</td><td>Middle to high</td></tr>
<tr><td>Maintenance</td><td>Low</td><td>Higher (batteries)</td><td>Moderate</td></tr>
<tr><td>Payback</td><td>Fastest</td><td>Slowest</td><td>Moderate</td></tr>
</tbody>
</table>
<p>For current price ranges for each type, see our <a href="/blog/solar-panel-price-in-india">solar price guide for 2026</a>, or get an instant estimate from the <a href="/solar-system-price-estimator">price estimator</a>.</p>

<h2>Subsidy: an important difference</h2>
<p>The central subsidy under PM Surya Ghar is meant for grid-connected residential rooftop systems that use DCR panels and are commissioned with a net meter. A pure off-grid system does not fit that framework. A hybrid system can be grid-connected with a net meter, but the subsidy is calculated only on the solar capacity, not the battery. Before you choose a hybrid design for the subsidy, confirm with your vendor and on the portal that your configuration is accepted by your DISCOM.</p>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify on official portals. The central subsidy for homes is ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, up to ₹78,000 in general-category states. Check current rules at pmsuryaghar.gov.in.</blockquote>

<h2>How to decide: three questions</h2>
<ol>
<li><strong>How reliable is your grid?</strong> If cuts are rare and short, choose on-grid. If you face daily cuts of an hour or more, consider hybrid. If there is no grid, off-grid is the only option.</li>
<li><strong>What must keep running during a cut?</strong> List the essentials (fans, lights, Wi-Fi, fridge, a computer) and add up their watts. The <a href="/solar-load-calculator">solar load calculator</a> does this for you, and the <a href="/solar-battery-calculator">battery calculator</a> converts it into battery capacity for the hours you need.</li>
<li><strong>What is your budget and goal?</strong> If the goal is the lowest bill for the least money, on-grid wins. If backup is worth paying for, hybrid is the balance.</li>
</ol>

<h2>A practical middle path</h2>
<p>Many households already own a conventional home inverter with a battery. A common and economical approach is to install an on-grid solar system for bill savings and keep the existing inverter for backup of a few essential circuits. It does not give solar power during a cut, but it avoids the cost of a large battery bank. Discuss this with your installer, because the wiring must keep the two systems properly separated.</p>
<p>Another option is to choose a hybrid-ready design: an on-grid system now, with an inverter that can accept a battery later when prices fall further.</p>

<h2>Sizing the inverter and battery</h2>
<p>Whatever type you choose, the inverter must match your panel capacity and, for hybrid and off-grid systems, your peak load. The <a href="/solar-inverter-size-calculator">inverter size calculator</a> gives a starting point. Battery sizing depends on backup hours, depth of discharge and battery chemistry; lithium (LFP) batteries allow deeper discharge than lead-acid, so you need less nominal capacity for the same usable energy.</p>

<h2>Bottom line</h2>
<p>For most Indian city homes, on-grid solar with net metering is the smartest choice: cheapest, subsidised and quickest to pay back. Hybrid is worth the premium only where outages are a real problem. Off-grid is for places without a dependable grid. If you are unsure which fits your home, call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a>, and ask for an on-grid and a hybrid option side by side.</p>`,
    faqs: [
      { q: "Does an on-grid solar system work during a power cut?", a: "No. On-grid inverters shut down when the grid fails, for the safety of linemen working on the network. You need a hybrid or off-grid system with a battery for solar backup." },
      { q: "Can I get the PM Surya Ghar subsidy on a hybrid system?", a: "The subsidy is for grid-connected rooftop solar with DCR panels and a net meter, and it is calculated on the solar capacity only. Many DISCOMs accept hybrid systems, but confirm your configuration on the portal and with your vendor before buying." },
      { q: "Which battery is best for a hybrid solar system?", a: "Lithium iron phosphate (LFP) batteries are the most common choice today because they last many more cycles than lead-acid, allow deeper discharge and need almost no maintenance, though they cost more upfront." },
      { q: "Can I add a battery to my on-grid system later?", a: "Only if the inverter supports it or you add a separate battery inverter. If you think you may want backup later, ask for a hybrid-ready inverter at the start." }
    ]
  },
  {
    slug: 'how-many-solar-panels-for-home',
    title: 'How Many Solar Panels Do I Need for My Home? (With Example)',
    description: 'Work out how many solar panels your home needs from your electricity bill, monthly units and roof area, with a worked example and simple sizing formulas.',
    category: 'Guides',
    date: '2026-10-12',
    updated: '2026-11-19',
    readMins: 7,
    excerpt: 'Turn your electricity bill into a solar system size and panel count in five steps, with a fully worked example for an Indian home.',
    html: `<p>Sizing a rooftop solar system is easier than it looks. You do not need to know every appliance in your house; your electricity bill already contains the most important number. This guide shows how to go from monthly units to system size in kW, then to the number of panels and the roof space you need, with a fully worked example.</p>

<h2>Step 1: Find your average monthly units</h2>
<p>Look at your electricity bills for the last 12 months and note the units (kWh) consumed in each billing period. Many DISCOMs print a consumption history on the bill or show it in their online account. Add them up and divide by 12 to get your average monthly consumption. Using a full year matters, because Indian homes use far more power in summer when air conditioners and coolers run.</p>
<p>If you are building a new home or adding major appliances such as an AC or an electric vehicle, estimate the extra units. The <a href="/solar-load-calculator">solar load calculator</a> helps for appliances, and the <a href="/ev-charging-cost-calculator">EV charging cost calculator</a> estimates the units an EV will add.</p>

<h2>Step 2: Know how much 1 kW produces where you live</h2>
<p>A well-installed 1 kW rooftop system in most of India generates roughly 3.5 to 4.5 units per day averaged across the year, or about 110 to 135 units a month. Sunny, dry regions such as Rajasthan and Gujarat are at the higher end; hilly, cloudy and high-rainfall areas are lower. Shade, dust and a poor tilt or orientation reduce output. For a first estimate, 4 units per kW per day (about 120 units a month) is a reasonable planning figure.</p>

<h2>Step 3: Calculate system size</h2>
<p>The basic formula is:</p>
<blockquote><strong>System size (kW) = Average monthly units ÷ (Units per kW per day × 30)</strong></blockquote>
<p>So a home using 360 units a month in an area that produces 4 units per kW per day needs 360 ÷ 120 = 3 kW. Round to the nearest practical size; it is generally better to size for about 80–100% of your consumption rather than more, because net metering rules in many states pay a low rate for surplus units at the end of the settlement period. Our <a href="/blog/net-metering-in-india-explained">net metering guide</a> explains why oversizing rarely pays.</p>
<p>Also check your <strong>sanctioned load</strong>. Many DISCOMs limit rooftop capacity to the sanctioned load on your connection, so a 5 kW system may need a load enhancement if your sanctioned load is 3 kW.</p>

<h2>Step 4: Convert kW into number of panels</h2>
<p>Modern residential panels are usually in the range of about 540 to 600 watts-peak (Wp) each. To find the number of panels:</p>
<blockquote><strong>Number of panels = System size in watts ÷ Panel wattage</strong>, rounded to a whole number.</blockquote>
<p>A 3 kW system with 550 Wp panels needs 3,000 ÷ 550 = 5.45, so you would install 6 panels for a total of 3.3 kWp, or 5 panels for 2.75 kWp. The installer will also arrange the panels into strings that suit the inverter's voltage window, which is why the exact count sometimes changes. You can check a string layout with the <a href="/solar-string-sizing-calculator">string sizing calculator</a>.</p>

<h2>Step 5: Check your roof area</h2>
<p>As a rule of thumb, you need about 80 to 100 square feet (roughly 7.5 to 9.5 square metres) of <strong>shadow-free</strong> roof area per kW for a standard installation. A single large panel is about 2.3 metres by 1.1 metres, or roughly 27 square feet, and you need gaps for walkways, cleaning access and to avoid self-shading between rows. Water tanks, staircase rooms, parapet walls and nearby trees or buildings all cast shadows, especially in winter when the sun is low in the south.</p>
<p>Measure the usable part of your roof with the <a href="/roof-area-calculator">roof area calculator</a> to see the maximum system that fits. If space is tight, higher-efficiency panels or an elevated structure over the water tank area can help.</p>

<h2>Worked example: a family in Pune</h2>
<p>Let us size a system for a family of four in an independent house.</p>
<table>
<thead><tr><th>Item</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Total units in last 12 months</td><td>4,320 units</td></tr>
<tr><td>Average monthly units</td><td>4,320 ÷ 12 = 360 units</td></tr>
<tr><td>Generation assumption</td><td>4 units per kW per day = 120 units per kW per month</td></tr>
<tr><td>Required system size</td><td>360 ÷ 120 = 3 kW</td></tr>
<tr><td>Panel choice</td><td>550 Wp DCR TOPCon panels</td></tr>
<tr><td>Number of panels</td><td>6 panels = 3.3 kWp</td></tr>
<tr><td>Roof area needed</td><td>About 270 to 330 sq ft shadow-free</td></tr>
<tr><td>Inverter</td><td>3 kW on-grid inverter</td></tr>
</tbody>
</table>
<p>The family's terrace has about 600 sq ft, but the water tank shades one corner in the afternoon, leaving roughly 400 sq ft of useful space. That comfortably fits 3.3 kWp. Because this size also gets the maximum central subsidy, it is a sensible choice.</p>
<p>At an indicative <a href="/3kw-solar-system-price">3 kW price</a> of around {cost3}, the central subsidy of ₹78,000 would reduce the cost to roughly {net3}. If the system offsets about 360 units a month at ₹7 to ₹8 per unit, the family saves roughly ₹2,500 to ₹2,900 a month.</p>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify subsidy amounts and rules on official portals such as pmsuryaghar.gov.in.</blockquote>

<h2>Sizing tips that save money</h2>
<ul>
<li><strong>Cut waste first.</strong> Switching to LED lights, BEE star-rated appliances and an inverter AC can reduce the system size you need.</li>
<li><strong>Plan for the future.</strong> If you expect an EV or another AC in the next two years, include that load now so the inverter and wiring can handle it.</li>
<li><strong>Do not oversize for the subsidy.</strong> The subsidy stops increasing at 3 kW, so larger systems are paid for fully by you; size them only if your consumption justifies it.</li>
<li><strong>Size the inverter correctly.</strong> A slightly higher DC panel capacity than inverter AC rating is common and normal; use the <a href="/solar-inverter-size-calculator">inverter size calculator</a> to check the ratio.</li>
</ul>

<h2>Get your exact number</h2>
<p>The fastest way to do all of this is the <a href="/solar-calculator">solar calculator</a>: enter your monthly bill or units and your state, and it estimates system size, panel count, roof area, cost and savings. Then compare price and payback with the <a href="/solar-roi-calculator">ROI calculator</a>. When you want a site visit to check shading and structure, you can call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a>.</p>`,
    faqs: [
      { q: "How many solar panels are needed for a 3 kW system?", a: "With 540 to 600 Wp panels, a 3 kW system usually needs 5 or 6 panels. For example, six 550 Wp panels make 3.3 kWp." },
      { q: "How many units does a 1 kW solar system generate in India?", a: "Roughly 3.5 to 4.5 units per day averaged over the year, or about 110 to 135 units a month, depending on location, shading, tilt and cleaning." },
      { q: "How much roof area do I need for solar?", a: "Plan for about 80 to 100 sq ft of shadow-free roof per kW. A 3 kW system typically needs around 240 to 300 sq ft, plus space for maintenance access." },
      { q: "Should I install a bigger system than my consumption?", a: "Usually not. Many states pay a low rate for surplus exported units at the end of the settlement period, so sizing for 80 to 100 percent of your consumption normally gives the best return." }
    ]
  },
  {
    slug: 'net-metering-in-india-explained',
    title: 'Net Metering in India Explained: Rules, Billing & Process',
    description: 'How net metering works in India: net vs gross metering, a sample bill calculation, how surplus units are settled, and the process to get a net meter.',
    category: 'Guides',
    date: '2026-10-21',
    updated: '2026-11-17',
    readMins: 7,
    excerpt: 'Understand how your DISCOM counts imported and exported units, how your bill is calculated after solar, and how net metering differs from gross metering.',
    html: `<p>Net metering is what makes on-grid rooftop solar so attractive for Indian homes. It lets you use the DISCOM grid as a kind of storage: when your panels make more power than you use, the surplus goes to the grid; when they make less, you draw from it. At the end of the billing cycle, you pay only for the net units. This guide explains how net metering works, how it differs from gross metering and net billing, how your bill is calculated, and how to get a net meter installed.</p>

<h2>What is net metering?</h2>
<p>Under net metering, your normal one-way meter is replaced with a <strong>bi-directional meter</strong> (often called a net meter) that records two readings separately: units imported from the grid and units exported to the grid. Your bill is based on the difference.</p>
<blockquote><strong>Net units billed = Units imported − Units exported</strong> (plus any banked units carried forward)</blockquote>
<p>If you export more than you import in a month, the surplus is usually carried forward as a credit to the next billing cycle. At the end of the settlement period, which is commonly the financial year, any remaining surplus is either paid out at a rate set by the State Electricity Regulatory Commission (SERC) or lapses, depending on the state's rules.</p>

<h2>Who sets the rules?</h2>
<p>The Electricity (Rights of Consumers) Rules framed by the Ministry of Power give consumers the right to install rooftop solar. After a 2021 amendment, net metering is allowed for systems up to 500 kW or up to the sanctioned load, whichever is lower, while larger systems may be connected under gross metering. The detailed rules, such as settlement period, payment rate for surplus, fixed charges and paperwork, are set by each state's SERC, so they differ from state to state. Our <a href="/states">state-wise solar pages</a> summarise the key points for your state.</p>

<h2>Net metering vs gross metering vs net billing</h2>
<table>
<thead><tr><th>Arrangement</th><th>How it works</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>Net metering</td><td>Imports and exports are netted in units. You pay for net units at your normal tariff.</td><td>Homes and small consumers who use most of their solar power</td></tr>
<tr><td>Gross metering</td><td>All solar generation is exported to the grid and paid at a fixed feed-in tariff. Your consumption is billed separately at your normal tariff.</td><td>Larger plants and investors selling power</td></tr>
<tr><td>Net billing (net feed-in)</td><td>Imports are billed at your tariff, exports are credited in rupees at a separate, usually lower, rate.</td><td>Used by some states for certain consumer categories</td></tr>
</tbody>
</table>
<p>For most households, net metering is the most valuable, because each exported unit offsets a unit you would otherwise buy at the retail tariff, which is usually higher than any feed-in rate.</p>

<h2>A sample bill calculation</h2>
<p>Consider a home with a 3 kW on-grid system. In one month:</p>
<ul>
<li>Solar generation: 360 units</li>
<li>Solar used directly in the home during the day: 160 units</li>
<li>Exported to the grid: 200 units</li>
<li>Imported from the grid (mostly evenings and nights): 220 units</li>
</ul>
<p>Total consumption is 160 + 220 = 380 units. With net metering, the billed units are 220 − 200 = 20 units. Without solar, the family would have been billed for all 380 units, often in higher tariff slabs.</p>
<table>
<thead><tr><th>Scenario</th><th>Billed units</th><th>Indicative energy charge (at ₹7.5 per unit)</th></tr></thead>
<tbody>
<tr><td>Without solar</td><td>380</td><td>₹2,850</td></tr>
<tr><td>With solar and net metering</td><td>20</td><td>₹150</td></tr>
</tbody>
</table>
<p>Fixed charges, electricity duty and other levies still apply, so the bill will not be exactly zero. Real tariffs are slab-based and vary by state; run your own figures with the <a href="/solar-roi-calculator">solar ROI calculator</a>.</p>

<h2>Why oversizing rarely pays</h2>
<p>If your system regularly exports more than you import, the surplus builds up. At the end of the settlement period, many SERCs pay for leftover units at a rate based on the DISCOM's average power purchase cost, which is typically well below what you pay per unit. That is why it usually makes sense to size the system close to your annual consumption. Our guide on <a href="/blog/how-many-solar-panels-for-home">how many panels you need</a> shows how to size correctly, and the <a href="/solar-calculator">solar calculator</a> does it automatically.</p>

<h2>The net metering process</h2>
<p>For homes applying under PM Surya Ghar, net metering is built into the portal flow:</p>
<ol>
<li><strong>Apply</strong> on pmsuryaghar.gov.in with your consumer number and proposed capacity.</li>
<li><strong>Feasibility:</strong> the DISCOM checks network capacity. Under the 2024 amendment to the consumer rights rules, systems up to 10 kW are exempt from a technical feasibility study, and larger systems have a fixed time limit for it.</li>
<li><strong>Install</strong> the system through a registered vendor.</li>
<li><strong>Net meter application:</strong> installation details are submitted and any meter fee is paid.</li>
<li><strong>Meter installation and inspection:</strong> the DISCOM installs and tests the bi-directional meter and inspects the plant.</li>
<li><strong>Commissioning:</strong> the DISCOM issues the commissioning report and net billing starts from the next cycle.</li>
</ol>
<p>The full walkthrough, including documents, is in our <a href="/blog/how-to-apply-solar-subsidy-online">online subsidy application guide</a>.</p>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify on official portals. Subsidy amounts (up to ₹78,000 for homes in general-category states under PM Surya Ghar), meter fees and timelines vary and can change. Check pmsuryaghar.gov.in and your SERC and DISCOM regulations.</blockquote>

<h2>Things to check on your net-metered bill</h2>
<ul>
<li><strong>Import and export readings</strong> are shown separately and match the meter display.</li>
<li><strong>Banked units</strong> from previous months are carried forward correctly.</li>
<li><strong>Tariff category</strong> has not changed unexpectedly after the new meter.</li>
<li><strong>Settlement:</strong> at the end of the settlement period, check how surplus units were treated.</li>
</ul>
<p>Keep an eye on generation too. If export suddenly drops, the panels may be dirty or the inverter may have tripped; our <a href="/blog/solar-maintenance-tips">solar maintenance guide</a> explains what to check.</p>

<h2>Net metering for businesses</h2>
<p>Commercial and industrial consumers can also use net metering within the state limits, though some states apply different rules or charges to them. Because commercial tariffs are higher, savings per unit are often larger. If you are weighing ownership against a third-party arrangement, the <a href="/opex-vs-capex-calculator">OPEX vs CAPEX calculator</a> compares them. To get a site assessment for your home or business, you can call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a>.</p>`,
    faqs: [
      { q: "What is the difference between net metering and gross metering?", a: "Net metering nets imported and exported units, so you pay only for the difference at your normal tariff. Gross metering sends all solar generation to the grid at a fixed feed-in tariff, and your consumption is billed separately." },
      { q: "What happens to extra units exported to the grid?", a: "They are usually carried forward to the next billing cycle. At the end of the settlement period, many states pay for remaining surplus units at a rate set by the SERC, which is usually lower than the retail tariff." },
      { q: "Will my electricity bill become zero with net metering?", a: "Energy charges can drop to near zero if your solar generation matches your consumption, but fixed charges, duties and other levies usually still apply." },
      { q: "What is the maximum system size allowed under net metering?", a: "Central rules allow net metering up to 500 kW or the sanctioned load, whichever is lower, with state regulators setting the details. Check your SERC's current regulations." }
    ]
  },
  {
    slug: 'topcon-vs-mono-perc-vs-bifacial-panels',
    title: 'TOPCon vs Mono PERC vs Bifacial Panels: Which Is Best?',
    description: 'TOPCon vs Mono PERC vs bifacial solar panels compared for Indian rooftops: efficiency, heat, degradation, price and why DCR panels matter for the subsidy.',
    category: 'Technology',
    date: '2026-11-02',
    updated: '2026-11-20',
    readMins: 8,
    excerpt: 'How the main panel technologies compare in Indian heat, what bifacial really adds on a rooftop, and how DCR rules affect your choice.',
    html: `<p>Walk into any solar discussion in India today and you will hear three terms: Mono PERC, TOPCon and bifacial. Add DCR and non-DCR, and it can feel like the panel decision needs an engineering degree. It does not. This guide explains each technology in plain language, compares them on what actually matters for an Indian rooftop, and explains how the DCR rule affects your choice if you want the subsidy.</p>

<h2>A quick primer on how panels differ</h2>
<p>Almost all rooftop panels sold in India today use monocrystalline silicon cells. The differences lie in how the cell is built (its architecture), whether the silicon is p-type or n-type, and whether the panel can collect light from the back as well as the front. These choices affect efficiency, behaviour in heat, long-term degradation and price.</p>

<h2>Mono PERC</h2>
<p>PERC stands for Passivated Emitter and Rear Contact. It adds a layer on the back of the cell that reflects light back into the silicon and reduces energy losses. Mono PERC panels, usually on p-type wafers, were the industry standard for several years.</p>
<ul>
<li><strong>Typical module efficiency:</strong> roughly 20–21.5%.</li>
<li><strong>Heat behaviour:</strong> temperature coefficient of power typically around −0.34% to −0.37% per °C.</li>
<li><strong>Degradation:</strong> commonly about 2% in the first year and around 0.5–0.55% a year after that, per typical manufacturer warranties.</li>
<li><strong>Price:</strong> generally the cheapest per watt of the three, though the gap with TOPCon has narrowed sharply.</li>
</ul>

<h2>TOPCon</h2>
<p>TOPCon (Tunnel Oxide Passivated Contact) cells are usually made on n-type silicon and add an ultra-thin oxide layer and a doped polysilicon layer that cut recombination losses. TOPCon has rapidly become the mainstream technology for new production lines, including in India.</p>
<ul>
<li><strong>Typical module efficiency:</strong> roughly 22–23% or higher.</li>
<li><strong>Heat behaviour:</strong> temperature coefficient around −0.29% to −0.32% per °C, meaning it loses less output on hot rooftops.</li>
<li><strong>Degradation:</strong> commonly about 1% in the first year and around 0.4% a year after, and n-type cells are much less affected by light-induced degradation.</li>
<li><strong>Bifaciality:</strong> many TOPCon panels are bifacial by design, with high rear-side efficiency.</li>
</ul>
<p>Why the temperature coefficient matters in India: on a summer afternoon, panel cells can run 25–35 °C above air temperature. On a 45 °C day, cells can exceed 70 °C. A difference of about 0.05% per °C sounds tiny, but at 45 °C above the 25 °C test condition, it adds up to more than 2% extra output during the hottest hours, every summer, for 25 years.</p>

<h2>Bifacial panels</h2>
<p>Bifacial is not a cell technology but a panel design. The back sheet is replaced with glass (or a transparent back sheet) so that light reflected from the roof can reach the rear of the cells. Both PERC and TOPCon cells can be made bifacial.</p>
<p>The gain depends heavily on installation. On ground-mounted plants over bright surfaces, bifacial panels can add something like 5–15% energy. On a typical Indian rooftop with a low structure over a dark or dusty surface, the gain is often small, a few percent. You get more benefit when:</p>
<ul>
<li>the structure is elevated (for example 1.5–2 metres or more above the roof),</li>
<li>the roof surface is light-coloured, such as a white reflective coating, and</li>
<li>rows are spaced so the rear is not shaded.</li>
</ul>
<p>Glass-glass bifacial panels are also heavier and can be more robust against moisture, which is useful in humid and coastal areas.</p>

<h2>Comparison table</h2>
<table>
<thead><tr><th>Feature</th><th>Mono PERC</th><th>TOPCon (n-type)</th><th>Bifacial (PERC or TOPCon)</th></tr></thead>
<tbody>
<tr><td>Typical efficiency</td><td>~20–21.5%</td><td>~22–23%+</td><td>Front efficiency of the cell type, plus rear gain</td></tr>
<tr><td>Heat performance</td><td>Good</td><td>Better</td><td>Same as cell type</td></tr>
<tr><td>First-year degradation (typical)</td><td>~2%</td><td>~1%</td><td>Same as cell type</td></tr>
<tr><td>Annual degradation after (typical)</td><td>~0.5–0.55%</td><td>~0.4%</td><td>Same as cell type</td></tr>
<tr><td>Rooftop benefit</td><td>Lowest cost</td><td>More units per kW, less roof per kW</td><td>Worth it on elevated structures over light roofs</td></tr>
</tbody>
</table>
<p>These are typical ranges from manufacturer datasheets; always check the exact datasheet and warranty of the model offered to you.</p>

<h2>DCR vs non-DCR panels</h2>
<p>This is the decision that matters most for homeowners who want the subsidy. <strong>DCR (Domestic Content Requirement) panels</strong> are modules manufactured in India using solar cells that are also made in India. <strong>Non-DCR panels</strong> may be assembled in India but use imported cells, or may be fully imported.</p>
<ul>
<li><strong>Subsidy:</strong> under PM Surya Ghar, only DCR panels qualify for the central subsidy for residential rooftops.</li>
<li><strong>Price:</strong> DCR panels cost more per watt, because domestic cell manufacturing is still scaling up.</li>
<li><strong>Technology:</strong> Indian manufacturers now offer both DCR Mono PERC and DCR TOPCon panels, so you do not have to give up newer technology to get the subsidy.</li>
<li><strong>ALMM:</strong> panels for net-metered projects must be from manufacturers on the government's Approved List of Models and Manufacturers (ALMM). From 1 June 2026, net-metering projects are also generally required to use cells from ALMM List-II, with specific exemptions announced by MNRE.</li>
</ul>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify on official portals. The central subsidy for homes is ₹30,000 per kW for the first 2 kW and ₹18,000 for the third kW, up to ₹78,000 in general-category states. DCR and ALMM rules are updated periodically; check pmsuryaghar.gov.in and mnre.gov.in for the current position.</blockquote>
<p>For a 3 kW home system, the subsidy of up to ₹78,000 is far larger than the extra cost of DCR panels, so DCR is the clear choice. For larger commercial systems that do not get the residential subsidy, non-DCR panels can be cheaper, but check ALMM requirements for net metering in your state.</p>

<h2>So which should you choose?</h2>
<ol>
<li><strong>For a subsidised home system:</strong> DCR TOPCon if the price difference over DCR Mono PERC is small; DCR Mono PERC if your budget is tight. Both are good.</li>
<li><strong>For a small or crowded roof:</strong> TOPCon, because its higher efficiency packs more kW into the same area. Check your space with the <a href="/roof-area-calculator">roof area calculator</a>.</li>
<li><strong>For an elevated structure over a white roof:</strong> bifacial TOPCon can add a useful bonus.</li>
<li><strong>For businesses:</strong> compare cost per unit generated over 25 years, not just price per watt. The <a href="/solar-roi-calculator">ROI calculator</a> helps.</li>
</ol>
<p>Panel choice also affects string design, because TOPCon panels may have different voltage and current ratings. Check with the <a href="/solar-string-sizing-calculator">string sizing calculator</a>, and see our <a href="/blog/solar-panel-price-in-india">price guide</a> for how panel choice affects total cost.</p>

<h2>Warranties to look for</h2>
<p>Look for a product warranty of at least 10–12 years and a linear performance warranty of 25–30 years from a manufacturer with a strong presence in India. Ask the installer to put the exact make and model in the quote, then paste it into the <a href="/solar-quote-checker">solar quote checker</a>. If you would like a recommendation for your roof, you can call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a>.</p>`,
    faqs: [
      { q: "Is TOPCon better than Mono PERC for Indian homes?", a: "Usually yes. TOPCon panels typically have higher efficiency, a better temperature coefficient and lower degradation, so they generate more units per kW in Indian heat. If the price difference is small, TOPCon is the better long-term choice." },
      { q: "Are bifacial panels worth it on a rooftop?", a: "Only when the structure is elevated, the roof surface is light or reflective, and the rear is not shaded. On a low structure over a dark roof, the extra generation is usually small." },
      { q: "What is a DCR solar panel?", a: "A DCR panel is manufactured in India using solar cells that are also made in India. Only DCR panels qualify for the PM Surya Ghar residential subsidy." },
      { q: "Can I use non-DCR panels and still get the subsidy?", a: "No. Systems with non-DCR panels are not eligible for the central residential subsidy. Confirm DCR status in writing before installation." }
    ]
  },
  {
    slug: 'solar-maintenance-tips',
    title: 'Solar Panel Maintenance Tips: Cleaning, Monsoon & Warranty',
    description: 'Practical solar panel maintenance tips for Indian homes: safe cleaning, monthly checks, inverter care, monsoon preparation and protecting your warranty.',
    category: 'Guides',
    date: '2026-11-12',
    updated: '2026-11-20',
    readMins: 7,
    excerpt: 'Simple routines that keep a rooftop solar system generating at its best for 25 years, from dust and bird droppings to monsoon checks and warranty claims.',
    html: `<p>Rooftop solar has no moving parts, which is why it is often described as maintenance-free. It is more accurate to say it is <em>low</em> maintenance. In Indian conditions, dust, bird droppings, heat, heavy monsoon rain and voltage fluctuations all take a toll. A few simple habits can keep your system producing close to its rated output for 25 years and protect your warranty. This guide covers cleaning, routine inspection, inverter care, monsoon preparation and warranties.</p>

<h2>1. Cleaning: the single biggest factor</h2>
<p>Dust is the most common reason Indian rooftop systems underperform. In dry, dusty months, or near construction sites, roads and industry, a layer of dust can reduce output noticeably within a couple of weeks, and losses of 10–20% or more are possible on heavily soiled panels. Bird droppings are worse, because they block light completely on part of a cell and can create hot spots.</p>
<h3>How often to clean</h3>
<ul>
<li><strong>Dusty or dry regions:</strong> every one to two weeks in the dry season.</li>
<li><strong>Typical urban homes:</strong> every two to four weeks.</li>
<li><strong>During the monsoon:</strong> rain does much of the work, but check for streaks, mud and bird droppings.</li>
</ul>
<p>A useful trick: note your daily generation from the inverter display or monitoring before and after cleaning. If cleaning gives a big jump, clean more often.</p>
<h3>How to clean safely</h3>
<ul>
<li>Clean early in the morning or in the evening, when panels are cool. Cold water on hot glass can cause thermal stress.</li>
<li>Use plain water and a soft brush, sponge or microfibre mop on a long handle. Use low-TDS water where possible, because hard water leaves white spots.</li>
<li>Do not use detergents, abrasive powders, wire brushes or high-pressure jets. These can damage the anti-reflective coating and seals, and may void the warranty.</li>
<li>Never stand or walk on panels. Use a safe walkway and take care near roof edges and parapets.</li>
<li>Do not spray water on the inverter, junction boxes or cable joints.</li>
</ul>
<p>If your roof is hard to access, consider a cleaning arrangement with your installer or an automatic sprinkler system designed for solar panels.</p>

<h2>2. Monthly and quarterly visual checks</h2>
<p>Spend ten minutes once a month looking at the system, without touching any live parts.</p>
<ul>
<li><strong>Panels:</strong> cracks, broken glass, brown or discoloured patches, or snail-trail lines.</li>
<li><strong>Shading:</strong> new shadows from a growing tree, a new water tank or a neighbour's construction.</li>
<li><strong>Structure:</strong> rust, loose bolts, cracked foundations or tilted rows, especially after storms.</li>
<li><strong>Cables:</strong> loose or hanging cables, rodent damage, cracked conduits and MC4 connectors lying in water.</li>
<li><strong>Earthing and lightning arrestor:</strong> intact connections. Earth resistance should be tested periodically by a qualified electrician, ideally before the monsoon.</li>
</ul>
<p>Any electrical work on DC cables, distribution boxes or the inverter should be done only by a trained technician. Solar DC can be dangerous even when the grid is off.</p>

<h2>3. Inverter care</h2>
<p>The inverter is the hardest-working component and usually the first to need attention. Panels often carry 25–30 year performance warranties, while string inverters commonly carry 5–10 years, so plan for one inverter replacement or major repair over the system's life.</p>
<ul>
<li><strong>Ventilation:</strong> keep the inverter in a shaded, ventilated spot. Direct sun and enclosed spaces cause overheating and power derating.</li>
<li><strong>Dust:</strong> wipe the heat sink and vents with a dry cloth when the unit is off.</li>
<li><strong>Error codes:</strong> check the display or monitoring regularly. Frequent grid over-voltage trips are common in some areas; report them to your installer, who can check settings within DISCOM limits.</li>
<li><strong>Monitoring:</strong> if your inverter supports remote monitoring over Wi-Fi, keep it connected. A sudden drop in daily units is the earliest warning sign of a problem.</li>
</ul>
<p>To check whether your inverter is correctly sized for your panels, use the <a href="/solar-inverter-size-calculator">inverter size calculator</a>. If you have batteries, follow the manufacturer's instructions on temperature and charging; for lead-acid types, check terminals and electrolyte levels as advised. The <a href="/solar-battery-calculator">battery calculator</a> helps when replacing or expanding storage.</p>

<h2>4. Monsoon and storm preparation</h2>
<ul>
<li><strong>Before the monsoon:</strong> tighten structure bolts, check that cable entries are sealed, clear roof drains under the panels, and get earthing tested.</li>
<li><strong>Roof waterproofing:</strong> check for leaks around the structure's foundations or anchor points and repair them before the rains.</li>
<li><strong>Cyclone and high-wind areas:</strong> coastal homes in Gujarat, Odisha, Andhra Pradesh, Tamil Nadu and elsewhere should confirm that the structure was designed for local wind speeds.</li>
<li><strong>Lightning:</strong> make sure the lightning arrestor and surge protection devices are intact. Replace any SPD whose indicator shows it has operated.</li>
<li><strong>After a storm:</strong> do a visual check from a safe position before going near the panels.</li>
</ul>
<p>Expect lower generation on cloudy days; that is normal. Compare monthly totals with the same month last year rather than with sunny summer months.</p>

<h2>5. Track performance</h2>
<p>A simple log of monthly units generated, from the inverter or your net-metered bill, tells you whether the system is healthy. A well-maintained system loses only a small fraction of output each year to normal degradation. If output falls much faster, ask your installer to investigate. The <a href="/solar-calculator">solar calculator</a> shows how much a system of your size should produce in your state, and our <a href="/blog/net-metering-in-india-explained">net metering guide</a> explains how to read import and export readings.</p>

<h2>6. Warranties and documentation</h2>
<p>A typical rooftop system involves several warranties:</p>
<table>
<thead><tr><th>Component</th><th>Typical warranty</th><th>What it covers</th></tr></thead>
<tbody>
<tr><td>Panels: product</td><td>10–12 years</td><td>Manufacturing defects</td></tr>
<tr><td>Panels: performance</td><td>25–30 years</td><td>Minimum output over time</td></tr>
<tr><td>Inverter</td><td>5–10 years</td><td>Inverter faults (extended options available)</td></tr>
<tr><td>Installation (workmanship)</td><td>As per installer contract</td><td>Structure, wiring and installation quality</td></tr>
</tbody>
</table>
<p>Under PM Surya Ghar, registered vendors are expected to provide maintenance support for a fixed period after installation; check the exact terms in your vendor agreement. Keep the invoice, panel serial numbers, inverter warranty card, commissioning report and photographs in one folder. Claims are much faster when you can show the serial numbers and installation date, and when you have not used harsh cleaning methods that the manufacturer excludes.</p>
<blockquote><strong>Disclaimer:</strong> figures are indicative; verify on official portals. If your system was installed with the central subsidy (up to ₹78,000 for homes in general-category states), keep all subsidy and commissioning documents, and check current scheme terms on pmsuryaghar.gov.in.</blockquote>

<h2>When to call a professional</h2>
<p>Call your installer if you see burn marks, smell burning, notice cracked panels, see repeated inverter faults, or generation drops sharply without an obvious cause such as dust or cloud. If your original installer is no longer available, or you are planning a new or expanded system, you can call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a> or <a href="/get-solar-quote">request a free quote</a> for an assessment. Thinking of upgrading? Our guides on <a href="/blog/topcon-vs-mono-perc-vs-bifacial-panels">panel technology</a> and <a href="/blog/solar-panel-price-in-india">solar prices in 2026</a> will help you plan.</p>`,
    faqs: [
      { q: "How often should I clean my solar panels?", a: "In most Indian cities, every two to four weeks, and every one to two weeks in very dusty or dry areas. Compare generation before and after cleaning to find the right frequency for your roof." },
      { q: "Can I use soap or a pressure washer to clean panels?", a: "Avoid both. Use plain, preferably low-TDS water and a soft brush or mop. Detergents, abrasives and high-pressure jets can damage the coating and seals and may void the warranty." },
      { q: "How long does a solar inverter last?", a: "String inverters commonly carry 5 to 10 year warranties and often last longer with good ventilation and care, but most homeowners should plan for one replacement or major repair during the 25-year life of the panels." },
      { q: "Does rain clean solar panels?", a: "Rain removes loose dust, but it can leave streaks and mud and does not remove bird droppings well. A quick check and spot clean during the monsoon is still useful." }
    ]
  },
  {
    slug: 'solar-loan-for-home-interest-rate-emi',
    title: 'Solar Loan for Home 2026: Interest Rate, EMI & How to Apply',
    description: 'Solar loan for home in India: collateral-free loans up to ₹2 lakh under PM Surya Ghar, 2026 interest rates, EMI examples, documents and how to apply.',
    category: 'Finance',
    date: '2026-11-22',
    updated: '2026-11-22',
    readMins: 7,
    tools: ['solar-emi-calculator', 'solar-roi-calculator', 'solar-subsidy-calculator'],
    excerpt: 'How rooftop solar loans work in 2026: the two loan slabs under PM Surya Ghar, what banks charge, EMI tables and how the subsidy reduces your loan.',
    html: `<p>You do not need to pay the full price of a rooftop solar system upfront. Under PM Surya Ghar: Muft Bijli Yojana, public-sector banks give collateral-free loans for home systems at a concessional rate, and for most families the monthly saving on the electricity bill is close to, or more than, the EMI. This guide explains the two loan slabs, what interest to expect in late 2026, what the EMI looks like and how to apply.</p>

<h2>The two solar loan slabs under PM Surya Ghar</h2>
<p>Banks follow a common model scheme for rooftop solar loans to households, with small differences from bank to bank. Broadly:</p>
<table>
<thead><tr><th>Feature</th><th>Systems up to 3 kW</th><th>Systems above 3 kW, up to 10 kW</th></tr></thead>
<tbody>
<tr><td>Maximum loan</td><td>About ₹2 lakh</td><td>About ₹6 lakh</td></tr>
<tr><td>Your own contribution (margin)</td><td>Around 10% of the project cost</td><td>Around 20% of the project cost</td></tr>
<tr><td>Interest rate</td><td>Concessional: RBI repo rate + 0.5% – about 6% a year in November 2026</td><td>Normal bank rates – from about 8.15% a year</td></tr>
<tr><td>Collateral</td><td>None; the solar system itself is hypothecated to the bank</td><td>Usually none beyond the system, but banks look at income and credit score</td></tr>
<tr><td>Repayment period</td><td>Up to 10 years, including a moratorium of about 6 months</td><td>Up to 10 years</td></tr>
</tbody>
</table>
<p>All these loans carry a floating rate, so the EMI can move when the repo rate changes. Limits, margins, processing fees and the documents asked for differ between banks, so treat the table as a guide and confirm the current terms with your bank or on the JanSamarth portal.</p>
<blockquote><strong>Disclaimer:</strong> rates and limits are indicative and change with RBI policy and each bank's rules. Check the bank's website or branch before you apply.</blockquote>

<h2>What will the EMI be?</h2>
<p>The table shows the monthly EMI at 6% a year, close to what the smaller loan slab cost in 2026. Use the <a href="/solar-emi-calculator">solar loan EMI calculator</a> for your own amount, rate and tenure.</p>
<table>
<thead><tr><th>Loan amount</th><th>5 years</th><th>7 years</th><th>10 years</th></tr></thead>
<tbody>
<tr><td>₹1,00,000</td><td>₹1,933</td><td>₹1,461</td><td>₹1,110</td></tr>
<tr><td>₹1,50,000</td><td>₹2,900</td><td>₹2,191</td><td>₹1,665</td></tr>
<tr><td>₹2,00,000</td><td>₹3,867</td><td>₹2,922</td><td>₹2,220</td></tr>
</tbody>
</table>
<p>For the larger slab, a ₹3 lakh loan at 8.15% works out to about ₹6,104 a month over 5 years, ₹4,698 over 7 years or ₹3,664 over 10 years.</p>

<h2>Will the savings cover the EMI?</h2>
<p>Usually, yes. Take the most popular size, a <a href="/3kw-solar-system-price">3 kW system costing about {cost3}</a>. It generates around 380 units a month, worth roughly ₹2,700 at ₹7 per unit. If you borrow ₹1.5 lakh for 7 years at 6%, the EMI is about ₹2,191 – already less than the saving. The central subsidy of ₹78,000 then arrives in your bank account a few weeks after commissioning. Use it to prepay the loan and the outstanding amount roughly halves, so you can either cut the EMI or finish the loan years early.</p>
<p>The picture is tighter for very small systems on low tariffs, and better for homes on high slabs. Check your own figures in the <a href="/solar-roi-calculator">solar ROI calculator</a>.</p>

<h2>What happens to the subsidy when you take a loan?</h2>
<p>The subsidy is always paid to the consumer's bank account after the DISCOM issues the commissioning report. When the system is financed, many banks ask that the account you register on the national portal is the loan-linked account, so that the subsidy goes towards the loan. Ask the bank at the start how it treats the subsidy and whether there is any charge for part-prepayment; under the model scheme there should be none.</p>

<h2>Who can get a solar loan, and which documents are needed?</h2>
<ul>
<li><strong>Applicant:</strong> the person in whose name the electricity connection stands, with rights over the roof. A co-applicant from the family is normally allowed.</li>
<li><strong>For loans up to ₹2 lakh:</strong> KYC (Aadhaar and PAN), the latest electricity bill, the application or feasibility acknowledgement from the national portal and the quotation of a vendor registered with your DISCOM. Many banks do not ask for income documents in this slab.</li>
<li><strong>For loans above ₹2 lakh:</strong> the same, plus income proof such as salary slips or income-tax returns and bank statements. A good credit score matters more here.</li>
<li><strong>The system:</strong> it must be a grid-connected rooftop system with DCR panels, installed by a registered vendor – the same conditions as for the subsidy.</li>
</ul>

<h2>How to apply for a solar loan</h2>
<ol>
<li>Register and submit your rooftop solar application on pmsuryaghar.gov.in. Our <a href="/pm-surya-ghar-apply-online">step-by-step application guide</a> covers this.</li>
<li>Choose a registered vendor and get a written quotation with the system size, brands and price.</li>
<li>On the portal, choose the loan option. It takes you to the JanSamarth platform, where you can compare participating banks and apply online; you can also walk into a branch with the quotation.</li>
<li>The bank sanctions the loan and usually pays the vendor directly, in stages, after you have paid your margin.</li>
<li>After installation and net metering, the subsidy is credited and you can prepay part of the loan.</li>
</ol>

<h2>Bank loan, installer EMI or personal loan?</h2>
<table>
<thead><tr><th>Option</th><th>Typical cost</th><th>Good to know</th></tr></thead>
<tbody>
<tr><td>Public-sector bank loan under PM Surya Ghar</td><td>Lowest – about 6% for the small slab in November 2026</td><td>Some paperwork and a branch visit may be needed</td></tr>
<tr><td>Top-up on an existing home loan</td><td>Close to your home-loan rate</td><td>Long tenure, quick if you already bank there</td></tr>
<tr><td>Installer or NBFC “easy EMI”</td><td>Often well above bank rates once fees are counted</td><td>Fast approval; read the processing fee and the real annual rate</td></tr>
<tr><td>Personal loan or credit card EMI</td><td>Usually the costliest</td><td>Use only for a small, short gap</td></tr>
</tbody>
</table>
<p>On a ₹1.5 lakh loan over five years, the difference between 6% and 14% is about ₹35,000 of extra interest, so it is worth the extra day of paperwork to get the bank rate.</p>

<h2>Five tips before you sign</h2>
<ul>
<li><strong>Borrow for the net cost, not the full price,</strong> if you can pay the subsidy portion from savings until it is refunded.</li>
<li><strong>Pick a tenure where the EMI is below your bill saving.</strong> The system then pays for itself from the first month.</li>
<li><strong>Prepay with the subsidy.</strong> It is the single biggest saving on interest.</li>
<li><strong>Check the quote before the bank does.</strong> Run it through the <a href="/solar-quote-checker">solar quote checker</a>; a loan on an overpriced system is still overpriced.</li>
<li><strong>Keep the paperwork.</strong> Invoice, warranty cards, commissioning report and loan statements are needed for the subsidy, insurance and any later sale of the house.</li>
</ul>
<p>Need a quotation to take to the bank? Call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a>, or <a href="/get-solar-quote">request a free quote</a>.</p>`,
    faqs: [
      { q: "What is the interest rate on a solar loan under PM Surya Ghar?", a: "For systems up to 3 kW, public-sector banks lend up to about ₹2 lakh at a concessional floating rate linked to the RBI repo rate, about 6% a year in November 2026 (repo rate + 0.5%). Loans above ₹2 lakh, up to ₹6 lakh, for larger home systems are charged normal bank rates, from about 8.15%. Confirm the current rate with your bank." },
      { q: "Is collateral needed for a solar loan?", a: "Not for the standard home loans under the scheme. The solar system itself is hypothecated to the bank, and no other security is normally taken for loans up to about ₹2 lakh." },
      { q: "What is the EMI on a ₹2 lakh solar loan?", a: "At 6% a year it is about ₹3,867 a month for 5 years, ₹2,922 for 7 years or ₹2,220 for 10 years." },
      { q: "Can I get a solar loan and the subsidy together?", a: "Yes. The loan pays the installer, and the central subsidy of up to ₹78,000 is credited after commissioning. Most borrowers use the subsidy to prepay part of the loan." },
      { q: "Which banks give solar rooftop loans?", a: "Public-sector banks such as SBI, PNB, Bank of Baroda, Canara Bank, Union Bank and Bank of Maharashtra have rooftop solar loan schemes, and applications can be made through the JanSamarth portal linked from pmsuryaghar.gov.in." }
    ]
  },
  {
    slug: 'dcr-vs-non-dcr-solar-panels',
    title: 'DCR vs Non-DCR Solar Panels: Price, Subsidy & How to Check',
    description: 'DCR vs non-DCR solar panels explained: what DCR means, why it is compulsory for the PM Surya Ghar subsidy, the price gap, ALMM and how to verify a panel.',
    category: 'Technology',
    date: '2026-11-22',
    updated: '2026-11-22',
    readMins: 7,
    tools: ['solar-subsidy-calculator', 'solar-quote-checker', 'solar-system-price-estimator'],
    excerpt: 'What DCR really means, why a subsidy claim fails without it, how much more DCR panels cost and the checks to make before the panels reach your roof.',
    html: `<p>If you are buying rooftop solar with the government subsidy, one three-letter word on the quotation decides whether you get up to ₹78,000 back or nothing at all: DCR. Installers mention it constantly, yet few explain it. This guide sets out what DCR and non-DCR panels are, how the price differs, where ALMM fits in and how to check that the panels delivered to your roof are the ones you paid for.</p>

<h2>What does DCR mean?</h2>
<p>DCR stands for <strong>Domestic Content Requirement</strong>. A DCR solar panel is one in which both the solar cells and the finished module are manufactured in India. A non-DCR panel is any other panel – most commonly a module assembled in India from imported cells, or a fully imported module.</p>
<p>The distinction is about where the cells are made, not about the technology. Mono PERC, TOPCon and bifacial panels are all available in DCR and non-DCR versions, often from the same factory and with the same warranty.</p>

<h2>Why DCR is compulsory for the subsidy</h2>
<p>The central subsidy under PM Surya Ghar: Muft Bijli Yojana is paid only for grid-connected home systems built with DCR modules and installed by a vendor registered with the DISCOM. The same condition applies to other central programmes such as the pump components of PM-KUSUM. The reason is policy: public money is meant to support Indian cell and module manufacturing.</p>
<p>At inspection, the DISCOM checks the make, model and serial numbers of the panels against what the vendor has uploaded to the national portal. If the modules turn out to be non-DCR, the claim can be rejected, and there is no way to fix that short of replacing the panels. If you are claiming the subsidy, assume that every panel in the system has to be DCR, including on systems larger than 3 kW.</p>

<h2>DCR vs non-DCR at a glance</h2>
<table>
<thead><tr><th>Point</th><th>DCR panels</th><th>Non-DCR panels</th></tr></thead>
<tbody>
<tr><td>Solar cells</td><td>Made in India</td><td>Imported</td></tr>
<tr><td>Module assembly</td><td>India</td><td>India or abroad</td></tr>
<tr><td>PM Surya Ghar subsidy</td><td>Eligible</td><td>Not eligible</td></tr>
<tr><td>Price per watt</td><td>Higher</td><td>Lower</td></tr>
<tr><td>Technology and warranty</td><td>Same range – Mono PERC or TOPCon, 25–30 year performance warranty</td><td>Same range</td></tr>
<tr><td>Typical buyer</td><td>Homes and housing societies claiming subsidy; government projects</td><td>Commercial and industrial users, homes not claiming subsidy</td></tr>
</tbody>
</table>

<h2>How much more do DCR panels cost?</h2>
<p>Indian-made cells cost more to produce than imported ones, so DCR modules carry a premium of several rupees per watt. On a 3 kW home system the difference has typically been in the range of ₹20,000 to ₹30,000 – far less than the ₹78,000 subsidy that DCR unlocks. For a home that qualifies, DCR is therefore always the better deal:</p>
<ul>
<li>A 3 kW on-grid system with DCR panels costs about {range3}; after the subsidy the net cost is roughly {net3}.</li>
<li>The same system with non-DCR panels might be quoted ₹20,000–30,000 cheaper, but with no subsidy you would pay far more in the end.</li>
</ul>
<p>The sums are different for shops, offices and factories. They receive no residential subsidy, so many choose non-DCR panels and rely on depreciation benefits instead. See the <a href="/solar-panel-price">solar panel price list</a> for current home prices and the <a href="/opex-vs-capex-calculator">OPEX vs CAPEX calculator</a> for business cases.</p>
<blockquote><strong>Disclaimer:</strong> price differences are indicative and move with module prices. Subsidy rules are set by MNRE; verify the current position on pmsuryaghar.gov.in.</blockquote>

<h2>Where does ALMM fit in?</h2>
<p>ALMM is the government's <strong>Approved List of Models and Manufacturers</strong>. It is a separate requirement from DCR:</p>
<ul>
<li><strong>ALMM List-I</strong> covers solar modules. Panels used in net-metered and government-supported projects must come from a model and manufacturer on this list.</li>
<li><strong>ALMM List-II</strong> covers solar cells. From 1 June 2026, net-metered projects are generally required to use modules made with cells from List-II manufacturers as well, subject to the exemptions MNRE has announced.</li>
</ul>
<p>So a panel can be ALMM-listed without being DCR, but a subsidy system needs both: an ALMM-listed model that is also DCR. As List-II takes effect, more of the rooftop market is moving to Indian-made cells, and the price gap between DCR and non-DCR panels is expected to narrow.</p>

<h2>How to check that your panels are DCR</h2>
<ol>
<li><strong>Get it in writing.</strong> The quotation and the invoice should state the manufacturer, model, wattage and the words “DCR modules”.</li>
<li><strong>Ask for the manufacturer's DCR declaration.</strong> Reputable manufacturers issue a certificate or declaration listing the serial numbers of the DCR modules supplied.</li>
<li><strong>Match the serial numbers.</strong> Every panel has a serial number on its label and in its RFID tag. Photograph the labels before the panels go up and compare them with the declaration and with what the vendor uploads to the portal.</li>
<li><strong>Check the model against ALMM.</strong> The current list is published on the MNRE website.</li>
<li><strong>Use a registered vendor.</strong> Only vendors registered with your DISCOM on the national portal can submit installation details for a subsidy claim.</li>
</ol>

<h2>Red flags</h2>
<ul>
<li>A quote that is much cheaper than others for the “same” DCR system. Compare it with the <a href="/solar-quote-checker">solar quote checker</a>.</li>
<li>An installer who says the DCR papers will come “after the subsidy”.</li>
<li>Panel labels that do not match the model named on the invoice.</li>
<li>Mixed panels of different makes on one roof.</li>
</ul>

<h2>Which should you choose?</h2>
<ul>
<li><strong>Home claiming the PM Surya Ghar subsidy:</strong> DCR, without exception. Then choose the technology – our comparison of <a href="/blog/topcon-vs-mono-perc-vs-bifacial-panels">TOPCon, Mono PERC and bifacial panels</a> will help.</li>
<li><strong>Home not eligible for subsidy</strong> (for example, a second system on a connection that has already claimed): compare both on price and warranty.</li>
<li><strong>Business:</strong> decide on cost per unit over 25 years, and confirm the ALMM rules that apply to net metering in your state.</li>
</ul>
<p>For a quotation that names the panel make, model and DCR status line by line, call our installation partner Avirat Energy on <a href="tel:{tel}">{phone}</a>, or <a href="/get-solar-quote">request a free quote</a>. Check the subsidy you should receive with the <a href="/solar-subsidy-calculator">solar subsidy calculator</a>.</p>`,
    faqs: [
      { q: "What is the difference between DCR and non-DCR solar panels?", a: "In a DCR panel both the solar cells and the module are made in India. A non-DCR panel uses imported cells or is imported as a finished module. The technology and warranties can be identical; the difference is the origin of the cells." },
      { q: "Is DCR mandatory for the PM Surya Ghar subsidy?", a: "Yes. The central subsidy is paid only for grid-connected systems that use DCR modules and are installed by a vendor registered with the DISCOM." },
      { q: "Are DCR panels better in quality than non-DCR panels?", a: "Not inherently. Quality depends on the manufacturer, the materials and the technology, not on where the cells were made. Compare efficiency, temperature coefficient and warranty terms." },
      { q: "How much costlier are DCR panels?", a: "They cost several rupees more per watt. On a 3 kW system the difference has typically been around ₹20,000 to ₹30,000, which is much less than the ₹78,000 subsidy." },
      { q: "How can I verify that my solar panels are DCR?", a: "Ask for the manufacturer's DCR declaration with serial numbers, match those numbers with the panel labels and with the details uploaded on the national portal, and make sure the invoice states DCR modules." }
    ]
  }
];

const TOKENS = { ...globalTokens(), tel: PARTNER.tel, hybrid3: typeRange(3, 'hybrid'), offgrid3: typeRange(3, 'offgrid') };
export const POSTS = fillDict(RAW, TOKENS);
