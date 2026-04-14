/**
 * Thin Anthropic API client using streaming to prevent idle-timeout errors.
 * Uses fetch + SSE so it works in a browser context without the Node SDK.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-opus-4-6'
const DEFAULT_MAX_TOKENS = 4096
const MAX_RETRIES = 3

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function getApiKey() {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || null
}

/**
 * Stream a completion from Anthropic and collect the full text.
 * Returns the complete assistant message as a string.
 */
async function streamCompletion({ messages, system, model, maxTokens }) {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not configured')

  const body = {
    model: model || DEFAULT_MODEL,
    max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
    stream: true,
    messages,
    ...(system ? { system } : {}),
  }

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${err}`)
  }

  // Consume SSE stream
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split('\n')
    buffer = lines.pop() // keep incomplete last line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') break
      try {
        const evt = JSON.parse(data)
        if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
          fullText += evt.delta.text
        }
      } catch {
        // ignore parse errors on keep-alive lines
      }
    }
  }

  return fullText
}

/**
 * callLLMWithRetry — public entry point.
 *
 * @param {string} userPrompt
 * @param {{ system?: string, model?: string, maxTokens?: number }} opts
 * @returns {Promise<string>}
 */
export async function callLLMWithRetry(userPrompt, opts = {}) {
  const messages = [{ role: 'user', content: userPrompt }]
  let lastError

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await streamCompletion({ messages, ...opts })
    } catch (err) {
      lastError = err
      const backoff = 1000 * Math.pow(2, attempt)
      console.warn(`LLM attempt ${attempt + 1} failed (${err.message}). Retrying in ${backoff}ms…`)
      await sleep(backoff)
    }
  }

  throw lastError
}

export default callLLMWithRetry
