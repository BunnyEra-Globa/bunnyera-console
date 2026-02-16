// ============================================
// bunnyera-console-apps - 入口文件
// ============================================
// BunnyEra Console 内部应用集合
// 包含 Dashboard、Projects、Resources、AIHub、LogCenter、Notes、Settings 等应用模块
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
  // 通用类型
  BaseEntity,
  Status,
  
  // Dashboard 类型
  DashboardStats,
  RecentActivity,
  ResourceStat,
  
  // Project 类型
  Project,
  ProjectDetail,
  
  // Resource 类型
  Resource,
  ResourceGroup,
  ResourceType,
  
  // AIHub 类型
  Agent,
  ChatSession,
  ChatMessage,
  
  // Log 类型
  LogEntry,
  LogLevel,
  
  // Note 类型
  Note,
  
  // Settings 类型
  Settings,
} from './types';

// --------------------------------------------
// 应用注册信息（用于动态加载）
// --------------------------------------------

export interface AppRegistryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.ComponentType<any>;
  path: string;
}

import { DashboardApp } from './apps/DashboardApp';
import { ProjectsApp } from './apps/ProjectsApp';
import { ResourcesApp } from './apps/ResourcesApp';
import { AIHubApp } from './apps/AIHubApp';
import { LogCenterApp } from './apps/LogCenterApp';
import { NotesApp } from './apps/NotesApp';
import { SettingsApp } from './apps/SettingsApp';

/**
 * 应用注册表
 * 用于在 bunnyera-console-ui 中动态注册和加载应用
 */
export const appRegistry: AppRegistryItem[] = [
  {
    id: 'dashboard',
    name: '控制台',
    description: '系统总览和关键指标',
    icon: '📊',
    component: DashboardApp,
    path: '/dashboard',
  },
  {
    id: 'projects',
    name: '项目',
    description: '项目管理和跟踪',
    icon: '📁',
    component: ProjectsApp,
    path: '/projects',
  },
  {
    id: 'resources',
    name: '资源',
    description: '资源文件管理',
    icon: '📦',
    component: ResourcesApp,
    path: '/resources',
  },
  {
    id: 'aihub',
    name: 'AI 助手',
    description: 'AI 对话和工作流',
    icon: '🤖',
    component: AIHubApp,
    path: '/aihub',
  },
  {
    id: 'logs',
    name: '日志',
    description: '系统日志和分析',
    icon: '📋',
    component: LogCenterApp,
    path: '/logs',
  },
  {
    id: 'notes',
    name: '笔记',
    description: '个人笔记和备忘',
    icon: '📝',
    component: NotesApp,
    path: '/notes',
  },
  {
    id: 'settings',
    name: '设置',
    description: '系统设置和偏好',
    icon: '⚙️',
    component: SettingsApp,
    path: '/settings',
  },
];

/**
 * 根据 ID 获取应用组件
 */
export function getAppById(id: string): AppRegistryItem | undefined {
  return appRegistry.find(app => app.id === id);
}

/**
 * 根据路径获取应用组件
 */
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
