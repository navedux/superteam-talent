import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, AuthState } from '@/types/auth'
import { API_ENDPOINTS } from '@/lib/constants'

const STORAGE_KEY = 'superteam_auth'

interface StoredAuth {
  user: User
  token: string
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

function storeAuth(user: User, token: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = getStoredAuth()

  const [state, setState] = useState<AuthState>({
    user: stored?.user ?? null,
    token: stored?.token ?? null,
    isAuthenticated: !!stored,
    isLoading: false,
  })

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Login failed')
      const data = (await res.json()) as { user: User; token: string }
      storeAuth(data.user, data.token)
      setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      setState(prev => ({ ...prev, isLoading: false }))
      throw new Error('Invalid credentials')
    }
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
