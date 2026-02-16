import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../theme/utils';

// ========================================
// 类型定义
// ========================================

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  /** 自定义类名 */
  className?: string;
  /** 是否选中 */
  checked?: boolean;
  /** 默认选中状态 */
  defaultChecked?: boolean;
  /** 选中状态变化回调 */
  onChange?: (checked: boolean) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否半选中 */
  indeterminate?: boolean;
  /** 子元素 (标签) */
  children?: React.ReactNode;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

// ========================================
// Checkbox 组件
// ========================================

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      indeterminate = false,
      children,
      size = 'md',
      id,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

    // 受控/非受控处理
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    // 处理变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onChange?.(newChecked);
    };

    // 尺寸样式
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4',
    };

    const labelSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const checkboxId = id || `checkbox-${React.useId()}`;

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer select-none',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex items-center justify-center rounded border-2 transition-all duration-200',
              sizeClasses[size],
              isChecked || indeterminate
                ? 'bg-be-primary border-be-primary'
                : 'bg-[var(--be-surface)] border-[var(--be-border)] hover:border-[var(--be-border-hover)]',
              disabled && 'bg-[var(--be-background-secondary)] border-[var(--be-border)]'
            )}
          >
            {isChecked && !indeterminate && (
              <Check className={cn(iconSizes[size], 'text-white')} strokeWidth={3} />
            )}
            {indeterminate && (
              <Minus className={cn(iconSizes[size], 'text-white')} strokeWidth={3} />
            )}
          </div>
        </div>
        {children && (
          <span className={cn('text-text-primary', labelSizes[size])}>
            {children}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ========================================
// CheckboxGroup 组件
// ========================================

export interface CheckboxGroupProps {
  /** 选项 */
  options: {
    label: React.ReactNode;
    value: string;
    disabled?: boolean;
  }[];
  /** 当前值 */
  value?: string[];
  /** 默认值 */
  defaultValue?: string[];
  /** 值变化回调 */
  onChange?: (value: string[]) => void;
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical';
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

export function CheckboxGroup({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  direction = 'vertical',
  className,
  size = 'md',
}: CheckboxGroupProps): JSX.Element {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue);

  // 受控/非受控处理
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // 处理变化
  const handleChange = (optionValue: string, checked: boolean) => {
    const newValue = checked
      ? [...currentValue, optionValue]
      : currentValue.filter((v) => v !== optionValue);

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div
      className={cn(
        'flex gap-3',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={currentValue.includes(option.value)}
          onChange={(checked) => handleChange(option.value, checked)}
          disabled={option.disabled}
          size={size}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  );
}
