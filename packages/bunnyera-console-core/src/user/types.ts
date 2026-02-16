/**
 * UserCenter 类型定义
 * 用户系统 - 管理用户和权限
 */

/** 用户角色 */
export type UserRole = "owner" | "admin" | "member";

/** 用户状态 */
export type UserStatus = "active" | "inactive" | "suspended";

/** 用户类型定义 */
export interface User {
  /** 用户唯一标识 */
  id: string;
  /** 用户名称 */
  name: string;
  /** 用户邮箱 */
  email: string;
  /** 用户角色 */
  role: UserRole;
  /** 用户状态 */
  status: UserStatus;
  /** 头像URL */
  avatar?: string;
  /** 创建时间 */
  createdAt: Date;
  /** 最后登录时间 */
  lastLoginAt?: Date;
  /** 元数据 */
  meta?: UserMeta;
}

/** 用户元数据 */
export interface UserMeta {
  /** 部门 */
  department?: string;
  /** 职位 */
  title?: string;
  /** 电话 */
  phone?: string;
  /** 时区 */
  timezone?: string;
  /** 语言 */
  language?: string;
  /** 主题偏好 */
  theme?: "light" | "dark" | "system";
  /** 通知设置 */
  notifications?: NotificationSettings;
  /** 其他自定义数据 */
  [key: string]: unknown;
}

/** 通知设置 */
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  /** 通知频率 */
  frequency: "immediate" | "hourly" | "daily" | "weekly";
}

/** 权限动作 */
export type PermissionAction =
  | "project:create"
  | "project:read"
  | "project:update"
  | "project:delete"
  | "resource:create"
  | "resource:read"
  | "resource:update"
  | "resource:delete"
  | "user:create"
  | "user:read"
  | "user:update"
  | "user:delete"
  | "ai:use"
  | "ai:manage"
  | "log:read"
  | "log:clear"
  | "setting:read"
  | "setting:update"
  | "admin:access";

/** 角色权限映射 */
export type RolePermissions = Record<UserRole, PermissionAction[]>;

/** 权限检查上下文 */
export interface PermissionContext {
  /** 目标项目ID */
  projectId?: string;
  /** 目标资源ID */
  resourceId?: string;
  /** 目标用户ID */
  targetUserId?: string;
  /** 其他上下文数据 */
  [key: string]: unknown;
}

/** 用户过滤条件 */
export interface UserFilter {
  /** 按角色过滤 */
  role?: UserRole;
  /** 按状态过滤 */
  status?: UserStatus;
  /** 按部门过滤 */
  department?: string;
}

/** 用户搜索选项 */
export interface UserSearchOptions {
  /** 搜索关键词 */
  query: string;
  /** 过滤条件 */
  filter?: UserFilter;
}

/** 用户数据源接口 - 预留扩展点 */
export interface IUserDataSource {
  /** 获取所有用户 */
  getAll(): Promise<User[]>;
  /** 根据ID获取用户 */
  getById(id: string): Promise<User | null>;
  /** 根据邮箱获取用户 */
  getByEmail(email: string): Promise<User | null>;
  /** 创建用户 */
  create(user: Omit<User, "id" | "createdAt">): Promise<User>;
  /** 更新用户 */
  update(id: string, updates: Partial<User>): Promise<User | null>;
  /** 删除用户 */
  delete(id: string): Promise<boolean>;
}

/** 认证接口 - 预留扩展点 */
export interface IAuthProvider {
  /** 登录 */
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  /** 登出 */
  logout(token: string): Promise<void>;
  /** 验证令牌 */
  verifyToken(token: string): Promise<User | null>;
  /** 刷新令牌 */
  refreshToken(token: string): Promise<string>;
}
