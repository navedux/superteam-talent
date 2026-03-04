import type { ComponentType } from 'react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  icon: ComponentType<any>
  message: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({ icon: Icon, message, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-3 ${className ?? ''}`}>
      <Icon size={40} className="text-text-muted" />
      <p className="text-text-secondary text-sm">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
