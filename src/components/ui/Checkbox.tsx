import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { RiCheckLine } from '@remixicon/react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  sublabel?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, sublabel, checked, onChange, ...props }, ref) => (
    <label className={cn('flex items-center gap-2 cursor-pointer', className)}>
      <div className="relative flex items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            'h-5 w-5 border flex items-center justify-center transition-colors',
            checked
              ? 'bg-brand border-brand'
              : 'bg-bg-input border-border'
          )}
        >
          {checked && <RiCheckLine size={13} className="text-white" />}
        </div>
      </div>
      {label && (
        <div className="flex flex-col">
          <span className="text-sm text-text-primary tracking-[-0.084px]">{label}</span>
          {sublabel && <span className="text-xs text-text-secondary">{sublabel}</span>}
        </div>
      )}
    </label>
  )
)
Checkbox.displayName = 'Checkbox'
