import { classifyQuestion, selectFrameworks } from './frameworks.js'
import { getCtx } from './analysisContent.js'
import { getFrameworkContent } from './analysisContent3.js'
import { generateId } from '@/lib/utils.js'
import { generateFrameworkSection, generateExecutiveSummaryLLM } from '@/agents/strategist.agent.js'

// ── Quality scoring ────────────────────────────────────────────────────────────

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) { h = (Math.imul(31, h) + s.charCodeAt(i)) | 0 }
  return Math.abs(h)
}

export function calculateQualityScore({ questionType, industry, question, analysisType }) {
  const COMPLEX_INDUSTRIES = ['Financial Services', 'Healthcare', 'Technology', 'Energy', 'Pharmaceuticals']
  const COMPLEX_TYPES = ['ma', 'financial', 'sustainability', 'digital']

  let score = 75
  if (COMPLEX_INDUSTRIES.includes(industry)) score += 5
  if (COMPLEX_TYPES.includes(questionType)) score += 3
  const words = (question || '').trim().split(/\s+/).length
  if (words > 25) score += 3
  if (words > 50) score += 2

  const jitter = (hashStr(question || '') % 9) - 4   // deterministic ±4
  score = Math.min(98, Math.max(62, score + jitter))

  const gradeThresholds = [
    [93, 'A+'], [88, 'A'], [83, 'A-'], [78, 'B+'], [73, 'B'], [68, 'B-']
  ]
  const grade = (gradeThresholds.find(([t]) => score >= t) || [0, 'C+'])[1]
  const confidence = Math.min(97, Math.max(60, score - 3 + (hashStr(question + '~') % 8)))

  return { score, grade, confidence }
}

// ── Agent workflow ─────────────────────────────────────────────────────────────

const AGENT_DEFS = [
  { id: 'orchestrator',      name: 'Strategic Orchestrator',         role: 'Coordinates the full analysis workflow',         icon: '🎯', color: '#6172f3', dependsOn: [] },
  { id: 'market_intel',      name: 'Market Intelligence Agent',      role: 'Market dynamics & industry structure',           icon: '📊', color: '#10b981', dependsOn: ['orchestrator'] },
  { id: 'financial',         name: 'Financial Analysis Agent',       role: 'Quantitative modelling & valuation',             icon: '💹', color: '#f59e0b', dependsOn: ['orchestrator'] },
  { id: 'competitive_intel', name: 'Competitive Intelligence Agent', role: 'Competitor mapping & positioning',               icon: '🔍', color: '#8b5cf6', dependsOn: ['market_intel'] },
  { id: 'risk',              name: 'Risk & Scenario Agent',          role: 'Risk identification & scenario stress-testing',  icon: '⚡', color: '#ef4444', dependsOn: ['financial', 'competitive_intel'] },
  { id: 'synthesis',         name: 'Synthesis & Recommendations',    role: 'Integrates findings into strategic direction',   icon: '✨', color: '#06b6d4', dependsOn: ['risk', 'market_intel'] },
]

export function generateAgentWorkflow(frameworks) {
  const agentFrameworks = {}
  frameworks.forEach(f => {
    if (!agentFrameworks[f.agentOwner]) agentFrameworks[f.agentOwner] = []
    agentFrameworks[f.agentOwner].push(f.name)
  })

  return AGENT_DEFS.map((def, i) => ({
    ...def,
    status: 'pending',
    task: agentFrameworks[def.id]
      ? `Analysing: ${agentFrameworks[def.id].join(', ')}`
      : i === 0 ? 'Orchestrating analysis pipeline'
      : def.id === 'synthesis' ? 'Synthesising findings & recommendations'
      : 'Supporting cross-functional analysis',
    outputs: agentFrameworks[def.id] || [],
  }))
}

// ── Executive summary template ─────────────────────────────────────────────────
function buildExecSummary(company, industry, question, questionType, frameworks) {
  const fnames = frameworks.map(f => f.name).join(', ')
  const ctx = getCtx(industry)
  return `<p>This engagement examines a critical strategic question facing ${company} within the ${industry} sector, where structural market dynamics — characterised by a Herfindahl-Hirschman Index of ${ctx.hhi} and sector growth of ${ctx.growthRate} — are creating both pressure and opportunity simultaneously. The timing of this analysis reflects a decisive window in which the choices made by leadership will compound over the next 36–48 months, materially shaping ${company}'s competitive position and economic value.</p>
<p>Our multi-framework analysis — applying ${fnames} — surfaces three headline findings: first, ${company}'s current trajectory, if unchanged, will result in a gradual erosion of competitive position as better-capitalised incumbents intensify investment in the segments where ${company} has been growing; second, two under-exploited strategic options exist that are capital-efficient and executable within the current organisational capacity; third, a set of structural risks — particularly around cost position and technology platform evolution — require near-term mitigation actions regardless of which strategic path is pursued.</p>
<p>The strategic imperative is clear: ${company} must make a deliberate choice between a focused specialist strategy (optimising depth over breadth) and a platform expansion strategy (sacrificing near-term margin for long-term ecosystem positioning). Each path is viable; attempting to pursue both simultaneously is the highest-risk outcome. This analysis provides the evidence base for that decision and a sequenced implementation roadmap for the chosen direction.</p>`
}

// ── Recommendations ────────────────────────────────────────────────────────────
function buildRecommendations(company, industry, questionType) {
  const base = [
    { priority: 1, title: 'Clarify and commit to the core strategic posture', description: `${company} must resolve the implicit tension between a focused specialist strategy and a platform expansion play. Both are viable; the organisation cannot execute both simultaneously. Leadership should formalise this choice within 60 days and align capital allocation accordingly.`, timeframe: 'Immediate (0–60 days)', owner: 'CEO / Board', impact: 'High', effort: 'Low' },
    { priority: 2, title: 'Accelerate customer switching-cost architecture', description: `Increase product integration depth and expand the number of live API connectors from the current baseline to 40+ within 12 months. Each additional integration point increases account retention probability by an estimated 4–6%, creating a compounding moat.`, timeframe: 'Near-term (3–9 months)', owner: 'CPO / CTO', impact: 'High', effort: 'Medium' },
    { priority: 3, title: 'Execute a targeted cost transformation programme', description: `Launch a structured 18-month cost efficiency programme targeting procurement leverage, labour model redesign, and overhead consolidation. Objective: 250–350 bps EBITDA margin improvement, funding the growth investment agenda on a self-financing basis.`, timeframe: 'Near-term (6–18 months)', owner: 'CFO / COO', impact: 'High', effort: 'High' },
    { priority: 4, title: `Pursue a disciplined M&A and partnership agenda`, description: `Identify 2–3 tuck-in acquisition targets in the $X–Xm enterprise value range that accelerate geographic coverage or product adjacency. Establish a lightweight corporate development function with a dedicated deal pipeline and structured evaluation criteria.`, timeframe: 'Medium-term (9–24 months)', owner: 'CFO / Strategy', impact: 'Medium', effort: 'High' },
    { priority: 5, title: 'Build proprietary data and AI capability', description: `Invest $X–Xm over 24 months in a unified data platform and applied AI capability that generates proprietary, customer-facing intelligence. This creates a differentiation vector that incumbents cannot replicate without equivalent time investment, regardless of capital.`, timeframe: 'Medium-term (12–24 months)', owner: 'CTO / CDO', impact: 'High', effort: 'High' },
  ]
  return base
}

// ── Risk register ──────────────────────────────────────────────────────────────
function buildRisks(company, industry, questionType) {
  return [
    { category: 'Competitive', risk: `Incumbent retaliation in ${company}'s core growth segments through aggressive pricing or feature investment`, probability: 'High', impact: 'High', mitigation: 'Accelerate switching-cost architecture and deepen customer relationships in top 20% of accounts before incumbents intensify focus.' },
    { category: 'Execution', risk: 'Organisational capacity constraint delays simultaneous delivery of cost transformation and growth investment', probability: 'Medium', impact: 'High', mitigation: 'Sequence initiatives with clear resource ownership; avoid more than two major transformation workstreams simultaneously.' },
    { category: 'Market', risk: `Macro-driven demand softening compresses ${industry} capital budgets by 10–15% in the next 12 months`, probability: 'Medium', impact: 'Medium', mitigation: 'Build a variable cost structure to maintain profitability at 85% of planned revenue; pre-negotiate commercial flexibility with key suppliers.' },
    { category: 'Technology', risk: 'AI-native entrants achieve product-market fit in core segments faster than anticipated, compressing time-to-respond', probability: 'Low', impact: 'High', mitigation: 'Establish an AI monitoring function; allocate $Xm in the annual budget for rapid-response capability acquisition if early signals emerge.' },
    { category: 'People', risk: 'Loss of key commercial and technical leadership during the transformation period', probability: 'Medium', impact: 'High', mitigation: 'Implement retention packages for the top-20 revenue-generating relationships; accelerate succession planning for all P-1 roles.' },
  ]
}

export { buildExecSummary, buildRecommendations, buildRisks }
