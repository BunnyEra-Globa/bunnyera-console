import React, { forwardRef, useState, useCallback } from 'react';
import { Eye, EyeOff, X, Search } from 'lucide-react';
import { cn } from '../theme/utils';

// ========================================
// 类型定义
// ========================================

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** 自定义类名 */
  className?: string;
  /** 输入框值 */
  value?: string;
  /** 默认值 */
  defaultValue?: string;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 失焦回调 */
  onBlur?: () => void;
  /** 聚焦回调 */
  onFocus?: () => void;
  /** 占位符 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readOnly?: boolean;
  /** 错误信息 */
  error?: string;
  /** 标签 */
  label?: string;
  /** 提示信息 */
  hint?: string;
  /** 前缀元素 */
  prefix?: React.ReactNode;
  /** 后缀元素 */
  suffix?: React.ReactNode;
  /** 输入框类型 */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否占满宽度 */
  fullWidth?: boolean;
  /** 是否显示清除按钮 */
  allowClear?: boolean;
  /** 清除回调 */
  onClear?: () => void;
}

// ========================================
// Input 组件
// ========================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      disabled = false,
      readOnly = false,
      error,
      label,
      hint,
      prefix,
      suffix,
      type = 'text',
      size = 'md',
      fullWidth = false,
      allowClear = false,
      onClear,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // 处理值变化
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
      },
      [onChange]
    );

    // 处理清除
    const handleClear = useCallback(() => {
      onChange?.('');
      onClear?.();
    }, [onChange, onClear]);

    // 处理聚焦
    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.();
        props.onFocus?.(e);
      },
      [onFocus, props]
    );

    // 处理失焦
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.();
        props.onBlur?.(e);
      },
      [onBlur, props]
    );

    // 处理密码可见性切换
    const togglePasswordVisibility = useCallback(() => {
      setShowPassword(prev => !prev);
    }, []);

    // 确定实际输入类型
    const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

    // 尺寸样式
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    // 前缀/后缀尺寸
    const affixSizeClasses = {
      sm: 'w-8',
      md: 'w-10',
      lg: 'w-12',
    };

    const hasValue = value !== undefined && value !== '';
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
        {/* 标签 */}
        {label && (
          <label className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}

        {/* 输入框容器 */}
        <div
          className={cn(
            'relative flex items-center transition-all duration-200',
            fullWidth && 'w-full'
          )}
        >
          {/* 前缀 */}
          {prefix && (
            <div
              className={cn(
                'absolute left-0 top-0 bottom-0 flex items-center justify-center text-text-tertiary',
                affixSizeClasses[size]
              )}
            >
              {prefix}
            </div>
          )}

          {/* 输入框 */}
          <input
            ref={ref}
            type={inputType}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              'w-full bg-[var(--be-surface)] border rounded-lg text-text-primary placeholder:text-text-tertiary',
              'transition-all duration-200',
              'focus:outline-none',
              sizeClasses[size],
              prefix && size === 'sm' && 'pl-8',
              prefix && size === 'md' && 'pl-10',
              prefix && size === 'lg' && 'pl-12',
              (suffix || showClearButton || type === 'password') && size === 'sm' && 'pr-8',
              (suffix || showClearButton || type === 'password') && size === 'md' && 'pr-10',
              (suffix || showClearButton || type === 'password') && size === 'lg' && 'pr-12',
              error
                ? 'border-be-danger focus:border-be-danger focus:ring-2 focus:ring-be-danger-light'
                : isFocused
                ? 'border-be-primary focus:ring-2 focus:ring-[var(--be-primary-light)]'
                : 'border-[var(--be-border)] hover:border-[var(--be-border-hover)]',
              disabled && 'bg-[var(--be-background-secondary)] text-text-disabled cursor-not-allowed',
              readOnly && 'bg-[var(--be-background-secondary)]'
            )}
            {...props}
          />

          {/* 清除按钮 */}
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                'absolute right-0 top-0 bottom-0 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors',
                affixSizeClasses[size],
                (suffix || type === 'password') && 'right-8'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* 密码可见性切换 */}
          {type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={cn(
                'absolute right-0 top-0 bottom-0 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors',
                affixSizeClasses[size],
                suffix && 'right-8',
                showClearButton && 'right-16'
              )}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* 后缀 */}
          {suffix && (
            <div
              className={cn(
                'absolute right-0 top-0 bottom-0 flex items-center justify-center text-text-tertiary',
                affixSizeClasses[size],
                (type === 'password' || showClearButton) && 'right-8',
                type === 'password' && showClearButton && 'right-16'
              )}
            >
              {suffix}
            </div>
          )}
        </div>

        {/* 错误信息 */}
        {error && (
          <p className="text-sm text-be-danger">{error}</p>
        )}

        {/* 提示信息 */}
        {hint && !error && (
          <p className="text-sm text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ========================================
// SearchInput 组件
// ========================================

export interface SearchInputProps extends Omit<InputProps, 'type' | 'prefix'> {
  /** 搜索回调 */
  onSearch?: (value: string) => void;
  /** 是否显示搜索图标 */
  showSearchIcon?: boolean;
  /** 加载状态 */
  loading?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, showSearchIcon = true, loading = false, onKeyDown, ...props }, ref) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onSearch?.(props.value || '');
        }
        onKeyDown?.(e);
      },
      [onSearch, props.value, onKeyDown]
    );

    return (
      <Input
        ref={ref}
        type="search"
        prefix={showSearchIcon && !loading ? <Search className="w-4 h-4" /> : undefined}
        suffix={
          loading ? (
            <div className="w-4 h-4 border-2 border-be-primary border-t-transparent rounded-full animate-spin" />
          ) : undefined
        }
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// ========================================
// InputGroup 组件
// ========================================

export interface InputGroupProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否垂直排列 */
  vertical?: boolean;
}

export function InputGroup({
  children,
  className,
  size = 'md',
  vertical = false,
}: InputGroupProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex',
        vertical ? 'flex-col' : 'flex-row',
        !vertical && '[&>*:not(:first-child):not(:last-child)]:rounded-none',
        !vertical && '[&>*:first-child]:rounded-r-none',
        !vertical && '[&>*:last-child]:rounded-l-none',
        !vertical && '[&>*:not(:first-child)]:-ml-px',
        vertical && '[&>*:not(:first-child):not(:last-child)]:rounded-none',
        vertical && '[&>*:first-child]:rounded-b-none',
        vertical && '[&>*:last-child]:rounded-t-none',
        vertical && '[&>*:not(:first-child)]:-mt-px',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child as React.ReactElement, { size });
      })}
    </div>
  );
}

// ========================================
// InputAddon 组件
// ========================================

export interface InputAddonProps {
  /** 内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 位置 */
  position?: 'before' | 'after';
}

export function InputAddon({
  children,
  className,
  position = 'before',
}: InputAddonProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center px-3 bg-[var(--be-background-secondary)] border border-[var(--be-border)] text-text-secondary text-sm',
        position === 'before' && 'rounded-l-lg border-r-0',
        position === 'after' && 'rounded-r-lg border-l-0',
        className
      )}
    >
      {children}
    </div>
  );
}

// ========================================
// NumberInput 组件
// ========================================

export interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 精度 */
  precision?: number;
  /** 值变化回调 */
  onChange?: (value: number | null) => void;
  /** 当前值 */
  value?: number | null;
  /** 默认值 */
  defaultValue?: number;
  /** 是否显示控制按钮 */
  showControls?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      precision = 0,
      onChange,
      value,
      defaultValue,
      showControls = true,
      className,
      ...props
    },
    ref
  ) => {
    const handleChange = useCallback(
      (val: string) => {
        if (val === '' || val === '-') {
          onChange?.(null);
          return;
        }
        const num = parseFloat(val);
        if (!isNaN(num)) {
          let clamped = num;
          if (min !== undefined) clamped = Math.max(min, clamped);
          if (max !== undefined) clamped = Math.min(max, clamped);
          onChange?.(Number(clamped.toFixed(precision)));
        }
      },
      [min, max, precision, onChange]
    );

    const handleIncrement = useCallback(() => {
      const current = value ?? defaultValue ?? 0;
      const newValue = current + step;
      handleChange(String(newValue));
    }, [value, defaultValue, step, handleChange]);

    const handleDecrement = useCallback(() => {
      const current = value ?? defaultValue ?? 0;
      const newValue = current - step;
      handleChange(String(newValue));
    }, [value, defaultValue, step, handleChange]);

    const displayValue = value !== undefined && value !== null ? String(value) : '';

    return (
      <div className={cn('relative', className)}>
        <Input
          ref={ref}
          type="number"
          value={displayValue}
          defaultValue={defaultValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        {showControls && (
          <div className="absolute right-0 top-0 bottom-0 flex flex-col border-l border-[var(--be-border)]">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={max !== undefined && (value ?? 0) >= max}
              className="flex-1 px-2 hover:bg-[var(--be-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-3 h-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={min !== undefined && (value ?? 0) <= min}
              className="flex-1 px-2 hover:bg-[var(--be-background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed border-t border-[var(--be-border)] transition-colors"
            >
              <svg className="w-3 h-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
