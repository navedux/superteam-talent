import type { Notification } from '@/types/jobs'

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New job match! A Senior Creative Talent is now in scope.',
    message: 'Based on your profile, we found a matching position at Helius.',
    read: false,
    createdAt: '2 hours ago',
    type: 'job',
    actionLabel: 'View Job',
  },
  {
    id: '2',
    title: 'Application update: your application is under review at a major web3 org.',
    message: 'Expect to hear back within 7 days.',
    read: false,
    createdAt: '5 hours ago',
    type: 'job',
    actionLabel: 'Track',
  },
  {
    id: '3',
    title: 'Profile view: multiple recruiters from top Solana companies viewed your profile.',
    message: 'Tip: keeping your profile updated can help land more interviews.',
    read: true,
    createdAt: '1 day ago',
    type: 'profile',
    actionLabel: 'Help',
  },
]
