import { cn } from '@/lib/cn'

interface ProgressBarProps {
  value: number
  size?: 'sm' | 'md'
  className?: string
}

export function ProgressBar({ value, size = 'md', className }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={cn(
      'w-full bg-[#333333]',
      size === 'sm' ? 'h-1.5' : 'h-2',
      className
    )}>
      <div
        className="h-full bg-brand transition-all"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  )
}
