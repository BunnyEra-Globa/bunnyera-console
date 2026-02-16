import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: cn(
      'bg-primary text-primary-foreground',
      'hover:bg-primary/90',
      'shadow-sm hover:shadow-md'
    ),
    secondary: cn(
      'bg-secondary text-secondary-foreground',
      'hover:bg-secondary/80'
    ),
    outline: cn(
      'border border-input bg-background',
      'text-foreground',
      'hover:bg-accent hover:text-accent-foreground'
    ),
    ghost: cn(
      'text-foreground',
      'hover:bg-accent hover:text-accent-foreground'
    ),
    danger: cn(
      'bg-destructive text-destructive-foreground',
      'hover:bg-destructive/90',
      'shadow-sm'
    ),
  }

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!isLoading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  )
}

// Icon Button
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function IconButton({
  children,
  className,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: IconButtonProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <Button
      variant={variant}
      size={size}
      isLoading={isLoading}
      disabled={disabled}
      className={cn('p-0 rounded-lg', sizes[size], className)}
      {...props}
    >
      {children}
    </Button>
  )
}
