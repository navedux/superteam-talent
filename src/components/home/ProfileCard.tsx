import { useNavigate } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RiMapPinLine, RiMailLine, RiAtLine, RiAddLine } from '@remixicon/react'
import { ROUTES } from '@/lib/constants'
import type { User } from '@/types/auth'

interface ProfileCardProps {
  user: User | null
}

export function ProfileCard({ user }: ProfileCardProps) {
  const navigate = useNavigate()

  if (!user) return null

  return (
    <Card className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex items-start gap-4">
        <Avatar name={user.name} size="xl" />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-lg font-medium text-text-primary truncate">{user.name}</h3>
          <p className="text-sm text-text-secondary truncate">{user.title}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <RiMapPinLine size={12} /> {user.location}
            </span>
          </div>
        </div>
        <Button variant="brand-muted" size="sm" onClick={() => navigate(ROUTES.PROFILE)}>
          Edit Profile
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-text-secondary">Signed up 6d </span>
        <span className="text-text-muted">&middot;</span>
        <button onClick={() => navigate(ROUTES.APPLICATIONS)} className="text-text-secondary hover:text-brand cursor-pointer">
          2 Applications
        </button>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          <RiMailLine size={14} className="text-text-muted" />
          <span>{user.email}</span>
        </div>
        {user.telegramHandle && (
          <div className="flex items-center gap-2 text-text-secondary">
            <RiAtLine size={14} className="text-text-muted" />
            <span>{user.telegramHandle}</span>
          </div>
        )}
      </div>

      {/* Superpower */}
      <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PROFILE)} className="text-brand hover:text-brand w-fit">
        <RiAddLine size={14} />
        Add New Superpower
      </Button>
    </Card>
  )
}
