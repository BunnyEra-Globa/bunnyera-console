// ============================================
// BunnyEra Console Apps - 类型定义
// ============================================

// --------------------------------------------
// 通用类型
// --------------------------------------------

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Status = 'active' | 'inactive' | 'pending' | 'error' | 'success';

// --------------------------------------------
// Dashboard 类型
// --------------------------------------------

export interface DashboardStats {
  projectCount: number;
  errorCount: number;
  resourceCount: number;
  activityCount: number;
}

export interface RecentActivity {
  id: string;
  type: 'project' | 'resource' | 'error' | 'system';
  title: string;
  description: string;
  timestamp: string;
}

export interface ResourceStat {
  type: string;
  count: number;
  size: number;
}

// --------------------------------------------
// Project 类型
// --------------------------------------------

export interface Project extends BaseEntity {
  name: string;
  description: string;
  status: Status;
  tags: string[];
  owner: string;
  progress: number;
  deadline?: string;
}

export interface ProjectDetail extends Project {
  members: string[];
  resources: string[];
  logs: string[];
  notes: string;
}

// --------------------------------------------
// Resource 类型
// --------------------------------------------

export type ResourceType = 'file' | 'image' | 'video' | 'domain' | 'server' | 'database';

export interface Resource extends BaseEntity {
  name: string;
  type: ResourceType;
  size?: number;
  path?: string;
  url?: string;
  status: Status;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface ResourceGroup {
  type: ResourceType;
  label: string;
  count: number;
  resources: Resource[];
}

// --------------------------------------------
// AIHub 类型
// --------------------------------------------

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon?: string;
  capabilities: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  agentId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// --------------------------------------------
// Log 类型
// --------------------------------------------

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  id: string;
  level: LogLevel;
  source: string;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// --------------------------------------------
// Note 类型
// --------------------------------------------

export interface Note extends BaseEntity {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
}

// --------------------------------------------
// Settings 类型
// --------------------------------------------

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  shortcuts: Record<string, string>;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}
