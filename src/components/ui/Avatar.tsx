import { cn } from '@/lib/cn'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  square?: boolean
  className?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-xl',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function Avatar({ src, name, size = 'md', square, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center font-medium bg-bg-card text-text-secondary overflow-hidden shrink-0',
        square ? 'rounded-none' : 'rounded-full',
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}
