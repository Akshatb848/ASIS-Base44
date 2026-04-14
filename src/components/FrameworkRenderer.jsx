import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const AGENT_LABELS = {
  orchestrator:      { label: 'Strategic Orchestrator', color: 'info' },
  market_intel:      { label: 'Market Intelligence',    color: 'success' },
  financial:         { label: 'Financial Analysis',     color: 'warning' },
  competitive_intel: { label: 'Competitive Intel',      color: 'purple' },
  risk:              { label: 'Risk & Scenario',        color: 'destructive' },
  synthesis:         { label: 'Synthesis',              color: 'info' },
}

export default function FrameworkRenderer({ section, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const agentInfo = AGENT_LABELS[section.agentOwner] || { label: 'Analysis Agent', color: 'secondary' }

  return (
    <div className="framework-card">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0 mt-0.5">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {section.frameworkName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={agentInfo.color} className="text-xs">{agentInfo.label}</Badge>
              {section.keyFindings?.length > 0 && (
                <span className="text-xs text-muted-foreground">{section.keyFindings.length} key findings</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-4">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Key findings preview (collapsed) */}
      {!expanded && section.keyFindings?.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {section.keyFindings.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 rounded-md px-2 py-1">
              <span className="text-primary">›</span>{f}
            </span>
          ))}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-border/30 pt-4">
          {/* Framework tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Framework Applied</span>
            <div className="h-px flex-1 bg-border/30" />
            <span className="text-xs text-primary font-medium">{section.frameworkName}</span>
          </div>

          {/* Prose content */}
          <div
            className="analysis-prose"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />

          {/* Key findings */}
          {section.keyFindings?.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border/20">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Key Findings</p>
              <ul className="space-y-2">
                {section.keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-primary font-bold mt-0.5">→</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
