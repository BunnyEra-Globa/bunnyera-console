import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../theme/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// ========================================
// Tag 样式变体
// ========================================

const tagVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-[var(--be-background-secondary)] text-text-secondary',
        primary: 'bg-be-primary-light text-be-primary',
        success: 'bg-be-success-light text-be-success',
        warning: 'bg-be-warning-light text-be-warning',
        danger: 'bg-be-danger-light text-be-danger',
        info: 'bg-be-info-light text-be-info',
        outline: 'bg-transparent border border-[var(--be-border)] text-text-secondary',
        ghost: 'bg-transparent text-text-secondary hover:bg-[var(--be-background-secondary)]',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-full',
        md: 'px-2.5 py-1 text-xs rounded-full',
        lg: 'px-3 py-1.5 text-sm rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// ========================================
// 类型定义
// ========================================

export interface TagProps extends VariantProps<typeof tagVariants> {
  /** 标签内容 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 图标 */
  icon?: React.ReactNode;
  /** 点击回调 */
  onClick?: () => void;
  /** 颜色 (自定义) */
  color?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 边框样式 */
  bordered?: boolean;
}

// ========================================
// Tag 组件
// ========================================

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'md',
      closable = false,
      onClose,
      icon,
      onClick,
      color,
      disabled = false,
      bordered = false,
    },
    ref
  ) => {
    // 自定义颜色样式
    const customStyle = color
      ? {
          backgroundColor: `${color}20`,
          color: color,
          borderColor: bordered ? color : undefined,
        }
      : undefined;

    return (
      <span
        ref={ref}
        onClick={!disabled ? onClick : undefined}
        style={customStyle}
        className={cn(
          tagVariants({ variant, size }),
          onClick && !disabled && 'cursor-pointer hover:opacity-80',
          disabled && 'opacity-50 cursor-not-allowed',
          bordered && 'border',
          className
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
        {closable && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="flex-shrink-0 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';

// ========================================
// TagGroup 组件
// ========================================

export interface TagGroupProps {
  /** 标签列表 */
  tags: {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    variant?: TagProps['variant'];
    closable?: boolean;
    disabled?: boolean;
  }[];
  /** 自定义类名 */
  className?: string;
  /** 尺寸 */
  size?: TagProps['size'];
  /** 标签关闭回调 */
  onTagClose?: (key: string) => void;
  /** 标签点击回调 */
  onTagClick?: (key: string) => void;
  /** 最大显示数量 */
  maxCount?: number;
  /** 间距 */
  gap?: 'sm' | 'md' | 'lg';
}

export function TagGroup({
  tags,
  className,
  size = 'md',
  onTagClose,
  onTagClick,
  maxCount,
  gap = 'md',
}: TagGroupProps): JSX.Element {
  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  const displayTags = maxCount ? tags.slice(0, maxCount) : tags;
  const remainingCount = maxCount ? tags.length - maxCount : 0;

  return (
    <div className={cn('flex flex-wrap', gapClasses[gap], className)}>
      {displayTags.map((tag) => (
        <Tag
          key={tag.key}
          variant={tag.variant}
          size={size}
          icon={tag.icon}
          closable={tag.closable}
          disabled={tag.disabled}
          onClose={() => onTagClose?.(tag.key)}
          onClick={() => onTagClick?.(tag.key)}
        >
          {tag.label}
        </Tag>
      ))}
      {remainingCount > 0 && (
        <Tag variant="default" size={size}>
          +{remainingCount}
        </Tag>
      )}
    </div>
  );
}

// ========================================
// CheckableTag 组件 (可选中的标签)
// ========================================

export interface CheckableTagProps extends Omit<TagProps, 'onChange'> {
  /** 是否选中 */
  checked?: boolean;
  /** 默认选中状态 */
  defaultChecked?: boolean;
  /** 选中状态变化回调 */
  onChange?: (checked: boolean) => void;
}

export const CheckableTag = forwardRef<HTMLSpanElement, CheckableTagProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleClick = () => {
      const newChecked = !isChecked;
      if (!isControlled) setInternalChecked(newChecked);
      onChange?.(newChecked);
    };

    return (
      <Tag
        ref={ref}
        {...props}
        variant={isChecked ? 'primary' : 'default'}
        onClick={handleClick}
        className={cn('cursor-pointer select-none', className)}
      >
        {children}
      </Tag>
    );
  }
);

CheckableTag.displayName = 'CheckableTag';

// ========================================
// EditableTagGroup 组件 (可编辑标签组)
// ========================================

export interface EditableTagGroupProps {
  /** 标签值列表 */
  value?: string[];
  /** 默认值 */
  defaultValue?: string[];
  /** 值变化回调 */
  onChange?: (value: string[]) => void;
  /** 占位符 */
  placeholder?: string;
  /** 自定义类名 */
  className?: string;
  /** 最大标签数 */
  maxCount?: number;
  /** 重复提示 */
  duplicateWarning?: string;
}

export function EditableTagGroup({
  value,
  defaultValue = [],
  onChange,
  placeholder = '添加标签...',
  className,
  maxCount,
  duplicateWarning = '标签已存在',
}: EditableTagGroupProps): JSX.Element {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = React.useState('');
  const [showDuplicateWarning, setShowDuplicateWarning] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDuplicateWarning(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (currentValue.includes(newTag)) {
        setShowDuplicateWarning(true);
        return;
      }

      const newValue = [...currentValue, newTag];
      if (!isControlled) setInternalValue(newValue);
      onChange?.(newValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && currentValue.length > 0) {
      const newValue = currentValue.slice(0, -1);
      if (!isControlled) setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleRemoveTag = (index: number) => {
    const newValue = currentValue.filter((_, i) => i !== index);
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const canAddMore = !maxCount || currentValue.length < maxCount;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 p-2 bg-[var(--be-surface)] border border-[var(--be-border)] rounded-lg',
        'focus-within:border-be-primary focus-within:ring-2 focus-within:ring-[var(--be-primary-light)]',
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {currentValue.map((tag, index) => (
        <Tag
          key={`${tag}-${index}`}
          closable
          onClose={() => handleRemoveTag(index)}
          variant="primary"
        >
          {tag}
        </Tag>
      ))}

      {canAddMore && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={currentValue.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
        />
      )}

      {showDuplicateWarning && (
        <span className="text-xs text-be-danger">{duplicateWarning}</span>
      )}
    </div>
  );
}

// ========================================
// StatusTag 组件 (状态标签)
// ========================================

export interface StatusTagProps extends Omit<TagProps, 'variant'> {
  /** 状态 */
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'processing' | 'default';
  /** 是否显示圆点 */
  showDot?: boolean;
  /** 文本 */
  text?: string;
}

export function StatusTag({
  status,
  showDot = true,
  text,
  children,
  ...props
}: StatusTagProps): JSX.Element {
  const statusConfig = {
    success: { variant: 'success' as const, dotColor: 'bg-be-success' },
    warning: { variant: 'warning' as const, dotColor: 'bg-be-warning' },
    danger: { variant: 'danger' as const, dotColor: 'bg-be-danger' },
    info: { variant: 'info' as const, dotColor: 'bg-be-info' },
    neutral: { variant: 'default' as const, dotColor: 'bg-text-tertiary' },
    processing: { variant: 'primary' as const, dotColor: 'bg-be-primary' },
    default: { variant: 'default' as const, dotColor: 'bg-text-tertiary' },
  };

  const config = statusConfig[status];

  return (
    <Tag variant={config.variant} {...props}>
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      )}
      {text || children}
    </Tag>
  );
}
