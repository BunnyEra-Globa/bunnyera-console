// ============================================
// BunnyEra Console Core - Mock API
// ============================================

import type {
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
  Status,
} from '../types';

// ============================================
// 工具函数
// ============================================

const generateId = () => Math.random().toString(36).substring(2, 15);

const now = () => new Date().toISOString();

const randomDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ============================================
// Dashboard Mock Data
// ============================================

const dashboardStats: DashboardStats = {
  projectCount: 24,
  errorCount: 7,
  resourceCount: 156,
  activityCount: 1289,
};

const recentActivities: RecentActivity[] = [
  { id: generateId(), type: 'project', title: '新项目创建', description: 'AI 助手平台项目已创建', timestamp: randomDate(1) },
  { id: generateId(), type: 'error', title: 'API 错误', description: '/api/v1/users 返回 500 错误', timestamp: randomDate(2) },
  { id: generateId(), type: 'resource', title: '资源上传', description: '新图片资源包已上传 (24MB)', timestamp: randomDate(3) },
  { id: generateId(), type: 'system', title: '系统更新', description: '系统已更新到 v2.3.1', timestamp: randomDate(5) },
  { id: generateId(), type: 'project', title: '项目完成', description: '数据分析模块开发完成', timestamp: randomDate(7) },
  { id: generateId(), type: 'error', title: '数据库警告', description: '连接池使用率超过 80%', timestamp: randomDate(8) },
];

const resourceStats: ResourceStat[] = [
  { type: 'file', count: 45, size: 1024 * 1024 * 256 },
  { type: 'image', count: 128, size: 1024 * 1024 * 512 },
  { type: 'video', count: 12, size: 1024 * 1024 * 1024 * 2 },
  { type: 'domain', count: 8, size: 0 },
  { type: 'server', count: 5, size: 0 },
];

// ============================================
// Projects Mock Data
// ============================================

const projectStatuses: Status[] = ['active', 'inactive', 'pending', 'error', 'success'];

const mockProjects: Project[] = [
  { id: 'proj-1', name: 'AI 助手平台', description: '智能对话系统与 Agent 管理平台', status: 'active', tags: ['AI', 'Platform'], owner: '张三', progress: 75, deadline: '2024-06-30', createdAt: randomDate(60), updatedAt: randomDate(5) },
  { id: 'proj-2', name: '数据分析系统', description: '大数据分析与可视化平台', status: 'success', tags: ['Data', 'Analytics'], owner: '李四', progress: 100, deadline: '2024-03-15', createdAt: randomDate(90), updatedAt: randomDate(10) },
  { id: 'proj-3', name: '用户中心重构', description: '统一用户认证与权限管理', status: 'pending', tags: ['Auth', 'Refactor'], owner: '王五', progress: 30, deadline: '2024-08-01', createdAt: randomDate(30), updatedAt: randomDate(3) },
  { id: 'proj-4', name: '移动端适配', description: '响应式设计与移动端优化', status: 'active', tags: ['Mobile', 'UI'], owner: '赵六', progress: 60, deadline: '2024-05-20', createdAt: randomDate(45), updatedAt: randomDate(7) },
  { id: 'proj-5', name: '支付系统集成', description: '第三方支付渠道接入', status: 'error', tags: ['Payment', 'Integration'], owner: '钱七', progress: 45, deadline: '2024-04-30', createdAt: randomDate(50), updatedAt: randomDate(2) },
  { id: 'proj-6', name: '监控告警系统', description: '实时监控与智能告警', status: 'active', tags: ['Monitor', 'DevOps'], owner: '孙八', progress: 80, deadline: '2024-05-15', createdAt: randomDate(40), updatedAt: randomDate(4) },
];

const projectDetailsMap: Map<string, ProjectDetail> = new Map();

mockProjects.forEach(proj => {
  projectDetailsMap.set(proj.id, {
    ...proj,
    members: ['张三', '李四', '王五'],
    resources: ['res-1', 'res-2', 'res-3'],
    logs: ['log-1', 'log-2'],
    notes: '项目备注信息...',
  });
});

// ============================================
// Resources Mock Data
// ============================================

const resourceTypes: ResourceType[] = ['file', 'image', 'video', 'domain', 'server', 'database'];

const mockResources: Resource[] = [
  { id: 'res-1', name: 'project-docs.pdf', type: 'file', size: 1024 * 1024 * 2.5, status: 'active', tags: ['document', 'pdf'], createdAt: randomDate(30), updatedAt: randomDate(5) },
  { id: 'res-2', name: 'logo.png', type: 'image', size: 1024 * 256, path: '/assets/logo.png', status: 'active', tags: ['logo', 'brand'], createdAt: randomDate(60), updatedAt: randomDate(10) },
  { id: 'res-3', name: 'intro-video.mp4', type: 'video', size: 1024 * 1024 * 15, path: '/videos/intro.mp4', status: 'active', tags: ['video', 'marketing'], createdAt: randomDate(20), updatedAt: randomDate(3) },
  { id: 'res-4', name: 'bunnyera.com', type: 'domain', status: 'active', tags: ['domain', 'production'], metadata: { registrar: 'Cloudflare', expiry: '2025-12-31' }, createdAt: randomDate(365), updatedAt: randomDate(30) },
  { id: 'res-5', name: 'api-server-01', type: 'server', status: 'active', tags: ['server', 'api'], metadata: { ip: '192.168.1.101', region: 'ap-east-1' }, createdAt: randomDate(90), updatedAt: randomDate(7) },
  { id: 'res-6', name: 'user-data.db', type: 'database', status: 'active', tags: ['database', 'mysql'], metadata: { engine: 'MySQL 8.0', size: '10GB' }, createdAt: randomDate(180), updatedAt: randomDate(1) },
  { id: 'res-7', name: 'banner-01.jpg', type: 'image', size: 1024 * 512, path: '/assets/banner-01.jpg', status: 'inactive', tags: ['banner', 'marketing'], createdAt: randomDate(45), updatedAt: randomDate(15) },
  { id: 'res-8', name: 'backup-2024.zip', type: 'file', size: 1024 * 1024 * 500, status: 'success', tags: ['backup', 'archive'], createdAt: randomDate(10), updatedAt: randomDate(10) },
];

// ============================================
// AIHub Mock Data
// ============================================

const mockAgents: Agent[] = [
  { id: 'agent-1', name: '通用助手', description: '全能型 AI 助手，可回答各类问题', capabilities: ['chat', 'code', 'analysis'] },
  { id: 'agent-2', name: '代码专家', description: '专注于编程与代码审查', capabilities: ['code', 'debug', 'review'] },
  { id: 'agent-3', name: '数据分析师', description: '数据分析与可视化建议', capabilities: ['data', 'analysis', 'chart'] },
  { id: 'agent-4', name: '产品经理', description: '产品规划与需求分析', capabilities: ['product', 'planning', 'requirements'] },
];

const mockSessions: ChatSession[] = [
  { id: 'session-1', title: 'React 性能优化', agentId: 'agent-2', messages: [], createdAt: randomDate(5), updatedAt: randomDate(1) },
  { id: 'session-2', title: '数据分析方案', agentId: 'agent-3', messages: [], createdAt: randomDate(3), updatedAt: randomDate(2) },
  { id: 'session-3', title: '产品功能讨论', agentId: 'agent-4', messages: [], createdAt: randomDate(7), updatedAt: randomDate(3) },
];

// 为会话添加消息
mockSessions[0].messages = [
  { id: generateId(), role: 'user', content: '如何优化 React 应用的性能？', timestamp: randomDate(1), agentId: 'agent-2' },
  { id: generateId(), role: 'assistant', content: 'React 性能优化可以从以下几个方面入手：\n\n1. **使用 React.memo** - 避免不必要的重渲染\n2. **useMemo 和 useCallback** - 缓存计算结果和函数\n3. **代码分割** - 使用 React.lazy 和 Suspense\n4. **虚拟列表** - 处理大量数据时使用\n5. **状态管理优化** - 避免不必要的状态提升', timestamp: randomDate(1), agentId: 'agent-2' },
];

// ============================================
// Logs Mock Data
// ============================================

const logLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

const mockLogs: LogEntry[] = [
  { id: 'log-1', level: 'error', source: 'api-server', message: '数据库连接超时', timestamp: randomDate(1), metadata: { retry: 3 } },
  { id: 'log-2', level: 'warn', source: 'cache-service', message: '缓存命中率低于 50%', timestamp: randomDate(2), metadata: { hitRate: 0.45 } },
  { id: 'log-3', level: 'info', source: 'auth-service', message: '用户登录成功', timestamp: randomDate(3), metadata: { userId: 'user-123' } },
  { id: 'log-4', level: 'debug', source: 'worker-1', message: '任务处理完成', timestamp: randomDate(4), metadata: { taskId: 'task-456' } },
  { id: 'log-5', level: 'error', source: 'payment-gateway', message: '支付请求失败', timestamp: randomDate(5), metadata: { errorCode: 'PAY_001' } },
  { id: 'log-6', level: 'fatal', source: 'main-server', message: '内存不足，服务崩溃', timestamp: randomDate(6), metadata: { memory: '98%' } },
  { id: 'log-7', level: 'info', source: 'scheduler', message: '定时任务执行成功', timestamp: randomDate(7), metadata: { job: 'cleanup' } },
  { id: 'log-8', level: 'warn', source: 'email-service', message: '邮件发送队列积压', timestamp: randomDate(8), metadata: { queueSize: 150 } },
];

// ============================================
// Notes Mock Data
// ============================================

const mockNotes: Note[] = [
  { id: 'note-1', title: '项目会议记录', content: '## 2024-01-15 会议\n\n1. 确定了产品路线图\n2. 讨论了技术架构方案\n3. 分配了开发任务\n\n下一步行动：\n- [ ] 完成需求文档\n- [ ] 搭建开发环境', tags: ['meeting', 'project'], isPinned: true, color: '#fff9c4', createdAt: randomDate(30), updatedAt: randomDate(5) },
  { id: 'note-2', title: 'API 设计规范', content: '# REST API 规范\n\n## 命名规范\n- 使用小写字母和连字符\n- 资源名使用复数形式\n\n## 响应格式\n```json\n{\n  "code": 200,\n  "data": {},\n  "message": "success"\n}\n```', tags: ['api', 'spec'], isPinned: false, color: '#e3f2fd', createdAt: randomDate(60), updatedAt: randomDate(10) },
  { id: 'note-3', title: '待办事项', content: '- [x] 完成 Dashboard 设计\n- [ ] 实现 Projects 页面\n- [ ] 集成 AIHub 功能\n- [ ] 优化性能', tags: ['todo', 'personal'], isPinned: false, color: '#f3e5f5', createdAt: randomDate(15), updatedAt: randomDate(2) },
];

// ============================================
// Settings Mock Data
// ============================================

const mockSettings: Settings = {
  theme: 'auto',
  language: 'zh-CN',
  shortcuts: {
    'openSearch': 'Ctrl+K',
    'newProject': 'Ctrl+Shift+P',
    'save': 'Ctrl+S',
    'toggleSidebar': 'Ctrl+B',
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
};

// ============================================
// Mock API 对象
// ============================================

export const mockApi = {
  // Dashboard
  dashboard: {
    getStats: (): Promise<DashboardStats> => Promise.resolve({ ...dashboardStats }),
    getRecentActivities: (limit: number = 10): Promise<RecentActivity[]> => 
      Promise.resolve(recentActivities.slice(0, limit)),
    getResourceStats: (): Promise<ResourceStat[]> => Promise.resolve([...resourceStats]),
  },

  // Projects
  projects: {
    getList: (filters?: { status?: Status; tags?: string[] }): Promise<Project[]> => {
      let result = [...mockProjects];
      if (filters?.status) {
        result = result.filter(p => p.status === filters.status);
      }
      if (filters?.tags?.length) {
        result = result.filter(p => filters.tags!.some(tag => p.tags.includes(tag)));
      }
      return Promise.resolve(result);
    },
    getById: (id: string): Promise<ProjectDetail | null> => {
      const detail = projectDetailsMap.get(id);
      return Promise.resolve(detail ? { ...detail } : null);
    },
    create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
      const newProject: Project = {
        ...data,
        id: generateId(),
        createdAt: now(),
        updatedAt: now(),
      };
      mockProjects.push(newProject);
      return Promise.resolve(newProject);
    },
    update: (id: string, data: Partial<Project>): Promise<Project | null> => {
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) return Promise.resolve(null);
      mockProjects[index] = { ...mockProjects[index], ...data, updatedAt: now() };
      return Promise.resolve(mockProjects[index]);
    },
    delete: (id: string): Promise<boolean> => {
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) return Promise.resolve(false);
      mockProjects.splice(index, 1);
      return Promise.resolve(true);
    },
  },

  // Resources
  resources: {
    getList: (filters?: { type?: ResourceType; search?: string }): Promise<Resource[]> => {
      let result = [...mockResources];
      if (filters?.type) {
        result = result.filter(r => r.type === filters.type);
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(r => r.name.toLowerCase().includes(search));
      }
      return Promise.resolve(result);
    },
    getGroups: (): Promise<ResourceGroup[]> => {
      const groups: Record<ResourceType, Resource[]> = {
        file: [], image: [], video: [], domain: [], server: [], database: [],
      };
      mockResources.forEach(r => {
        groups[r.type].push(r);
      });
      return Promise.resolve([
        { type: 'file', label: '文件', count: groups.file.length, resources: groups.file },
        { type: 'image', label: '图片', count: groups.image.length, resources: groups.image },
        { type: 'video', label: '视频', count: groups.video.length, resources: groups.video },
        { type: 'domain', label: '域名', count: groups.domain.length, resources: groups.domain },
        { type: 'server', label: '服务器', count: groups.server.length, resources: groups.server },
        { type: 'database', label: '数据库', count: groups.database.length, resources: groups.database },
      ]);
    },
    getById: (id: string): Promise<Resource | null> => {
      const resource = mockResources.find(r => r.id === id);
      return Promise.resolve(resource ? { ...resource } : null);
    },
  },

  // AIHub
  aiHub: {
    getAgents: (): Promise<Agent[]> => Promise.resolve([...mockAgents]),
    getSessions: (): Promise<ChatSession[]> => Promise.resolve([...mockSessions]),
    getSessionById: (id: string): Promise<ChatSession | null> => {
      const session = mockSessions.find(s => s.id === id);
      return Promise.resolve(session ? { ...session } : null);
    },
    createSession: (agentId: string, title: string): Promise<ChatSession> => {
      const newSession: ChatSession = {
        id: generateId(),
        title,
        agentId,
        messages: [],
        createdAt: now(),
        updatedAt: now(),
      };
      mockSessions.push(newSession);
      return Promise.resolve(newSession);
    },
    sendMessage: async (sessionId: string, content: string): Promise<ChatMessage> => {
      const session = mockSessions.find(s => s.id === sessionId);
      if (!session) throw new Error('Session not found');

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: now(),
        agentId: session.agentId,
      };
      session.messages.push(userMessage);

      // 模拟 AI 回复
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const agent = mockAgents.find(a => a.id === session.agentId);
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `我是 ${agent?.name || 'AI 助手'}。\n\n您说："${content}"\n\n这是一个模拟回复，实际项目中会调用真实的 AI API。`,
        timestamp: now(),
        agentId: session.agentId,
      };
      session.messages.push(assistantMessage);
      session.updatedAt = now();

      return assistantMessage;
    },
  },

  // Logs
  logs: {
    getList: (filters?: { level?: LogLevel; limit?: number }): Promise<LogEntry[]> => {
      let result = [...mockLogs];
      if (filters?.level) {
        result = result.filter(l => l.level === filters.level);
      }
      if (filters?.limit) {
        result = result.slice(0, filters.limit);
      }
      return Promise.resolve(result.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    },
    getRecentErrors: (limit: number = 10): Promise<LogEntry[]> => {
      return Promise.resolve(
        mockLogs
          .filter(l => ['error', 'fatal'].includes(l.level))
          .slice(0, limit)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      );
    },
  },

  // Notes
  notes: {
    getList: (): Promise<Note[]> => Promise.resolve([...mockNotes].sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      return a.isPinned ? -1 : 1;
    })),
    getById: (id: string): Promise<Note | null> => {
      const note = mockNotes.find(n => n.id === id);
      return Promise.resolve(note ? { ...note } : null);
    },
    create: (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
      const newNote: Note = {
        ...data,
        id: generateId(),
        createdAt: now(),
        updatedAt: now(),
      };
      mockNotes.push(newNote);
      return Promise.resolve(newNote);
    },
    update: (id: string, data: Partial<Note>): Promise<Note | null> => {
      const index = mockNotes.findIndex(n => n.id === id);
      if (index === -1) return Promise.resolve(null);
      mockNotes[index] = { ...mockNotes[index], ...data, updatedAt: now() };
      return Promise.resolve(mockNotes[index]);
    },
    delete: (id: string): Promise<boolean> => {
      const index = mockNotes.findIndex(n => n.id === id);
      if (index === -1) return Promise.resolve(false);
      mockNotes.splice(index, 1);
      return Promise.resolve(true);
    },
  },

  // Settings
  settings: {
    get: (): Promise<Settings> => Promise.resolve({ ...mockSettings }),
    update: (data: Partial<Settings>): Promise<Settings> => {
      Object.assign(mockSettings, data);
      return Promise.resolve({ ...mockSettings });
    },
  },
};

export default mockApi;
