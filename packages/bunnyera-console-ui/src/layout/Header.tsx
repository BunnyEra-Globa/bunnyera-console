import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  Bell,
  Settings,
  Menu,
  X,
  Clock,
  Calendar,
  ChevronDown,
  Sparkles,
  History,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { cn } from '../theme/utils';
import { useNavigation } from '../context/NavigationContext';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';

// ========================================
// 类型定义
// ========================================

export interface HeaderProps {
  /** 自定义类名 */
  className?: string;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 搜索快捷键 */
  searchShortcut?: string;
  /** 通知数量 */
  notificationCount?: number;
  /** 用户头像 */
  userAvatar?: string;
  /** 用户名 */
  userName?: string;
  /** 用户角色 */
  userRole?: string;
  /** 最近搜索 */
  recentSearches?: string[];
  /** 热门搜索 */
  trendingSearches?: string[];
  /** 搜索建议 */
  searchSuggestions?: string[];
  /** 搜索回调 */
  onSearch?: (query: string) => void;
  /** 通知点击回调 */
  onNotificationClick?: () => void;
  /** 设置点击回调 */
  onSettingsClick?: () => void;
  /** 用户菜单点击回调 */
  onUserMenuClick?: () => void;
  /** 菜单按钮点击回调 (移动端) */
  onMenuClick?: () => void;
  /** 自定义右侧操作 */
  rightActions?: React.ReactNode;
  /** 是否显示搜索框 */
  showSearch?: boolean;
  /** 是否显示通知 */
  showNotifications?: boolean;
  /** 是否显示设置 */
  showSettings?: boolean;
  /** 是否显示用户菜单 */
  showUserMenu?: boolean;
}

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  shortcut?: string;
  recentSearches?: string[];
  trendingSearches?: string[];
  suggestions?: string[];
  className?: string;
}

// ========================================
// SearchBar 组件
// ========================================

export function SearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  placeholder = '搜索任何内容...',
  shortcut = '⌘K',
  recentSearches = [],
  trendingSearches = [],
  suggestions = [],
  className,
}: SearchBarProps): JSX.Element {
  const [value, setValue] = useState(controlledValue || '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : value;

  // 合并所有建议
  const allSuggestions = [
    ...suggestions.filter(s => s.toLowerCase().includes(currentValue.toLowerCase())),
    ...recentSearches.filter(s => s.toLowerCase().includes(currentValue.toLowerCase())),
    ...trendingSearches.filter(s => s.toLowerCase().includes(currentValue.toLowerCase())),
  ].slice(0, 8);

  // 处理输入变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) setValue(newValue);
    onChange?.(newValue);
    setActiveIndex(-1);
  }, [isControlled, onChange]);

  // 处理搜索
  const handleSearch = useCallback((searchValue: string) => {
    if (searchValue.trim()) {
      onSearch?.(searchValue);
      setIsOpen(false);
    }
  }, [onSearch]);

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % allSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + allSuggestions.length) % allSuggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && allSuggestions[activeIndex]) {
        const selected = allSuggestions[activeIndex];
        if (!isControlled) setValue(selected);
        onChange?.(selected);
        handleSearch(selected);
      } else {
        handleSearch(currentValue);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, [activeIndex, allSuggestions, currentValue, isControlled, onChange, handleSearch]);

  // 全局快捷键
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* 搜索输入框 */}
      <div
        className={cn(
          'relative group',
          isOpen && 'z-50'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 bg-[var(--be-background)] border border-[var(--be-border)] rounded-xl',
            'transition-all duration-200',
            isOpen
              ? 'bg-[var(--be-surface)] border-be-primary ring-2 ring-[var(--be-primary-light)]'
              : 'hover:border-[var(--be-border-hover)]'
          )}
        >
          <Search className={cn(
            'w-5 h-5 transition-colors',
            isOpen ? 'text-be-primary' : 'text-text-tertiary'
          )} />
          
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />

          {currentValue ? (
            <button
              onClick={() => {
                if (!isControlled) setValue('');
                onChange?.('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded hover:bg-[var(--be-background-secondary)] text-text-tertiary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 text-xs font-medium text-text-tertiary bg-[var(--be-background-secondary)] rounded border border-[var(--be-border)]">
              {shortcut}
            </kbd>
          )}
        </div>

        {/* 下拉面板 */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--be-surface)] border border-[var(--be-border)] rounded-xl shadow-xl overflow-hidden z-50">
            {/* 建议列表 */}
            {allSuggestions.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  建议
                </div>
                {allSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isControlled) setValue(suggestion);
                      onChange?.(suggestion);
                      handleSearch(suggestion);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                      activeIndex === index
                        ? 'bg-[var(--be-primary-light)] text-be-primary'
                        : 'text-text-secondary hover:bg-[var(--be-background-secondary)]'
                    )}
                  >
                    <Search className="w-4 h-4 text-text-tertiary" />
                    <span className="flex-1 text-left">{suggestion}</span>
                    {recentSearches.includes(suggestion) && (
                      <History className="w-3.5 h-3.5 text-text-tertiary" />
                    )}
                    {trendingSearches.includes(suggestion) && (
                      <TrendingUp className="w-3.5 h-3.5 text-be-warning" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* 最近搜索 */}
            {recentSearches.length > 0 && !currentValue && (
              <div className="py-2 border-t border-[var(--be-border)]">
                <div className="px-4 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  最近搜索
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isControlled) setValue(search);
                      onChange?.(search);
                      handleSearch(search);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-[var(--be-background-secondary)] transition-colors"
                  >
                    <Clock className="w-4 h-4 text-text-tertiary" />
                    <span className="flex-1 text-left">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 热门搜索 */}
            {trendingSearches.length > 0 && !currentValue && (
              <div className="py-2 border-t border-[var(--be-border)]">
                <div className="px-4 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  热门搜索
                </div>
                <div className="px-4 py-2 flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isControlled) setValue(search);
                        onChange?.(search);
                        handleSearch(search);
                      }}
                      className="px-3 py-1.5 text-sm text-text-secondary bg-[var(--be-background)] hover:bg-[var(--be-primary-light)] hover:text-be-primary rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 快捷操作 */}
            <div className="px-4 py-2 bg-[var(--be-background-secondary)] border-t border-[var(--be-border)]">
              <div className="flex items-center justify-between text-xs text-text-tertiary">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--be-surface)] rounded border border-[var(--be-border)]">↑↓</kbd>
                    选择
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--be-surface)] rounded border border-[var(--be-border)]">↵</kbd>
                    确认
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--be-surface)] rounded border border-[var(--be-border)]">esc</kbd>
                    关闭
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI 搜索
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// ========================================
// Header 组件
// ========================================

export function Header({
  className,
  searchPlaceholder = '搜索任何内容...',
  searchShortcut = '⌘K',
  notificationCount = 0,
  userAvatar,
  userName = 'User',
  userRole = 'Member',
  recentSearches = [],
  trendingSearches = [],
  searchSuggestions = [],
  onSearch,
  onNotificationClick,
  onSettingsClick,
  onUserMenuClick,
  onMenuClick,
  rightActions,
  showSearch = true,
  showNotifications = true,
  showSettings = true,
  showUserMenu = true,
}: HeaderProps): JSX.Element {
  const { sidebarCollapsed, toggleSidebar } = useNavigation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭用户下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        'h-[var(--be-header-height)] bg-[var(--be-surface)] border-b border-[var(--be-border)]',
        'flex items-center gap-4 px-4 lg:px-6',
        'sticky top-0 z-30',
        'transition-all duration-300',
        sidebarCollapsed ? 'ml-[var(--be-sidebar-collapsed-width)]' : 'ml-[var(--be-sidebar-width)]',
        className
      )}
    >
      {/* 左侧：菜单按钮 + 面包屑 */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--be-background-secondary)] text-text-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* 面包屑 (可扩展) */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-text-tertiary">BunnyEra</span>
          <span className="text-text-disabled">/</span>
          <span className="text-text-primary font-medium">Dashboard</span>
        </nav>
      </div>

      {/* 中间：搜索栏 */}
      {showSearch && (
        <div className="flex-1 max-w-xl mx-auto">
          <SearchBar
            placeholder={searchPlaceholder}
            shortcut={searchShortcut}
            onSearch={onSearch}
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            suggestions={searchSuggestions}
          />
        </div>
      )}

      {/* 右侧：操作按钮 */}
      <div className="flex items-center gap-2">
        {rightActions}

        {/* 通知按钮 */}
        {showNotifications && (
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-lg hover:bg-[var(--be-background-secondary)] text-text-secondary hover:text-text-primary transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-be-danger text-[10px] font-medium text-white ring-2 ring-[var(--be-surface)]">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        )}

        {/* 设置按钮 */}
        {showSettings && (
          <button
            onClick={onSettingsClick}
            className="hidden sm:flex p-2 rounded-lg hover:bg-[var(--be-background-secondary)] text-text-secondary hover:text-text-primary transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}

        {/* 用户菜单 */}
        {showUserMenu && (
          <div ref={userDropdownRef} className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--be-background-secondary)] transition-colors"
            >
              <Avatar src={userAvatar} name={userName} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-text-primary">{userName}</p>
                <p className="text-xs text-text-tertiary">{userRole}</p>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-text-tertiary transition-transform',
                showUserDropdown && 'rotate-180'
              )} />
            </button>

            {/* 用户下拉菜单 */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--be-surface)] border border-[var(--be-border)] rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-[var(--be-border)]">
                  <div className="flex items-center gap-3">
                    <Avatar src={userAvatar} name={userName} size="lg" />
                    <div>
                      <p className="font-medium text-text-primary">{userName}</p>
                      <p className="text-sm text-text-tertiary">{userRole}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      onUserMenuClick?.();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-[var(--be-background-secondary)] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    个人资料
                  </button>
                  <button
                    onClick={() => {
                      onSettingsClick?.();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-[var(--be-background-secondary)] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    设置
                  </button>
                </div>

                <div className="py-2 border-t border-[var(--be-border)]">
                  <button
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-be-danger hover:bg-be-danger-light transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

// ========================================
// 导出子组件
// ========================================

export interface HeaderBreadcrumbProps {
  items: { label: string; href?: string; icon?: React.ReactNode }[];
  className?: string;
}

export function HeaderBreadcrumb({ items, className }: HeaderBreadcrumbProps): JSX.Element {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      {items.map((item, index) => (
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
            <span className={cn(
              'flex items-center gap-1.5',
              index === items.length - 1 ? 'text-text-primary font-medium' : 'text-text-tertiary'
            )}>
              {item.icon}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
