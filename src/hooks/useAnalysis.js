import { useState, useEffect, useCallback } from 'react'
import { Analysis } from '@/entities/Analysis'
import { useAuth } from '@/hooks/useAuth'

export function useAnalysis() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshAnalyses = useCallback(async () => {
    if (!user) {
      setAnalyses([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await Analysis.list(user.id)
      setAnalyses(data)
    } catch (err) {
      setError(err.message || 'Failed to load analyses')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshAnalyses()
  }, [refreshAnalyses])

  const createAnalysis = useCallback(async (analysisData) => {
    if (!user) throw new Error('Must be logged in to create an analysis')
    try {
      const created = await Analysis.create({
        ...analysisData,
        user_id: user.id,
      })
      setAnalyses(prev => [created, ...prev])
      return created
    } catch (err) {
      throw new Error(err.message || 'Failed to create analysis')
    }
  }, [user])

  const getAnalysis = useCallback(async (id) => {
    try {
      return await Analysis.get(id)
    } catch (err) {
      throw new Error(err.message || 'Failed to get analysis')
    }
  }, [])

  const updateAnalysis = useCallback(async (id, updates) => {
    try {
      const updated = await Analysis.update(id, updates)
      setAnalyses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
      return updated
    } catch (err) {
      throw new Error(err.message || 'Failed to update analysis')
    }
  }, [])

  const deleteAnalysis = useCallback(async (id) => {
    try {
      await Analysis.delete(id)
      setAnalyses(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      throw new Error(err.message || 'Failed to delete analysis')
    }
  }, [])

  return {
    analyses,
    loading,
    error,
    createAnalysis,
    getAnalysis,
    updateAnalysis,
    deleteAnalysis,
    refreshAnalyses,
  }
}

export default useAnalysis
