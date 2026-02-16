import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ========================================
// 类型定义
// ========================================

export type NavPage = 
  | 'dashboard'
  | 'projects'
  | 'resources'
  | 'ai-hub'
  | 'logs'
  | 'notes'
  | 'settings'
  | 'profile'
  | 'help'
  | string;

export interface NavigationState {
  /** 当前激活的页面 */
  currentPage: NavPage;
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean;
  /** 当前展开的菜单项 */
  expandedKeys: string[];
  /** 选中的菜单项 */
  selectedKeys: string[];
  /** 面包屑路径 */
  breadcrumbs: { label: string; href?: string }[];
}

export interface NavigationContextValue extends NavigationState {
  /** 设置当前页面 */
  setCurrentPage: (page: NavPage) => void;
  /** 切换侧边栏折叠状态 */
  toggleSidebar: () => void;
  /** 设置侧边栏折叠状态 */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** 展开/收起菜单项 */
  toggleExpandedKey: (key: string) => void;
  /** 设置展开的菜单项 */
  setExpandedKeys: (keys: string[]) => void;
  /** 设置选中的菜单项 */
  setSelectedKeys: (keys: string[]) => void;
  /** 设置面包屑 */
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void;
  /** 导航到指定页面 */
  navigate: (page: NavPage, params?: Record<string, unknown>) => void;
}

// ========================================
// Context 创建
// ========================================

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

// ========================================
// Props 类型
// ========================================

export interface NavigationProviderProps {
  children: ReactNode;
  /** 初始页面 */
  initialPage?: NavPage;
  /** 初始折叠状态 */
  initialCollapsed?: boolean;
  /** 页面切换回调 */
  onPageChange?: (page: NavPage, params?: Record<string, unknown>) => void;
  /** 导航回调 */
  onNavigate?: (page: NavPage, params?: Record<string, unknown>) => void;
}

// ========================================
// Provider 组件
// ========================================

export function NavigationProvider({
  children,
  initialPage = 'dashboard',
  initialCollapsed = false,
  onPageChange,
  onNavigate,
}: NavigationProviderProps): JSX.Element {
  const [currentPage, setCurrentPageState] = useState<NavPage>(initialPage);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(initialCollapsed);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([initialPage]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; href?: string }[]>([]);

  const setCurrentPage = useCallback((page: NavPage) => {
    setCurrentPageState(page);
    setSelectedKeys([page]);
    onPageChange?.(page);
  }, [onPageChange]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleExpandedKey = useCallback((key: string) => {
    setExpandedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  const navigate = useCallback((page: NavPage, params?: Record<string, unknown>) => {
    setCurrentPageState(page);
    setSelectedKeys([page]);
    onNavigate?.(page, params);
    onPageChange?.(page, params);
  }, [onNavigate, onPageChange]);

  const value: NavigationContextValue = {
    currentPage,
    sidebarCollapsed,
    expandedKeys,
    selectedKeys,
    breadcrumbs,
    setCurrentPage,
    toggleSidebar,
    setSidebarCollapsed,
    toggleExpandedKey,
    setExpandedKeys,
    setSelectedKeys,
    setBreadcrumbs,
    navigate,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

// ========================================
// Hook
// ========================================

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// ========================================
// 高阶组件 (可选)
// ========================================

export interface WithNavigationProps {
  navigation: NavigationContextValue;
}

export function withNavigation<P extends WithNavigationProps>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, 'navigation'>> {
  return function WithNavigationWrapper(props: Omit<P, 'navigation'>) {
    const navigation = useNavigation();
    return <Component {...(props as P)} navigation={navigation} />;
  };
}

// ========================================
// 页面配置
// ========================================

export const PAGE_CONFIG: Record<string, { label: string; icon: string; path: string }> = {
  dashboard: { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  projects: { label: 'Projects', icon: 'FolderKanban', path: '/projects' },
  resources: { label: 'Resources', icon: 'Files', path: '/resources' },
  'ai-hub': { label: 'AI Hub', icon: 'Sparkles', path: '/ai-hub' },
  logs: { label: 'Logs', icon: 'ScrollText', path: '/logs' },
  notes: { label: 'Notes', icon: 'NotebookPen', path: '/notes' },
  settings: { label: 'Settings', icon: 'Settings', path: '/settings' },
  profile: { label: 'Profile', icon: 'User', path: '/profile' },
  help: { label: 'Help', icon: 'HelpCircle', path: '/help' },
};

// ========================================
// 导航辅助函数
// ========================================

export function getPageLabel(page: NavPage): string {
  return PAGE_CONFIG[page]?.label || page;
}

export function getPageIcon(page: NavPage): string {
  return PAGE_CONFIG[page]?.icon || 'Circle';
}

export function getPagePath(page: NavPage): string {
  return PAGE_CONFIG[page]?.path || `/${page}`;
}
