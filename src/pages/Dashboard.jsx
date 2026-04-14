import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAnalysis } from '@/hooks/useAnalysis'
import Layout from '@/components/Layout'
import QualityBadge from '@/components/QualityBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, BarChart3, Clock, Trash2, ArrowRight } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

function StatCard({ label, value, sub }) {
  return (
    <div className="metric-card">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

function AnalysisCard({ analysis, onDelete }) {
  const navigate = useNavigate()
  return (
    <Card
      className="cursor-pointer hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 group"
      onClick={() => navigate(`/analysis/${analysis.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
              {analysis.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{analysis.company}</p>
          </div>
          <QualityBadge grade={analysis.qualityGrade || 'B'} confidence={analysis.confidenceLevel || 80} score={analysis.qualityScore || 78} compact />
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {analysis.question}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {(analysis.frameworks || []).slice(0, 2).map((f, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
          ))}
          {(analysis.frameworks || []).length > 2 && (
            <Badge variant="secondary" className="text-xs">+{analysis.frameworks.length - 2}</Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs">{analysis.industry}</Badge>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeTime(analysis.created_at)}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onDelete(analysis.id) }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-red-400 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { analyses, loading, refreshAnalyses, deleteAnalysis } = useAnalysis()
  const navigate = useNavigate()

  useEffect(() => { refreshAnalyses(user?.id) }, [user?.id])

  const displayName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.user_metadata?.name?.split(' ')[0]
    || 'Analyst'

  const thisMonth = analyses.filter(a => {
    const d = new Date(a.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const avgGrade = analyses.length
    ? ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+']
        .find(g => analyses.filter(a => a.qualityGrade === g).length >= analyses.length / 4) || 'B'
    : '—'

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}</h1>
          <p className="text-muted-foreground text-sm mt-1">Your strategic analysis workspace</p>
        </div>
        <Button onClick={() => navigate('/analysis/new')} className="gap-2" size="lg">
          <Plus className="h-4 w-4" />New Analysis
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Analyses" value={analyses.length} sub="all time" />
        <StatCard label="This Month" value={thisMonth} sub="analyses" />
        <StatCard label="Avg Quality" value={avgGrade} sub="grade" />
        <StatCard label="Frameworks" value={analyses.reduce((s, a) => s + (a.frameworks?.length || 0), 0)} sub="applied" />
      </div>

      {/* Analyses */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl skeleton" />)}
        </div>
      ) : analyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No analyses yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">Create your first consultant-grade strategic analysis in under 2 minutes.</p>
          <Button onClick={() => navigate('/analysis/new')} className="gap-2">
            <Plus className="h-4 w-4" />Create First Analysis <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyses.map(a => (
            <AnalysisCard key={a.id} analysis={a} onDelete={id => deleteAnalysis(id).then(() => refreshAnalyses(user?.id))} />
          ))}
        </div>
      )}
    </Layout>
  )
}
