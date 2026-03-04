import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'brand-muted' | 'applied'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  isLoading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:scale-[0.98]',
  secondary: 'bg-bg-input text-text-primary border border-border hover:bg-bg-card shadow-input',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-card',
  'brand-muted': 'bg-brand-muted text-brand hover:bg-brand/20',
  applied: 'bg-bg-input text-text-muted border border-border pointer-events-none opacity-70',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-2.5 text-lg gap-1 font-heading font-medium',
  icon: 'p-2.5',
  'icon-sm': 'p-1.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
