import { classifyQuestion, selectFrameworks } from './frameworks.js'
import { getCtx } from './analysisContent.js'
import { getFrameworkContent } from './analysisContent3.js'
import { generateId } from '@/lib/utils.js'
import { generateFrameworkSection, generateExecutiveSummaryLLM } from '@/agents/strategist.agent.js'
import {
  calculateQualityScore,
  generateAgentWorkflow,
  buildExecSummary,
  buildRecommendations,
  buildRisks,
} from './analysisEngine.js'

export async function runFullAnalysis({ company, industry, question, analysisType, userId }) {
  const questionType = classifyQuestion(question, analysisType)
  const frameworks = selectFrameworks(questionType, 3)
  const ctx = getCtx(industry)
  const { score, grade, confidence } = calculateQualityScore({ questionType, industry, question, analysisType })
  const agentWorkflow = generateAgentWorkflow(frameworks)

  // Build sections — try LLM first, fall back to templates
  const sections = await Promise.all(
    frameworks.map(async (fw) => {
      let content = null
      try {
        content = await generateFrameworkSection({ company, industry, question, framework: fw, questionType })
      } catch { /* LLM unavailable */ }

      if (!content) content = getFrameworkContent(fw.id, company, industry, ctx)

      return {
        frameworkId: fw.id,
        frameworkName: fw.name,
        agentOwner: fw.agentOwner,
        content,
        keyFindings: extractKeyFindings(content),
      }
    })
  )

  // Executive summary
  let executiveSummary = null
  try {
    executiveSummary = await generateExecutiveSummaryLLM({ company, industry, question, frameworks })
  } catch { /* fall back */ }
  if (!executiveSummary) executiveSummary = buildExecSummary(company, industry, question, questionType, frameworks)

  const recommendations = buildRecommendations(company, industry, questionType)
  const risks = buildRisks(company, industry, questionType)

  return {
    id: generateId(),
    title: `${company} — ${analysisType || 'Strategic Analysis'}`,
    company,
    industry,
    question,
    analysisType,
    questionType,
    status: 'completed',
    qualityScore: score,
    qualityGrade: grade,
    confidenceLevel: confidence,
    frameworks: frameworks.map(f => f.name),
    executiveSummary,
    sections,
    recommendations,
    risks,
    agentWorkflow,
    strategicImplications: buildStrategicImplications(company, questionType),
    user_id: userId || 'demo_user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

function extractKeyFindings(html) {
  const findings = []
  const strongMatches = html.match(/<strong>([^<]+)<\/strong>/g) || []
  strongMatches.slice(0, 3).forEach(m => {
    const text = m.replace(/<\/?strong>/g, '').replace(/ —.*/, '').trim()
    if (text.length > 4 && text.length < 60) findings.push(text)
  })
  return findings.length ? findings : ['Key finding extracted from analysis']
}

function buildStrategicImplications(company, questionType) {
  const implications = {
    competitive:    `${company} must accelerate its differentiation agenda and build switching costs before incumbents intensify focus on its growth segments.`,
    growth:         `${company}'s growth architecture should prioritise market penetration and targeted adjacency moves over premature diversification.`,
    market_entry:   `A phased entry strategy — JV first, then ownership — minimises capital risk while preserving full strategic optionality.`,
    ma:             `Deal economics are compelling on a risk-adjusted basis; value realisation is contingent on PMI execution quality, particularly in the first 100 days.`,
    operational:    `Operational improvement of 250–350 bps EBITDA is achievable within 18 months and should be sequenced ahead of, not concurrent with, major growth investments.`,
    digital:        `Digital transformation must be anchored by business outcomes rather than technology milestones; a use-case-led roadmap reduces execution risk by 35–40%.`,
    innovation:     `The identified white space opportunity requires a dedicated innovation unit with protected funding, separate from the core business P&L.`,
    sustainability: `ESG investment generates measurable financial return through cost of capital reduction and customer retention; the business case is commercially sound independent of regulatory mandates.`,
    financial:      `Capital reallocation from maintenance to growth spending, funded by the identified efficiency programme, is the highest-NPV capital allocation decision available to leadership.`,
    organizational: `Organisational alignment — particularly resolving the strategy-resource gap and systems deficit — is a prerequisite for the growth and transformation programmes to deliver their projected returns.`,
    strategic:      `The strategic choice between focused specialist and platform expansion must be resolved at leadership level within 60 days; ambiguity beyond this point carries compounding execution and capital cost.`,
  }
  return implications[questionType] || implications.strategic
}
