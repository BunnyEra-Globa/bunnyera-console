import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../theme/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// ========================================
// 按钮样式变体
// ========================================

const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-be-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        // 主按钮
        primary: 'bg-be-primary text-white hover:bg-[var(--be-primary-hover)] shadow-sm hover:shadow-md',
        // 次按钮
        secondary: 'bg-[var(--be-background-secondary)] text-text-primary hover:bg-[var(--be-background-tertiary)] border border-[var(--be-border)]',
        // 描边按钮
        outline: 'bg-transparent text-text-primary hover:bg-[var(--be-background-secondary)] border border-[var(--be-border)] hover:border-[var(--be-border-hover)]',
        // 幽灵按钮
        ghost: 'bg-transparent text-text-secondary hover:bg-[var(--be-background-secondary)] hover:text-text-primary',
        // 危险按钮
        danger: 'bg-be-danger text-white hover:bg-red-600 shadow-sm hover:shadow-md',
        // 链接按钮
        link: 'bg-transparent text-be-primary hover:text-[var(--be-primary-hover)] underline-offset-4 hover:underline p-0 h-auto',
        // 渐变按钮
        gradient: 'bg-gradient-primary text-white hover:opacity-90 shadow-sm hover:shadow-md',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs gap-1.5',
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2',
        xl: 'h-14 px-8 text-lg gap-3',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// ========================================
// 类型定义
// ========================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 按钮内容 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 右侧图标 */
  rightIcon?: React.ReactNode;
  /** 图标位置 */
  iconPosition?: 'left' | 'right';
  /** 加载提示文本 */
  loadingText?: string;
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link' | 'gradient';
  /** 按钮尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  /** 是否占满宽度 */
  fullWidth?: boolean;
  /** 是否为圆形按钮 */
  circle?: boolean;
  /** 是否为圆角按钮 */
  rounded?: boolean;
}

// ========================================
// Button 组件
// ========================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      rightIcon,
      iconPosition = 'left',
      loadingText,
      fullWidth = false,
      circle = false,
      rounded = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // 处理图标
    const renderIcon = () => {
      if (loading) {
        return <Loader2 className="w-4 h-4 animate-spin" />;
      }
      if (iconPosition === 'left' && icon) {
        return <span className="flex-shrink-0">{icon}</span>;
      }
      return null;
    };

    const renderRightIcon = () => {
      if (loading && loadingText) {
        return null;
      }
      if (iconPosition === 'right' && icon) {
        return <span className="flex-shrink-0">{icon}</span>;
      }
      if (rightIcon) {
        return <span className="flex-shrink-0">{rightIcon}</span>;
      }
      return null;
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          circle && 'rounded-full',
          rounded && 'rounded-full px-6',
          className
        )}
        {...props}
      >
        {renderIcon()}
        {loading && loadingText ? loadingText : children}
        {renderRightIcon()}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ========================================
// ButtonGroup 组件
// ========================================

export interface ButtonGroupProps {
  /** 子按钮 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 变体 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** 是否垂直排列 */
  vertical?: boolean;
  /** 是否占满宽度 */
  fullWidth?: boolean;
}

export function ButtonGroup({
  children,
  className,
  size = 'md',
  variant = 'outline',
  vertical = false,
  fullWidth = false,
}: ButtonGroupProps): JSX.Element {
  return (
    <div
      className={cn(
        'inline-flex',
        vertical ? 'flex-col' : 'flex-row',
        fullWidth && 'w-full',
        className
      )}
      role="group"
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        return React.cloneElement(child as React.ReactElement<ButtonProps>, {
          size,
          variant,
          fullWidth,
          className: cn(
            (child as React.ReactElement<ButtonProps>).props.className,
            !vertical && {
              'rounded-r-none': !isLast,
              'rounded-l-none': !isFirst,
              '-ml-px': !isFirst,
            },
            vertical && {
              'rounded-b-none': !isLast,
              'rounded-t-none': !isFirst,
              '-mt-px': !isFirst,
            }
          ),
        });
      })}
    </div>
  );
}

// ========================================
// IconButton 组件
// ========================================

export interface IconButtonProps extends Omit<ButtonProps, 'icon' | 'iconPosition' | 'rightIcon'> {
  /** 图标 */
  icon: React.ReactNode;
  /** 按钮标题 */
  title?: string;
  /**  aria-label */
  'aria-label'?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', variant = 'ghost', title, 'aria-label': ariaLabel, ...props }, ref) => {
    const sizeClasses = {
      xs: 'h-7 w-7',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-14 w-14',
    };

    const iconSizes = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };

    return (
      <button
        ref={ref}
        type="button"
        title={title}
        aria-label={ariaLabel || title}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-be-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:scale-[0.98]',
          sizeClasses[size as keyof typeof sizeClasses],
          variant === 'primary' && 'bg-be-primary text-white hover:bg-[var(--be-primary-hover)]',
          variant === 'secondary' && 'bg-[var(--be-background-secondary)] text-text-primary hover:bg-[var(--be-background-tertiary)]',
          variant === 'outline' && 'bg-transparent text-text-primary hover:bg-[var(--be-background-secondary)] border border-[var(--be-border)]',
          variant === 'ghost' && 'bg-transparent text-text-secondary hover:bg-[var(--be-background-secondary)] hover:text-text-primary',
          variant === 'danger' && 'bg-be-danger text-white hover:bg-red-600',
          className
        )}
        {...props}
      >
        <span className={cn('flex-shrink-0', iconSizes[size as keyof typeof iconSizes])}>
          {icon}
        </span>
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

// ========================================
// ActionButton 组件 (带下拉菜单的按钮)
// ========================================

export interface ActionButtonProps extends ButtonProps {
  /** 下拉菜单项 */
  actions?: {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
  }[];
  /** 下拉菜单标题 */
  dropdownTitle?: string;
  /** 下拉菜单位置 */
  dropdownPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
}

export function ActionButton({
  actions = [],
  dropdownTitle,
  dropdownPlacement = 'bottomRight',
  children,
  ...buttonProps
}: ActionButtonProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placementClasses = {
    bottomLeft: 'left-0 top-full mt-1',
    bottomRight: 'right-0 top-full mt-1',
    topLeft: 'left-0 bottom-full mb-1',
    topRight: 'right-0 bottom-full mb-1',
  };

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      <Button {...buttonProps}>{children}</Button>
      
      {actions.length > 0 && (
        <>
          <div className="w-px bg-[var(--be-border)] mx-1" />
          <Button
            variant={buttonProps.variant}
            size={buttonProps.size}
            onClick={() => setIsOpen(!isOpen)}
            className="px-2"
          >
            <svg
              className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>

          {isOpen && (
            <div
              className={cn(
                'absolute z-50 min-w-[160px] bg-[var(--be-surface)] border border-[var(--be-border)] rounded-xl shadow-lg overflow-hidden',
                placementClasses[dropdownPlacement]
              )}
            >
              {dropdownTitle && (
                <div className="px-4 py-2 text-xs font-medium text-text-tertiary border-b border-[var(--be-border)]">
                  {dropdownTitle}
                </div>
              )}
              <div className="py-1">
                {actions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => {
                      action.onClick?.();
                      setIsOpen(false);
                    }}
                    disabled={action.disabled}
                    className={cn(
                      'w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                      action.danger
                        ? 'text-be-danger hover:bg-be-danger-light'
                        : 'text-text-secondary hover:bg-[var(--be-background-secondary)]',
                      action.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
