import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';
import { cn } from '../theme/utils';

// ========================================
// 类型定义
// ========================================

export interface SelectOption {
  /** 选项值 */
  value: string;
  /** 选项标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
}

export interface SelectProps {
  /** 自定义类名 */
  className?: string;
  /** 当前值 */
  value?: string | string[];
  /** 默认值 */
  defaultValue?: string | string[];
  /** 选项列表 */
  options: SelectOption[];
  /** 值变化回调 */
  onChange?: (value: string | string[]) => void;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 错误信息 */
  error?: string;
  /** 标签 */
  label?: string;
  /** 提示信息 */
  hint?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否占满宽度 */
  fullWidth?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 是否可清除 */
  clearable?: boolean;
  /** 是否多选 */
  multiple?: boolean;
  /** 最多显示标签数 */
  maxTagCount?: number;
  /** 加载状态 */
  loading?: boolean;
  /** 空状态文本 */
  emptyText?: string;
}

// ========================================
// Select 组件
// ========================================

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      value,
      defaultValue,
      options,
      onChange,
      placeholder = '请选择',
      disabled = false,
      error,
      label,
      hint,
      size = 'md',
      fullWidth = false,
      searchable = false,
      clearable = false,
      multiple = false,
      maxTagCount = 3,
      loading = false,
      emptyText = '暂无数据',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [internalValue, setInternalValue] = useState<string | string[]>(
      defaultValue || (multiple ? [] : '')
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 受控/非受控处理
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    // 过滤选项
    const filteredOptions = searchable
      ? options.filter(
          (opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opt.value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // 获取选中的选项
    const getSelectedOptions = useCallback((): SelectOption[] => {
      if (multiple) {
        const values = Array.isArray(currentValue) ? currentValue : [];
        return options.filter((opt) => values.includes(opt.value));
      }
      return options.filter((opt) => opt.value === currentValue);
    }, [currentValue, options, multiple]);

    const selectedOptions = getSelectedOptions();

    // 处理选择
    const handleSelect = useCallback(
      (option: SelectOption) => {
        if (option.disabled) return;

        if (multiple) {
          const currentValues = Array.isArray(currentValue) ? currentValue : [];
          const newValues = currentValues.includes(option.value)
            ? currentValues.filter((v) => v !== option.value)
            : [...currentValues, option.value];
          if (!isControlled) setInternalValue(newValues);
          onChange?.(newValues);
        } else {
          if (!isControlled) setInternalValue(option.value);
          onChange?.(option.value);
          setIsOpen(false);
        }
        setSearchQuery('');
      },
      [currentValue, multiple, isControlled, onChange]
    );

    // 处理清除
    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        const newValue = multiple ? [] : '';
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
      },
      [multiple, isControlled, onChange]
    );

    // 处理移除标签
    const handleRemoveTag = useCallback(
      (valueToRemove: string) => {
        const currentValues = Array.isArray(currentValue) ? currentValue : [];
        const newValues = currentValues.filter((v) => v !== valueToRemove);
        if (!isControlled) setInternalValue(newValues);
        onChange?.(newValues);
      },
      [currentValue, isControlled, onChange]
    );

    // 点击外部关闭
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 聚焦时打开下拉
    useEffect(() => {
      if (isOpen && searchable && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // 尺寸样式
    const sizeClasses = {
      sm: 'h-8 text-sm',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base',
    };

    const tagSizeClasses = {
      sm: 'text-xs py-0.5 px-1.5',
      md: 'text-xs py-1 px-2',
      lg: 'text-sm py-1 px-2.5',
    };

    // 渲染选中值
    const renderValue = () => {
      if (selectedOptions.length === 0) {
        return <span className="text-text-tertiary">{placeholder}</span>;
      }

      if (multiple) {
        const displayTags = selectedOptions.slice(0, maxTagCount);
        const remainingCount = selectedOptions.length - maxTagCount;

        return (
          <div className="flex flex-wrap gap-1">
            {displayTags.map((opt) => (
              <span
                key={opt.value}
                className={cn(
                  'inline-flex items-center gap-1 bg-be-primary-light text-be-primary rounded-full',
                  tagSizeClasses[size]
                )}
              >
                {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                <span className="truncate max-w-[80px]">{opt.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(opt.value);
                  }}
                  className="flex-shrink-0 hover:text-be-danger transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {remainingCount > 0 && (
              <span className={cn('text-text-tertiary', tagSizeClasses[size])}>
                +{remainingCount}
              </span>
            )}
          </div>
        );
      }

      const selected = selectedOptions[0];
      return (
        <div className="flex items-center gap-2">
          {selected.icon && <span className="flex-shrink-0">{selected.icon}</span>}
          <span className="truncate">{selected.label}</span>
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}
      >
        {/* 标签 */}
        {label && <label className="text-sm font-medium text-text-primary">{label}</label>}

        {/* 选择器容器 */}
        <div ref={containerRef} className={cn('relative', fullWidth && 'w-full')}>
          {/* 触发器 */}
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'flex items-center gap-2 bg-[var(--be-surface)] border rounded-lg cursor-pointer transition-all duration-200',
              sizeClasses[size],
              error
                ? 'border-be-danger focus-within:border-be-danger focus-within:ring-2 focus-within:ring-be-danger-light'
                : 'border-[var(--be-border)] hover:border-[var(--be-border-hover)] focus-within:border-be-primary focus-within:ring-2 focus-within:ring-[var(--be-primary-light)]',
              disabled && 'bg-[var(--be-background-secondary)] cursor-not-allowed opacity-60',
              isOpen && 'border-be-primary ring-2 ring-[var(--be-primary-light)]',
              multiple ? 'px-2 py-1 min-h-[2.5rem]' : 'px-3'
            )}
          >
            {/* 搜索输入框 (多选或搜索模式下显示) */}
            {isOpen && searchable ? (
              <div className="flex-1 flex items-center gap-2">
                <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={multiple && selectedOptions.length > 0 ? '' : placeholder}
                  className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-tertiary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <div className="flex-1 min-w-0">{renderValue()}</div>
            )}

            {/* 右侧操作 */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* 清除按钮 */}
              {clearable && selectedOptions.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-0.5 rounded hover:bg-[var(--be-background-secondary)] text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* 加载状态 */}
              {loading && (
                <div className="w-4 h-4 border-2 border-be-primary border-t-transparent rounded-full animate-spin" />
              )}

              {/* 下拉箭头 */}
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-text-tertiary transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </div>
          </div>

          {/* 下拉面板 */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-[var(--be-surface)] border border-[var(--be-border)] rounded-lg shadow-lg overflow-hidden">
              {/* 搜索框 (单选非搜索模式下显示) */}
              {searchable && !multiple && (
                <div className="p-2 border-b border-[var(--be-border)]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索..."
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--be-background)] border border-[var(--be-border)] rounded-lg focus:outline-none focus:border-be-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {/* 选项列表 */}
              <div className="max-h-60 overflow-auto py-1">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-text-tertiary">
                    {emptyText}
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = multiple
                      ? Array.isArray(currentValue) && currentValue.includes(option.value)
                      : currentValue === option.value;

                    return (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors',
                          option.disabled && 'opacity-50 cursor-not-allowed',
                          isSelected
                            ? 'bg-[var(--be-primary-light)] text-be-primary'
                            : 'text-text-secondary hover:bg-[var(--be-background-secondary)]'
                        )}
                      >
                        {/* 多选复选框 */}
                        {multiple && (
                          <div
                            className={cn(
                              'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                              isSelected
                                ? 'bg-be-primary border-be-primary'
                                : 'border-[var(--be-border)]'
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        )}

                        {/* 图标 */}
                        {option.icon && <span className="flex-shrink-0">{option.icon}</span>}

                        {/* 标签 */}
                        <span className="flex-1 truncate">{option.label}</span>

                        {/* 单选选中标记 */}
                        {!multiple && isSelected && (
                          <Check className="w-4 h-4 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 错误信息 */}
        {error && <p className="text-sm text-be-danger">{error}</p>}

        {/* 提示信息 */}
        {hint && !error && <p className="text-sm text-text-tertiary">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ========================================
// OptionGroup 组件
// ========================================

export interface OptionGroupProps {
  /** 分组标题 */
  label: string;
  /** 选项 */
  children: React.ReactNode;
}

export function OptionGroup({ label, children }: OptionGroupProps): JSX.Element {
  return (
    <div className="py-1">
      <div className="px-3 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
        {label}
      </div>
      {children}
    </div>
  );
}
