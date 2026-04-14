import { generateId } from '@/lib/utils'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const STORAGE_KEY = 'asis_analyses'

function getLocalAnalyses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalAnalyses(analyses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses))
}

export const Analysis = {
  async list(userId) {
    if (isSupabaseConfigured && userId !== 'demo_user') {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    }
    // Local storage fallback
    const all = getLocalAnalyses()
    return all.filter(a => !userId || a.user_id === userId || a.user_id === 'demo_user')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  async get(id) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        // Fallback to local
        const all = getLocalAnalyses()
        return all.find(a => a.id === id) || null
      }
      return data
    }
    const all = getLocalAnalyses()
    return all.find(a => a.id === id) || null
  },

  async create(data) {
    const analysis = {
      id: generateId(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured && data.user_id !== 'demo_user') {
      const { data: saved, error } = await supabase
        .from('analyses')
        .insert([analysis])
        .select()
        .single()
      if (error) {
        // Fallback to local
        const all = getLocalAnalyses()
        all.unshift(analysis)
        saveLocalAnalyses(all)
        return analysis
      }
      return saved
    }

    // Local storage
    const all = getLocalAnalyses()
    all.unshift(analysis)
    saveLocalAnalyses(all)
    return analysis
  },

  async update(id, updates) {
    const updated = { ...updates, updated_at: new Date().toISOString() }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('analyses')
        .update(updated)
        .eq('id', id)
        .select()
        .single()
      if (!error) return data
    }

    // Local storage
    const all = getLocalAnalyses()
    const idx = all.findIndex(a => a.id === id)
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updated }
      saveLocalAnalyses(all)
      return all[idx]
    }
    return null
  },

  async delete(id) {
    if (isSupabaseConfigured) {
      await supabase.from('analyses').delete().eq('id', id)
    }
    const all = getLocalAnalyses()
    saveLocalAnalyses(all.filter(a => a.id !== id))
  },
}

export default Analysis
