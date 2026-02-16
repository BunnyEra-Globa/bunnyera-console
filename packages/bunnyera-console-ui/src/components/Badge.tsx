import React, { forwardRef } from 'react';
import { cn } from '../theme/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// ========================================
// Badge 样式变体
// ========================================

const badgeVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-be-primary text-white',
        success: 'bg-be-success text-white',
        warning: 'bg-be-warning text-white',
        danger: 'bg-be-danger text-white',
        info: 'bg-be-info text-white',
        neutral: 'bg-[var(--be-background-tertiary)] text-text-secondary',
        outline: 'bg-transparent border-2 border-be-primary text-be-primary',
        ghost: 'bg-[var(--be-primary-light)] text-be-primary',
      },
      size: {
        sm: 'min-w-[16px] h-4 px-1 text-[10px] rounded-full',
        md: 'min-w-[20px] h-5 px-1.5 text-xs rounded-full',
        lg: 'min-w-[24px] h-6 px-2 text-sm rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// ========================================
// 类型定义
// ========================================

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  /** 徽标内容 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 数字计数 */
  count?: number;
  /** 最大显示数字 */
  max?: number;
  /** 是否显示为圆点 */
  dot?: boolean;
  /** 状态颜色 */
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing';
  /** 状态文本 */
  text?: string;
  /** 偏移位置 */
  offset?: [number, number];
  /** 是否独立显示 */
  standalone?: boolean;
  /** 是否显示零 */
  showZero?: boolean;
  /** 是否动画 */
  pulse?: boolean;
}

// ========================================
// Badge 组件
// ========================================

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'md',
      count,
      max = 99,
      dot = false,
      status,
      text,
      offset,
      standalone = false,
      showZero = false,
      pulse = false,
    },
    ref
  ) => {
    // 处理数字显示
    const displayCount = count !== undefined ? (count > max ? `${max}+` : String(count)) : null;

    // 判断是否显示徽标
    const shouldShow = count !== undefined ? (count > 0 || showZero) : true;

    // 状态颜色映射
    const statusColors = {
      success: 'bg-be-success',
      warning: 'bg-be-warning',
      danger: 'bg-be-danger',
      info: 'bg-be-info',
      neutral: 'bg-text-tertiary',
      processing: 'bg-be-primary',
    };

    // 独立显示模式
    if (standalone) {
      if (dot) {
        return (
          <span
            ref={ref}
            className={cn(
              'inline-block w-2 h-2 rounded-full',
              status ? statusColors[status] : 'bg-be-primary',
              pulse && 'animate-pulse',
              className
            )}
          />
        );
      }

      if (status && text) {
        return (
          <span
            ref={ref}
            className={cn(
              'inline-flex items-center gap-1.5 text-sm',
              className
            )}
          >
            <span className={cn('w-2 h-2 rounded-full', statusColors[status])} />
            <span className="text-text-secondary">{text}</span>
          </span>
        );
      }

      return (
        <span
          ref={ref}
          className={cn(badgeVariants({ variant, size }), className)}
        >
          {displayCount || children}
        </span>
      );
    }

    // 包裹子元素的徽标
    return (
      <span ref={ref} className={cn('relative inline-flex', className)}>
        {children}
        {shouldShow && (
          <span
            className={cn(
              'absolute z-10 flex items-center justify-center',
              dot
                ? 'w-2.5 h-2.5 rounded-full -top-1 -right-1'
                : badgeVariants({ variant, size }),
              status && dot && statusColors[status],
              !status && dot && 'bg-be-danger',
              pulse && 'animate-pulse'
            )}
            style={
              offset
                ? { transform: `translate(${offset[0]}px, ${offset[1]}px)` }
                : undefined
            }
          >
            {!dot && (displayCount || children)}
          </span>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ========================================
// StatusBadge 组件 (状态徽标)
// ========================================

export interface StatusBadgeProps {
  /** 状态 */
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing';
  /** 文本 */
  text?: string;
  /** 是否显示圆点 */
  showDot?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({
  status,
  text,
  showDot = true,
  className,
  size = 'md',
}: StatusBadgeProps): JSX.Element {
  const statusConfig = {
    success: { color: 'bg-be-success', label: '成功' },
    warning: { color: 'bg-be-warning', label: '警告' },
    danger: { color: 'bg-be-danger', label: '错误' },
    info: { color: 'bg-be-info', label: '信息' },
    neutral: { color: 'bg-text-tertiary', label: '默认' },
    processing: { color: 'bg-be-primary', label: '处理中' },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5', sizeClasses[size], className)}>
      {showDot && (
        <span className={cn('rounded-full', config.color, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      )}
      <span className="text-text-secondary">{text || config.label}</span>
    </span>
  );
}

// ========================================
// NotificationBadge 组件 (通知徽标)
// ========================================

export interface NotificationBadgeProps {
  /** 通知数量 */
  count?: number;
  /** 最大显示数量 */
  max?: number;
  /** 子元素 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否显示零 */
  showZero?: boolean;
  /** 是否动画 */
  pulse?: boolean;
}

export function NotificationBadge({
  count = 0,
  max = 99,
  children,
  className,
  showZero = false,
  pulse = false,
}: NotificationBadgeProps): JSX.Element {
  const shouldShow = count > 0 || showZero;
  const displayCount = count > max ? `${max}+` : String(count);

  return (
    <span className={cn('relative inline-flex', className)}>
      {children}
      {shouldShow && (
        <span
          className={cn(
            'absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1',
            'flex items-center justify-center',
            'bg-be-danger text-white text-[10px] font-medium rounded-full',
            'border-2 border-[var(--be-surface)]',
            pulse && 'animate-pulse'
          )}
        >
          {displayCount}
        </span>
      )}
    </span>
  );
}

// ========================================
// DotBadge 组件 (纯圆点徽标)
// ========================================

export interface DotBadgeProps {
  /** 状态 */
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing';
  /** 自定义颜色 */
  color?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否动画 */
  pulse?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function DotBadge({
  status = 'neutral',
  color,
  size = 'md',
  pulse = false,
  className,
}: DotBadgeProps): JSX.Element {
  const statusColors = {
    success: 'bg-be-success',
    warning: 'bg-be-warning',
    danger: 'bg-be-danger',
    info: 'bg-be-info',
    neutral: 'bg-text-tertiary',
    processing: 'bg-be-primary',
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span
      className={cn(
        'inline-block rounded-full',
        sizeClasses[size],
        color || statusColors[status],
        pulse && 'animate-pulse',
        className
      )}
    />
  );
}

// ========================================
// Ribbon 组件 (角标)
// ========================================

export interface RibbonProps {
  /** 角标文本 */
  text: React.ReactNode;
  /** 位置 */
  placement?: 'start' | 'end';
  /** 颜色 */
  color?: string;
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

export function Ribbon({
  text,
  placement = 'end',
  color = 'var(--be-primary)',
  children,
  className,
}: RibbonProps): JSX.Element {
  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      <div
        className={cn(
          'absolute top-0 px-3 py-1 text-xs font-medium text-white',
          placement === 'start' ? '-left-2' : '-right-2',
          placement === 'start' ? 'rounded-br-lg' : 'rounded-bl-lg'
        )}
        style={{ backgroundColor: color }}
      >
        {text}
      </div>
    </div>
  );
}

// ========================================
// StepBadge 组件 (步骤徽标)
// ========================================

export interface StepBadgeProps {
  /** 当前步骤 */
  current: number;
  /** 总步骤数 */
  total: number;
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

export function StepBadge({
  current,
  total,
  className,
  size = 'md',
}: StepBadgeProps): JSX.Element {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        'bg-be-primary-light text-be-primary',
        sizeClasses[size],
        className
      )}
    >
      <span>{current}</span>
      <span className="text-be-primary/50">/</span>
      <span className="text-be-primary/70">{total}</span>
    </span>
  );
}

// ========================================
// TrendBadge 组件 (趋势徽标)
// ========================================

export interface TrendBadgeProps {
  /** 趋势类型 */
  type: 'up' | 'down' | 'neutral';
  /** 数值 */
  value: string | number;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

export function TrendBadge({
  type,
  value,
  showIcon = true,
  className,
  size = 'md',
}: TrendBadgeProps): JSX.Element {
  const config = {
    up: {
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      className: 'bg-be-success-light text-be-success',
    },
    down: {
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
      className: 'bg-be-danger-light text-be-danger',
    },
    neutral: {
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
      ),
      className: 'bg-[var(--be-background-secondary)] text-text-secondary',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        config[type].className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && config[type].icon}
      <span>{value}</span>
    </span>
  );
}
