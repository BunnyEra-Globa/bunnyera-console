import React from 'react';
import { cn } from '../theme/utils';
import { Sidebar, SidebarProps } from './Sidebar';
import { Header, HeaderProps } from './Header';
import { Workspace, WorkspaceProps } from './Workspace';
import { useNavigation } from '../context/NavigationContext';

// ========================================
// 类型定义
// ========================================

export interface LayoutProps {
  /** 子元素 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否显示侧边栏 */
  showSidebar?: boolean;
  /** 是否显示顶部栏 */
  showHeader?: boolean;
  /** 侧边栏配置 */
  sidebarProps?: Omit<SidebarProps, 'className'>;
  /** 顶部栏配置 */
  headerProps?: Omit<HeaderProps, 'className'>;
  /** 工作区配置 */
  workspaceProps?: Omit<WorkspaceProps, 'children' | 'className'>;
  /** 自定义侧边栏 */
  customSidebar?: React.ReactNode;
  /** 自定义顶部栏 */
  customHeader?: React.ReactNode;
  /** 布局模式 */
  mode?: 'default' | 'full' | 'embedded';
}

export interface AppLayoutProps extends LayoutProps {
  /** 页面标题 */
  pageTitle?: string;
  /** 是否需要登录 */
  requireAuth?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 加载提示 */
  loadingTip?: string;
}

// ========================================
// Layout 组件
// ========================================

export function Layout({
  children,
  className,
  showSidebar = true,
  showHeader = true,
  sidebarProps,
  headerProps,
  workspaceProps,
  customSidebar,
  customHeader,
  mode = 'default',
}: LayoutProps): JSX.Element {
  const { sidebarCollapsed } = useNavigation();

  if (mode === 'full') {
    return (
      <div className={cn('min-h-screen bg-[var(--be-background)]', className)}>
        {children}
      </div>
    );
  }

  if (mode === 'embedded') {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        {showHeader && (customHeader || <Header {...headerProps} />)}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-[var(--be-background)]', className)}>
      {/* 侧边栏 */}
      {showSidebar && (customSidebar || <Sidebar {...sidebarProps} />)}

      {/* 主内容区 */}
      <div
        className={cn(
          'transition-all duration-300',
          showSidebar && (sidebarCollapsed ? 'ml-[var(--be-sidebar-collapsed-width)]' : 'ml-[var(--be-sidebar-width)]')
        )}
      >
        {/* 顶部栏 */}
        {showHeader && (customHeader || <Header {...headerProps} />)}

        {/* 工作区 */}
        <Workspace {...workspaceProps}>
          {children}
        </Workspace>
      </div>
    </div>
  );
}

// ========================================
// AppLayout 组件
// ========================================

export function AppLayout({
  children,
  className,
  showSidebar = true,
  showHeader = true,
  sidebarProps,
  headerProps,
  workspaceProps,
  customSidebar,
  customHeader,
  pageTitle,
  requireAuth = false,
  loading = false,
  loadingTip = '加载中...',
}: AppLayoutProps): JSX.Element {
  // 设置页面标题
  React.useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | BunnyEra Console`;
    }
  }, [pageTitle]);

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--be-background)]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[var(--be-primary-light)] rounded-full" />
            <div className="absolute inset-0 border-4 border-be-primary rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-text-secondary">{loadingTip}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout
      className={className}
      showSidebar={showSidebar}
      showHeader={showHeader}
      sidebarProps={sidebarProps}
      headerProps={headerProps}
      workspaceProps={workspaceProps}
      customSidebar={customSidebar}
      customHeader={customHeader}
    >
      {children}
    </Layout>
  );
}

// ========================================
// SplitLayout 组件 (分栏布局)
// ========================================

export interface SplitLayoutProps {
  /** 左侧内容 */
  left: React.ReactNode;
  /** 右侧内容 */
  right: React.ReactNode;
  /** 左侧宽度 */
  leftWidth?: number | string;
  /** 是否可调整 */
  resizable?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 左侧类名 */
  leftClassName?: string;
  /** 右侧类名 */
  rightClassName?: string;
}

export function SplitLayout({
  left,
  right,
  leftWidth = 320,
  resizable = false,
  className,
  leftClassName,
  rightClassName,
}: SplitLayoutProps): JSX.Element {
  const [width, setWidth] = React.useState(leftWidth);
  const [isResizing, setIsResizing] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = React.useCallback(() => {
    if (resizable) {
      setIsResizing(true);
    }
  }, [resizable]);

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      if (newWidth >= 200 && newWidth <= rect.width * 0.5) {
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full', className)}
    >
      {/* 左侧 */}
      <div
        className={cn('flex-shrink-0 border-r border-[var(--be-border)] overflow-auto', leftClassName)}
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
      >
        {left}
      </div>

      {/* 调整手柄 */}
      {resizable && (
        <div
          className="w-1 bg-transparent hover:bg-be-primary cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />
      )}

      {/* 右侧 */}
      <div className={cn('flex-1 overflow-auto', rightClassName)}>
        {right}
      </div>
    </div>
  );
}

// ========================================
// ThreeColumnLayout 组件 (三栏布局)
// ========================================

export interface ThreeColumnLayoutProps {
  /** 左侧边栏 */
  leftSidebar?: React.ReactNode;
  /** 主内容 */
  children: React.ReactNode;
  /** 右侧边栏 */
  rightSidebar?: React.ReactNode;
  /** 左侧宽度 */
  leftWidth?: number | string;
  /** 右侧宽度 */
  rightWidth?: number | string;
  /** 自定义类名 */
  className?: string;
  /** 左侧类名 */
  leftClassName?: string;
  /** 主内容类名 */
  mainClassName?: string;
  /** 右侧类名 */
  rightClassName?: string;
}

export function ThreeColumnLayout({
  leftSidebar,
  children,
  rightSidebar,
  leftWidth = 280,
  rightWidth = 320,
  className,
  leftClassName,
  mainClassName,
  rightClassName,
}: ThreeColumnLayoutProps): JSX.Element {
  return (
    <div className={cn('flex h-full', className)}>
      {/* 左侧边栏 */}
      {leftSidebar && (
        <aside
          className={cn(
            'flex-shrink-0 border-r border-[var(--be-border)] overflow-auto',
            leftClassName
          )}
          style={{ width: typeof leftWidth === 'number' ? `${leftWidth}px` : leftWidth }}
        >
          {leftSidebar}
        </aside>
      )}

      {/* 主内容 */}
      <main className={cn('flex-1 overflow-auto', mainClassName)}>
        {children}
      </main>

      {/* 右侧边栏 */}
      {rightSidebar && (
        <aside
          className={cn(
            'flex-shrink-0 border-l border-[var(--be-border)] overflow-auto',
            rightClassName
          )}
          style={{ width: typeof rightWidth === 'number' ? `${rightWidth}px` : rightWidth }}
        >
          {rightSidebar}
        </aside>
      )}
    </div>
  );
}

// ========================================
// StackedLayout 组件 (堆叠布局)
// ========================================

export interface StackedLayoutProps {
  /** 顶部导航 */
  topNav?: React.ReactNode;
  /** 头部 */
  header?: React.ReactNode;
  /** 主内容 */
  children: React.ReactNode;
  /** 底部 */
  footer?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

export function StackedLayout({
  topNav,
  header,
  children,
  footer,
  className,
}: StackedLayoutProps): JSX.Element {
  return (
    <div className={cn('min-h-screen flex flex-col bg-[var(--be-background)]', className)}>
      {/* 顶部导航 */}
      {topNav && (
        <div className="bg-[var(--be-surface)] border-b border-[var(--be-border)]">
          {topNav}
        </div>
      )}

      {/* 头部 */}
      {header && (
        <header className="bg-[var(--be-surface)] border-b border-[var(--be-border)]">
          {header}
        </header>
      )}

      {/* 主内容 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 底部 */}
      {footer && (
        <footer className="bg-[var(--be-surface)] border-t border-[var(--be-border)]">
          {footer}
        </footer>
      )}
    </div>
  );
}

// ========================================
// 导出所有布局组件
// ========================================

export * from './Sidebar';
export * from './Header';
export * from './Workspace';
