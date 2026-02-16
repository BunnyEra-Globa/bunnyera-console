import React from 'react';
import { cn } from '../theme/utils';
import { useNavigation } from '../context/NavigationContext';

// ========================================
// 类型定义
// ========================================

export interface WorkspaceProps {
  /** 子元素 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 内边距大小 */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** 是否全宽 */
  fullWidth?: boolean;
  /** 背景色 */
  background?: 'default' | 'surface' | 'transparent';
  /** 是否显示滚动条 */
  scrollable?: boolean;
  /** 最大宽度 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export interface PageContainerProps extends WorkspaceProps {
  /** 页面标题 */
  title?: React.ReactNode;
  /** 页面副标题 */
  subtitle?: React.ReactNode;
  /** 标题右侧操作 */
  extra?: React.ReactNode;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 返回按钮回调 */
  onBack?: () => void;
  /** 面包屑 */
  breadcrumbs?: { label: string; href?: string }[];
  /** 页面头部类名 */
  headerClassName?: string;
  /** 页面内容类名 */
  contentClassName?: string;
}

export interface PageHeaderProps {
  /** 标题 */
  title: React.ReactNode;
  /** 副标题 */
  subtitle?: React.ReactNode;
  /** 右侧操作 */
  extra?: React.ReactNode;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 返回按钮回调 */
  onBack?: () => void;
  /** 面包屑 */
  breadcrumbs?: { label: string; href?: string; icon?: React.ReactNode }[];
  /** 自定义类名 */
  className?: string;
  /** 底部内容 */
  footer?: React.ReactNode;
  /** 标签页 */
  tabs?: React.ReactNode;
}

// ========================================
// Workspace 组件
// ========================================

export function Workspace({
  children,
  className,
  padding = 'md',
  fullWidth = false,
  background = 'default',
  scrollable = true,
  maxWidth = 'full',
}: WorkspaceProps): JSX.Element {
  const { sidebarCollapsed } = useNavigation();

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8',
    xl: 'p-8 lg:p-10',
  };

  const backgroundClasses = {
    default: 'bg-[var(--be-background)]',
    surface: 'bg-[var(--be-surface)]',
    transparent: 'bg-transparent',
  };

  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: '',
  };

  return (
    <main
      className={cn(
        'min-h-[calc(100vh-var(--be-header-height))]',
        'transition-all duration-300',
        sidebarCollapsed ? 'ml-[var(--be-sidebar-collapsed-width)]' : 'ml-[var(--be-sidebar-width)]',
        backgroundClasses[background],
        scrollable && 'overflow-auto scrollbar-thin',
        className
      )}
    >
      <div
        className={cn(
          paddingClasses[padding],
          !fullWidth && 'mx-auto',
          maxWidthClasses[maxWidth]
        )}
      >
        {children}
      </div>
    </main>
  );
}

// ========================================
// PageContainer 组件
// ========================================

export function PageContainer({
  children,
  title,
  subtitle,
  extra,
  showBack = false,
  onBack,
  breadcrumbs,
  className,
  headerClassName,
  contentClassName,
  padding = 'md',
  fullWidth = false,
  background = 'default',
  scrollable = true,
  maxWidth = 'full',
}: PageContainerProps): JSX.Element {
  return (
    <Workspace
      padding={padding}
      fullWidth={fullWidth}
      background={background}
      scrollable={scrollable}
      maxWidth={maxWidth}
      className={className}
    >
      {/* 页面头部 */}
      {(title || breadcrumbs) && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          extra={extra}
          showBack={showBack}
          onBack={onBack}
          breadcrumbs={breadcrumbs}
          className={headerClassName}
        />
      )}

      {/* 页面内容 */}
      <div className={contentClassName}>
        {children}
      </div>
    </Workspace>
  );
}

// ========================================
// PageHeader 组件
// ========================================

export function PageHeader({
  title,
  subtitle,
  extra,
  showBack = false,
  onBack,
  breadcrumbs,
  className,
  footer,
  tabs,
}: PageHeaderProps): JSX.Element {
  return (
    <div className={cn('mb-6', className)}>
      {/* 面包屑 */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-4">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-text-disabled">/</span>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 text-text-tertiary hover:text-be-primary transition-colors"
                >
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <span className="flex items-center gap-1.5 text-text-primary font-medium">
                  {item.icon}
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* 标题区域 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* 返回按钮 */}
          {showBack && (
            <button
              onClick={onBack}
              className="mt-1 p-2 rounded-lg hover:bg-[var(--be-background-secondary)] text-text-tertiary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          )}

          <div>
            {typeof title === 'string' ? (
              <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
            ) : (
              title
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className="mt-1 text-text-secondary">{subtitle}</p>
              ) : (
                <div className="mt-1">{subtitle}</div>
              )
            )}
          </div>
        </div>

        {/* 右侧操作 */}
        {extra && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {extra}
          </div>
        )}
      </div>

      {/* 底部内容 */}
      {footer && (
        <div className="mt-4">{footer}</div>
      )}

      {/* 标签页 */}
      {tabs && (
        <div className="mt-4 border-b border-[var(--be-border)]">{tabs}</div>
      )}
    </div>
  );
}

// ========================================
// PageContent 组件
// ========================================

export interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  /** 布局方式 */
  layout?: 'default' | 'grid' | 'flex';
  /** 网格列数 */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 间距 */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function PageContent({
  children,
  className,
  layout = 'default',
  columns = 3,
  gap = 'md',
}: PageContentProps): JSX.Element {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8',
    xl: 'gap-8 lg:gap-10',
  };

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  if (layout === 'grid') {
    return (
      <div className={cn('grid', gridColumns[columns], gapClasses[gap], className)}>
        {children}
      </div>
    );
  }

  if (layout === 'flex') {
    return (
      <div className={cn('flex flex-wrap', gapClasses[gap], className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
}

// ========================================
// PageSection 组件
// ========================================

export interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  /** 标题 */
  title?: React.ReactNode;
  /** 副标题 */
  subtitle?: React.ReactNode;
  /** 右侧操作 */
  extra?: React.ReactNode;
  /** 是否显示分隔线 */
  divider?: boolean;
}

export function PageSection({
  children,
  className,
  title,
  subtitle,
  extra,
  divider = false,
}: PageSectionProps): JSX.Element {
  return (
    <section className={cn(divider && 'border-t border-[var(--be-border)] pt-6', className)}>
      {(title || extra) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              typeof title === 'string' ? (
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
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
          {extra && <div className="flex items-center gap-2">{extra}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// ========================================
// Grid 组件
// ========================================

export interface GridProps {
  children: React.ReactNode;
  className?: string;
  /** 列数 */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /** 间距 */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** 响应式列数 */
  responsive?: boolean;
}

export function Grid({
  children,
  className,
  cols = 3,
  gap = 'md',
  responsive = true,
}: GridProps): JSX.Element {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-3',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8',
    xl: 'gap-8 lg:gap-10',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
    5: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-5',
    6: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
    12: responsive ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-12' : 'grid-cols-12',
  };

  return (
    <div className={cn('grid', colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// ========================================
// Flex 组件
// ========================================

export interface FlexProps {
  children: React.ReactNode;
  className?: string;
  /** 方向 */
  direction?: 'row' | 'col';
  /** 对齐方式 */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /**  justify 方式 */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** 间距 */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** 是否换行 */
  wrap?: boolean;
}

export function Flex({
  children,
  className,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false,
}: FlexProps): JSX.Element {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        direction === 'col' && 'flex-col',
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        justify === 'start' && 'justify-start',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        justify === 'between' && 'justify-between',
        justify === 'around' && 'justify-around',
        justify === 'evenly' && 'justify-evenly',
        gapClasses[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}

// ========================================
// Container 组件
// ========================================

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** 最大宽度 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** 居中 */
  center?: boolean;
}

export function Container({
  children,
  className,
  maxWidth = 'full',
  center = true,
}: ContainerProps): JSX.Element {
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: '',
  };

  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}
