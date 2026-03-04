export interface Job {
  id: string
  title: string
  company: string
  companyLogo?: string
  location: string
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Bounty'
  compensation: string
  skills: string[]
  postedAt: string
  description: string
  status?: 'Paid' | 'Open' | 'Closing Soon'
}

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  type: 'job' | 'profile' | 'system'
  actionLabel?: string
  actionUrl?: string
}
