# ASIS v5.0 — Claude Code Rules

## File-Writing Rules
- Write **one file at a time** — never bundle multiple large files into a single tool call.
- Each `Write` or `Edit` call must target exactly **one file path**.
- Keep individual file writes **under 300 lines** when possible; split large files into logical modules.
- After writing each file, confirm the path before proceeding to the next.
- Never use background agents (`run_in_background: true`) for source-code generation — write directly.

## Timeout Prevention
- Split any task producing >200 lines of output into sequential single-file writes.
- Never generate large analysis text blocks inline; pull from template maps instead.
- If a function body exceeds ~80 lines, extract helpers into separate files.

## Project Stack
- React 18 + Vite 5, **JSX only** (no TypeScript)
- Tailwind CSS v3 + shadcn-style components in `src/components/ui/`
- Supabase for auth (`src/lib/supabase.js`)
- Path alias: `@/` → `src/`
- All page routes defined in `src/App.jsx`

## LLM Client (src/lib/llmClient.js)
- Use **streaming** via `anthropic.messages.stream()` + async iteration, not `messages.create()`.
- Collect streamed chunks into a single string before returning.
- Wrap in `callLLMWithRetry(prompt, opts)` with 3 retries and exponential back-off (1 s, 2 s, 4 s).

## Analysis Engine
- Framework selection must be deterministic per `questionType` — use the lookup map in `src/utils/analysisEngine.js`.
- Quality score uses a seeded hash of the question string for the ±4 jitter — same question always yields the same score.
- No "Silicon Consultancy" brand anywhere in the codebase.

## Agent Prompts
- System prompts live in `src/agents/prompts/*.system.txt`.
- Load with `import … from '…?raw'` (Vite raw import) — no `readFileSync` in the browser bundle.
