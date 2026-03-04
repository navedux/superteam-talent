import { cn } from '@/lib/cn'

interface Tab {
  label: string
  value: string
  count?: number
}

interface TabGroupProps {
  tabs: Tab[]
  activeTab: string
  onChange: (value: string) => void
  className?: string
}

export function TabGroup({ tabs, activeTab, onChange, className }: TabGroupProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-2 px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer h-10',
            activeTab === tab.value
              ? 'bg-brand text-white'
              : 'bg-bg-input border border-border text-text-muted hover:text-text-secondary'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'text-xs px-1.5 py-0.5',
              activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-bg-card text-text-muted'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
