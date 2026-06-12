import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, type Profile } from '../lib/supabase'

interface Result {
  error: string | null
}

interface AuthState {
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signIn: (email: string, password: string) => Promise<Result>
  signUp: (email: string, password: string, fullName: string) => Promise<Result & { needsConfirm: boolean }>
  resetPassword: (email: string) => Promise<Result>
  updatePassword: (password: string) => Promise<Result>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

const baseUrl = () =>
  typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, cafe_id')
      .eq('id', userId)
      .maybeSingle()
    setProfile((data as Profile) ?? null)
  }

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) await loadProfile(data.session.user.id)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      if (newSession?.user) await loadProfile(newSession.user.id)
      else setProfile(null)
      // Al pulsar el enlace de recuperación, llevamos al formulario de nueva contraseña
      if (event === 'PASSWORD_RECOVERY') window.location.hash = '#/reset-password'
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value: AuthState = {
    session,
    profile,
    loading,
    async signInWithGoogle() {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: baseUrl() },
      })
    },
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message ?? null }
    },
    async signUp(email, password, fullName) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: baseUrl() },
      })
      return { error: error?.message ?? null, needsConfirm: !error && !data.session }
    },
    async resetPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: baseUrl() })
      return { error: error?.message ?? null }
    },
    async updatePassword(password) {
      const { error } = await supabase.auth.updateUser({ password })
      return { error: error?.message ?? null }
    },
    async signOut() {
      await supabase.auth.signOut()
      setProfile(null)
    },
    async refreshProfile() {
      if (session?.user) await loadProfile(session.user.id)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
