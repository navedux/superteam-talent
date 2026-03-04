export const ROUTES = {
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  HOME: '/',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  PLAYBOOK: '/playbook',
  PROFILE: '/profile',
} as const

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  PROFILE: '/api/profile',
  JOBS: '/api/jobs',
  NOTIFICATIONS: '/api/notifications',
  ONBOARDING: '/api/onboarding',
} as const

export const ONBOARDING_STEPS = [
  { id: 1, label: 'Step 1/5', title: 'Identity & Contact' },
  { id: 2, label: 'Step 2/5', title: 'Job Category' },
  { id: 3, label: 'Step 3/5', title: 'Market Status' },
  { id: 4, label: 'Step 4/5', title: 'Contributions' },
  { id: 5, label: 'Step 5/5', title: 'Community' },
] as const
