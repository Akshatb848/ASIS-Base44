// Analysis content templates — Part 1: industry context + competitive/growth

export const INDUSTRY_CONTEXT = {
  'Technology': { hhi: '1,240–1,680', topPlayers: 5, growthRate: '12–18%', margin: '18–32%', capexRatio: '8–14%' },
  'Financial Services': { hhi: '1,800–2,400', topPlayers: 4, growthRate: '4–8%', margin: '22–38%', capexRatio: '4–7%' },
  'Healthcare': { hhi: '900–1,400', topPlayers: 6, growthRate: '6–10%', margin: '12–24%', capexRatio: '10–18%' },
  'Consumer Goods': { hhi: '1,100–1,600', topPlayers: 5, growthRate: '3–6%', margin: '14–22%', capexRatio: '5–9%' },
  'Energy': { hhi: '1,600–2,200', topPlayers: 4, growthRate: '2–5%', margin: '10–20%', capexRatio: '20–35%' },
  'Manufacturing': { hhi: '800–1,300', topPlayers: 7, growthRate: '2–4%', margin: '8–16%', capexRatio: '12–20%' },
  'Retail': { hhi: '700–1,100', topPlayers: 8, growthRate: '3–7%', margin: '4–10%', capexRatio: '3–6%' },
  'Telecommunications': { hhi: '2,200–2,800', topPlayers: 3, growthRate: '1–4%', margin: '20–34%', capexRatio: '15–22%' },
  'default': { hhi: '1,000–1,500', topPlayers: 6, growthRate: '4–8%', margin: '12–20%', capexRatio: '8–12%' },
}

export function getCtx(industry) {
  return INDUSTRY_CONTEXT[industry] || INDUSTRY_CONTEXT['default']
}

// ── Competitive templates ──────────────────────────────────────────────────────
export const COMPETITIVE_TEMPLATES = {
  porter_five_forces: (co, ind, ctx) => `
<p><strong>Industry Rivalry — High Intensity</strong><br/>
The ${ind} sector exhibits concentrated competition, with the top ${ctx.topPlayers} players controlling an estimated 58–65% of addressable market (Herfindahl-Hirschman Index: ${ctx.hhi}). Competitive battlegrounds have shifted from price toward ecosystem depth, switching-cost engineering, and data-driven service differentiation. ${co} faces margin compression of 150–250 bps annually if it does not accelerate its differentiation agenda.</p>
<p><strong>Threat of New Entrants — Moderate</strong><br/>
Capital requirements and regulatory complexity provide a 24–36-month incumbency buffer. However, well-capitalised adjacent-sector entrants (technology platforms, private-equity-backed roll-ups) are eroding traditional barriers at a pace that warrants active monitoring. Minimum efficient scale sits at approximately ${ctx.growthRate} of segment revenue before unit economics become viable.</p>
<p><strong>Supplier Bargaining Power — Moderate-High</strong><br/>
Key input concentration is rising: the top three supplier categories represent 40–55% of ${co}'s direct cost base. Multi-sourcing strategies and strategic inventory buffers can reduce this dependency by an estimated 12–18% over 18 months. Long-term supply agreements covering 60%+ of critical inputs are the near-term priority.</p>
<p><strong>Buyer Bargaining Power — High</strong><br/>
Customer concentration has increased, with the top-decile accounts now representing 34–42% of revenues. Churn risk is elevated where switching costs remain low and procurement sophistication is high — particularly in institutional and enterprise segments. Deepening product integration and outcome-based commercial structures are the primary levers to reduce buyer leverage.</p>
<p><strong>Threat of Substitutes — Moderate</strong><br/>
Adjacent technology categories and alternative service models are creating substitute pressure at the margin, particularly for commodity-tier offerings. ${co}'s premium and integrated-suite positions are substantially more defensible, with substitute-driven churn estimated at under 3% annually for these cohorts.</p>`.trim(),

  competitive_positioning: (co, ind) => `
<p><strong>Positioning Assessment</strong><br/>
${co} occupies a mid-premium position within the ${ind} competitive landscape — differentiated enough to command a 5–12% price premium over category average, but not yet commanding the brand equity or switching costs of the top-tier incumbents. The gap between ${co}'s current positioning and a defensible leadership position is primarily one of scale, ecosystem lock-in, and brand salience rather than core product capability.</p>
<p><strong>Differentiation Vectors</strong><br/>
Our analysis identifies three axes on which ${co} can realistically build sustainable differentiation within a 24-month horizon: (1) vertical-specific functionality — investing $X–Xm to deepen domain logic for the two highest-value segments; (2) integration density — increasing the number of live API integrations from the current baseline to 40+ connectors, doubling switching costs; (3) service excellence — targeting a 15-point NPS improvement through structured customer success investment.</p>
<p><strong>Competitive Response Risk</strong><br/>
Incumbent responses to ${co}'s growth trajectory will likely manifest as aggressive pricing on renewal cohorts (risk window: 6–12 months) and feature parity investments targeted at ${co}'s top-differentiating capabilities (12–24 months). A preemptive moat-building programme — anchored around proprietary data assets and outcome-guarantees — is the recommended counter-strategy.</p>`.trim(),

  strategic_group_analysis: (co, ind) => `
<p><strong>Group Topology</strong><br/>
The ${ind} market resolves into four distinct strategic groups when mapped across the dimensions of geographic scope and product breadth: (1) Global Full-Suite Leaders — 2–3 players commanding 35–42% share with broad portfolios and multi-region presence; (2) Regional Specialists — 4–6 players with deep vertical or geographic focus and EBITDA margins 300–500 bps above segment average; (3) Challenger Platforms — 3–5 technology-forward entrants with high growth (20–35% YoY) but sub-scale economics; (4) Niche Participants — fragmented long-tail with limited strategic relevance.</p>
<p><strong>${co}'s Current Group Membership</strong><br/>
${co} currently straddles Group 2 and Group 3 — possessing the domain depth of a regional specialist but the growth ambitions and technology orientation of a challenger platform. This hybrid positioning creates both opportunity (M&A targets from Group 2 to accelerate scale) and risk (margin dilution as growth investment competes with profitability expectations).</p>
<p><strong>Strategic Mobility Barriers</strong><br/>
Migration from the current position to Group 1 requires overcoming three structural barriers: minimum revenue scale (~$Xbn), global delivery infrastructure, and enterprise trust credentials. A phased 3–5-year programme — beginning with geographic consolidation and a targeted tuck-in acquisition — represents the most capital-efficient path to group migration.</p>`.trim(),

  relative_cost_position: (co, ind, ctx) => `
<p><strong>Cost Structure Benchmarking</strong><br/>
${co}'s total cost as a percentage of revenue is estimated at ${100 - parseInt(ctx.margin)}–${100 - parseInt(ctx.margin) + 8}%, placing it 8–12% above the best-cost operator in the ${ind} sector. The gap is concentrated in three areas: labour productivity (35% of gap), procurement leverage (40% of gap), and overhead allocation efficiency (25% of gap). Each percentage-point of cost reduction translates directly to EBITDA expansion of ${ctx.margin.split('–')[0]}–${ctx.margin.split('–')[1]} bps at current revenue levels.</p>
<p><strong>Cost Reduction Pathway</strong><br/>
A structured cost transformation over 18–24 months — targeting labour model redesign, strategic sourcing renegotiation, and shared-services consolidation — could close 60–70% of the identified gap. This translates to an estimated $X–Xm in annual run-rate savings. The balance requires scale-dependent improvements (procurement leverage, infrastructure unit costs) that become accessible as revenue crosses the $Xm threshold.</p>`.trim(),
}

// ── Growth templates ───────────────────────────────────────────────────────────
export const GROWTH_TEMPLATES = {
  ansoff_matrix: (co, ind) => `
<p><strong>Quadrant I — Market Penetration (Near-Term Priority)</strong><br/>
${co}'s most capital-efficient near-term growth lies within its existing customer base and core geographic footprint. Current penetration economics indicate that customers with three or more integrated modules exhibit 2.3x higher retention and 62% greater average revenue per account. A structured land-and-expand motion — anchored by dedicated customer success resources and usage-based commercial triggers — could unlock an estimated 18–24% uplift in net revenue retention within 12 months.</p>
<p><strong>Quadrant II — Market Development (12–24 Month Horizon)</strong><br/>
Adjacent geographic markets offer the highest risk-adjusted growth opportunity after core penetration. Two tier-2 markets have been identified where ${co}'s existing product suite addresses 70–80% of local requirements with minimal localisation investment. Combined addressable opportunity is estimated at $X–Xm TAM, with a 15–20% realistic capture rate in the first 36 months given ${co}'s go-to-market capacity.</p>
<p><strong>Quadrant III — Product Development (18–36 Month Horizon)</strong><br/>
Three adjacent product extensions have been identified through customer journey analysis that would address unmet needs in ${co}'s highest-value segments. Build-versus-buy economics favour acqui-hire or tuck-in acquisition for two of the three extensions, given the 18–24-month time-to-market advantage over organic development.</p>
<p><strong>Quadrant IV — Diversification (Strategic Option Only)</strong><br/>
Diversification plays should be considered only after Quadrants I–III are generating sustainable returns. Premature diversification would dilute management attention and capital allocation at a stage when core business compounding remains the highest-return activity.</p>`.trim(),

  bcg_matrix: (co, ind) => `
<p><strong>Portfolio Composition</strong><br/>
${co}'s current portfolio resolves into three BCG quadrants: one Star (core platform, ~55% of revenue, 22–28% growth, strong relative share), two Cash Cows (legacy product lines, ~35% of revenue, 2–4% growth, high margin), and one Question Mark (new vertical, ~10% of revenue, 40%+ growth but sub-scale economics). There are currently no Dogs requiring divestiture consideration.</p>
<p><strong>Cash Flow Implications</strong><br/>
The Cash Cow segment generates estimated free cash flow of $X–Xm annually, providing the internal funding capacity to support the Star's growth investment ($X–Xm required over 24 months) and a selective bet on the Question Mark ($X–Xm). This self-funding dynamic is a significant strategic asset — ${co} can execute its growth agenda without dilutive equity issuance over the near term.</p>
<p><strong>Portfolio Evolution Priorities</strong><br/>
The Question Mark requires a clear decision within 12 months: commit to the investment required to build competitive scale (estimated $X–Xm over 18 months) or divest/partner to avoid the trap of perpetual subscale investment. Deferring this decision carries the highest risk of destroying value through capital mis-allocation.</p>`.trim(),
}
