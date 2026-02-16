// ============================================
// SettingsApp - 设置
// ============================================

import React, { useEffect, useState } from 'react';
import { mockApi } from '../../core';
import type { Settings } from '../../types';

// 设置项组件
interface SettingItemProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
  action?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, description, onClick, action }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 20px',
      borderRadius: '12px',
      background: '#fff',
      border: '1px solid #e5e7eb',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.borderColor = '#bfdbfe';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)';
      }
    }}
    onMouseLeave={(e) => {
      if (onClick) {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
      }
    }}
  >
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontWeight: '600',
        color: '#111827',
        marginBottom: '4px',
        fontSize: '15px',
      }}>
        {title}
      </div>
      <div style={{
        fontSize: '13px',
        color: '#6b7280',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {description}
      </div>
    </div>
    {action ? (
      action
    ) : onClick ? (
      <div style={{
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        fontSize: '18px',
      }}>
        →
      </div>
    ) : null}
  </div>
);

// 开关组件
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    style={{
      width: '48px',
      height: '26px',
      borderRadius: '13px',
      background: checked ? '#3b82f6' : '#e5e7eb',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.2s',
    }}
  >
    <span style={{
      position: 'absolute',
      top: '3px',
      left: checked ? '25px' : '3px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: '#fff',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </button>
);

// ============================================
// SettingsApp 主组件
// ============================================

export interface SettingsAppProps {
  className?: string;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({ className }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await mockApi.settings.get();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (updates: Partial<Settings>) => {
    const updated = await mockApi.settings.update(updates);
    setSettings(updated);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6b7280',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚙️</div>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  // 主题设置面板
  const ThemePanel = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' }}>
        主题设置
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { value: 'light', label: '浅色模式', icon: '☀️', desc: '明亮的界面主题' },
          { value: 'dark', label: '深色模式', icon: '🌙', desc: '护眼的深色主题' },
          { value: 'auto', label: '跟随系统', icon: '🔄', desc: '自动切换浅色/深色' },
        ].map((option) => (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: '10px',
              border: `2px solid ${settings?.theme === option.value ? '#3b82f6' : '#e5e7eb'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={settings?.theme === option.value}
              onChange={() => handleUpdateSettings({ theme: option.value as Settings['theme'] })}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '28px' }}>{option.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                {option.label}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{option.desc}</div>
            </div>
            {settings?.theme === option.value && (
              <div style={{ color: '#3b82f6', fontSize: '20px' }}>✓</div>
            )}
          </label>
        ))}
      </div>
    </div>
  );

  // 语言设置面板
  const LanguagePanel = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' }}>
        语言设置
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
          { value: 'en-US', label: 'English', flag: '🇺🇸' },
          { value: 'ja-JP', label: '日本語', flag: '🇯🇵' },
        ].map((lang) => (
          <label
            key={lang.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '8px',
              border: `1px solid ${settings?.language === lang.value ? '#3b82f6' : '#e5e7eb'}`,
              cursor: 'pointer',
              background: settings?.language === lang.value ? '#eff6ff' : '#fff',
            }}
          >
            <input
              type="radio"
              name="language"
              value={lang.value}
              checked={settings?.language === lang.value}
              onChange={() => handleUpdateSettings({ language: lang.value })}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: '20px' }}>{lang.flag}</span>
            <span style={{ flex: 1, color: '#374151' }}>{lang.label}</span>
            {settings?.language === lang.value && (
              <span style={{ color: '#3b82f6' }}>✓</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );

  // 快捷键设置面板
  const ShortcutsPanel = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' }}>
        快捷键设置
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(settings?.shortcuts || {}).map(([key, shortcut]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              background: '#f9fafb',
              borderRadius: '8px',
            }}
          >
            <span style={{ color: '#374151', fontSize: '14px' }}>
              {key === 'openSearch' && '打开搜索'}
              {key === 'newProject' && '新建项目'}
              {key === 'save' && '保存'}
              {key === 'toggleSidebar' && '切换侧边栏'}
            </span>
            <kbd style={{
              padding: '6px 12px',
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'monospace',
              color: '#374151',
            }}>
              {shortcut}
            </kbd>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
        提示：点击快捷键可以修改（功能开发中）
      </p>
    </div>
  );

  // 通知设置面板
  const NotificationsPanel = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 20px 0' }}>
        通知设置
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '10px',
        }}>
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              启用通知
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              接收系统和应用通知
            </div>
          </div>
          <Toggle
            checked={settings?.notifications.enabled || false}
            onChange={(checked) =>
              handleUpdateSettings({
                notifications: { ...settings!.notifications, enabled: checked },
              })
            }
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '10px',
        }}>
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              声音提醒
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              通知时播放提示音
            </div>
          </div>
          <Toggle
            checked={settings?.notifications.sound || false}
            onChange={(checked) =>
              handleUpdateSettings({
                notifications: { ...settings!.notifications, sound: checked },
              })
            }
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '10px',
        }}>
          <div>
            <div style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              桌面通知
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              显示系统桌面通知
            </div>
          </div>
          <Toggle
            checked={settings?.notifications.desktop || false}
            onChange={(checked) =>
              handleUpdateSettings({
                notifications: { ...settings!.notifications, desktop: checked },
              })
            }
          />
        </div>
      </div>
    </div>
  );

  // 关于面板
  const AboutPanel = () => (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        margin: '0 auto 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '40px',
      }}>
        🐰
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
        BunnyEra Console
      </h3>
      <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>
        版本 2.0.0
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button style={{
          padding: '10px 20px',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          检查更新
        </button>
        <button style={{
          padding: '10px 20px',
          background: '#f3f4f6',
          color: '#374151',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
        }}>
          查看文档
        </button>
      </div>
    </div>
  );

  const sections: Record<string, { title: string; component: React.ReactNode }> = {
    theme: { title: '主题', component: <ThemePanel /> },
    language: { title: '语言', component: <LanguagePanel /> },
    shortcuts: { title: '快捷键', component: <ShortcutsPanel /> },
    notifications: { title: '通知', component: <NotificationsPanel /> },
    about: { title: '关于', component: <AboutPanel /> },
  };

  return (
    <div className={className} style={{ padding: '24px', height: '100%', overflow: 'auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
          设置
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>自定义您的工作环境</p>
      </div>

      {activeSection ? (
        // 子设置页面
        <div style={{ maxWidth: '600px' }}>
          <button
            onClick={() => setActiveSection(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              padding: '8px 0',
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ← 返回
          </button>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
          }}>
            {sections[activeSection].component}
          </div>
        </div>
      ) : (
        // 主设置页面
        <div style={{ maxWidth: '800px' }}>
          {/* 设置分类 */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              外观
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SettingItem
                icon="🎨"
                title="主题"
                description={settings?.theme === 'light' ? '浅色模式' : settings?.theme === 'dark' ? '深色模式' : '跟随系统'}
                onClick={() => setActiveSection('theme')}
              />
              <SettingItem
                icon="🌐"
                title="语言"
                description={settings?.language === 'zh-CN' ? '简体中文' : settings?.language === 'en-US' ? 'English' : settings?.language}
                onClick={() => setActiveSection('language')}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              功能
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SettingItem
                icon="⌨️"
                title="快捷键"
                description="自定义键盘快捷键"
                onClick={() => setActiveSection('shortcuts')}
              />
              <SettingItem
                icon="🔔"
                title="通知"
                description={settings?.notifications.enabled ? '已启用' : '已禁用'}
                onClick={() => setActiveSection('notifications')}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', margin: '0 0 12px 0', textTransform: 'uppercase' }}>
              其他
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SettingItem
                icon="ℹ️"
                title="关于"
                description="BunnyEra Console v2.0.0"
                onClick={() => setActiveSection('about')}
              />
            </div>
          </div>

          {/* 占位提示 */}
          <div style={{
            padding: '20px',
            background: '#fef3c7',
            borderRadius: '10px',
            border: '1px solid #fcd34d',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{ fontWeight: '600', color: '#92400e' }}>占位页面</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#a16207' }}>
              此设置页面为占位实现，后续将被 be-settings 包替换。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsApp;
