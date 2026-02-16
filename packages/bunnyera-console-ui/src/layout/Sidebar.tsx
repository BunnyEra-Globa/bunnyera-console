import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Files,
  Sparkles,
  ScrollText,
  NotebookPen,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  HelpCircle,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';
import { cn } from '../theme/utils';
import { useNavigation, NavPage, PAGE_CONFIG } from '../context/NavigationContext';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';

// ========================================
// 类型定义
// ========================================

export interface SidebarProps {
  /** 自定义类名 */
  className?: string;
  /** 用户头像 URL */
  userAvatar?: string;
  /** 用户名 */
  userName?: string;
  /** 用户角色 */
  userRole?: string;
  /** 通知数量 */
  notificationCount?: number;
  /** 底部操作 */
  footerActions?: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    badge?: number;
  }[];
  /** 自定义 Logo */
  logo?: React.ReactNode;
  /** Logo 文本 */
  logoText?: string;
  /** 菜单项点击回调 */
  onMenuClick?: (page: NavPage) => void;
  /** 退出登录回调 */
  onLogout?: () => void;
  /** 是否显示搜索 */
  showSearch?: boolean;
  /** 搜索回调 */
  onSearch?: (query: string) => void;
}

// ========================================
// 菜单项类型
// ========================================

interface MenuItem {
  key: NavPage;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

// ========================================
// 默认菜单项
// ========================================

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" />, badge: 3 },
  { key: 'resources', label: 'Resources', icon: <Files className="w-5 h-5" /> },
  { key: 'ai-hub', label: 'AI Hub', icon: <Sparkles className="w-5 h-5" /> },
  { key: 'logs', label: 'Logs', icon: <ScrollText className="w-5 h-5" /> },
  { key: 'notes', label: 'Notes', icon: <NotebookPen className="w-5 h-5" /> },
];

const BOTTOM_MENU_ITEMS: MenuItem[] = [
  { key: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

// ========================================
// 组件
// ========================================

export function Sidebar({
  className,
  userAvatar,
  userName = 'User',
  userRole = 'Member',
  notificationCount = 0,
  footerActions,
  logo,
  logoText = 'BunnyEra',
  onMenuClick,
  onLogout,
  showSearch = true,
  onSearch,
}: SidebarProps): JSX.Element {
  const { currentPage, sidebarCollapsed, toggleSidebar, navigate } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuClick = useCallback((key: NavPage) => {
    navigate(key);
    onMenuClick?.(key);
  }, [navigate, onMenuClick]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  }, [onSearch]);

  const renderMenuItem = (item: MenuItem) => {
    const isActive = currentPage === item.key;
    const isDisabled = item.disabled;

    return (
      <button
        key={item.key}
        onClick={() => !isDisabled && handleMenuClick(item.key)}
        disabled={isDisabled}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-be-primary focus-visible:ring-offset-2',
          isActive
            ? 'bg-be-primary text-white shadow-lg shadow-be-primary/25'
            : 'text-text-secondary hover:bg-[var(--be-primary-light)] hover:text-be-primary',
          isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-text-secondary',
          sidebarCollapsed && 'justify-center px-2'
        )}
        title={sidebarCollapsed ? item.label : undefined}
      >
        <span className={cn(
          'flex-shrink-0 transition-transform duration-200',
          !isActive && 'group-hover:scale-110'
        )}>
          {item.icon}
        </span>
        
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <Badge count={item.badge} size="sm" />
            )}
          </>
        )}

        {sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-be-danger rounded-full flex items-center justify-center">
            <span className="text-[10px] text-white font-medium">
              {item.badge > 9 ? '9+' : item.badge}
            </span>
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-[var(--be-surface)] border-r border-[var(--be-border)]',
        'transition-all duration-300 ease-in-out fixed left-0 top-0 z-50',
        sidebarCollapsed ? 'w-[var(--be-sidebar-collapsed-width)]' : 'w-[var(--be-sidebar-width)]',
        className
      )}
    >
      {/* Logo 区域 */}
      <div className={cn(
        'flex items-center gap-3 px-4 h-[var(--be-header-height)] border-b border-[var(--be-border)]',
        sidebarCollapsed && 'justify-center px-2'
      )}>
        {logo || (
          <div className={cn(
            'w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0'
          )}>
            <span className="text-white font-bold text-sm">BE</span>
          </div>
        )}
        
        {!sidebarCollapsed && (
          <span className="font-semibold text-lg text-text-primary truncate">
            {logoText}
          </span>
        )}

        {/* 折叠按钮 */}
        <button
          onClick={toggleSidebar}
          className={cn(
            'ml-auto p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-[var(--be-background-secondary)] transition-colors',
            sidebarCollapsed && 'ml-0 absolute -right-3 top-6 bg-[var(--be-surface)] border border-[var(--be-border)] shadow-sm'
          )}
          title={sidebarCollapsed ? '展开' : '折叠'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 搜索区域 */}
      {showSearch && !sidebarCollapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="搜索..."
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm bg-[var(--be-background)] border border-[var(--be-border)] rounded-lg',
                'placeholder:text-text-tertiary',
                'focus:outline-none focus:border-be-primary focus:ring-2 focus:ring-[var(--be-primary-light)]',
                'transition-all duration-200'
              )}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 bg-[var(--be-background-secondary)] text-text-tertiary rounded border border-[var(--be-border)]">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {/* 主菜单 */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-1">
        {DEFAULT_MENU_ITEMS.map(renderMenuItem)}
      </nav>

      {/* 底部菜单 */}
      <div className="px-3 py-2 border-t border-[var(--be-border)] space-y-1">
        {BOTTOM_MENU_ITEMS.map(renderMenuItem)}
        
        {/* 自定义底部操作 */}
        {footerActions?.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              'text-text-secondary hover:bg-[var(--be-background-secondary)] hover:text-text-primary',
              sidebarCollapsed && 'justify-center px-2'
            )}
            title={sidebarCollapsed ? action.label : undefined}
          >
            <span className="flex-shrink-0">{action.icon}</span>
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left">{action.label}</span>
                {action.badge !== undefined && action.badge > 0 && (
                  <Badge count={action.badge} size="sm" />
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* 用户信息 */}
      <div className={cn(
        'p-3 border-t border-[var(--be-border)]',
        sidebarCollapsed && 'px-2'
      )}>
        <div className={cn(
          'flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--be-background-secondary)] transition-colors cursor-pointer',
          sidebarCollapsed && 'justify-center'
        )}>
          <Avatar
            src={userAvatar}
            name={userName}
            size={sidebarCollapsed ? 'sm' : 'md'}
            status="online"
          />
          
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {userName}
              </p>
              <p className="text-xs text-text-tertiary truncate">
                {userRole}
              </p>
            </div>
          )}

          {!sidebarCollapsed && (
            <div className="flex items-center gap-1">
              {notificationCount > 0 && (
                <button className="p-1.5 rounded-lg hover:bg-[var(--be-background)] text-text-tertiary hover:text-be-primary transition-colors relative">
                  <Bell className="w-4 h-4" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-be-danger rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    </span>
                  )}
                </button>
              )}
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg hover:bg-[var(--be-background)] text-text-tertiary hover:text-be-danger transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ========================================
// 导出子组件
// ========================================

export interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, children, className }: SidebarSectionProps): JSX.Element {
  const { sidebarCollapsed } = useNavigation();

  return (
    <div className={cn('py-2', className)}>
      {title && !sidebarCollapsed && (
        <h3 className="px-3 mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}

export function SidebarItem({
  icon,
  label,
  active = false,
  badge,
  disabled = false,
  onClick,
  href,
}: SidebarItemProps): JSX.Element {
  const { sidebarCollapsed } = useNavigation();

  const content = (
    <>
      <span className="flex-shrink-0">{icon}</span>
      {!sidebarCollapsed && (
        <>
          <span className="flex-1 text-left truncate">{label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge count={badge} size="sm" />
          )}
        </>
      )}
    </>
  );

  const className = cn(
    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
    active
      ? 'bg-be-primary text-white'
      : 'text-text-secondary hover:bg-[var(--be-primary-light)] hover:text-be-primary',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  );
}
