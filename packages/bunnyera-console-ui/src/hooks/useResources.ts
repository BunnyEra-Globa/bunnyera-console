import { useState, useEffect, useCallback } from 'react';
import type { Resource, User } from '../types';

// ========================================
// Mock 数据
// ========================================

const MOCK_OWNER: User = {
  id: '1',
  name: '张三',
  email: 'zhangsan@bunnyera.com',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-15T08:00:00Z',
};

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    name: '项目文档',
    type: 'folder',
    owner: MOCK_OWNER,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-06-20T10:30:00Z',
    tags: ['docs', 'project'],
  },
  {
    id: '2',
    name: '设计稿.fig',
    type: 'file',
    size: 1024 * 1024 * 25, // 25MB
    mimeType: 'application/figma',
    owner: MOCK_OWNER,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-06-18T16:45:00Z',
    tags: ['design', 'figma'],
    thumbnail: 'https://placehold.co/200x150/6366f1/ffffff?text=Figma',
  },
  {
    id: '3',
    name: 'API 文档.md',
    type: 'document',
    size: 1024 * 50, // 50KB
    mimeType: 'text/markdown',
    url: '/docs/api.md',
    owner: MOCK_OWNER,
    createdAt: '2024-03-05T11:20:00Z',
    updatedAt: '2024-06-15T09:30:00Z',
    tags: ['api', 'documentation'],
  },
  {
    id: '4',
    name: 'GitHub 仓库',
    type: 'link',
    url: 'https://github.com/bunnyera/console',
    owner: MOCK_OWNER,
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
    tags: ['github', 'source'],
  },
  {
    id: '5',
    name: '演示视频.mp4',
    type: 'file',
    size: 1024 * 1024 * 150, // 150MB
    mimeType: 'video/mp4',
    owner: MOCK_OWNER,
    createdAt: '2024-04-12T10:00:00Z',
    updatedAt: '2024-05-20T15:30:00Z',
    tags: ['video', 'demo'],
    thumbnail: 'https://placehold.co/200x150/8b5cf6/ffffff?text=Video',
  },
  {
    id: '6',
    name: '源代码',
    type: 'folder',
    parentId: '1',
    owner: MOCK_OWNER,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-06-19T14:20:00Z',
    tags: ['code', 'source'],
  },
  {
    id: '7',
    name: 'main.tsx',
    type: 'file',
    parentId: '6',
    size: 1024 * 5, // 5KB
    mimeType: 'text/typescript',
    owner: MOCK_OWNER,
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-06-19T14:20:00Z',
    tags: ['code', 'typescript'],
  },
];

// ========================================
// Hook 返回类型
// ========================================

export interface UseResourcesReturn {
  /** 资源列表 */
  resources: Resource[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => void;
  /** 获取单个资源 */
  getResource: (id: string) => Resource | undefined;
  /** 获取子资源 */
  getChildren: (parentId: string | null) => Resource[];
  /** 创建资源 */
  createResource: (data: Partial<Resource>) => Promise<Resource>;
  /** 更新资源 */
  updateResource: (id: string, data: Partial<Resource>) => Promise<Resource>;
  /** 删除资源 */
  deleteResource: (id: string) => Promise<void>;
  /** 按类型筛选 */
  filterByType: (type: Resource['type']) => Resource[];
  /** 搜索资源 */
  searchResources: (query: string) => Resource[];
  /** 获取面包屑路径 */
  getBreadcrumb: (id: string) => Resource[];
  /** 总大小 */
  totalSize: number;
}

// ========================================
// useResources Hook
// ========================================

export function useResources(): UseResourcesReturn {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 模拟获取数据
  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setResources(MOCK_RESOURCES);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch resources'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // 获取单个资源
  const getResource = useCallback((id: string): Resource | undefined => {
    return resources.find((r) => r.id === id);
  }, [resources]);

  // 获取子资源
  const getChildren = useCallback((parentId: string | null): Resource[] => {
    return resources.filter((r) =>
      parentId === null ? !r.parentId : r.parentId === parentId
    );
  }, [resources]);

  // 创建资源
  const createResource = useCallback(async (data: Partial<Resource>): Promise<Resource> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const newResource: Resource = {
      id: String(Date.now()),
      name: data.name || 'New Resource',
      type: data.type || 'file',
      owner: data.owner || MOCK_OWNER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.tags || [],
      ...data,
    };
    
    setResources((prev) => [newResource, ...prev]);
    return newResource;
  }, []);

  // 更新资源
  const updateResource = useCallback(async (id: string, data: Partial<Resource>): Promise<Resource> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const resourceIndex = resources.findIndex((r) => r.id === id);
    if (resourceIndex === -1) {
      throw new Error(`Resource with id ${id} not found`);
    }
    
    const updatedResource = {
      ...resources[resourceIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    setResources((prev) =>
      prev.map((r) => (r.id === id ? updatedResource : r))
    );
    
    return updatedResource;
  }, [resources]);

  // 删除资源
  const deleteResource = useCallback(async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setResources((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // 按类型筛选
  const filterByType = useCallback((type: Resource['type']): Resource[] => {
    return resources.filter((r) => r.type === type);
  }, [resources]);

  // 搜索资源
  const searchResources = useCallback((query: string): Resource[] => {
    const lowerQuery = query.toLowerCase();
    return resources.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }, [resources]);

  // 获取面包屑路径
  const getBreadcrumb = useCallback((id: string): Resource[] => {
    const path: Resource[] = [];
    let currentId: string | undefined = id;
    
    while (currentId) {
      const resource = resources.find((r) => r.id === currentId);
      if (resource) {
        path.unshift(resource);
        currentId = resource.parentId;
      } else {
        break;
      }
    }
    
    return path;
  }, [resources]);

  // 总大小
  const totalSize = resources.reduce((sum, r) => sum + (r.size || 0), 0);

  return {
    resources,
    loading,
    error,
    refresh: fetchResources,
    getResource,
    getChildren,
    createResource,
    updateResource,
    deleteResource,
    filterByType,
    searchResources,
    getBreadcrumb,
    totalSize,
  };
}

// ========================================
// useResource Hook (单个资源)
// ========================================

export interface UseResourceReturn {
  /** 资源 */
  resource: Resource | null;
  /** 子资源 */
  children: Resource[];
  /** 面包屑路径 */
  breadcrumb: Resource[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => void;
  /** 更新资源 */
  update: (data: Partial<Resource>) => Promise<void>;
  /** 删除资源 */
  remove: () => Promise<void>;
  /** 创建子资源 */
  createChild: (data: Partial<Resource>) => Promise<Resource>;
}

export function useResource(id: string | null): UseResourceReturn {
  const {
    getResource,
    getChildren,
    getBreadcrumb,
    loading,
    error,
    refresh,
    updateResource,
    deleteResource,
    createResource,
  } = useResources();

  const [resource, setResource] = useState<Resource | null>(null);
  const [children, setChildren] = useState<Resource[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<Resource[]>([]);

  useEffect(() => {
    if (id) {
      const r = getResource(id);
      setResource(r || null);
      setChildren(getChildren(id));
      setBreadcrumb(getBreadcrumb(id));
    } else {
      setResource(null);
      setChildren(getChildren(null));
      setBreadcrumb([]);
    }
  }, [id, getResource, getChildren, getBreadcrumb]);

  const update = useCallback(
    async (data: Partial<Resource>) => {
      if (!id) return;
      await updateResource(id, data);
      setResource((prev) => (prev ? { ...prev, ...data } : null));
    },
    [id, updateResource]
  );

  const remove = useCallback(async () => {
    if (!id) return;
    await deleteResource(id);
  }, [id, deleteResource]);

  const createChild = useCallback(
    async (data: Partial<Resource>) => {
      return createResource({ ...data, parentId: id });
    },
    [id, createResource]
  );

  return {
    resource,
    children,
    breadcrumb,
    loading,
    error,
    refresh,
    update,
    remove,
    createChild,
  };
}
