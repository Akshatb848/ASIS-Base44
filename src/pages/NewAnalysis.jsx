import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAnalysis } from '@/hooks/useAnalysis'
import Layout from '@/components/Layout'
import AgentCollaborationGraph from '@/components/AgentCollaborationGraph'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { runFullAnalysis } from '@/utils/runAnalysis'
import { classifyQuestion, selectFrameworks } from '@/utils/frameworks'
import { generateAgentWorkflow } from '@/utils/analysisEngine'

const INDUSTRIES = ['Technology','Financial Services','Healthcare','Consumer Goods','Energy','Manufacturing','Retail','Media & Entertainment','Telecommunications','Real Estate','Other']
const STAGES = ['Startup','Growth','Mature / Public','Conglomerate']
const ANALYSIS_TYPES = ['Competitive Strategy','Growth Strategy','Market Entry','M&A/Transactions','Operational Excellence','Digital Transformation','Innovation Strategy','Sustainability/ESG','Financial Strategy','Organizational Design','General Strategic Review']

const EXAMPLE_QUESTIONS = {
  'Competitive Strategy': 'How should we respond to the market entry of a well-capitalised challenger targeting our core SME segment with a 30% price advantage?',
  'Growth Strategy': 'Where are the highest-value adjacent growth opportunities given our current capabilities and the evolving market structure?',
  'Market Entry': 'What is the optimal entry strategy for Southeast Asia, and which market should we prioritise first?',
  'M&A/Transactions': 'Should we acquire the identified target at the current valuation, and what integration approach maximises synergy capture?',
  'Operational Excellence': 'How do we close our 15% cost gap versus the best-cost operator while preserving service quality?',
}

export default function NewAnalysis() {
  const { user } = useAuth()
  const { createAnalysis } = useAnalysis()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({ company: '', industry: '', stage: '', analysisType: '', question: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Preview frameworks for step 3
  const previewType = form.question ? classifyQuestion(form.question, form.analysisType) : null
  const previewFrameworks = previewType ? selectFrameworks(previewType, 3) : []
  const previewAgents = previewFrameworks.length ? generateAgentWorkflow(previewFrameworks) : []

  const canNext1 = form.company.trim() && form.industry && form.stage
  const canNext2 = form.analysisType && form.question.trim().length >= 20

  async function handleGenerate() {
    setGenerating(true)
    try {
      const result = await runFullAnalysis({ ...form, userId: user?.id })
      const saved = await createAnalysis({ ...result, user_id: user?.id })
      navigate(`/analysis/${saved?.id || result.id}`)
    } catch (e) {
      console.error(e)
      setGenerating(false)
    }
  }

  if (generating) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Generating your analysis</h2>
          <p className="text-muted-foreground text-sm mt-1">6 agents are collaborating on your strategic question…</p>
        </div>
        <AgentCollaborationGraph agents={previewAgents} isAnimating={true} />
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className={`flex items-center gap-2 ${s < 3 ? 'flex-1' : ''}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-colors ${step > s ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div><h2 className="text-xl font-bold text-foreground">Company Context</h2><p className="text-muted-foreground text-sm mt-1">Tell us about the company being analysed.</p></div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">Company Name</label><Input placeholder="e.g. Acme Corporation" value={form.company} onChange={e => set('company', e.target.value)} /></div>
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">Industry</label>
                <Select value={form.industry} onValueChange={v => set('industry', v)}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>{INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">Company Stage</label>
                <Select value={form.stage} onValueChange={v => set('stage', v)}>
                  <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => setStep(2)} disabled={!canNext1} className="w-full gap-2">Next <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div><h2 className="text-xl font-bold text-foreground">Strategic Question</h2><p className="text-muted-foreground text-sm mt-1">Define the core strategic question this analysis must answer.</p></div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-foreground mb-1.5 block">Analysis Type</label>
                <Select value={form.analysisType} onValueChange={v => set('analysisType', v)}>
                  <SelectTrigger><SelectValue placeholder="Select analysis type" /></SelectTrigger>
                  <SelectContent>{ANALYSIS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {form.analysisType && EXAMPLE_QUESTIONS[form.analysisType] && (
                <div className="rounded-lg border border-border/40 bg-secondary/30 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Example question:</p>
                  <p className="text-xs text-foreground italic cursor-pointer hover:text-primary transition-colors" onClick={() => set('question', EXAMPLE_QUESTIONS[form.analysisType])}>
                    "{EXAMPLE_QUESTIONS[form.analysisType]}"
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Your Strategic Question</label>
                <Textarea rows={4} placeholder="Describe the strategic question in detail…" value={form.question} onChange={e => set('question', e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1.5 text-right">{form.question.length} chars {form.question.length < 20 && '(min 20)'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button>
              <Button onClick={() => setStep(3)} disabled={!canNext2} className="flex-1 gap-2">Preview <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div><h2 className="text-xl font-bold text-foreground">Ready to Generate</h2><p className="text-muted-foreground text-sm mt-1">Review your analysis configuration before running.</p></div>
            <div className="rounded-xl border border-border/40 bg-card/60 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Company</span><span className="text-foreground font-medium">{form.company}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Industry</span><span className="text-foreground font-medium">{form.industry}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Type</span><span className="text-foreground font-medium">{form.analysisType}</span></div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Frameworks Selected</p>
              <div className="flex flex-wrap gap-2">
                {previewFrameworks.map(f => <Badge key={f.id} variant="info">{f.name}</Badge>)}
              </div>
            </div>
            <AgentCollaborationGraph agents={previewAgents} isAnimating={false} compact />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button>
              <Button onClick={handleGenerate} className="flex-1 gap-2" size="lg"><Sparkles className="h-4 w-4" />Generate Analysis</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
