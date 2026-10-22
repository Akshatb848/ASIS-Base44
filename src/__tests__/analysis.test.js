// Smoke tests for the client-side analysis engine (no network, no API key).
import { describe, it, expect } from 'vitest'
import { classifyQuestion, selectFrameworks, QUESTION_TYPES } from '@/utils/frameworks'
import { calculateQualityScore, generateAgentWorkflow } from '@/utils/analysisEngine'
import { runFullAnalysis } from '@/utils/runAnalysis'

describe('classifyQuestion', () => {
  it('uses the explicit analysis type when given', () => {
    expect(classifyQuestion('anything', 'Market Entry')).toBe(QUESTION_TYPES.MARKET_ENTRY)
  })
  it('falls back to the general strategic type for unmatched text', () => {
    expect(classifyQuestion('zzz', undefined)).toBeTypeOf('string')
  })
})

describe('selectFrameworks', () => {
  it('returns the requested number of distinct frameworks', () => {
    const fws = selectFrameworks(QUESTION_TYPES.MARKET_ENTRY, 3)
    expect(fws).toHaveLength(3)
    expect(new Set(fws.map(f => f.id)).size).toBe(3)
  })
})

describe('calculateQualityScore', () => {
  const input = { questionType: QUESTION_TYPES.MARKET_ENTRY, industry: 'Retail', question: 'Where should we enter first?', analysisType: 'Market Entry' }
  it('is deterministic for the same input (heuristic, not a measured quality)', () => {
    expect(calculateQualityScore(input)).toEqual(calculateQualityScore(input))
  })
  it('stays within the documented 62–98 range', () => {
    const { score, confidence } = calculateQualityScore(input)
    expect(score).toBeGreaterThanOrEqual(62)
    expect(score).toBeLessThanOrEqual(98)
    expect(confidence).toBeGreaterThanOrEqual(60)
    expect(confidence).toBeLessThanOrEqual(97)
  })
})

describe('runFullAnalysis (template fallback, no API key)', () => {
  it('produces a complete analysis object', async () => {
    const a = await runFullAnalysis({
      company: 'Example Co', industry: 'Retail', analysisType: 'Market Entry',
      question: 'Which Southeast Asian market should we enter first?', userId: 'demo_user',
    })
    expect(a.status).toBe('completed')
    expect(a.sections).toHaveLength(3)
    a.sections.forEach(s => expect(s.content.length).toBeGreaterThan(100))
    expect(a.executiveSummary).toBeTruthy()
    expect(a.recommendations.length).toBeGreaterThan(0)
    expect(a.risks.length).toBeGreaterThan(0)
    expect(a.agentWorkflow.every(s => s.status === 'completed')).toBe(true)
  })
  it('pre-run workflow preview starts as pending', () => {
    const wf = generateAgentWorkflow(selectFrameworks(QUESTION_TYPES.MARKET_ENTRY, 3))
    expect(wf.length).toBe(6)
    expect(wf.every(s => s.status === 'pending')).toBe(true)
  })
})
