// Analysis content templates — Part 3: innovation / sustainability / financial / org / strategic

export const INNOVATION_TEMPLATES = {
  blue_ocean: (co, ind) => `
<p><strong>Current Red Ocean Positioning</strong><br/>The ${ind} sector is characterised by intense competition on established dimensions — price, feature breadth, and distribution scale. ${co} is currently competing on these same vectors, resulting in margin compression and commoditisation pressure. Our analysis identifies a structural opportunity to reframe the competitive space by creating demand among non-consumers rather than competing for existing customers.</p>
<p><strong>Value Innovation Canvas</strong><br/>Applying the Four Actions Framework, we recommend: <strong>Eliminate</strong> — legacy configuration complexity that inflates cost without customer-perceived value; <strong>Reduce</strong> — breadth of rarely-used features (bottom-quartile usage, top-quartile maintenance cost); <strong>Raise</strong> — time-to-value from the current 6–8 weeks to under 2 weeks; <strong>Create</strong> — an outcome guarantee model that no current competitor offers. This reframing targets the 35–40% of the addressable market that currently abstains from category purchase due to perceived complexity and risk.</p>
<p><strong>Blue Ocean Viability</strong><br/>The identified white space is commercially viable — estimated at $X–Xm in 3-year revenue — and defensible for 18–24 months before imitation becomes credible. First-mover advantage must be locked in through rapid customer acquisition and proprietary data accumulation during this window.</p>`.trim(),

  jobs_to_be_done: (co, ind) => `
<p><strong>Core Jobs Identified</strong><br/>Customer research across ${co}'s primary segments identifies three functional jobs that drive 70–75% of purchase decisions: (1) risk reduction — customers seek certainty of outcome over feature richness; (2) status signalling — enterprise buyers want solutions that reflect positively on their professional judgement; (3) workload offload — reducing the cognitive and administrative burden on internal teams. ${co}'s current positioning addresses Job 3 well but under-indexes on Jobs 1 and 2.</p>
<p><strong>Unmet Jobs — Growth Opportunity</strong><br/>Two unmet jobs represent material expansion opportunities: (1) ecosystem orchestration — customers want a single integration point for a cluster of adjacent workflows, a job no current player serves well; (2) predictive intelligence — proactive identification of risk or opportunity before it becomes visible to the customer. Addressing these jobs requires product investment of $X–Xm but creates a switching-cost structure that incumbents cannot easily replicate.</p>`.trim(),
}

export const SUSTAINABILITY_TEMPLATES = {
  esg_materiality: (co, ind) => `
<p><strong>Material Issues Identification</strong><br/>A double-materiality assessment across 22 ESG topics identifies six issues as financially material to ${co}: climate transition risk, supply chain labour standards, data privacy, workforce diversity, governance transparency, and product lifecycle impact. These six issues account for approximately 80% of stakeholder ESG concern and represent the domains where ${co}'s ESG performance most directly affects its cost of capital, customer retention, and regulatory exposure.</p>
<p><strong>Performance Gaps</strong><br/>${co} scores below sector median on three of the six material issues: supply chain labour standards (no Tier 2 visibility), data privacy governance (outdated policy framework, pre-GDPR-era controls), and product lifecycle impact (no end-of-life take-back programme). Closing these gaps within 18 months is both a risk-mitigation imperative and a competitive differentiator, as 68% of enterprise procurement processes now include ESG minimum standards.</p>
<p><strong>ESG Investment Case</strong><br/>The business case for ESG investment is increasingly quantifiable: companies in the top ESG quartile of the ${ind} sector trade at a 12–18% valuation premium and achieve 15–20% lower cost of debt. A focused $X–Xm ESG programme — prioritising the three identified gaps — is projected to generate $X–Xm in NPV value through reduced regulatory risk, improved customer retention, and access to ESG-linked financing.</p>`.trim(),
}

export const FINANCIAL_TEMPLATES = {
  dupont_analysis: (co, ind, ctx) => `
<p><strong>Return on Equity Decomposition</strong><br/>${co}'s current ROE of approximately ${parseInt(ctx.margin)}–${parseInt(ctx.margin) + 6}% decomposes into: net profit margin (${ctx.margin}%), asset turnover (0.8–1.2x), and financial leverage (1.6–2.0x). The primary value-creation opportunity lies in margin expansion (400–600 bps improvement is achievable) rather than asset turnover optimisation, which is already at or above sector median. Leverage is conservative relative to sector peers, providing $X–Xm of additional debt capacity without breaching investment-grade metrics.</p>
<p><strong>Margin Improvement Pathway</strong><br/>Bridging from current EBITDA margins to the sector top-quartile benchmark of ${parseInt(ctx.margin.split('–')[1]) + 5}% requires three concurrent workstreams: gross margin recovery through pricing discipline and input cost management (+150–200 bps), operating leverage capture as revenue scales (+100–150 bps), and overhead efficiency (+80–120 bps through organisational simplification). Total bridge: 330–470 bps, realised over 24–30 months.</p>`.trim(),

  capital_allocation: (co, ind) => `
<p><strong>Current Allocation Assessment</strong><br/>${co}'s capital allocation across its four uses of cash — maintenance capex, growth capex, M&A, and shareholder returns — is weighted toward maintenance spending (45% of FCF) at the expense of growth investment (28% of FCF). This allocation is sub-optimal at the current stage of the business cycle: ${co} has the balance sheet capacity to increase growth investment to 40–45% of FCF without impairing its credit profile, and doing so would increase long-term NPV by an estimated $X–Xm.</p>
<p><strong>Priority Reallocation</strong><br/>We recommend a reallocation of $X–Xm annually from maintenance to growth capex, with priority directed at digital infrastructure ($Xm), commercial capability build ($Xm), and opportunistic M&A ($Xm reserve). Maintenance capex can be safely reduced through a structured asset-light transition in three non-core operational areas, without compromising operating performance.</p>`.trim(),
}

export const ORGANIZATIONAL_TEMPLATES = {
  mckinsey_7s: (co, ind) => `
<p><strong>Hard Elements Assessment</strong><br/>Strategy alignment is partially coherent — the stated growth agenda is not fully reflected in the resource allocation model, with 60% of investment still directed at the core rather than growth initiatives. Structure remains functional in design, creating handoff friction between commercial and delivery functions that adds an estimated 15–20% to service cycle times. Systems are the primary constraint: 12 of 18 core operational processes are unsupported by fit-for-purpose technology, driving manual workarounds and data quality issues.</p>
<p><strong>Soft Elements Assessment</strong><br/>Shared values are well-articulated but inconsistently lived — the gap between stated and observed culture is most pronounced in cross-functional collaboration and accountability. Staff quality is high in technical roles and below-par in commercial leadership, with the top-decile attrition rate (22% annually) in sales management representing a $X–Xm annual productivity drag. Skills and style gaps in data literacy and agile delivery are limiting the pace of transformation.</p>
<p><strong>Alignment Programme</strong><br/>A 90-day organisational alignment sprint — focused on the three highest-friction 7S misalignments (strategy-resource gap, systems deficit, and culture-accountability gap) — can unlock 8–12% organisational effectiveness improvement within 6 months. This is a prerequisite for the digital and growth programmes to deliver their projected returns.</p>`.trim(),
}

export const STRATEGIC_TEMPLATES = {
  swot_weighted: (co, ind, ctx) => `
<p><strong>Strengths (Weighted Score: 7.4 / 10)</strong><br/>${co}'s primary strengths are: established customer relationships (8.5/10 — 3–5 year average tenure, 85%+ retention), domain expertise in core ${ind} workflows (8.0/10), and a scalable technology platform requiring minimal incremental investment to serve 2–3x current volume (7.5/10). Financial position is solid with ${ctx.margin} EBITDA margins and conservative leverage.</p>
<p><strong>Weaknesses (Weighted Score: 5.8 / 10)</strong><br/>Three structural weaknesses require active remediation: brand awareness outside the core customer segment (4.5/10 — unaided awareness below 15% in target expansion segments), sales capacity relative to pipeline (5.0/10 — current sales headcount supports ~70% of identified opportunity), and technology debt in non-core systems (6.0/10 — creates integration complexity for enterprise prospects).</p>
<p><strong>Opportunities (Weighted Score: 7.1 / 10)</strong><br/>The three highest-priority opportunities by risk-adjusted value are: (1) geographic expansion into two identified high-growth markets ($X–Xm NPV); (2) ecosystem platform buildout to capture adjacent workflow spend ($X–Xm NPV); (3) AI-enabled service augmentation to improve unit economics and create new differentiation ($X–Xm NPV over 3 years).</p>
<p><strong>Threats (Weighted Score: 6.2 / 10)</strong><br/>Primary threats: incumbent counter-investment in the segments where ${co} is gaining share (probability: high, impact: 6.5/10), macro-driven budget compression in ${co}'s buyer segment (probability: medium, impact: 7.0/10), and technology platform disruption from AI-native entrants (probability: medium-low over 24 months, impact: 8.0/10 if materialised).</p>`.trim(),

  scenario_planning: (co, ind) => `
<p><strong>Scenario Architecture</strong><br/>Four scenarios have been developed across two critical uncertainties: (1) pace of market consolidation (fast vs. slow) and (2) technology disruption intensity (high vs. low). These axes generate four distinct futures with materially different strategic implications for ${co}.</p>
<p><strong>Scenario 1 — "Platform Dominance" (Fast consolidation, Low disruption)</strong><br/>2–3 dominant platforms emerge within 36 months. ${co} must either achieve platform status or find a defensible specialist niche. Recommended posture: accelerate platform investment now; this scenario rewards bold capital allocation. Probability: 30%.</p>
<p><strong>Scenario 2 — "Fragmented Innovation" (Slow consolidation, High disruption)</strong><br/>AI-native entrants fragment the market; no single player achieves dominance. ${co}'s domain expertise becomes a premium differentiator. Recommended posture: invest in AI capability and position as the trusted specialist. Probability: 25%.</p>
<p><strong>Robust Strategy</strong><br/>Across all four scenarios, three strategic moves are value-accretive: deepening customer switching costs, building proprietary data assets, and maintaining balance sheet flexibility for opportunistic M&A. These form the core of the recommended strategy regardless of which scenario materialises.</p>`.trim(),
}

// ── Master content resolver ────────────────────────────────────────────────────
import { COMPETITIVE_TEMPLATES, GROWTH_TEMPLATES } from './analysisContent.js'
import { MARKET_ENTRY_TEMPLATES, MA_TEMPLATES, OPERATIONAL_TEMPLATES, DIGITAL_TEMPLATES } from './analysisContent2.js'

const ALL_TEMPLATES = {
  ...COMPETITIVE_TEMPLATES,
  ...GROWTH_TEMPLATES,
  ...MARKET_ENTRY_TEMPLATES,
  ...MA_TEMPLATES,
  ...OPERATIONAL_TEMPLATES,
  ...DIGITAL_TEMPLATES,
  ...INNOVATION_TEMPLATES,
  ...SUSTAINABILITY_TEMPLATES,
  ...FINANCIAL_TEMPLATES,
  ...ORGANIZATIONAL_TEMPLATES,
  ...STRATEGIC_TEMPLATES,
}

export function getFrameworkContent(frameworkId, company, industry, ctx) {
  const fn = ALL_TEMPLATES[frameworkId]
  if (!fn) return `<p>Analysis for <strong>${frameworkId}</strong> applied to ${company} in the ${industry} sector.</p>`
  return fn(company, industry, ctx)
}
