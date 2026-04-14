import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, Clock, Zap } from 'lucide-react'

const POSITIONS = {
  orchestrator:      { x: 50,  y: 8  },
  market_intel:      { x: 18,  y: 38 },
  financial:         { x: 50,  y: 38 },
  competitive_intel: { x: 82,  y: 38 },
  risk:              { x: 30,  y: 70 },
  synthesis:         { x: 70,  y: 70 },
}

const EDGES = [
  ['orchestrator', 'market_intel'],
  ['orchestrator', 'financial'],
  ['orchestrator', 'competitive_intel'],
  ['market_intel', 'risk'],
  ['financial', 'risk'],
  ['competitive_intel', 'synthesis'],
  ['risk', 'synthesis'],
  ['market_intel', 'synthesis'],
]

function statusColor(status) {
  if (status === 'completed') return '#10b981'
  if (status === 'active')    return '#6172f3'
  return '#334155'
}

function StatusIcon({ status }) {
  if (status === 'completed') return <CheckCircle className="h-3 w-3 text-emerald-400" />
  if (status === 'active')    return <Zap className="h-3 w-3 text-primary animate-pulse" />
  return <Clock className="h-3 w-3 text-slate-500" />
}

export default function AgentCollaborationGraph({ agents = [], isAnimating = false, compact = false }) {
  const [states, setStates] = useState({})

  const ORDER = ['orchestrator', 'market_intel', 'financial', 'competitive_intel', 'risk', 'synthesis']

  useEffect(() => {
    if (!isAnimating) {
      const done = {}
      agents.forEach(a => { done[a.id] = a.status || 'pending' })
      setStates(done)
      return
    }
    const init = {}
    ORDER.forEach(id => { init[id] = 'pending' })
    setStates(init)

    let step = 0
    const timer = setInterval(() => {
      if (step < ORDER.length) {
        const id = ORDER[step]
        setStates(prev => ({ ...prev, [id]: 'active' }))
        if (step > 0) setStates(prev => ({ ...prev, [ORDER[step - 1]]: 'completed' }))
      } else {
        setStates(prev => ({ ...prev, [ORDER[ORDER.length - 1]]: 'completed' }))
        clearInterval(timer)
      }
      step++
    }, 900)
    return () => clearInterval(timer)
  }, [isAnimating, agents.length])

  const agentMap = {}
  agents.forEach(a => { agentMap[a.id] = a })

  const completedCount = Object.values(states).filter(s => s === 'completed').length
  const totalCount = ORDER.length
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <div className={`rounded-2xl border border-border/40 bg-card/60 backdrop-blur ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Agent Collaboration Network</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{completedCount} of {totalCount} agents complete</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-muted-foreground font-medium">{progress}%</span>
        </div>
      </div>

      {/* SVG Graph */}
      <div className="relative w-full" style={{ paddingTop: '52%' }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 56" preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {EDGES.map(([from, to]) => {
            const f = POSITIONS[from], t = POSITIONS[to]
            const active = states[from] === 'active' || states[to] === 'active'
            const done = states[from] === 'completed' && states[to] === 'completed'
            return (
              <line key={`${from}-${to}`}
                x1={f.x} y1={f.y + 5} x2={t.x} y2={t.y - 2}
                stroke={done ? '#10b981' : active ? '#6172f3' : '#1e293b'}
                strokeWidth="0.6"
                strokeDasharray={done ? 'none' : '1.5 1.5'}
                className="transition-all duration-500"
              />
            )
          })}

          {/* Nodes */}
          {ORDER.map(id => {
            const pos = POSITIONS[id]
            const agent = agentMap[id] || agents.find(a => a.id === id) || {}
            const status = states[id] || 'pending'
            const color = statusColor(status)
            const isActive = status === 'active'

            return (
              <g key={id} transform={`translate(${pos.x},${pos.y})`}>
                {isActive && <circle cx="0" cy="0" r="5.5" fill={color} opacity="0.15" className="animate-ping" />}
                <circle cx="0" cy="0" r="4.5" fill="#0f172a" stroke={color} strokeWidth="0.8" className="transition-all duration-500" />
                <text x="0" y="0.8" textAnchor="middle" className="fill-white" style={{ fontSize: '2.5px', fontWeight: 600 }}>
                  {agent.icon || '●'}
                </text>
                <text x="0" y="7.5" textAnchor="middle" className="fill-slate-300" style={{ fontSize: '2px' }}>
                  {(agent.name || id).replace(' Agent', '').replace(' & ', '/')}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Agent list */}
      <div className={`grid gap-2 mt-4 ${compact ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {ORDER.map(id => {
          const agent = agentMap[id] || agents.find(a => a.id === id) || { id, name: id }
          const status = states[id] || 'pending'
          return (
            <div key={id} className={`flex items-start gap-2 rounded-lg p-2 border transition-all duration-300 ${
              status === 'active' ? 'border-primary/40 bg-primary/5' :
              status === 'completed' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/20'
            }`}>
              <StatusIcon status={status} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{agent.name || id}</p>
                {!compact && <p className="text-xs text-muted-foreground truncate">{agent.task || agent.role || ''}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
