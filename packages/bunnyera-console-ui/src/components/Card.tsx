import React, { forwardRef } from 'react';
import { cn } from '../theme/utils';

// ========================================
// 类型定义
// ========================================

export interface CardProps {
  /** 卡片内容 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 卡片标题 */
  title?: React.ReactNode;
  /** 卡片副标题 */
  subtitle?: React.ReactNode;
  /** 标题右侧操作 */
  extra?: React.ReactNode;
  /** 卡片底部 */
  footer?: React.ReactNode;
  /** 卡片封面 */
  cover?: React.ReactNode;
  /** 是否可悬浮 */
  hoverable?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 阴影大小 */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** 内边距大小 */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** 点击回调 */
  onClick?: () => void;
  /** 加载状态 */
  loading?: boolean;
  /** 选中状态 */
  selected?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

// ========================================
// Card 组件
// ========================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      title,
      subtitle,
      extra,
      footer,
      cover,
      hoverable = false,
      bordered = true,
      shadow = 'none',
      padding = 'md',
      onClick,
      loading = false,
      selected = false,
      size = 'md',
    },
    ref
  ) => {
    const paddingClasses = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    // 加载状态骨架屏
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'bg-[var(--be-surface)] rounded-xl overflow-hidden animate-pulse',
            bordered && 'border border-[var(--be-border)]',
            shadowClasses[shadow],
            className
          )}
        >
          {cover && <div className="h-40 bg-[var(--be-background-secondary)]" />}
          <div className={paddingClasses[padding]}>
            <div className="h-5 w-1/3 bg-[var(--be-background-secondary)] rounded mb-2" />
            <div className="h-4 w-2/3 bg-[var(--be-background-secondary)] rounded" />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'bg-[var(--be-surface)] rounded-xl overflow-hidden transition-all duration-200',
          bordered && 'border border-[var(--be-border)]',
          shadowClasses[shadow],
          hoverable && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
          selected && 'ring-2 ring-be-primary ring-offset-2',
          onClick && 'cursor-pointer',
          sizeClasses[size],
          className
        )}
      >
        {/* 封面 */}
        {cover && <div className="relative overflow-hidden">{cover}</div>}

        {/* 头部 */}
        {(title || extra) && (
          <div className={cn('flex items-start justify-between gap-4', paddingClasses[padding], !cover && 'pb-0')}>
            <div className="flex-1 min-w-0">
              {title && (
                typeof title === 'string' ? (
                  <h3 className="font-semibold text-text-primary truncate">{title}</h3>
                ) : (
                  title
                )
              )}
              {subtitle && (
                typeof subtitle === 'string' ? (
                  <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
                ) : (
                  <div className="mt-1">{subtitle}</div>
                )
              )}
            </div>
            {extra && <div className="flex-shrink-0">{extra}</div>}
          </div>
        )}

        {/* 内容 */}
        <div className={cn(
          paddingClasses[padding],
          !title && !extra && !cover && paddingClasses[padding],
          (title || extra) && !cover && 'pt-3'
        )}>
          {children}
        </div>

        {/* 底部 */}
        {footer && (
          <div className={cn(
            'border-t border-[var(--be-border)]',
            paddingClasses[padding],
            'bg-[var(--be-background-secondary)]/50'
          )}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ========================================
// CardGrid 组件
// ========================================

export interface CardGridProps {
  /** 子卡片 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 列数 */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 间距 */
  gap?: 'none' | 'sm' | 'md' | 'lg';
  /** 响应式 */
  responsive?: boolean;
}

export function CardGrid({
  children,
  className,
  cols = 3,
  gap = 'md',
  responsive = true,
}: CardGridProps): JSX.Element {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-4',
    5: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-5',
    6: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' : 'grid-cols-6',
  };

  return (
    <div className={cn('grid', colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// ========================================
// StatCard 组件 (统计卡片)
// ========================================

export interface StatCardProps {
  /** 标题 */
  title: string;
  /** 数值 */
  value: string | number;
  /** 前缀 */
  prefix?: React.ReactNode;
  /** 后缀 */
  suffix?: React.ReactNode;
  /** 趋势 */
  trend?: 'up' | 'down' | 'neutral';
  /** 趋势值 */
  trendValue?: string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 图标背景色 */
  iconBg?: string;
  /** 自定义类名 */
  className?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 点击回调 */
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  icon,
  iconBg = 'bg-[var(--be-primary-light)]',
  className,
  loading = false,
  onClick,
}: StatCardProps): JSX.Element {
  if (loading) {
    return (
      <Card loading className={className} />
    );
  }

  const trendColors = {
    up: 'text-be-success',
    down: 'text-be-danger',
    neutral: 'text-text-tertiary',
  };

  const trendIcons = {
    up: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <Card
      className={cn('cursor-pointer', className)}
      onClick={onClick}
      hoverable
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            {prefix && <span className="text-lg text-text-tertiary">{prefix}</span>}
            <span className="text-2xl font-bold text-text-primary">{value}</span>
            {suffix && <span className="text-sm text-text-tertiary">{suffix}</span>}
          </div>
          {trend && trendValue && (
            <div className={cn('mt-2 flex items-center gap-1 text-sm', trendColors[trend])}>
              {trendIcons[trend]}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl', iconBg)}>
            <span className="text-be-primary">{icon}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

// ========================================
// InfoCard 组件 (信息卡片)
// ========================================

export interface InfoCardProps {
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 操作按钮 */
  actions?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 变体 */
  variant?: 'default' | 'bordered' | 'filled';
}

export function InfoCard({
  title,
  description,
  icon,
  actions,
  className,
  variant = 'default',
}: InfoCardProps): JSX.Element {
  const variantClasses = {
    default: 'bg-[var(--be-surface)]',
    bordered: 'bg-[var(--be-surface)] border border-[var(--be-border)]',
    filled: 'bg-[var(--be-background-secondary)]',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-4 transition-all duration-200',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 p-2 bg-[var(--be-primary-light)] rounded-lg">
            <span className="text-be-primary">{icon}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-medium text-text-primary">{title}</h4>}
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

// ========================================
// MediaCard 组件 (媒体卡片)
// ========================================

export interface MediaCardProps {
  /** 图片 URL */
  image?: string;
  /** 图片高度 */
  imageHeight?: number;
  /** 标题 */
  title?: string;
  /** 描述 */
  description?: string;
  /** 标签 */
  tags?: string[];
  /** 操作按钮 */
  actions?: React.ReactNode;
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}

export function MediaCard({
  image,
  imageHeight = 200,
  title,
  description,
  tags,
  actions,
  onClick,
  className,
}: MediaCardProps): JSX.Element {
  return (
    <Card
      hoverable
      onClick={onClick}
      className={className}
      cover={
        image && (
          <div
            className="w-full bg-[var(--be-background-secondary)] overflow-hidden"
            style={{ height: imageHeight }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )
      }
    >
      <div className="space-y-3">
        {title && <h3 className="font-semibold text-text-primary line-clamp-1">{title}</h3>}
        {description && <p className="text-sm text-text-secondary line-clamp-2">{description}</p>}
        
        {(tags || actions) && (
          <div className="flex items-center justify-between pt-2">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-[var(--be-background-secondary)] text-text-secondary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs text-text-tertiary">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}
