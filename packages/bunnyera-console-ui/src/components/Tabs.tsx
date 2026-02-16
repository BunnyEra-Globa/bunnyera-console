import React, { useState, useCallback } from 'react';
import { cn } from '../theme/utils';

// ========================================
// 类型定义
// ========================================

export interface TabItem {
  /** 唯一标识 */
  key: string;
  /** 标签 */
  label: React.ReactNode;
  /** 内容 */
  children?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
  /** 徽章 */
  badge?: React.ReactNode;
  /** 是否可关闭 */
  closable?: boolean;
}

export interface TabsProps {
  /** 标签项 */
  items: TabItem[];
  /** 当前激活的 key */
  activeKey?: string;
  /** 默认激活的 key */
  defaultActiveKey?: string;
  /** 切换回调 */
  onChange?: (key: string) => void;
  /** 类型 */
  type?: 'line' | 'card' | 'pill';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否居中 */
  centered?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 标签栏类名 */
  tabBarClassName?: string;
  /** 内容区类名 */
  contentClassName?: string;
  /** 标签关闭回调 */
  onTabClose?: (key: string) => void;
  /** 额外内容 (右侧) */
  tabBarExtraContent?: React.ReactNode;
  /** 标签位置 */
  tabPosition?: 'top' | 'left' | 'right' | 'bottom';
}

// ========================================
// Tabs 组件
// ========================================

export function Tabs({
  items,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  type = 'line',
  size = 'md',
  centered = false,
  className,
  tabBarClassName,
  contentClassName,
  onTabClose,
  tabBarExtraContent,
  tabPosition = 'top',
}: TabsProps): JSX.Element {
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey || (items.length > 0 ? items[0].key : '')
  );

  // 受控/非受控处理
  const isControlled = controlledActiveKey !== undefined;
  const activeKey = isControlled ? controlledActiveKey : internalActiveKey;

  // 处理切换
  const handleChange = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (item?.disabled) return;

      if (!isControlled) {
        setInternalActiveKey(key);
      }
      onChange?.(key);
    },
    [items, isControlled, onChange]
  );

  // 尺寸样式
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  const tabPadding = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2.5',
    lg: 'px-5 py-3',
  };

  // 类型样式
  const typeStyles = {
    line: {
      tabBar: 'border-b border-[var(--be-border)]',
      tab: cn(
        'relative border-b-2 border-transparent text-text-secondary hover:text-text-primary transition-colors',
        'data-[active=true]:text-be-primary data-[active=true]:border-be-primary'
      ),
    },
    card: {
      tabBar: 'bg-[var(--be-background-secondary)] p-1 rounded-lg',
      tab: cn(
        'rounded-md text-text-secondary hover:text-text-primary transition-all',
        'data-[active=true]:bg-[var(--be-surface)] data-[active=true]:text-text-primary data-[active=true]:shadow-sm'
      ),
    },
    pill: {
      tabBar: 'gap-1',
      tab: cn(
        'rounded-full text-text-secondary hover:bg-[var(--be-background-secondary)] transition-all',
        'data-[active=true]:bg-be-primary data-[active=true]:text-white'
      ),
    },
  };

  // 当前激活的项
  const activeItem = items.find((item) => item.key === activeKey);

  // 水平/垂直布局
  const isHorizontal = tabPosition === 'top' || tabPosition === 'bottom';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {/* 标签栏 */}
      <div
        className={cn(
          'flex',
          isHorizontal ? 'flex-row' : 'flex-col',
          typeStyles[type].tabBar,
          centered && isHorizontal && 'justify-center',
          tabBarClassName
        )}
        role="tablist"
      >
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            disabled={item.disabled}
            data-active={activeKey === item.key}
            onClick={() => handleChange(item.key)}
            className={cn(
              'flex items-center gap-2 font-medium whitespace-nowrap transition-all',
              sizeClasses[size],
              tabPadding[size],
              typeStyles[type].tab,
              item.disabled && 'opacity-50 cursor-not-allowed hover:text-text-secondary',
              tabBarClassName
            )}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.badge && <span className="flex-shrink-0">{item.badge}</span>}
            {item.closable && onTabClose && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(item.key);
                }}
                className="flex-shrink-0 p-0.5 rounded-full hover:bg-black/10 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
          </button>
        ))}
        {tabBarExtraContent && (
          <div className={cn('flex items-center', isHorizontal ? 'ml-auto' : 'mt-auto')}>
            {tabBarExtraContent}
          </div>
        )}
      </div>

      {/* 内容区 */}
      <div
        className={cn(
          'flex-1',
          isHorizontal ? 'mt-4' : 'ml-4',
          contentClassName
        )}
        role="tabpanel"
      >
        {activeItem?.children}
      </div>
    </div>
  );
}

// ========================================
// TabPane 组件 (用于声明式用法)
// ========================================

export interface TabPaneProps {
  /** 唯一标识 */
  tabKey: string;
  /** 标签 */
  tab: React.ReactNode;
  /** 内容 */
  children?: React.ReactNode;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
}

export function TabPane({ children }: TabPaneProps): JSX.Element {
  return <>{children}</>;
}

// ========================================
// DraggableTabs 组件 (可拖拽标签)
// ========================================

export interface DraggableTabsProps extends Omit<TabsProps, 'onChange'> {
  /** 标签变化回调 */
  onChange?: (key: string) => void;
  /** 顺序变化回调 */
  onOrderChange?: (items: TabItem[]) => void;
}

export function DraggableTabs({ items, onOrderChange, ...props }: DraggableTabsProps): JSX.Element {
  const [draggedItem, setDraggedItem] = useState<TabItem | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const handleDragStart = (item: TabItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    setDragOverKey(key);
  };

  const handleDrop = (e: React.DragEvent, targetItem: TabItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.key === targetItem.key) return;

    const newItems = [...items];
    const draggedIndex = newItems.findIndex((i) => i.key === draggedItem.key);
    const targetIndex = newItems.findIndex((i) => i.key === targetItem.key);

    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    onOrderChange?.(newItems);
    setDraggedItem(null);
    setDragOverKey(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverKey(null);
  };

  return (
    <Tabs
      {...props}
      items={items}
      tabBarClassName={cn(
        props.tabBarClassName,
        '[&>button]:cursor-move'
      )}
    />
  );
}

// ========================================
// CompactTabs 组件 (紧凑标签)
// ========================================

export interface CompactTabsProps extends Omit<TabsProps, 'type' | 'size'> {
  /** 是否显示边框 */
  bordered?: boolean;
}

export function CompactTabs({ bordered = true, ...props }: CompactTabsProps): JSX.Element {
  return (
    <Tabs
      {...props}
      type="line"
      size="sm"
      tabBarClassName={cn(
        bordered && 'border-b border-[var(--be-border)]',
        props.tabBarClassName
      )}
    />
  );
}

// ========================================
// VerticalTabs 组件 (垂直标签)
// ========================================

export interface VerticalTabsProps extends Omit<TabsProps, 'tabPosition'> {
  /** 宽度 */
  width?: number | string;
}

export function VerticalTabs({ width = 200, ...props }: VerticalTabsProps): JSX.Element {
  return (
    <Tabs
      {...props}
      tabPosition="left"
      tabBarClassName={cn(
        'w-auto border-r border-[var(--be-border)] pr-2',
        props.tabBarClassName
      )}
    />
  );
}

// ========================================
// useTabs Hook
// ========================================

export interface UseTabsReturn {
  /** 当前激活的 key */
  activeKey: string;
  /** 设置激活的 key */
  setActiveKey: (key: string) => void;
  /** Tabs 组件 */
  TabsComponent: React.FC<Omit<TabsProps, 'activeKey' | 'defaultActiveKey' | 'onChange'>>;
}

export function useTabs(defaultKey: string): UseTabsReturn {
  const [activeKey, setActiveKey] = useState(defaultKey);

  const TabsComponent = useCallback(
    (props: Omit<TabsProps, 'activeKey' | 'defaultActiveKey' | 'onChange'>) => (
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        {...props}
      />
    ),
    [activeKey]
  );

  return {
    activeKey,
    setActiveKey,
    TabsComponent,
  };
}
