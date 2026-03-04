import { cn } from '@/lib/cn'

interface DividerProps {
  text?: string
  className?: string
}

export function Divider({ text, className }: DividerProps) {
  if (text) {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] font-medium text-text-muted tracking-[0.22px] uppercase">{text}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    )
  }
  return <div className={cn('h-px bg-border', className)} />
}
