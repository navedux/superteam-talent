import { RiSearchLine, RiCloseLine } from '@remixicon/react'
import { cn } from '@/lib/cn'

interface SearchInputProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onValueChange, placeholder = 'Search...', className }: SearchInputProps) {
  return (
    <div className={cn('flex items-center gap-2 bg-bg-input border border-border px-3 py-2.5', className)}>
      <RiSearchLine size={16} className="text-text-muted shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        className="bg-transparent text-sm text-text-primary placeholder:text-text-muted flex-1 outline-none min-w-0"
      />
      {value && (
        <button
          onClick={() => onValueChange('')}
          className="text-text-muted hover:text-text-primary cursor-pointer shrink-0"
        >
          <RiCloseLine size={16} />
        </button>
      )}
    </div>
  )
}
