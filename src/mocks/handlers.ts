import { http, HttpResponse, delay } from 'msw'
import { mockUser } from './data/users'
import { mockJobs } from './data/jobs'
import { mockNotifications } from './data/notifications'

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as { email: string; password: string }
    if (body.email && body.password) {
      return HttpResponse.json({ user: mockUser, token: 'mock-jwt-token' })
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }),

  http.get('/api/profile', async () => {
    await delay(200)
    return HttpResponse.json(mockUser)
  }),

  http.get('/api/jobs', async () => {
    await delay(200)
    return HttpResponse.json(mockJobs)
  }),

  http.get('/api/notifications', async () => {
    await delay(150)
    return HttpResponse.json(mockNotifications)
  }),

  http.post('/api/onboarding', async ({ request }) => {
    await delay(400)
    const data = await request.json()
    return HttpResponse.json({ success: true, data })
  }),
]
