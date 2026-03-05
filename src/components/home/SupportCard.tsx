import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { SearchModal } from '@/components/search/SearchModal'
import {
  RiSearchLine,
  RiNotification3Line,
  RiBriefcase3Line,
  RiStarSmileLine,
  RiFileCheckLine,
  RiCloseLine,
} from '@remixicon/react'
import { API_ENDPOINTS, ROUTES } from '@/lib/constants'
import type { User } from '@/types/auth'
import type { Notification } from '@/types/jobs'

const typeIcons: Record<string, typeof RiBriefcase3Line> = {
  job: RiBriefcase3Line,
  profile: RiStarSmileLine,
  system: RiFileCheckLine,
}

interface UserHeaderProps {
  user: User | null
}

export function UserHeader({ user }: UserHeaderProps) {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notifRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })

  // CMD+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Fetch notifications
  useEffect(() => {
    fetch(API_ENDPOINTS.NOTIFICATIONS)
      .then(res => res.json())
      .then((data: Notification[]) => setNotifications(data))
      .catch(console.error)
  }, [])

  // Click outside to close notification panel
  useEffect(() => {
    if (!notifOpen) return
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  const openNotifPanel = useCallback(() => {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      })
    }
    setNotifOpen(prev => !prev)
  }, [])

  const unreadCount = notifications.length

  if (!user) return null

  return (
    <>
      <div className="flex items-center gap-4 p-4 overflow-hidden">
        <Avatar name={user.name} size="lg" />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h2 className="text-lg font-medium text-text-primary tracking-[-0.27px]">{user.name}</h2>
          <p className="text-sm text-text-secondary">Welcome back to Talent</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} title="Search (⌘K)">
            <RiSearchLine size={20} />
          </Button>

          {/* Notification bell */}
          <div ref={notifRef}>
            <Button
              ref={bellRef}
              variant="ghost"
              size="icon"
              onClick={openNotifPanel}
              title="Notifications"
              className="relative"
            >
              <RiNotification3Line size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full" />
              )}
            </Button>

            {/* Notification dropdown */}
            {notifOpen && (
              <div
                className="fixed w-[380px] bg-bg-card border border-border shadow-lg z-[100]"
                style={{ top: dropdownPos.top, right: dropdownPos.right }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-medium bg-brand text-white px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => setNotifOpen(false)}>
                    <RiCloseLine size={16} />
                  </Button>
                </div>

                {/* Notification list */}
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-text-muted">
                      <RiNotification3Line size={24} />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(notif => {
                      const Icon = typeIcons[notif.type] || RiNotification3Line
                      return (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setNotifOpen(false)
                            if (notif.type === 'job') navigate(ROUTES.JOBS)
                            else if (notif.type === 'profile') navigate(ROUTES.PROFILE)
                            else navigate(ROUTES.APPLICATIONS)
                          }}
                          className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-bg-secondary transition-colors border-b border-border last:border-b-0"
                        >
                          <div className="shrink-0 mt-0.5 p-1.5 bg-brand/10 rounded-full">
                            <Icon size={14} className="text-brand" />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                            <p className="text-[13px] font-medium text-text-primary leading-snug">{notif.title}</p>
                            <p className="text-[13px] text-text-secondary leading-snug truncate">{notif.message}</p>
                          </div>
                          <span className="text-[11px] text-text-muted shrink-0 mt-0.5">5m</span>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="border-t border-border px-4 py-2.5">
                    <button
                      onClick={() => { setNotifOpen(false); navigate(ROUTES.APPLICATIONS) }}
                      className="text-xs font-medium text-brand hover:text-brand-hover transition-colors cursor-pointer w-full text-center"
                    >
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
