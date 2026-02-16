import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../theme/utils';
import { Button } from './Button';

// ========================================
// 类型定义
// ========================================

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerProps {
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
  /** 宽度 (左右位置) */
  width?: number | string;
  /** 高度 (上下位置) */
  height?: number | string;
  /** 位置 */
  placement?: DrawerPlacement;
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
  /** 额外内容 (在头部下方) */
  extra?: React.ReactNode;
  /** 是否显示分隔线 */
  split?: boolean;
}

// ========================================
// Drawer 组件
// ========================================

export function Drawer({
  open = false,
  onClose,
  title,
  children,
  footer,
  width = 400,
  height = 400,
  placement = 'right',
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
  extra,
  split = true,
}: DrawerProps): JSX.Element | null {
  const [isClosing, setIsClosing] = React.useState(false);
  const [hasOpened, setHasOpened] = React.useState(false);

  // 处理关闭
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose?.();
    }, 300);
  }, [onClose]);

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

  // 位置样式
  const placementClasses = {
    top: 'top-0 left-0 right-0',
    right: 'top-0 right-0 bottom-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'top-0 left-0 bottom-0',
  };

  const placementTransforms = {
    top: isVisible ? 'translate-y-0' : '-translate-y-full',
    right: isVisible ? 'translate-x-0' : 'translate-x-full',
    bottom: isVisible ? 'translate-y-0' : 'translate-y-full',
    left: isVisible ? 'translate-x-0' : '-translate-x-full',
  };

  const sizeStyles =
    placement === 'top' || placement === 'bottom'
      ? { height: typeof height === 'number' ? `${height}px` : height }
      : { width: typeof width === 'number' ? `${width}px` : width };

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
      className={cn('fixed inset-0 z-50', isVisible ? 'visible' : 'invisible')}
      aria-modal="true"
      role="dialog"
    >
      {/* 蒙层 */}
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
          maskClassName
        )}
        onClick={handleMaskClick}
      />

      {/* 抽屉 */}
      <div
        className={cn(
          'absolute bg-[var(--be-surface)] shadow-2xl flex flex-col',
          placementClasses[placement],
          'transition-transform duration-300 ease-out',
          placementTransforms[placement],
          className
        )}
        style={sizeStyles}
      >
        {/* 头部 */}
        {header || title !== undefined ? (
          <div className={cn(
            'flex-shrink-0 flex items-center justify-between px-6 py-4',
            split && 'border-b border-[var(--be-border)]'
          )}>
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

        {/* 额外内容 */}
        {extra && (
          <div className="flex-shrink-0 px-6 py-3 border-b border-[var(--be-border)] bg-[var(--be-background-secondary)]/50">
            {extra}
          </div>
        )}

        {/* 内容 */}
        <div className={cn('flex-1 overflow-auto p-6', contentClassName)}>
          {children}
        </div>

        {/* 底部 */}
        {footer !== undefined ? (
          footer && (
            <div className={cn(
              'flex-shrink-0 px-6 py-4',
              split && 'border-t border-[var(--be-border)]',
              'bg-[var(--be-background-secondary)]/50'
            )}>
              {footer}
            </div>
          )
        ) : (
          <div className={cn(
            'flex-shrink-0 px-6 py-4',
            split && 'border-t border-[var(--be-border)]',
            'bg-[var(--be-background-secondary)]/50'
          )}>
            {defaultFooter}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// DrawerForm 组件 (表单抽屉)
// ========================================

export interface DrawerFormProps extends Omit<DrawerProps, 'children'> {
  /** 表单内容 */
  children?: React.ReactNode;
  /** 表单提交回调 */
  onSubmit?: () => void;
  /** 表单重置回调 */
  onReset?: () => void;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 重置按钮文本 */
  resetText?: string;
}

export function DrawerForm({
  children,
  onSubmit,
  onReset,
  showReset = false,
  resetText = '重置',
  onOk,
  footer,
  ...props
}: DrawerFormProps): JSX.Element {
  const handleOk = useCallback(() => {
    onSubmit?.();
    onOk?.();
  }, [onSubmit, onOk]);

  const defaultFooter = (
    <div className="flex items-center justify-between">
      {showReset ? (
        <Button variant="ghost" onClick={onReset}>
          {resetText}
        </Button>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={props.onClose}>
          {props.cancelText || '取消'}
        </Button>
        <Button onClick={handleOk} loading={props.confirmLoading}>
          {props.okText || '提交'}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      {...props}
      onOk={handleOk}
      footer={footer !== undefined ? footer : defaultFooter}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOk();
        }}
      >
        {children}
      </form>
    </Drawer>
  );
}

// ========================================
// useDrawer Hook
// ========================================

export interface UseDrawerReturn {
  /** 打开状态 */
  open: boolean;
  /** 打开抽屉 */
  show: () => void;
  /** 关闭抽屉 */
  hide: () => void;
  /** 切换抽屉 */
  toggle: () => void;
  /** Drawer 组件 */
  DrawerComponent: React.FC<Omit<DrawerProps, 'open' | 'onClose'>>;
}

export function useDrawer(): UseDrawerReturn {
  const [open, setOpen] = React.useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const DrawerComponent = React.useCallback(
    (props: Omit<DrawerProps, 'open' | 'onClose'>) => (
      <Drawer open={open} onClose={hide} {...props} />
    ),
    [open, hide]
  );

  return {
    open,
    show,
    hide,
    toggle,
    DrawerComponent,
  };
}
