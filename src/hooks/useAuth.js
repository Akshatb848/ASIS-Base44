import { useContext } from 'react'
import { AuthContext } from '@/App'
import { auth } from '@/api/auth'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')

  const { user, loading, setUser, signOut, signInDemo } = ctx

  const signInWithGoogle = async () => {
    const result = await auth.signInWithGoogle()
    if (result?.demo && result?.user) {
      setUser(result.user)
    }
    return result
  }

  const signInWithGitHub = async () => {
    const result = await auth.signInWithGitHub()
    if (result?.demo && result?.user) {
      setUser(result.user)
    }
    return result
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    signInDemo,
  }
}

export default useAuth
