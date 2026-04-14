import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const GRADE_CONFIG = {
  'A+': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', glow: 'shadow-emerald-400/20', label: 'Exceptional' },
  'A':  { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', glow: 'shadow-emerald-400/20', label: 'Excellent' },
  'A-': { color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30',    glow: 'shadow-blue-400/20',    label: 'Strong' },
  'B+': { color: 'text-blue-400',    bg: 'bg-blue-400/10',    border: 'border-blue-400/30',    glow: 'shadow-blue-400/20',    label: 'Above Average' },
  'B':  { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   glow: 'shadow-amber-400/20',   label: 'Solid' },
  'B-': { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   glow: 'shadow-amber-400/20',   label: 'Adequate' },
  'C+': { color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/30',  glow: 'shadow-orange-400/20',  label: 'Developing' },
}

export default function QualityBadge({ grade = 'A', confidence = 85, score = 88, compact = false }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG['B']

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 border ${cfg.bg} ${cfg.border}`}>
              <span className={`font-bold text-sm ${cfg.color}`}>{grade}</span>
              <span className="text-xs text-muted-foreground">{confidence}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{cfg.label} — Score {score}/100</p>
            <p className="text-xs text-muted-foreground">Confidence: {confidence}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 shadow-lg ${cfg.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Analysis Quality</p>
        <span className="text-xs text-muted-foreground">{cfg.label}</span>
      </div>
      <div className="flex items-end gap-4">
        <div>
          <span className={`text-5xl font-bold ${cfg.color} leading-none`}>{grade}</span>
          <p className="text-xs text-muted-foreground mt-1">Score {score}/100</p>
        </div>
        <div className="flex-1 pb-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <span className={`text-sm font-semibold ${cfg.color}`}>{confidence}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                grade.startsWith('A') ? 'bg-emerald-400' : grade.startsWith('B') ? 'bg-blue-400' : 'bg-amber-400'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Frameworks: {score >= 88 ? 3 : 2} applied</p>
        </div>
      </div>
    </div>
  )
}
