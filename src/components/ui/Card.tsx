import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardVariant = 'default' | 'elevated'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: CardVariant
  hover?: boolean
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-bg-card border border-border p-4',
  elevated: 'bg-bg-elevated p-1',
}

export function Card({ children, className, variant = 'default', hover }: CardProps) {
  return (
    <div className={cn(
      variantStyles[variant],
      hover && 'hover:border-brand/30 transition-colors cursor-pointer',
      className
    )}>
      {children}
    </div>
  )
}
