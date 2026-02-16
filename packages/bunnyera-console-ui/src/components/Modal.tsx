import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../theme/utils';
import { Button } from './Button';

// ========================================
// 类型定义
// ========================================

export interface ModalProps {
  /** 是否打开 */
  open?: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 标题 */
  title?: React.ReactNode;
  /** 内容 */
  children?: React.ReactNode;
  /** 底部内容 */
  footer?: React.ReactNode;
  /** 宽度 */
  width?: number | string;
  /** 是否居中 */
  centered?: boolean;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 点击蒙层是否关闭 */
  maskClosable?: boolean;
  /** 关闭时销毁内容 */
  destroyOnClose?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 确认按钮加载状态 */
  confirmLoading?: boolean;
  /** 确认按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认回调 */
  onOk?: () => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 是否显示确认按钮 */
  showOk?: boolean;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 确认按钮属性 */
  okButtonProps?: React.ComponentProps<typeof Button>;
  /** 取消按钮属性 */
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  /** 自定义头部 */
  header?: React.ReactNode;
  /** 自定义蒙层类名 */
  maskClassName?: string;
  /** 自定义内容类名 */
  contentClassName?: string;
  /** 动画持续时间 */
  transitionDuration?: number;
}

// ========================================
// Modal 组件
// ========================================

export function Modal({
  open = false,
  onClose,
  title,
  children,
  footer,
  width = 520,
  centered = false,
  closable = true,
  maskClosable = true,
  destroyOnClose = false,
  className,
  confirmLoading = false,
  okText = '确认',
  cancelText = '取消',
  onOk,
  onCancel,
  showOk = true,
  showCancel = true,
  okButtonProps,
  cancelButtonProps,
  header,
  maskClassName,
  contentClassName,
  transitionDuration = 200,
}: ModalProps): JSX.Element | null {
  const [isClosing, setIsClosing] = React.useState(false);
  const [hasOpened, setHasOpened] = React.useState(false);

  // 处理关闭
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose?.();
    }, transitionDuration);
  }, [onClose, transitionDuration]);

  // 处理确认
  const handleOk = useCallback(() => {
    onOk?.();
  }, [onOk]);

  // 处理取消
  const handleCancel = useCallback(() => {
    onCancel?.();
    handleClose();
  }, [onCancel, handleClose]);

  // 处理蒙层点击
  const handleMaskClick = useCallback(() => {
    if (maskClosable && !confirmLoading) {
      handleClose();
    }
  }, [maskClosable, confirmLoading, handleClose]);

  // 处理 ESC 键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !confirmLoading) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setHasOpened(true);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, confirmLoading, handleClose]);

  // 如果不打开且未打开过（销毁内容）
  if (!open && (!hasOpened || destroyOnClose)) {
    return null;
  }

  const isVisible = open && !isClosing;

  // 默认底部
  const defaultFooter = (
    <div className="flex items-center justify-end gap-3">
      {showCancel && (
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={confirmLoading}
          {...cancelButtonProps}
        >
          {cancelText}
        </Button>
      )}
      {showOk && (
        <Button
          loading={confirmLoading}
          onClick={handleOk}
          {...okButtonProps}
        >
          {okText}
        </Button>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        centered ? 'items-center justify-center' : 'items-start justify-center pt-[100px]',
        'transition-all duration-200',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      aria-modal="true"
      role="dialog"
    >
      {/* 蒙层 */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200',
          maskClassName
        )}
        onClick={handleMaskClick}
      />

      {/* 对话框 */}
      <div
        className={cn(
          'relative bg-[var(--be-surface)] rounded-2xl shadow-2xl overflow-hidden',
          'transition-all duration-200',
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-4',
          className
        )}
        style={{ width: typeof width === 'number' ? `${width}px` : width, maxWidth: 'calc(100vw - 32px)' }}
      >
        {/* 头部 */}
        {header || title !== undefined ? (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--be-border)]">
            {header || (
              <h3 className="text-lg font-semibold text-text-primary">
                {title}
              </h3>
            )}
            {closable && (
              <button
                onClick={handleClose}
                disabled={confirmLoading}
                className="p-1.5 rounded-lg hover:bg-[var(--be-background-secondary)] text-text-tertiary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : null}

        {/* 内容 */}
        <div className={cn('px-6 py-4', contentClassName)}>
          {children}
        </div>

        {/* 底部 */}
        {footer !== undefined ? (
          footer && (
            <div className="px-6 py-4 border-t border-[var(--be-border)] bg-[var(--be-background-secondary)]/50">
              {footer}
            </div>
          )
        ) : (
          <div className="px-6 py-4 border-t border-[var(--be-border)] bg-[var(--be-background-secondary)]/50">
            {defaultFooter}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// ConfirmModal 组件 (确认对话框)
// ========================================

export interface ConfirmModalProps extends Omit<ModalProps, 'children' | 'footer'> {
  /** 内容 */
  content?: React.ReactNode;
  /** 类型 */
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  /** 图标 */
  icon?: React.ReactNode;
}

export function ConfirmModal({
  content,
  type = 'confirm',
  icon,
  title,
  okButtonProps,
  ...props
}: ConfirmModalProps): JSX.Element {
  const typeConfig = {
    info: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-be-info-light flex items-center justify-center">
          <svg className="w-6 h-6 text-be-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      okVariant: 'primary' as const,
    },
    success: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-be-success-light flex items-center justify-center">
          <svg className="w-6 h-6 text-be-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
      okVariant: 'primary' as const,
    },
    warning: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-be-warning-light flex items-center justify-center">
          <svg className="w-6 h-6 text-be-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      ),
      okVariant: 'danger' as const,
    },
    error: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-be-danger-light flex items-center justify-center">
          <svg className="w-6 h-6 text-be-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      ),
      okVariant: 'danger' as const,
    },
    confirm: {
      icon: (
        <div className="w-12 h-12 rounded-full bg-be-primary-light flex items-center justify-center">
          <svg className="w-6 h-6 text-be-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      okVariant: 'primary' as const,
    },
  };

  const config = typeConfig[type];

  return (
    <Modal
      title={title}
      width={400}
      centered
      showCancel
      okButtonProps={{ variant: config.okVariant, ...okButtonProps }}
      {...props}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {icon || config.icon}
        </div>
        <div className="flex-1 pt-1">
          {content}
        </div>
      </div>
    </Modal>
  );
}

// ========================================
// useModal Hook
// ========================================

export interface UseModalReturn {
  /** 打开状态 */
  open: boolean;
  /** 打开对话框 */
  show: () => void;
  /** 关闭对话框 */
  hide: () => void;
  /** 切换对话框 */
  toggle: () => void;
  /** Modal 组件 */
  ModalComponent: React.FC<Omit<ModalProps, 'open' | 'onClose'>>;
}

export function useModal(): UseModalReturn {
  const [open, setOpen] = React.useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const ModalComponent = React.useCallback(
    (props: Omit<ModalProps, 'open' | 'onClose'>) => (
      <Modal open={open} onClose={hide} {...props} />
    ),
    [open, hide]
  );

  return {
    open,
    show,
    hide,
    toggle,
    ModalComponent,
  };
}
