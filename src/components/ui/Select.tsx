import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { RiArrowDownSLine } from '@remixicon/react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  required?: boolean
  optional?: boolean
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, required, optional, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="flex items-center gap-1 text-sm font-medium text-text-primary tracking-[-0.084px]">
            {label}
            {required && <span className="text-brand">*</span>}
            {optional && <span className="text-text-secondary font-normal">(Optional)</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none bg-bg-input border border-border px-3 py-2.5 text-sm text-text-primary',
              'shadow-input tracking-[-0.084px]',
              'focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand',
              'transition-colors duration-150 cursor-pointer',
              error && 'border-error focus:ring-error',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <RiArrowDownSLine size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>
        {error && <p className="text-xs text-error tracking-[-0.084px]">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
