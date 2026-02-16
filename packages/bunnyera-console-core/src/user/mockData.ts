/**
 * UserCenter Mock 数据
 * 内存内用户存储和权限配置
 */

import {
  User,
  UserRole,
  UserStatus,
  PermissionAction,
  RolePermissions,
} from "./types";

/** 生成唯一ID */
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/** 默认角色权限配置 */
export const defaultRolePermissions: RolePermissions = {
  owner: [
    "project:create",
    "project:read",
    "project:update",
    "project:delete",
    "resource:create",
    "resource:read",
    "resource:update",
    "resource:delete",
    "user:create",
    "user:read",
    "user:update",
    "user:delete",
    "ai:use",
    "ai:manage",
    "log:read",
    "log:clear",
    "setting:read",
    "setting:update",
    "admin:access",
  ],
  admin: [
    "project:create",
    "project:read",
    "project:update",
    "project:delete",
    "resource:create",
    "resource:read",
    "resource:update",
    "resource:delete",
    "user:create",
    "user:read",
    "user:update",
    "ai:use",
    "ai:manage",
    "log:read",
    "setting:read",
    "setting:update",
    "admin:access",
  ],
  member: [
    "project:read",
    "project:update",
    "resource:create",
    "resource:read",
    "resource:update",
    "user:read",
    "ai:use",
    "setting:read",
  ],
};

/** 初始 mock 用户数据 */
const initialUsers: User[] = [
  {
    id: "user_001",
    name: "Admin",
    email: "admin@bunnyera.com",
    role: "owner",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    lastLoginAt: new Date("2024-01-15T08:00:00Z"),
    meta: {
      department: "Engineering",
      title: "Founder",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      theme: "system",
      notifications: {
        email: true,
        push: true,
        sms: false,
        frequency: "immediate",
      },
    },
  },
  {
    id: "user_002",
    name: "张三",
    email: "zhangsan@bunnyera.com",
    role: "admin",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
    createdAt: new Date("2023-03-15T00:00:00Z"),
    lastLoginAt: new Date("2024-01-14T18:30:00Z"),
    meta: {
      department: "Engineering",
      title: "Tech Lead",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      theme: "dark",
      notifications: {
        email: true,
        push: true,
        sms: false,
        frequency: "hourly",
      },
    },
  },
  {
    id: "user_003",
    name: "李四",
    email: "lisi@bunnyera.com",
    role: "member",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
    createdAt: new Date("2023-06-01T00:00:00Z"),
    lastLoginAt: new Date("2024-01-10T09:15:00Z"),
    meta: {
      department: "Product",
      title: "Product Manager",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      theme: "light",
      notifications: {
        email: true,
        push: false,
        sms: false,
        frequency: "daily",
      },
    },
  },
  {
    id: "user_004",
    name: "王五",
    email: "wangwu@bunnyera.com",
    role: "member",
    status: "inactive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
    createdAt: new Date("2023-08-20T00:00:00Z"),
    lastLoginAt: new Date("2023-12-01T14:00:00Z"),
    meta: {
      department: "Design",
      title: "Designer",
      timezone: "Asia/Shanghai",
      language: "zh-CN",
      theme: "system",
      notifications: {
        email: false,
        push: false,
        sms: false,
        frequency: "weekly",
      },
    },
  },
  {
    id: "user_005",
    name: "赵六",
    email: "zhaoliu@bunnyera.com",
    role: "admin",
    status: "suspended",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu",
    createdAt: new Date("2023-05-10T00:00:00Z"),
    meta: {
      department: "Operations",
      title: "DevOps Engineer",
      timezone: "Asia/Shanghai",
      language: "en-US",
      theme: "dark",
    },
  },
];

/** 内存用户存储 */
class UserMemoryStore {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> id

  constructor() {
    initialUsers.forEach((user) => {
      this.users.set(user.id, user);
      this.emailIndex.set(user.email, user.id);
    });
  }

  /** 获取所有用户 */
  getAll(): User[] {
    return Array.from(this.users.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  /** 根据ID获取用户 */
  getById(id: string): User | null {
    return this.users.get(id) || null;
  }

  /** 根据邮箱获取用户 */
  getByEmail(email: string): User | null {
    const id = this.emailIndex.get(email);
    if (id) {
      return this.users.get(id) || null;
    }
    return null;
  }

  /** 创建用户 */
  create(user: Omit<User, "id" | "createdAt">): User {
    const now = new Date();
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: now,
    };
    this.users.set(newUser.id, newUser);
    this.emailIndex.set(newUser.email, newUser.id);
    return newUser;
  }

  /** 更新用户 */
  update(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    // 如果更新邮箱，更新索引
    if (updates.email && updates.email !== user.email) {
      this.emailIndex.delete(user.email);
      this.emailIndex.set(updates.email, id);
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id: user.id,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  /** 删除用户 */
  delete(id: string): boolean {
    const user = this.users.get(id);
    if (user) {
      this.emailIndex.delete(user.email);
      return this.users.delete(id);
    }
    return false;
  }

  /** 清空所有数据 */
  clear(): void {
    this.users.clear();
    this.emailIndex.clear();
  }

  /** 重置为初始数据 */
  reset(): void {
    this.clear();
    initialUsers.forEach((user) => {
      this.users.set(user.id, user);
      this.emailIndex.set(user.email, user.id);
    });
  }
}

/** 单例存储实例 */
export const userStore = new UserMemoryStore();

/** 检查用户是否有权限 */
export function checkPermission(
  user: User,
  action: PermissionAction,
  rolePermissions: RolePermissions = defaultRolePermissions
): boolean {
  // 检查用户状态
  if (user.status !== "active") {
    return false;
  }

  // 获取用户角色的权限列表
  const permissions = rolePermissions[user.role];
  if (!permissions) {
    return false;
  }

  return permissions.includes(action);
}

/** 获取角色的所有权限 */
export function getRolePermissions(
  role: UserRole,
  rolePermissions: RolePermissions = defaultRolePermissions
): PermissionAction[] {
  return rolePermissions[role] || [];
}

/** 角色显示名称 */
export const roleDisplayNames: Record<UserRole, string> = {
  owner: "所有者",
  admin: "管理员",
  member: "成员",
};

/** 状态显示名称 */
export const statusDisplayNames: Record<UserStatus, string> = {
  active: "活跃",
  inactive: "未激活",
  suspended: "已暂停",
};

/** 权限动作显示名称 */
export const permissionDisplayNames: Record<PermissionAction, string> = {
  "project:create": "创建项目",
  "project:read": "查看项目",
  "project:update": "更新项目",
  "project:delete": "删除项目",
  "resource:create": "创建资源",
  "resource:read": "查看资源",
  "resource:update": "更新资源",
  "resource:delete": "删除资源",
  "user:create": "创建用户",
  "user:read": "查看用户",
  "user:update": "更新用户",
  "user:delete": "删除用户",
  "ai:use": "使用 AI",
  "ai:manage": "管理 AI",
  "log:read": "查看日志",
  "log:clear": "清空日志",
  "setting:read": "查看设置",
  "setting:update": "更新设置",
  "admin:access": "访问管理后台",
};
