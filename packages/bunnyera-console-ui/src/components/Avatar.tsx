import React, { forwardRef } from 'react';
import { User } from 'lucide-react';
import { cn } from '../theme/utils';

// ========================================
// 类型定义
// ========================================

export interface AvatarProps {
  /** 图片 URL */
  src?: string;
  /** 图片 alt */
  alt?: string;
  /** 名称 (用于生成头像) */
  name?: string;
  /** 尺寸 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** 形状 */
  shape?: 'circle' | 'square';
  /** 在线状态 */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** 自定义类名 */
  className?: string;
  /** 图片类名 */
  imgClassName?: string;
  /** 点击回调 */
  onClick?: () => void;
  /** 边框 */
  bordered?: boolean;
  /** 边框颜色 */
  borderColor?: string;
}

// ========================================
// Avatar 组件
// ========================================

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      className,
      imgClassName,
      onClick,
      bordered = false,
      borderColor = 'var(--be-surface)',
    },
    ref
  ) => {
    // 尺寸样式
    const sizeClasses = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-20 h-20 text-xl',
    };

    // 状态颜色
    const statusColors = {
      online: 'bg-be-success',
      offline: 'bg-text-tertiary',
      away: 'bg-be-warning',
      busy: 'bg-be-danger',
    };

    // 状态尺寸
    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
      '2xl': 'w-4 h-4',
    };

    // 获取首字母
    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // 生成背景色
    const generateColor = (name: string): string => {
      const colors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-green-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-sky-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-pink-500',
        'bg-rose-500',
      ];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };

    // 渲染内容
    const renderContent = () => {
      if (src) {
        return (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'w-full h-full object-cover',
              shape === 'circle' ? 'rounded-full' : 'rounded-lg',
              imgClassName
            )}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        );
      }

      if (name) {
        return (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center text-white font-medium',
              shape === 'circle' ? 'rounded-full' : 'rounded-lg',
              generateColor(name)
            )}
          >
            {getInitials(name)}
          </div>
        );
      }

      return (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center bg-[var(--be-background-secondary)] text-text-tertiary',
            shape === 'circle' ? 'rounded-full' : 'rounded-lg'
          )}
        >
          <User className="w-1/2 h-1/2" />
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex flex-shrink-0',
          sizeClasses[size],
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <div
          className={cn(
            'w-full h-full overflow-hidden',
            shape === 'circle' ? 'rounded-full' : 'rounded-lg',
            bordered && 'ring-2',
            bordered && shape === 'circle' && 'ring-offset-2'
          )}
          style={{ ringColor: borderColor }}
        >
          {renderContent()}
        </div>

        {/* 状态指示器 */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2',
              statusColors[status],
              statusSizes[size],
              shape === 'square' && 'bottom-0.5 right-0.5'
            )}
            style={{ ringColor: borderColor }}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// ========================================
// AvatarGroup 组件
// ========================================

export interface AvatarGroupProps {
  /** 头像列表 */
  avatars: {
    src?: string;
    name?: string;
    alt?: string;
  }[];
  /** 最大显示数量 */
  maxCount?: number;
  /** 尺寸 */
  size?: AvatarProps['size'];
  /** 形状 */
  shape?: AvatarProps['shape'];
  /** 自定义类名 */
  className?: string;
  /** 重叠大小 */
  overlap?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({
  avatars,
  maxCount = 4,
  size = 'md',
  shape = 'circle',
  className,
  overlap = 'md',
}: AvatarGroupProps): JSX.Element {
  const displayAvatars = avatars.slice(0, maxCount);
  const remainingCount = avatars.length - maxCount;

  const overlapClasses = {
    sm: '-space-x-1',
    md: '-space-x-2',
    lg: '-space-x-3',
  };

  return (
    <div className={cn('flex items-center', overlapClasses[overlap], className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          shape={shape}
          bordered
        />
      ))}
      {remainingCount > 0 && (
        <Avatar
          name={`+${remainingCount}`}
          size={size}
          shape={shape}
          bordered
          className="bg-[var(--be-background-tertiary)]"
        />
      )}
    </div>
  );
}
