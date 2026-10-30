import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Profile, UserRole } from '@/types'
import type { Session, User } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isAdmin: boolean

  init: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  refreshProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isAdmin: false,

  init: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        set({
          session,
          user: session.user,
          profile: profileData as Profile | null,
          isAuthenticated: true,
          isAdmin: (profileData as Profile | null)?.role === 'admin',
          loading: false,
        })
      } else {
        set({ loading: false })
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single()

          set({
            session: newSession,
            user: newSession.user,
            profile: profileData as Profile | null,
            isAuthenticated: true,
            isAdmin: (profileData as Profile | null)?.role === 'admin',
          })
        } else {
          set({
            session: null,
            user: null,
            profile: null,
            isAuthenticated: false,
            isAdmin: false,
          })
        }
      })
    } catch {
      set({ loading: false })
    }
  },

  signIn: async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        return { error: getAuthErrorMessage(error.message) }
      }
      return { error: null }
    } catch {
      return { error: 'Unable to connect to the authentication service. Please try again.' }
    }
  },

  signUp: async (email, password, fullName) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) {
        return { error: getAuthErrorMessage(error.message) }
      }
      return { error: null }
    } catch {
      return { error: 'Unable to create your account. Please try again.' }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({
      session: null,
      user: null,
      profile: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
    })
  },

  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) {
        return { error: getAuthErrorMessage(error.message) }
      }
      return { error: null }
    } catch {
      return { error: 'Unable to send reset email. Please try again.' }
    }
  },

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      set({ profile: data as Profile, isAdmin: (data as Profile).role === 'admin' })
    }
  },

  clearError: () => set({ error: null }),
}))

function getAuthErrorMessage(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'The email or password you entered is incorrect.',
    'Email not confirmed': 'Please verify your email address before signing in.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters.': 'Password must be at least 8 characters.',
  }
  return map[message] ?? message
}

export type { UserRole }
