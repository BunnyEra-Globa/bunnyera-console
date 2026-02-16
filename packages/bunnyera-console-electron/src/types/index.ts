// Navigation item type
export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
}

// Project type
export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed' | 'archived'
  progress: number
  createdAt: string
  updatedAt: string
  tags: string[]
}

// Resource type
export interface Resource {
  id: string
  name: string
  type: 'file' | 'folder' | 'link' | 'note'
  size?: string
  url?: string
  content?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

// Log entry type
export interface LogEntry {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  source: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// Chat message type for AI Hub
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  isStreaming?: boolean
}

// Settings type
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: boolean
  autoSave: boolean
  sidebarCollapsed: boolean
}

// Dashboard stats type
export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalResources: number
  totalLogs: number
  errorCount: number
  warningCount: number
}

// API Response type
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}
