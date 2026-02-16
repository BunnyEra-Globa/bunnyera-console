import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../theme/utils';

// ========================================
// 类型定义
// ========================================

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** 自定义类名 */
  className?: string;
  /** 输入框值 */
  value?: string;
  /** 默认值 */
  defaultValue?: string;
  /** 值变化回调 */
  onChange?: (value: string) => void;
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
  /** 行数 */
  rows?: number;
  /** 最大长度 */
  maxLength?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
  /** 是否自动调整高度 */
  autoResize?: boolean;
  /** 最小行数 */
  minRows?: number;
  /** 最大行数 */
  maxRows?: number;
  /** 是否占满宽度 */
  fullWidth?: boolean;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
}

// ========================================
// Textarea 组件
// ========================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled = false,
      readOnly = false,
      error,
      label,
      hint,
      rows = 4,
      maxLength,
      showCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      fullWidth = false,
      size = 'md',
      onInput,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [height, setHeight] = useState<number | undefined>(undefined);

    // 合并 ref
    const textareaRef = (ref || internalRef) as React.RefObject<HTMLTextAreaElement>;

    // 受控/非受控处理
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const currentLength = (currentValue || '').length;

    // 处理值变化
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
      },
      [isControlled, onChange]
    );

    // 自动调整高度
    const adjustHeight = useCallback(() => {
      if (!autoResize || !textareaRef.current) return;

      const textarea = textareaRef.current;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
      const padding = parseInt(getComputedStyle(textarea).paddingTop, 10) +
                      parseInt(getComputedStyle(textarea).paddingBottom, 10);

      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const minHeight = minRows * lineHeight + padding;
      const maxHeight = maxRows * lineHeight + padding;

      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      setHeight(newHeight);
    }, [autoResize, minRows, maxRows, textareaRef]);

    // 处理输入
    const handleInput = useCallback(
      (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight();
        onInput?.(e);
      },
      [adjustHeight, onInput]
    );

    // 初始调整高度
    useEffect(() => {
      if (autoResize) {
        adjustHeight();
      }
    }, [autoResize, currentValue, adjustHeight]);

    // 尺寸样式
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
        {/* 标签 */}
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">{label}</label>
            {showCount && maxLength && (
              <span className={cn(
                'text-xs',
                currentLength > maxLength ? 'text-be-danger' : 'text-text-tertiary'
              )}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}

        {/* 文本域容器 */}
        <div className={cn('relative', fullWidth && 'w-full')}>
          <textarea
            ref={textareaRef}
            value={currentValue}
            onChange={handleChange}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            rows={autoResize ? minRows : rows}
            maxLength={maxLength}
            style={height ? { height } : undefined}
            className={cn(
              'w-full bg-[var(--be-surface)] border rounded-lg text-text-primary placeholder:text-text-tertiary',
              'transition-all duration-200 resize-y',
              'focus:outline-none focus:border-be-primary focus:ring-2 focus:ring-[var(--be-primary-light)]',
              error && 'border-be-danger focus:border-be-danger focus:ring-be-danger-light',
              !error && 'border-[var(--be-border)] hover:border-[var(--be-border-hover)]',
              disabled && 'bg-[var(--be-background-secondary)] text-text-disabled cursor-not-allowed resize-none',
              readOnly && 'bg-[var(--be-background-secondary)]',
              sizeClasses[size]
            )}
            {...props}
          />
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          {/* 错误信息 */}
          {error && <p className="text-sm text-be-danger">{error}</p>}

          {/* 提示信息 */}
          {hint && !error && <p className="text-sm text-text-tertiary">{hint}</p>}

          {/* 字数统计 (无标签时显示在右侧) */}
          {showCount && maxLength && !label && (
            <span className={cn(
              'text-xs ml-auto',
              currentLength > maxLength ? 'text-be-danger' : 'text-text-tertiary'
            )}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ========================================
// AutoResizeTextarea 组件 (自动调整高度的文本域)
// ========================================

export interface AutoResizeTextareaProps extends Omit<TextareaProps, 'autoResize'> {
  /** 最小行数 */
  minRows?: number;
  /** 最大行数 */
  maxRows?: number;
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ minRows = 3, maxRows = 10, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        autoResize
        minRows={minRows}
        maxRows={maxRows}
        {...props}
      />
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

// ========================================
// RichTextarea 组件 (富文本文本域)
// ========================================

export interface RichTextareaProps extends TextareaProps {
  /** 工具栏 */
  toolbar?: React.ReactNode;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 工具栏位置 */
  toolbarPosition?: 'top' | 'bottom';
}

export const RichTextarea = forwardRef<HTMLTextAreaElement, RichTextareaProps>(
  (
    {
      toolbar,
      showToolbar = true,
      toolbarPosition = 'top',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('border border-[var(--be-border)] rounded-lg overflow-hidden', className)}>
        {/* 顶部工具栏 */}
        {showToolbar && toolbarPosition === 'top' && toolbar && (
          <div className="px-3 py-2 bg-[var(--be-background-secondary)] border-b border-[var(--be-border)]">
            {toolbar}
          </div>
        )}

        {/* 文本域 */}
        <Textarea
          ref={ref}
          className="border-0 focus:ring-0 rounded-none"
          {...props}
        />

        {/* 底部工具栏 */}
        {showToolbar && toolbarPosition === 'bottom' && toolbar && (
          <div className="px-3 py-2 bg-[var(--be-background-secondary)] border-t border-[var(--be-border)]">
            {toolbar}
          </div>
        )}
      </div>
    );
  }
);

RichTextarea.displayName = 'RichTextarea';

// ========================================
// MentionTextarea 组件 (@提及文本域)
// ========================================

export interface MentionOption {
  id: string;
  name: string;
  avatar?: string;
}

export interface MentionTextareaProps extends TextareaProps {
  /** 提及选项 */
  mentionOptions: MentionOption[];
  /** 提及回调 */
  onMention?: (user: MentionOption) => void;
  /** 触发字符 */
  trigger?: string;
}

export const MentionTextarea = forwardRef<HTMLTextAreaElement, MentionTextareaProps>(
  ({ mentionOptions, onMention, trigger = '@', ...props }, ref) => {
    const [showMentionList, setShowMentionList] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // 过滤提及选项
    const filteredOptions = mentionOptions.filter((opt) =>
      opt.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );

    // 处理输入
    const handleChange = useCallback(
      (value: string) => {
        props.onChange?.(value);

        // 检测是否触发了提及
        const lastChar = value.slice(-1);
        if (lastChar === trigger) {
          setShowMentionList(true);
          setMentionQuery('');
        } else if (showMentionList) {
          // 获取触发符后的文本
          const beforeCursor = value.slice(0, cursorPosition);
          const lastTriggerIndex = beforeCursor.lastIndexOf(trigger);
          if (lastTriggerIndex >= 0) {
            const query = beforeCursor.slice(lastTriggerIndex + 1);
            if (query.includes(' ')) {
              setShowMentionList(false);
            } else {
              setMentionQuery(query);
            }
          }
        }
      },
      [props, showMentionList, cursorPosition, trigger]
    );

    // 处理选择提及
    const handleSelectMention = useCallback(
      (option: MentionOption) => {
        const value = props.value || '';
        const beforeCursor = value.slice(0, cursorPosition);
        const lastTriggerIndex = beforeCursor.lastIndexOf(trigger);
        const newValue =
          value.slice(0, lastTriggerIndex) +
          `${trigger}${option.name} ` +
          value.slice(cursorPosition);

        props.onChange?.(newValue);
        onMention?.(option);
        setShowMentionList(false);
      },
      [props, cursorPosition, onMention, trigger]
    );

    return (
      <div ref={containerRef} className="relative">
        <Textarea
          ref={ref}
          {...props}
          onChange={handleChange}
          onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
        />

        {/* 提及列表 */}
        {showMentionList && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-56 mt-1 bg-[var(--be-surface)] border border-[var(--be-border)] rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-48 overflow-auto py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectMention(option)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-[var(--be-background-secondary)] transition-colors"
                >
                  {option.avatar ? (
                    <img
                      src={option.avatar}
                      alt={option.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-be-primary-light flex items-center justify-center">
                      <span className="text-xs text-be-primary">
                        {option.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MentionTextarea.displayName = 'MentionTextarea';
