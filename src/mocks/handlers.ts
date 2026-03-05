import { http, HttpResponse, delay } from 'msw'
import { mockUser } from './data/users'
import { mockJobs } from './data/jobs'
import { mockNotifications } from './data/notifications'

export const handlers = [
  http.post('/api/auth/login', async () => {
    await delay(300)
    return HttpResponse.json({ user: mockUser, token: 'mock-jwt-token' })
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
