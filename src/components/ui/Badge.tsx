import type { ReactNode } from 'react'
import { RiCloseLine } from '@remixicon/react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'brand' | 'success' | 'error' | 'outline' | 'filter'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  onDismiss?: () => void
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/8 text-text-secondary',
  brand: 'bg-brand-muted text-brand',
  success: 'bg-success/15 text-success',
  error: 'bg-error/15 text-error',
  outline: 'border border-border text-text-secondary',
  filter: 'bg-brand/25 text-brand',
}

export function Badge({ children, variant = 'default', className, onDismiss }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium tracking-[-0.084px]',
        variantStyles[variant],
        className
      )}
    >
      {children}
      {onDismiss && (
        <button
          onClick={e => { e.stopPropagation(); onDismiss() }}
          className="ml-0.5 hover:text-text-primary cursor-pointer"
        >
          <RiCloseLine size={12} />
        </button>
      )}
    </span>
  )
}
