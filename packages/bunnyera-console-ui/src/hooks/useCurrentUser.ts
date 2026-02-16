import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

// ========================================
// Mock 数据
// ========================================

const MOCK_CURRENT_USER: User = {
  id: '1',
  name: '张三',
  email: 'zhangsan@bunnyera.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  role: 'admin',
  status: 'active',
  createdAt: '2024-01-15T08:00:00Z',
  lastLoginAt: '2024-06-20T10:30:00Z',
};

// ========================================
// Hook 返回类型
// ========================================

export interface UseCurrentUserReturn {
  /** 当前用户 */
  user: User | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 是否是管理员 */
  isAdmin: boolean;
  /** 刷新用户信息 */
  refresh: () => void;
  /** 更新用户信息 */
  updateUser: (data: Partial<User>) => Promise<void>;
  /** 更新头像 */
  updateAvatar: (avatarUrl: string) => Promise<void>;
  /** 修改密码 */
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  /** 退出登录 */
  logout: () => Promise<void>;
  /** 登录 */
  login: (email: string, password: string) => Promise<void>;
  /** 用户偏好设置 */
  preferences: UserPreferences;
  /** 更新偏好设置 */
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

// ========================================
// 用户偏好设置类型
// ========================================

export interface UserPreferences {
  /** 主题 */
  theme: 'light' | 'dark' | 'system';
  /** 语言 */
  language: string;
  /** 侧边栏折叠状态 */
  sidebarCollapsed: boolean;
  /** 通知设置 */
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  /** 显示设置 */
  display: {
    density: 'compact' | 'comfortable' | 'spacious';
    fontSize: 'small' | 'medium' | 'large';
  };
}

// ========================================
// 默认偏好设置
// ========================================

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'zh-CN',
  sidebarCollapsed: false,
  notifications: {
    email: true,
    push: true,
    desktop: false,
  },
  display: {
    density: 'comfortable',
    fontSize: 'medium',
  },
};

// ========================================
// useCurrentUser Hook
// ========================================

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  // 模拟获取当前用户
  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // 从 localStorage 读取偏好设置
      const savedPrefs = localStorage.getItem('bunnyera_preferences');
      if (savedPrefs) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(savedPrefs) });
      }
      
      setUser(MOCK_CURRENT_USER);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // 更新用户信息
  const updateUser = useCallback(async (data: Partial<User>): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  // 更新头像
  const updateAvatar = useCallback(async (avatarUrl: string): Promise<void> => {
    await updateUser({ avatar: avatarUrl });
  }, [updateUser]);

  // 修改密码
  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // 模拟验证旧密码
    if (oldPassword === 'wrong') {
      throw new Error('旧密码不正确');
    }
    
    // 模拟密码修改成功
    console.log('Password changed successfully');
  }, []);

  // 退出登录
  const logout = useCallback(async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(null);
    localStorage.removeItem('bunnyera_token');
    localStorage.removeItem('bunnyera_preferences');
  }, []);

  // 登录
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // 模拟登录验证
      if (email === 'test@bunnyera.com' && password === 'password') {
        setUser(MOCK_CURRENT_USER);
        localStorage.setItem('bunnyera_token', 'mock_token_' + Date.now());
      } else {
        throw new Error('邮箱或密码不正确');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新偏好设置
  const updatePreferences = useCallback((prefs: Partial<UserPreferences>): void => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, ...prefs };
      localStorage.setItem('bunnyera_preferences', JSON.stringify(newPrefs));
      return newPrefs;
    });
  }, []);

  // 计算属性
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    refresh: fetchCurrentUser,
    updateUser,
    updateAvatar,
    changePassword,
    logout,
    login,
    preferences,
    updatePreferences,
  };
}

// ========================================
// useAuth Hook (认证相关)
// ========================================

export interface UseAuthReturn {
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 登录状态 */
  isLoading: boolean;
  /** 登录 */
  login: (credentials: { email: string; password: string }) => Promise<void>;
  /** 注册 */
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  /** 退出登录 */
  logout: () => Promise<void>;
  /** 重置密码 */
  resetPassword: (email: string) => Promise<void>;
  /** 验证 Token */
  verifyToken: () => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 验证 token
  const verifyToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('bunnyera_token');
    if (!token) return false;
    
    // 模拟 token 验证
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }, []);

  // 初始验证
  useEffect(() => {
    verifyToken().then((valid) => {
      setIsAuthenticated(valid);
      setIsLoading(false);
    });
  }, [verifyToken]);

  const login = useCallback(async (credentials: { email: string; password: string }): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      if (credentials.email && credentials.password) {
        localStorage.setItem('bunnyera_token', 'mock_token_' + Date.now());
        setIsAuthenticated(true);
      } else {
        throw new Error('请填写完整的登录信息');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (data.name && data.email && data.password) {
        console.log('User registered:', data);
      } else {
        throw new Error('请填写完整的注册信息');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem('bunnyera_token');
    setIsAuthenticated(false);
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    if (!email) {
      throw new Error('请填写邮箱地址');
    }
    
    console.log('Password reset email sent to:', email);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    verifyToken,
  };
}

// ========================================
// usePermissions Hook (权限相关)
// ========================================

export type Permission = 
  | 'project:read' 
  | 'project:write' 
  | 'project:delete'
  | 'resource:read'
  | 'resource:write'
  | 'resource:delete'
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'settings:read'
  | 'settings:write'
  | 'ai:use'
  | 'ai:manage';

export interface UsePermissionsReturn {
  /** 权限列表 */
  permissions: Permission[];
  /** 检查权限 */
  hasPermission: (permission: Permission) => boolean;
  /** 检查多个权限 */
  hasPermissions: (permissions: Permission[]) => boolean;
  /** 检查任意权限 */
  hasAnyPermission: (permissions: Permission[]) => boolean;
}

export function usePermissions(userRole?: string): UsePermissionsReturn {
  // 根据角色定义权限
  const rolePermissions: Record<string, Permission[]> = {
    admin: [
      'project:read', 'project:write', 'project:delete',
      'resource:read', 'resource:write', 'resource:delete',
      'user:read', 'user:write', 'user:delete',
      'settings:read', 'settings:write',
      'ai:use', 'ai:manage',
    ],
    editor: [
      'project:read', 'project:write',
      'resource:read', 'resource:write',
      'user:read',
      'settings:read',
      'ai:use',
    ],
    viewer: [
      'project:read',
      'resource:read',
      'user:read',
      'ai:use',
    ],
  };

  const permissions = rolePermissions[userRole || 'viewer'] || [];

  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasPermissions = useCallback((perms: Permission[]): boolean => {
    return perms.every((p) => permissions.includes(p));
  }, [permissions]);

  const hasAnyPermission = useCallback((perms: Permission[]): boolean => {
    return perms.some((p) => permissions.includes(p));
  }, [permissions]);

  return {
    permissions,
    hasPermission,
    hasPermissions,
    hasAnyPermission,
  };
}
