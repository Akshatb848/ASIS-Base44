/**
 * Strategist Agent
 * Generates consultant-grade strategic analysis sections.
 * Reads the system prompt via Vite's ?raw import (works in-browser, no readFileSync).
 */
import { callLLMWithRetry } from '@/lib/llmClient'
import systemPromptRaw from './prompts/strategist.system.txt?raw'

/**
 * Build the user prompt for a specific framework section.
 */
function buildFrameworkPrompt({ company, industry, question, framework, questionType }) {
  return `
Company: ${company}
Industry: ${industry}
Strategic Question: ${question}
Analysis Type: ${questionType}

Apply the ${framework.name} framework to the above context.

Return a structured analysis section with:
1. A bold sub-header for each major component of the framework.
2. 3–5 sentences of insight per component, grounded in the company/industry context.
3. Specific metrics or benchmarks where applicable (use realistic industry ranges if exact data is unavailable — never say "data unavailable").
4. A short "Strategic Implication for ${company}" paragraph at the end of the section.

Total length: 380–450 words. No bullet-point lists — prose only.
`.trim()
}

/**
 * generateFrameworkSection — calls the LLM for one framework.
 * @param {object} params
 * @returns {Promise<string>} HTML-formatted prose
 */
export async function generateFrameworkSection(params) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    // Return a richly-templated fallback so the app works without an API key
    return null
  }

  const userPrompt = buildFrameworkPrompt(params)
  const raw = await callLLMWithRetry(userPrompt, {
    system: systemPromptRaw,
    maxTokens: 1024,
  })

  // Convert markdown bold to HTML strong tags for the renderer
  return raw
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p}</p>`)
    .join('\n')
}

/**
 * generateExecutiveSummaryLLM — full exec summary from the LLM.
 * @returns {Promise<string|null>}
 */
export async function generateExecutiveSummaryLLM({ company, industry, question, frameworks }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return null

  const frameworkList = frameworks.map(f => f.name).join(', ')
  const prompt = `
Company: ${company}
Industry: ${industry}
Strategic Question: ${question}
Frameworks applied: ${frameworkList}

Write a 3-paragraph executive summary for a strategy engagement focused on the above question.
- Paragraph 1: Situation & context (current state, why this question matters now).
- Paragraph 2: Key findings (2–3 headline insights from the analysis, referenced to the frameworks).
- Paragraph 3: Strategic direction & call to action (what the leadership team must decide or do next).

Tone: Partner-level, direct, hypothesis-driven. 220–280 words total.
`.trim()

  const raw = await callLLMWithRetry(prompt, {
    system: systemPromptRaw,
    maxTokens: 512,
  })

  return raw
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p}</p>`)
    .join('\n')
}

export default { generateFrameworkSection, generateExecutiveSummaryLLM }
