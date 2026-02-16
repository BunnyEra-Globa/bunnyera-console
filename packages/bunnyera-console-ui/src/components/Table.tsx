import React, { useState, useCallback, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../theme/utils';
import { Checkbox } from './Checkbox';

// ========================================
// 类型定义
// ========================================

export interface TableColumn<T = unknown> {
  /** 列唯一标识 */
  key: string;
  /** 列标题 */
  title: React.ReactNode;
  /** 数据索引 */
  dataIndex?: string;
  /** 列宽 */
  width?: number | string;
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否可排序 */
  sorter?: boolean | ((a: T, b: T) => number);
  /** 自定义渲染 */
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  /** 固定位置 */
  fixed?: 'left' | 'right';
  /** 是否省略 */
  ellipsis?: boolean;
  /** 自定义类名 */
  className?: string;
}

export interface TableProps<T = unknown> {
  /** 表格数据 */
  data: T[];
  /** 列配置 */
  columns: TableColumn<T>[];
  /** 加载状态 */
  loading?: boolean;
  /** 行唯一标识 */
  rowKey?: string | ((record: T) => string);
  /** 分页配置 */
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange?: (page: number, pageSize: number) => void;
  };
  /** 是否可选择 */
  selectable?: boolean;
  /** 选中的行 key */
  selectedRowKeys?: string[];
  /** 选择变化回调 */
  onSelectChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  /** 行点击回调 */
  onRowClick?: (record: T, index: number) => void;
  /** 空状态文本 */
  emptyText?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否斑马纹 */
  striped?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 行类名 */
  rowClassName?: (record: T, index: number) => string;
  /** 表头类名 */
  headerClassName?: string;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 滚动配置 */
  scroll?: { x?: number | string; y?: number | string };
  /** 展开配置 */
  expandable?: {
    expandedRowRender?: (record: T) => React.ReactNode;
    rowExpandable?: (record: T) => boolean;
    expandedRowKeys?: string[];
    onExpand?: (expanded: boolean, record: T) => void;
  };
}

// ========================================
// Table 组件
// ========================================

export function Table<T extends Record<string, unknown> = Record<string, unknown>>({
  data,
  columns,
  loading = false,
  rowKey = 'id',
  pagination,
  selectable = false,
  selectedRowKeys: controlledSelectedKeys,
  onSelectChange,
  onRowClick,
  emptyText = '暂无数据',
  className,
  striped = false,
  bordered = false,
  size = 'md',
  rowClassName,
  headerClassName,
  showHeader = true,
  scroll,
  expandable,
}: TableProps<T>): JSX.Element {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 受控/非受控处理
  const isSelectionControlled = controlledSelectedKeys !== undefined;
  const selectedKeys = isSelectionControlled
    ? controlledSelectedKeys
    : internalSelectedKeys;

  // 获取行 key
  const getRowKey = useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return String(record[rowKey] ?? index);
    },
    [rowKey]
  );

  // 排序处理
  const handleSort = useCallback((column: TableColumn<T>) => {
    if (!column.sorter) return;

    setSortConfig((prev) => {
      if (prev?.key === column.key) {
        return prev.direction === 'asc'
          ? { key: column.key, direction: 'desc' }
          : null;
      }
      return { key: column.key, direction: 'asc' };
    });
  }, []);

  // 排序后的数据
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const column = columns.find((col) => col.key === sortConfig.key);
    if (!column || !column.sorter) return data;

    return [...data].sort((a, b) => {
      let result = 0;
      if (typeof column.sorter === 'function') {
        result = column.sorter(a, b);
      } else if (column.dataIndex) {
        const aVal = a[column.dataIndex];
        const bVal = b[column.dataIndex];
        if (aVal < bVal) result = -1;
        if (aVal > bVal) result = 1;
      }
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [data, sortConfig, columns]);

  // 分页数据
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination]);

  // 选择处理
  const handleSelect = useCallback(
    (key: string, record: T) => {
      const newKeys = selectedKeys.includes(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key];

      if (!isSelectionControlled) {
        setInternalSelectedKeys(newKeys);
      }

      const selectedRows = data.filter((item) =>
        newKeys.includes(getRowKey(item, data.indexOf(item)))
      );
      onSelectChange?.(newKeys, selectedRows);
    },
    [selectedKeys, isSelectionControlled, data, getRowKey, onSelectChange]
  );

  // 全选处理
  const handleSelectAll = useCallback(() => {
    const allKeys = paginatedData.map((item, index) =>
      getRowKey(item, data.indexOf(item))
    );
    const newKeys =
      selectedKeys.length === allKeys.length ? [] : allKeys;

    if (!isSelectionControlled) {
      setInternalSelectedKeys(newKeys);
    }

    const selectedRows = data.filter((item) =>
      newKeys.includes(getRowKey(item, data.indexOf(item)))
    );
    onSelectChange?.(newKeys, selectedRows);
  }, [paginatedData, selectedKeys, isSelectionControlled, data, getRowKey, onSelectChange]);

  // 展开处理
  const handleExpand = useCallback(
    (key: string, record: T) => {
      const newKeys = expandedKeys.includes(key)
        ? expandedKeys.filter((k) => k !== key)
        : [...expandedKeys, key];
      setExpandedKeys(newKeys);
      expandable?.onExpand?.(newKeys.includes(key), record);
    },
    [expandedKeys, expandable]
  );

  // 尺寸样式
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const cellPadding = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  // 判断是否全选
  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item, index) =>
      selectedKeys.includes(getRowKey(item, data.indexOf(item)))
    );

  // 判断是否部分选中
  const partiallySelected =
    selectedKeys.length > 0 &&
    selectedKeys.length < paginatedData.length;

  return (
    <div className={cn('flex flex-col', className)}>
      {/* 表格容器 */}
      <div
        className={cn(
          'overflow-auto rounded-lg',
          bordered && 'border border-[var(--be-border)]'
        )}
        style={scroll?.y ? { maxHeight: scroll.y } : undefined}
      >
        <table
          className={cn(
            'w-full border-collapse',
            sizeClasses[size]
          )}
          style={scroll?.x ? { minWidth: scroll.x } : undefined}
        >
          {/* 表头 */}
          {showHeader && (
            <thead className={cn('bg-[var(--be-background-secondary)]', headerClassName)}>
              <tr>
                {/* 选择列 */}
                {selectable && (
                  <th
                    className={cn(
                      cellPadding[size],
                      'text-left font-medium text-text-secondary border-b border-[var(--be-border)]',
                      'sticky top-0 bg-[var(--be-background-secondary)] z-10'
                    )}
                  >
                    <Checkbox
                      checked={allSelected}
                      indeterminate={partiallySelected}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}

                {/* 展开列 */}
                {expandable && (
                  <th
                    className={cn(
                      cellPadding[size],
                      'w-10 text-left font-medium text-text-secondary border-b border-[var(--be-border)]',
                      'sticky top-0 bg-[var(--be-background-secondary)] z-10'
                    )}
                  />
                )}

                {/* 数据列 */}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      cellPadding[size],
                      'text-left font-medium text-text-secondary border-b border-[var(--be-border)]',
                      'sticky top-0 bg-[var(--be-background-secondary)] z-10',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.fixed === 'left' && 'sticky left-0 z-20',
                      column.fixed === 'right' && 'sticky right-0 z-20',
                      column.className
                    )}
                    style={{ width: column.width }}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-1',
                        column.align === 'center' && 'justify-center',
                        column.align === 'right' && 'justify-end',
                        column.sorter && 'cursor-pointer select-none hover:text-text-primary'
                      )}
                      onClick={() => handleSort(column)}
                    >
                      <span className={cn(column.ellipsis && 'truncate max-w-[200px]')}>
                        {column.title}
                      </span>
                      {column.sorter && (
                        <span className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              'w-3 h-3 -mb-1',
                              sortConfig?.key === column.key &&
                                sortConfig.direction === 'asc'
                                ? 'text-be-primary'
                                : 'text-text-tertiary'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'w-3 h-3',
                              sortConfig?.key === column.key &&
                                sortConfig.direction === 'desc'
                                ? 'text-be-primary'
                                : 'text-text-tertiary'
                            )}
                          />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* 表体 */}
          <tbody>
            {loading ? (
              // 加载状态
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
                  className={cn(cellPadding[size], 'text-center text-text-tertiary')}
                >
                  <div className="flex items-center justify-center gap-2 py-8">
                    <div className="w-5 h-5 border-2 border-be-primary border-t-transparent rounded-full animate-spin" />
                    加载中...
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              // 空状态
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
                  className={cn(cellPadding[size], 'text-center text-text-tertiary')}
                >
                  <div className="py-12">{emptyText}</div>
                </td>
              </tr>
            ) : (
              // 数据行
              paginatedData.map((record, index) => {
                const key = getRowKey(record, data.indexOf(record));
                const isSelected = selectedKeys.includes(key);
                const isExpanded = expandedKeys.includes(key);
                const rowExpandable =
                  expandable?.rowExpandable?.(record) ?? true;

                return (
                  <React.Fragment key={key}>
                    <tr
                      onClick={() => onRowClick?.(record, index)}
                      className={cn(
                        'transition-colors',
                        striped && index % 2 === 1 && 'bg-[var(--be-background-secondary)]/50',
                        isSelected && 'bg-be-primary-light/50',
                        onRowClick && 'cursor-pointer hover:bg-[var(--be-background-secondary)]',
                        rowClassName?.(record, index)
                      )}
                    >
                      {/* 选择列 */}
                      {selectable && (
                        <td
                          className={cn(
                            cellPadding[size],
                            'border-b border-[var(--be-border)]'
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(key, record)}
                          />
                        </td>
                      )}

                      {/* 展开列 */}
                      {expandable && (
                        <td
                          className={cn(
                            cellPadding[size],
                            'border-b border-[var(--be-border)]'
                          )}
                        >
                          {rowExpandable && (
                            <button
                              onClick={() => handleExpand(key, record)}
                              className={cn(
                                'p-1 rounded hover:bg-[var(--be-background-secondary)] transition-transform',
                                isExpanded && 'rotate-90'
                              )}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      )}

                      {/* 数据列 */}
                      {columns.map((column) => {
                        const value = column.dataIndex
                          ? record[column.dataIndex]
                          : undefined;
                        const content = column.render
                          ? column.render(value, record, index)
                          : String(value ?? '');

                        return (
                          <td
                            key={column.key}
                            className={cn(
                              cellPadding[size],
                              'border-b border-[var(--be-border)] text-text-primary',
                              column.align === 'center' && 'text-center',
                              column.align === 'right' && 'text-right',
                              column.fixed === 'left' && 'sticky left-0 bg-inherit',
                              column.fixed === 'right' && 'sticky right-0 bg-inherit',
                              column.className
                            )}
                          >
                            <span
                              className={cn(
                                column.ellipsis && 'truncate max-w-[200px] block'
                              )}
                            >
                              {content}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* 展开行 */}
                    {isExpanded && expandable?.expandedRowRender && (
                      <tr>
                        <td
                          colSpan={
                            columns.length +
                            (selectable ? 1 : 0) +
                            (expandable ? 1 : 0)
                          }
                          className={cn(
                            cellPadding[size],
                            'border-b border-[var(--be-border)] bg-[var(--be-background-secondary)]/30'
                          )}
                        >
                          {expandable.expandedRowRender(record)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-text-tertiary">
            共 {pagination.total} 条
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                pagination.onChange?.(
                  Math.max(1, pagination.current - 1),
                  pagination.pageSize
                )
              }
              disabled={pagination.current <= 1}
              className="p-2 rounded-lg hover:bg-[var(--be-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-text-secondary">
              {pagination.current} /{' '}
              {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() =>
                pagination.onChange?.(
                  Math.min(
                    Math.ceil(pagination.total / pagination.pageSize),
                    pagination.current + 1
                  ),
                  pagination.pageSize
                )
              }
              disabled={
                pagination.current >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
              className="p-2 rounded-lg hover:bg-[var(--be-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// List 组件 (列表视图)
// ========================================

export interface ListProps<T = unknown> {
  /** 数据 */
  data: T[];
  /** 渲染每一项 */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** 加载状态 */
  loading?: boolean;
  /** 空状态文本 */
  emptyText?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 每一项的类名 */
  itemClassName?: string;
  /** 是否有边框 */
  bordered?: boolean;
  /** 是否显示分隔线 */
  split?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 分页配置 */
  pagination?: TableProps<T>['pagination'];
}

export function List<T extends Record<string, unknown> = Record<string, unknown>>({
  data,
  renderItem,
  loading = false,
  emptyText = '暂无数据',
  className,
  itemClassName,
  bordered = false,
  split = true,
  size = 'md',
  pagination,
}: ListProps<T>): JSX.Element {
  const sizeClasses = {
    sm: 'py-2 px-3',
    md: 'py-3 px-4',
    lg: 'py-4 px-6',
  };

  // 分页数据
  const paginatedData = useMemo(() => {
    if (!pagination) return data;
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pagination]);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="w-5 h-5 border-2 border-be-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('text-center py-12 text-text-tertiary', className)}>
        {emptyText}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={cn(
          bordered && 'border border-[var(--be-border)] rounded-lg overflow-hidden'
        )}
      >
        {paginatedData.map((item, index) => (
          <div
            key={index}
            className={cn(
              sizeClasses[size],
              split && index < paginatedData.length - 1 && 'border-b border-[var(--be-border)]',
              itemClassName
            )}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* 分页 */}
      {pagination && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-text-tertiary">
            共 {pagination.total} 条
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                pagination.onChange?.(
                  Math.max(1, pagination.current - 1),
                  pagination.pageSize
                )
              }
              disabled={pagination.current <= 1}
              className="p-2 rounded-lg hover:bg-[var(--be-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-text-secondary">
              {pagination.current} /{' '}
              {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() =>
                pagination.onChange?.(
                  Math.min(
                    Math.ceil(pagination.total / pagination.pageSize),
                    pagination.current + 1
                  ),
                  pagination.pageSize
                )
              }
              disabled={
                pagination.current >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
              className="p-2 rounded-lg hover:bg-[var(--be-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
