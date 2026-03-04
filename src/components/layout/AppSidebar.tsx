import { NavLink, useNavigate } from 'react-router'
import { RiHomeLine, RiBriefcaseLine, RiFileTextLine, RiBookOpenLine, RiUserLine, RiHeadphoneLine, RiLogoutBoxLine } from '@remixicon/react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { to: ROUTES.HOME, icon: RiHomeLine, label: 'Home' },
  { to: ROUTES.JOBS, icon: RiBriefcaseLine, label: 'Job Board' },
  { to: ROUTES.APPLICATIONS, icon: RiFileTextLine, label: 'Application Tracker' },
  { to: ROUTES.PLAYBOOK, icon: RiBookOpenLine, label: 'Job Playbook' },
  { to: ROUTES.PROFILE, icon: RiUserLine, label: 'Talent Profile' },
]

interface AppSidebarProps {
  open?: boolean
  onClose?: () => void
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={cn(
        'w-[272px] h-screen bg-bg-secondary border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="flex items-center p-3">
          <div className="p-3 w-[248px]">
            <img src="/ST_LOGO.webp" alt="Superteam Talent" className="h-5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-5 pt-5 px-5 pb-4 overflow-hidden">
          {/* Navigation */}
          <nav>
            <ul className="flex flex-col gap-1">
              {navItems.map(item => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-3 py-2 text-sm transition-colors relative',
                        isActive
                          ? 'bg-bg-card text-text-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={20} />
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Card */}
          <div className="mt-auto bg-bg-card p-3 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <RiHeadphoneLine size={24} className="text-text-primary" />
              <span className="text-base font-medium text-text-primary">Need Help?</span>
            </div>
            <p className="text-sm text-text-secondary">Reach us on Telegram</p>
            <Button
              size="sm"
              fullWidth
              onClick={() => window.open('https://t.me/superteam', '_blank')}
            >
              Contact Support
            </Button>
          </div>

          {/* Logout button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="justify-start hover:text-red-400"
          >
            <RiLogoutBoxLine size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  )
}
