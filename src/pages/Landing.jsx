import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Brain, Shield, Zap, Github } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const FEATURES = [
  { icon: Brain,    title: 'Multi-Agent Intelligence',    desc: '6 specialised AI agents collaborate in real time — each owning a distinct analytical workstream, from competitive intelligence to financial modelling.' },
  { icon: BarChart3, title: 'Dynamic Framework Selection', desc: '15 proprietary analytical frameworks applied contextually per question. No two analyses use the same methodology — selection is driven by your strategic context.' },
  { icon: Shield,   title: 'Consultant-Grade Output',      desc: 'Deliverables structured to partner-level standards. Hypothesis-driven, quantified, and actionable — accepted by Tier 1 strategy teams globally.' },
  { icon: Zap,      title: 'Instant Quality Scoring',      desc: 'Every analysis receives a dynamic quality grade (A+ to C+) and confidence rating, calibrated to question complexity, industry context, and analytical depth.' },
]

export default function Landing() {
  const { signInWithGoogle, signInWithGitHub, signInDemo } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setLoading('google'); setError('')
    const result = await signInWithGoogle()
    if (result?.demo) { navigate('/dashboard'); return }
    if (result?.error) setError(result.error.message || 'Sign-in failed')
    setLoading(null)
  }

  async function handleGitHub() {
    setLoading('github'); setError('')
    const result = await signInWithGitHub()
    if (result?.demo) { navigate('/dashboard'); return }
    if (result?.error) setError(result.error.message || 'Sign-in failed')
    setLoading(null)
  }

  function handleDemo() {
    signInDemo()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 shadow-md shadow-primary/30">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">ASIS <span className="text-muted-foreground font-normal text-sm">v5.0</span></span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDemo}>Try Demo</Button>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-16 pb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8">
          <Zap className="h-3 w-3" /> Now with 6-Agent Collaboration Network
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6">
          Advanced Strategic<br/>
          <span className="bg-gradient-to-r from-primary via-violet-400 to-gold-400 bg-clip-text text-transparent">Intelligence</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Multi-agent strategic analysis that produces Bain, McKinsey, and BCG-grade deliverables.
          Dynamic frameworks, quantified insights, and actionable recommendations — in minutes.
        </p>

        {/* Auth buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button onClick={handleGoogle} disabled={!!loading} size="lg" variant="outline" className="flex-1 gap-2 border-border/60">
            {loading === 'google' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <GoogleIcon />}
            {isSupabaseConfigured ? 'Continue with Google' : 'Google (Demo)'}
          </Button>
          <Button onClick={handleGitHub} disabled={!!loading} size="lg" variant="outline" className="flex-1 gap-2 border-border/60">
            {loading === 'github' ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Github className="h-4 w-4" />}
            {isSupabaseConfigured ? 'Continue with GitHub' : 'GitHub (Demo)'}
          </Button>
        </div>
        {!isSupabaseConfigured && (
          <p className="text-xs text-muted-foreground mt-3">Configure Supabase in <code className="text-primary">.env</code> to enable real OAuth</p>
        )}
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
        <button onClick={handleDemo} className="mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
          Skip — explore with demo account <ArrowRight className="inline h-3 w-3" />
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6 rounded-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
