import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  required?: boolean
  optional?: boolean
  error?: string
  hint?: string
  icon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, required, optional, error, hint, icon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="flex items-center gap-1 text-sm font-medium text-text-primary tracking-[-0.084px]">
            {label}
            {required && <span className="text-brand">*</span>}
            {optional && <span className="text-text-secondary font-normal">(Optional)</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-text-muted flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-bg-input border border-border px-3 py-2.5 text-sm text-text-primary',
              'placeholder:text-text-muted shadow-input tracking-[-0.084px]',
              'focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand',
              'transition-colors duration-150',
              icon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error focus:ring-error',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-text-muted flex items-center cursor-pointer">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error tracking-[-0.084px]">{error}</p>}
        {hint && !error && <p className="text-xs text-text-secondary tracking-[-0.084px]">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
