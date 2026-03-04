export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  title: string
  location: string
  isOnboarded: boolean
  telegramHandle?: string
  twitterHandle?: string
  linkedinUrl?: string
  githubUrl?: string
  superteamEarnUrl?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
