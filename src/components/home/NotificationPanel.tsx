import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  RiNotification3Line,
  RiBriefcase3Line,
  RiStarSmileLine,
  RiFileCheckLine,
  RiFlashlightLine,
  RiHandHeartLine,
  RiUserVoiceLine,
  RiTrophyLine,
  RiCloseCircleLine,
} from '@remixicon/react'
import { API_ENDPOINTS, ROUTES } from '@/lib/constants'
import type { Notification } from '@/types/jobs'

const typeIcons: Record<string, typeof RiBriefcase3Line> = {
  job: RiBriefcase3Line,
  profile: RiStarSmileLine,
  system: RiFileCheckLine,
}

const trackerStats = [
  { label: 'Matched', count: 5, icon: RiFlashlightLine, color: 'text-brand' },
  { label: 'Introduced', count: 2, icon: RiHandHeartLine, color: 'text-blue-400' },
  { label: 'Interviews', count: 2, icon: RiUserVoiceLine, color: 'text-warning' },
  { label: 'Placed', count: 1, icon: RiTrophyLine, color: 'text-success' },
  { label: 'Rejected', count: 2, icon: RiCloseCircleLine, color: 'text-text-muted' },
]

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Recent Notifications */}
      <div className="border border-border">
        <div className="flex flex-col gap-4 p-4">
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
                  <Icon size={18} className="text-brand" />
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

      {/* Application Tracker Overview */}
      <div className="border border-border">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-2.5">
            <RiBriefcase3Line size={24} className="text-brand" />
            <h3 className="text-base font-medium text-text-primary flex-1">Application Overview</h3>
            <button
              onClick={() => navigate(ROUTES.APPLICATIONS)}
              className="text-sm font-medium text-brand hover:text-brand-hover transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Total */}
          <div className="flex items-baseline gap-2 px-1">
            <span className="text-2xl font-heading font-medium text-text-primary">
              {trackerStats.reduce((sum, s) => sum + s.count, 0)}
            </span>
            <span className="text-sm text-text-secondary">total applications</span>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2">
            {trackerStats.map(stat => (
              <div
                key={stat.label}
                onClick={() => navigate(ROUTES.APPLICATIONS)}
                className="flex items-center gap-3 p-3 border border-border cursor-pointer hover:bg-bg-card hover:border-text-muted/30 transition-all duration-150"
              >
                <stat.icon size={18} className={stat.color} />
                <span className="text-[13px] text-text-secondary flex-1">{stat.label}</span>
                <span className="text-sm font-medium text-text-primary">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
