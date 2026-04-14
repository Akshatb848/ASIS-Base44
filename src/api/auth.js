import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Demo user for when Supabase is not configured
const DEMO_USER = {
  id: 'demo_user',
  email: 'analyst@asis-demo.com',
  user_metadata: {
    full_name: 'Strategy Analyst',
    avatar_url: null,
    name: 'Strategy Analyst',
  },
}

export const auth = {
  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      return { user: DEMO_USER, error: null, demo: true }
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    return { data, error }
  },

  async signInWithGitHub() {
    if (!isSupabaseConfigured) {
      return { user: DEMO_USER, error: null, demo: true }
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    return { data, error }
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      localStorage.removeItem('asis_demo_user')
      return { error: null }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('asis_demo_user')
      if (stored) return { user: JSON.parse(stored), error: null }
      return { user: null, error: null }
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getSession() {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('asis_demo_user')
      if (stored) return { session: { user: JSON.parse(stored) }, error: null }
      return { session: null, error: null }
    }
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      // Check localStorage for demo user
      const stored = localStorage.getItem('asis_demo_user')
      if (stored) {
        setTimeout(() => callback('SIGNED_IN', { user: JSON.parse(stored) }), 50)
      }
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session)
    })
  },

  signInDemo() {
    localStorage.setItem('asis_demo_user', JSON.stringify(DEMO_USER))
    return { user: DEMO_USER, error: null }
  },
}

export default auth
