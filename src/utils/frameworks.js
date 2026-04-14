// ─── Framework library ────────────────────────────────────────────────────────
// Each question type maps to a UNIQUE set of frameworks — no cross-type overlap.

export const QUESTION_TYPES = {
  COMPETITIVE:    'competitive',
  GROWTH:         'growth',
  MARKET_ENTRY:   'market_entry',
  MA:             'ma',
  OPERATIONAL:    'operational',
  DIGITAL:        'digital',
  INNOVATION:     'innovation',
  SUSTAINABILITY: 'sustainability',
  FINANCIAL:      'financial',
  ORGANIZATIONAL: 'organizational',
  STRATEGIC:      'strategic',
}

export const FRAMEWORK_LIBRARY = {
  competitive: [
    { id: 'porter_five_forces',       name: "Porter's Five Forces",              agentOwner: 'competitive_intel' },
    { id: 'competitive_positioning',  name: 'Competitive Positioning Matrix',    agentOwner: 'market_intel' },
    { id: 'strategic_group_analysis', name: 'Strategic Group Analysis',          agentOwner: 'competitive_intel' },
    { id: 'relative_cost_position',   name: 'Relative Cost Position Analysis',   agentOwner: 'financial' },
  ],
  growth: [
    { id: 'ansoff_matrix',     name: 'Ansoff Growth Matrix',          agentOwner: 'market_intel' },
    { id: 'bcg_matrix',        name: 'BCG Growth-Share Matrix',       agentOwner: 'financial' },
    { id: 'growth_pyramid',    name: 'McKinsey Growth Pyramid',       agentOwner: 'market_intel' },
    { id: 'ge_mckinsey',       name: 'GE-McKinsey Nine-Box Matrix',   agentOwner: 'competitive_intel' },
  ],
  market_entry: [
    { id: 'pestle',                  name: 'PESTLE Analysis',                      agentOwner: 'market_intel' },
    { id: 'market_attractiveness',   name: 'Market Attractiveness Assessment',     agentOwner: 'market_intel' },
    { id: 'entry_mode_matrix',       name: 'Entry Mode Strategy Matrix',           agentOwner: 'competitive_intel' },
    { id: 'competitive_benchmarking',name: 'Competitive Benchmarking',             agentOwner: 'competitive_intel' },
  ],
  ma: [
    { id: 'dcf_valuation',    name: 'DCF Valuation Framework',       agentOwner: 'financial' },
    { id: 'synergy_matrix',   name: 'Synergy Identification Matrix', agentOwner: 'financial' },
    { id: 'strategic_dd',     name: 'Strategic Due Diligence',       agentOwner: 'competitive_intel' },
    { id: 'pmi_readiness',    name: 'PMI Readiness Assessment',      agentOwner: 'risk' },
  ],
  operational: [
    { id: 'value_chain',        name: 'Value Chain Analysis',              agentOwner: 'market_intel' },
    { id: 'lean_six_sigma',     name: 'Lean Six Sigma Assessment',         agentOwner: 'risk' },
    { id: 'scor_model',         name: 'SCOR Supply Chain Model',           agentOwner: 'market_intel' },
    { id: 'process_excellence', name: 'Process Excellence Maturity Model', agentOwner: 'risk' },
  ],
  digital: [
    { id: 'digital_maturity',      name: 'Digital Maturity Model',               agentOwner: 'market_intel' },
    { id: 'platform_strategy',     name: 'Platform Business Strategy',           agentOwner: 'market_intel' },
    { id: 'tech_investment',       name: 'Technology Investment Prioritisation',  agentOwner: 'financial' },
    { id: 'digital_value_creation',name: 'Digital Value Creation Framework',     agentOwner: 'competitive_intel' },
  ],
  innovation: [
    { id: 'blue_ocean',          name: 'Blue Ocean Strategy Canvas',    agentOwner: 'market_intel' },
    { id: 'innovation_portfolio',name: 'Innovation Portfolio Matrix',   agentOwner: 'competitive_intel' },
    { id: 'jobs_to_be_done',     name: 'Jobs-to-be-Done Framework',     agentOwner: 'market_intel' },
    { id: 's_curve',             name: 'S-Curve Technology Analysis',   agentOwner: 'risk' },
  ],
  sustainability: [
    { id: 'esg_materiality',  name: 'ESG Materiality Matrix',             agentOwner: 'risk' },
    { id: 'triple_bottom_line',name: 'Triple Bottom Line Framework',      agentOwner: 'financial' },
    { id: 'tcfd_climate_risk', name: 'Climate Risk Assessment (TCFD)',    agentOwner: 'risk' },
    { id: 'circular_economy',  name: 'Circular Economy Readiness',        agentOwner: 'market_intel' },
  ],
  financial: [
    { id: 'dupont_analysis',    name: 'DuPont Financial Decomposition',  agentOwner: 'financial' },
    { id: 'capital_allocation', name: 'Capital Allocation Framework',    agentOwner: 'financial' },
    { id: 'eva_framework',      name: 'Economic Value Added (EVA)',      agentOwner: 'financial' },
    { id: 'working_capital',    name: 'Working Capital Optimisation',    agentOwner: 'risk' },
  ],
  organizational: [
    { id: 'mckinsey_7s',        name: 'McKinsey 7S Framework',          agentOwner: 'market_intel' },
    { id: 'kotter_change',      name: 'Kotter 8-Step Change Model',     agentOwner: 'risk' },
    { id: 'culture_assessment', name: 'Organisational Culture Assessment', agentOwner: 'competitive_intel' },
    { id: 'talent_matrix',      name: 'Talent Excellence Matrix',       agentOwner: 'market_intel' },
  ],
  strategic: [
    { id: 'swot_weighted',       name: 'SWOT with Quantitative Weighting', agentOwner: 'market_intel' },
    { id: 'balanced_scorecard',  name: 'Balanced Scorecard Design',        agentOwner: 'financial' },
    { id: 'scenario_planning',   name: 'Scenario Planning Matrix',         agentOwner: 'risk' },
    { id: 'real_options',        name: 'Real Options Analysis',            agentOwner: 'financial' },
  ],
}

// ─── Question classifier ───────────────────────────────────────────────────────

const KEYWORD_MAP = [
  { type: QUESTION_TYPES.MA,             patterns: /acqui|merg|m&a|buyout|takeover|target company|due diligence|synerg/i },
  { type: QUESTION_TYPES.FINANCIAL,      patterns: /profit|margin|cost reduction|revenue|cash flow|ebitda|valuation|roi|capex|opex|working capital|balance sheet/i },
  { type: QUESTION_TYPES.DIGITAL,        patterns: /digital transform|technology|automat|cloud|platform|data|ai strategy|saas|software/i },
  { type: QUESTION_TYPES.SUSTAINABILITY, patterns: /esg|sustainab|carbon|net.zero|climate|environment|circular economy|social impact/i },
  { type: QUESTION_TYPES.INNOVATION,     patterns: /innovat|disrupt|new product|launch|r&d|startup|venture|blue ocean|creative/i },
  { type: QUESTION_TYPES.ORGANIZATIONAL, patterns: /talent|culture|org design|restructur|people|leadership|change management|workforce/i },
  { type: QUESTION_TYPES.OPERATIONAL,    patterns: /operat|efficien|process|supply chain|logistics|lean|six sigma|manufactur|quality/i },
  { type: QUESTION_TYPES.MARKET_ENTRY,   patterns: /enter|new market|expand|geographic|internation|launch in|penetrate|new region/i },
  { type: QUESTION_TYPES.GROWTH,         patterns: /grow|scale|expand|increase revenue|market share|bcg|portfolio|new segment/i },
  { type: QUESTION_TYPES.COMPETITIVE,    patterns: /competi|rival|competitor|market position|differentiat|moat|pricing power|strategic group/i },
]

export function classifyQuestion(question, analysisType) {
  // analysisType from the form takes precedence when explicit
  const typeMap = {
    'Competitive Strategy':      QUESTION_TYPES.COMPETITIVE,
    'Growth Strategy':           QUESTION_TYPES.GROWTH,
    'Market Entry':              QUESTION_TYPES.MARKET_ENTRY,
    'M&A/Transactions':          QUESTION_TYPES.MA,
    'Operational Excellence':    QUESTION_TYPES.OPERATIONAL,
    'Digital Transformation':    QUESTION_TYPES.DIGITAL,
    'Innovation Strategy':       QUESTION_TYPES.INNOVATION,
    'Sustainability/ESG':        QUESTION_TYPES.SUSTAINABILITY,
    'Financial Strategy':        QUESTION_TYPES.FINANCIAL,
    'Organisational Design':     QUESTION_TYPES.ORGANIZATIONAL,
    'Organizational Design':     QUESTION_TYPES.ORGANIZATIONAL,
    'General Strategic Review':  QUESTION_TYPES.STRATEGIC,
  }
  if (analysisType && typeMap[analysisType]) return typeMap[analysisType]

  for (const { type, patterns } of KEYWORD_MAP) {
    if (patterns.test(question)) return type
  }
  return QUESTION_TYPES.STRATEGIC
}

export function selectFrameworks(questionType, count = 3) {
  const pool = FRAMEWORK_LIBRARY[questionType] || FRAMEWORK_LIBRARY.strategic
  return pool.slice(0, count)
}
