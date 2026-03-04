import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  RiNotification3Line,
  RiBriefcase3Line,
  RiStarSmileLine,
  RiFileCheckLine,
} from '@remixicon/react'
import { API_ENDPOINTS, ROUTES } from '@/lib/constants'
import type { Notification } from '@/types/jobs'

const typeIcons: Record<string, typeof RiBriefcase3Line> = {
  job: RiBriefcase3Line,
  profile: RiStarSmileLine,
  system: RiFileCheckLine,
}

export function NotificationPanel() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetch(API_ENDPOINTS.NOTIFICATIONS)
      .then(res => res.json())
      .then((data: Notification[]) => setNotifications(data))
      .catch(console.error)
  }, [])

  return (
    <div className="border border-border">
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <RiNotification3Line size={24} className="text-brand" />
          <h3 className="text-base font-medium text-text-primary flex-1">Recent Notifications</h3>
          <button
            onClick={() => navigate(ROUTES.APPLICATIONS)}
            className="text-sm font-medium text-brand hover:text-brand-hover transition-colors cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Notification Items */}
        {notifications.map(notif => {
          const Icon = typeIcons[notif.type] || RiNotification3Line
          return (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.type === 'job') navigate(ROUTES.JOBS)
                else if (notif.type === 'profile') navigate(ROUTES.PROFILE)
                else navigate(ROUTES.APPLICATIONS)
              }}
              className="flex items-start gap-2.5 p-4 border border-border cursor-pointer hover:bg-bg-card hover:border-text-muted/30 transition-all duration-150"
            >
              <div className="shrink-0 p-0.5">
                <Icon size={18} className="text-error" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary leading-snug">{notif.title}</p>
                <p className="text-[13px] text-text-secondary leading-snug">{notif.message}</p>
              </div>
              <span className="text-xs font-medium text-text-secondary shrink-0">5 min</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
