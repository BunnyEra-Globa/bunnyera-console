// ============================================
// bunnyera-console-apps - 入口文件（品牌规范版）
// ============================================
// BunnyEra Console 内部应用集合
// 每个 App 都是运行在 bunnyera-console-ui 布局中的独立模块
// ============================================

// --------------------------------------------
// 导出应用组件
// --------------------------------------------

export { DashboardApp } from './apps/DashboardApp';
export { ProjectsApp } from './apps/ProjectsApp';
export { ResourcesApp } from './apps/ResourcesApp';
export { AIHubApp } from './apps/AIHubApp';
export { LogCenterApp } from './apps/LogCenterApp';
export { NotesApp } from './apps/NotesApp';
export { SettingsApp } from './apps/SettingsApp';

// --------------------------------------------
// 导出应用 Props 类型
// --------------------------------------------

export type { DashboardAppProps } from './apps/DashboardApp';
export type { ProjectsAppProps } from './apps/ProjectsApp';
export type { ResourcesAppProps } from './apps/ResourcesApp';
export type { AIHubAppProps } from './apps/AIHubApp';
export type { LogCenterAppProps } from './apps/LogCenterApp';
export type { NotesAppProps } from './apps/NotesApp';
export type { SettingsAppProps } from './apps/SettingsApp';

// --------------------------------------------
// 导出核心 Mock API
// --------------------------------------------

export { mockApi } from './core';

// --------------------------------------------
// 导出类型定义
// --------------------------------------------

export type {
  BaseEntity,
  Status,
  DashboardStats,
  RecentActivity,
  ResourceStat,
  Project,
  ProjectDetail,
  Resource,
  ResourceGroup,
  ResourceType,
  Agent,
  ChatSession,
  ChatMessage,
  LogEntry,
  LogLevel,
  Note,
  Settings,
} from './types';

// --------------------------------------------
// 应用注册类型（品牌规范版）
// --------------------------------------------

export interface AppRegistryItem {
  id: string;
  name: string;
  description: string;
  icon: string; // 统一 icon 名称，不使用 emoji
  component: React.ComponentType<any>;
  path: string;

  // BunnyEra Console 品牌要求字段
  category: 'workspace' | 'system' | 'ai' | 'resources' | 'logs' | 'notes';
  order: number;
  keepAlive?: boolean;
  permissions?: string[];
  layout?: 'default' | 'full' | 'minimal';
}

// --------------------------------------------
// 导入应用组件
// --------------------------------------------

import { DashboardApp } from './apps/DashboardApp';
import { ProjectsApp } from './apps/ProjectsApp';
import { ResourcesApp } from './apps/ResourcesApp';
import { AIHubApp } from './apps/AIHubApp';
import { LogCenterApp } from './apps/LogCenterApp';
import { NotesApp } from './apps/NotesApp';
import { SettingsApp } from './apps/SettingsApp';

// --------------------------------------------
// 应用注册表（品牌规范版）
// icon 字段必须使用统一 icon 名称，不使用 emoji
// --------------------------------------------

export const appRegistry: AppRegistryItem[] = [
  {
    id: 'dashboard',
    name: '控制台',
    description: '系统总览和关键指标',
    icon: 'dashboard',
    component: DashboardApp,
    path: '/dashboard',
    category: 'workspace',
    order: 1,
    keepAlive: true,
  },
  {
    id: 'projects',
    name: '项目',
    description: '项目管理和跟踪',
    icon: 'projects',
    component: ProjectsApp,
    path: '/projects',
    category: 'workspace',
    order: 2,
    keepAlive: true,
  },
  {
    id: 'resources',
    name: '资源',
    description: '资源文件管理',
    icon: 'resources',
    component: ResourcesApp,
    path: '/resources',
    category: 'resources',
    order: 3,
    keepAlive: true,
  },
  {
    id: 'aihub',
    name: 'AI 助手',
    description: 'AI 对话和工作流',
    icon: 'ai',
    component: AIHubApp,
    path: '/aihub',
    category: 'ai',
    order: 4,
    layout: 'full',
    keepAlive: true,
  },
  {
    id: 'logs',
    name: '日志',
    description: '系统日志和分析',
    icon: 'logs',
    component: LogCenterApp,
    path: '/logs',
    category: 'logs',
    order: 5,
  },
  {
    id: 'notes',
    name: '笔记',
    description: '个人笔记和备忘',
    icon: 'notes',
    component: NotesApp,
    path: '/notes',
    category: 'notes',
    order: 6,
    keepAlive: true,
  },
  {
    id: 'settings',
    name: '设置',
    description: '系统设置和偏好',
    icon: 'settings',
    component: SettingsApp,
    path: '/settings',
    category: 'system',
    order: 99,
    layout: 'minimal',
  },
];

// --------------------------------------------
// 工具函数
// --------------------------------------------

export function getAppById(id: string): AppRegistryItem | undefined {
  return appRegistry.find(app => app.id === id);
}

export function getAppByPath(path: string): AppRegistryItem | undefined {
  return appRegistry.find(app => app.path === path);
}

// --------------------------------------------
// 版本信息
// --------------------------------------------

export const VERSION = '1.0.0';

// --------------------------------------------
// 默认导出
// --------------------------------------------

export default {
  DashboardApp,
  ProjectsApp,
  ResourcesApp,
  AIHubApp,
  LogCenterApp,
  NotesApp,
  SettingsApp,
  appRegistry,
  getAppById,
  getAppByPath,
  VERSION,
};
