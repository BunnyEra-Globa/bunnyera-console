import React from 'react';
import { Inbox, Search, FolderOpen, FileX, Box, Database } from 'lucide-react';
import { cn } from '../theme/utils';
import { Button } from './Button';

// ========================================
// 类型定义
// ========================================

export interface EmptyStateProps {
  /** 图标 */
  icon?: React.ReactNode;
  /** 标题 */
  title?: React.ReactNode;
  /** 描述 */
  description?: React.ReactNode;
  /** 操作按钮 */
  action?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 预设类型 */
  type?: 'default' | 'search' | 'folder' | 'file' | 'data' | 'box';
  /** 次要操作 */
  secondaryAction?: React.ReactNode;
}

// ========================================
// 预设图标
// ========================================

const presetIcons = {
  default: Inbox,
  search: Search,
  folder: FolderOpen,
  file: FileX,
  data: Database,
  box: Box,
};

// ========================================
// EmptyState 组件
// ========================================

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
  type = 'default',
  secondaryAction,
}: EmptyStateProps): JSX.Element {
  // 尺寸样式
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'w-10 h-10',
      iconWrapper: 'w-16 h-16',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      icon: 'w-14 h-14',
      iconWrapper: 'w-24 h-24',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      iconWrapper: 'w-32 h-32',
      title: 'text-xl',
      description: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  // 获取预设图标
  const IconComponent = presetIcons[type];
  const defaultIcon = <IconComponent className={classes.icon} />;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        classes.container,
        className
      )}
    >
      {/* 图标 */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-[var(--be-background-secondary)] text-text-tertiary mb-4',
          classes.iconWrapper
        )}
      >
        {icon || defaultIcon}
      </div>

      {/* 标题 */}
      {title && (
        <h3
          className={cn(
            'font-semibold text-text-primary mb-2',
            classes.title
          )}
        >
          {title}
        </h3>
      )}

      {/* 描述 */}
      {description && (
        <p
          className={cn(
            'text-text-secondary max-w-md mb-6',
            classes.description
          )}
        >
          {description}
        </p>
      )}

      {/* 操作按钮 */}
      {action && (
        <div className="flex items-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

// ========================================
// EmptySearch 组件 (搜索为空)
// ========================================

export interface EmptySearchProps extends Omit<EmptyStateProps, 'type' | 'icon'> {
  /** 搜索关键词 */
  keyword?: string;
  /** 清除搜索回调 */
  onClear?: () => void;
}

export function EmptySearch({
  keyword,
  onClear,
  title,
  description,
  ...props
}: EmptySearchProps): JSX.Element {
  return (
    <EmptyState
      type="search"
      title={title || `未找到 "${keyword}" 的相关结果`}
      description={description || '请尝试使用其他关键词或检查拼写'}
      action={
        onClear && (
          <Button variant="primary" onClick={onClear}>
            清除搜索
          </Button>
        )
      }
      {...props}
    />
  );
}

// ========================================
// EmptyFolder 组件 (空文件夹)
// ========================================

export interface EmptyFolderProps extends Omit<EmptyStateProps, 'type' | 'icon'> {
  /** 创建回调 */
  onCreate?: () => void;
  /** 创建按钮文本 */
  createText?: string;
}

export function EmptyFolder({
  onCreate,
  createText = '创建文件',
  title,
  description,
  ...props
}: EmptyFolderProps): JSX.Element {
  return (
    <EmptyState
      type="folder"
      title={title || '文件夹为空'}
      description={description || '此文件夹中没有任何文件'}
      action={
        onCreate && (
          <Button variant="primary" onClick={onCreate}>
            {createText}
          </Button>
        )
      }
      {...props}
    />
  );
}

// ========================================
// EmptyData 组件 (无数据)
// ========================================

export interface EmptyDataProps extends Omit<EmptyStateProps, 'type' | 'icon'> {
  /** 刷新回调 */
  onRefresh?: () => void;
  /** 创建回调 */
  onCreate?: () => void;
  /** 创建按钮文本 */
  createText?: string;
}

export function EmptyData({
  onRefresh,
  onCreate,
  createText = '创建数据',
  title,
  description,
  ...props
}: EmptyDataProps): JSX.Element {
  return (
    <EmptyState
      type="data"
      title={title || '暂无数据'}
      description={description || '当前没有任何数据，可以创建一条新数据'}
      action={
        <>
          {onCreate && (
            <Button variant="primary" onClick={onCreate}>
              {createText}
            </Button>
          )}
          {onRefresh && (
            <Button variant="secondary" onClick={onRefresh}>
              刷新
            </Button>
          )}
        </>
      }
      {...props}
    />
  );
}

// ========================================
// EmptyError 组件 (错误状态)
// ========================================

export interface EmptyErrorProps extends Omit<EmptyStateProps, 'type' | 'icon'> {
  /** 错误信息 */
  error?: string;
  /** 重试回调 */
  onRetry?: () => void;
}

export function EmptyError({
  error,
  onRetry,
  title,
  description,
  ...props
}: EmptyErrorProps): JSX.Element {
  return (
    <EmptyState
      icon={
        <div className="w-full h-full flex items-center justify-center text-be-danger">
          <svg className="w-3/5 h-3/5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      }
      title={title || '出错了'}
      description={error || description || '加载数据时发生错误，请稍后重试'}
      action={
        onRetry && (
          <Button variant="primary" onClick={onRetry}>
            重试
          </Button>
        )
      }
      {...props}
    />
  );
}

// ========================================
// EmptyLoading 组件 (加载状态)
// ========================================

export interface EmptyLoadingProps extends Omit<EmptyStateProps, 'type' | 'icon'> {
  /** 加载提示 */
  tip?: string;
}

export function EmptyLoading({
  tip = '加载中...',
  ...props
}: EmptyLoadingProps): JSX.Element {
  return (
    <EmptyState
      icon={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 border-4 border-be-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
      description={tip}
      {...props}
    />
  );
}

// ========================================
// EmptyResult 组件 (结果为空)
// ========================================

export interface EmptyResultProps extends Omit<EmptyStateProps, 'type'> {
  /** 结果类型 */
  resultType?: 'filter' | 'search' | 'sort';
  /** 重置回调 */
  onReset?: () => void;
}

export function EmptyResult({
  resultType = 'filter',
  onReset,
  title,
  description,
  ...props
}: EmptyResultProps): JSX.Element {
  const config = {
    filter: {
      title: '没有符合条件的结果',
      description: '请尝试调整筛选条件',
    },
    search: {
      title: '没有找到相关内容',
      description: '请尝试使用其他关键词',
    },
    sort: {
      title: '排序后无数据',
      description: '请尝试其他排序方式',
    },
  };

  return (
    <EmptyState
      type="box"
      title={title || config[resultType].title}
      description={description || config[resultType].description}
      action={
        onReset && (
          <Button variant="primary" onClick={onReset}>
            重置条件
          </Button>
        )
      }
      {...props}
    />
  );
}
