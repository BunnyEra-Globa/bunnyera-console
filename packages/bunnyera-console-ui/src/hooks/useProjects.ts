import { useState, useEffect, useCallback } from 'react';
import type { Project, User } from '../types';

// ========================================
// Mock 数据
// ========================================

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@bunnyera.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@bunnyera.com',
    role: 'editor',
    status: 'active',
    createdAt: '2024-02-20T09:30:00Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@bunnyera.com',
    role: 'viewer',
    status: 'inactive',
    createdAt: '2024-03-10T14:15:00Z',
  },
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'BunnyEra Console',
    description: 'BunnyEra 控制台项目，提供统一的管理界面',
    status: 'active',
    owner: MOCK_USERS[0],
    members: [MOCK_USERS[0], MOCK_USERS[1]],
    tags: ['react', 'typescript', 'dashboard'],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-06-20T10:30:00Z',
    progress: 75,
  },
  {
    id: '2',
    name: 'AI Hub Platform',
    description: 'AI 模型管理与推理服务平台',
    status: 'active',
    owner: MOCK_USERS[1],
    members: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[2]],
    tags: ['ai', 'python', 'ml'],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-06-18T16:45:00Z',
    progress: 60,
  },
  {
    id: '3',
    name: 'Data Pipeline',
    description: '数据处理与 ETL 流程自动化',
    status: 'draft',
    owner: MOCK_USERS[0],
    members: [MOCK_USERS[0]],
    tags: ['data', 'etl', 'automation'],
    createdAt: '2024-03-05T11:20:00Z',
    updatedAt: '2024-03-05T11:20:00Z',
    progress: 10,
  },
  {
    id: '4',
    name: 'Mobile App v2',
    description: '移动端应用第二版开发',
    status: 'archived',
    owner: MOCK_USERS[2],
    members: [MOCK_USERS[1], MOCK_USERS[2]],
    tags: ['mobile', 'flutter', 'ios', 'android'],
    createdAt: '2023-08-10T13:00:00Z',
    updatedAt: '2024-01-30T15:00:00Z',
    progress: 100,
  },
  {
    id: '5',
    name: 'API Gateway',
    description: '统一 API 网关与微服务治理',
    status: 'active',
    owner: MOCK_USERS[0],
    members: [MOCK_USERS[0], MOCK_USERS[1]],
    tags: ['api', 'gateway', 'microservices'],
    createdAt: '2024-04-12T10:00:00Z',
    updatedAt: '2024-06-15T09:30:00Z',
    progress: 45,
  },
];

// ========================================
// Hook 返回类型
// ========================================

export interface UseProjectsReturn {
  /** 项目列表 */
  projects: Project[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => void;
  /** 获取单个项目 */
  getProject: (id: string) => Project | undefined;
  /** 创建项目 */
  createProject: (data: Partial<Project>) => Promise<Project>;
  /** 更新项目 */
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  /** 删除项目 */
  deleteProject: (id: string) => Promise<void>;
  /** 按状态筛选 */
  filterByStatus: (status: Project['status']) => Project[];
  /** 搜索项目 */
  searchProjects: (query: string) => Project[];
}

// ========================================
// useProjects Hook
// ========================================

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 模拟获取数据
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProjects(MOCK_PROJECTS);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 获取单个项目
  const getProject = useCallback((id: string): Project | undefined => {
    return projects.find((p) => p.id === id);
  }, [projects]);

  // 创建项目
  const createProject = useCallback(async (data: Partial<Project>): Promise<Project> => {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newProject: Project = {
      id: String(Date.now()),
      name: data.name || 'New Project',
      description: data.description || '',
      status: data.status || 'draft',
      owner: data.owner || MOCK_USERS[0],
      members: data.members || [MOCK_USERS[0]],
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
    };
    
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }, []);

  // 更新项目
  const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<Project> => {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const projectIndex = projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const updatedProject = {
      ...projects[projectIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? updatedProject : p))
    );
    
    return updatedProject;
  }, [projects]);

  // 删除项目
  const deleteProject = useCallback(async (id: string): Promise<void> => {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // 按状态筛选
  const filterByStatus = useCallback((status: Project['status']): Project[] => {
    return projects.filter((p) => p.status === status);
  }, [projects]);

  // 搜索项目
  const searchProjects = useCallback((query: string): Project[] => {
    const lowerQuery = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }, [projects]);

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    filterByStatus,
    searchProjects,
  };
}

// ========================================
// useProject Hook (单个项目)
// ========================================

export interface UseProjectReturn {
  /** 项目 */
  project: Project | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => void;
  /** 更新项目 */
  update: (data: Partial<Project>) => Promise<void>;
  /** 删除项目 */
  remove: () => Promise<void>;
}

export function useProject(id: string): UseProjectReturn {
  const { getProject, loading, error, refresh, updateProject, deleteProject } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = getProject(id);
    setProject(p || null);
  }, [id, getProject]);

  const update = useCallback(
    async (data: Partial<Project>) => {
      await updateProject(id, data);
      setProject((prev) => (prev ? { ...prev, ...data } : null));
    },
    [id, updateProject]
  );

  const remove = useCallback(async () => {
    await deleteProject(id);
  }, [id, deleteProject]);

  return {
    project,
    loading,
    error,
    refresh,
    update,
    remove,
  };
}
