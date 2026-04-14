import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import AgentCollaborationGraph from '@/components/AgentCollaborationGraph'
import QualityBadge from '@/components/QualityBadge'
import FrameworkRenderer from '@/components/FrameworkRenderer'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RotateCcw, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { Analysis } from '@/entities/Analysis'
import { formatDate } from '@/lib/utils'

const PRIORITY_COLOR = { 1:'text-red-400 bg-red-400/10 border-red-400/30', 2:'text-orange-400 bg-orange-400/10 border-orange-400/30', 3:'text-amber-400 bg-amber-400/10 border-amber-400/30', 4:'text-blue-400 bg-blue-400/10 border-blue-400/30', 5:'text-slate-400 bg-slate-400/10 border-slate-400/20' }
const PROB_COLOR = { High:'text-red-400', Medium:'text-amber-400', Low:'text-emerald-400' }

export default function AnalysisDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replaying, setReplaying] = useState(false)

  useEffect(() => {
    Analysis.get(id).then(a => { setAnalysis(a); setLoading(false) })
  }, [id])

  function handleReplay() { setReplaying(true); setTimeout(() => setReplaying(false), 7000) }

  function handleExport() {
    if (!analysis) return
    const text = [
      `ASIS v5.0 — Strategic Analysis`,
      `${'='.repeat(60)}`,
      `Company: ${analysis.company}`,
      `Industry: ${analysis.industry}`,
      `Date: ${formatDate(analysis.created_at)}`,
      `Quality Grade: ${analysis.qualityGrade} (${analysis.qualityScore}/100) | Confidence: ${analysis.confidenceLevel}%`,
      ``,`EXECUTIVE SUMMARY`,`${'─'.repeat(40)}`,
      analysis.executiveSummary?.replace(/<[^>]+>/g,'') || '',
      ``,`FRAMEWORK ANALYSES`,`${'─'.repeat(40)}`,
      ...(analysis.sections||[]).flatMap(s => [`\n${s.frameworkName}\n`, s.content.replace(/<[^>]+>/g,'')]),
      ``,`RECOMMENDATIONS`,`${'─'.repeat(40)}`,
      ...(analysis.recommendations||[]).map(r => `${r.priority}. ${r.title}\n   ${r.description}\n   Owner: ${r.owner} | Timeline: ${r.timeframe}`),
    ].join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${analysis.company}-analysis.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <Layout><div className="flex justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div></Layout>
  if (!analysis) return <Layout><div className="text-center py-24"><p className="text-muted-foreground">Analysis not found.</p><Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4">Back to Dashboard</Button></div></Layout>

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-foreground truncate">{analysis.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline">{analysis.industry}</Badge>
            <Badge variant="secondary">{analysis.analysisType}</Badge>
            <span className="text-xs text-muted-foreground">{formatDate(analysis.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
          <Button variant="ghost" size="sm" onClick={handleReplay} className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" />Replay</Button>
        </div>
      </div>

      {/* Quality + Graph row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-1">
          <QualityBadge grade={analysis.qualityGrade} confidence={analysis.confidenceLevel} score={analysis.qualityScore} />
        </div>
        <div className="lg:col-span-2">
          <AgentCollaborationGraph agents={analysis.agentWorkflow || []} isAnimating={replaying} compact />
        </div>
      </div>

      {/* Strategic question */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-4 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Strategic Question</p>
        <p className="text-sm text-foreground leading-relaxed">"{analysis.question}"</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
          {['overview','frameworks','recommendations','risks'].map(t => (
            <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="rounded-xl border border-border/40 bg-card/40 p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Executive Summary</h3>
              <div className="analysis-prose" dangerouslySetInnerHTML={{ __html: analysis.executiveSummary }} />
            </div>
            {analysis.strategicImplications && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Strategic Implication</p>
                <p className="text-sm text-foreground leading-relaxed">{analysis.strategicImplications}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Frameworks */}
        <TabsContent value="frameworks">
          <div className="space-y-3">
            {(analysis.sections || []).map((s, i) => (
              <FrameworkRenderer key={s.frameworkId || i} section={s} defaultExpanded={i === 0} />
            ))}
          </div>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations">
          <div className="space-y-3">
            {(analysis.recommendations || []).map(r => (
              <div key={r.priority} className="rounded-xl border border-border/40 bg-card/40 p-5">
                <div className="flex items-start gap-4">
                  <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border shrink-0 ${PRIORITY_COLOR[r.priority]}`}>{r.priority}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">{r.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{r.description}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {[['Owner', r.owner],['Timeline', r.timeframe],['Impact', r.impact],['Effort', r.effort]].map(([k,v]) => (
                        <span key={k} className="text-xs text-muted-foreground"><span className="text-foreground font-medium">{k}:</span> {v}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Risks */}
        <TabsContent value="risks">
          <div className="space-y-3">
            {(analysis.risks || []).map((r, i) => (
              <div key={i} className="rounded-xl border border-border/40 bg-card/40 p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{r.risk}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge variant="outline" className={`text-xs ${PROB_COLOR[r.probability]}`}>P: {r.probability}</Badge>
                    <Badge variant="outline" className={`text-xs ${PROB_COLOR[r.impact]}`}>I: {r.impact}</Badge>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs mb-2">{r.category}</Badge>
                <div className="flex items-start gap-2 mt-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  )
}
