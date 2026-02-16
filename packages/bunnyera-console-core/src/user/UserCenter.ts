/**
 * UserCenter 核心实现
 * 用户系统 - 提供用户管理和权限控制的完整 API
 */

import {
  User,
  UserRole,
  UserStatus,
  PermissionAction,
  PermissionContext,
  UserFilter,
  UserSearchOptions,
  IUserDataSource,
  RolePermissions,
} from "./types";
import {
  userStore,
  checkPermission,
  defaultRolePermissions,
} from "./mockData";

/** 用户中心配置选项 */
export interface UserCenterOptions {
  /** 自定义数据源 */
  dataSource?: IUserDataSource;
  /** 自定义权限配置 */
  rolePermissions?: RolePermissions;
  /** 当前用户ID（用于模拟登录） */
  currentUserId?: string;
}

/**
 * 用户中心类
 * 管理用户和权限
 */
export class UserCenter {
  private dataSource: IUserDataSource;
  private rolePermissions: RolePermissions;
  private currentUserId: string | null;

  constructor(options: UserCenterOptions = {}) {
    this.dataSource = options.dataSource || this.createDefaultDataSource();
    this.rolePermissions = options.rolePermissions || defaultRolePermissions;
    this.currentUserId = options.currentUserId || null;
  }

  /**
   * 创建默认数据源
   */
  private createDefaultDataSource(): IUserDataSource {
    return {
      getAll: async () => userStore.getAll(),
      getById: async (id: string) => userStore.getById(id),
      getByEmail: async (email: string) => userStore.getByEmail(email),
      create: async (user) => userStore.create(user),
      update: async (id, updates) => userStore.update(id, updates),
      delete: async (id: string) => userStore.delete(id),
    };
  }

  // ==================== 当前用户 API ====================

  /**
   * 设置当前用户ID
   * @param userId 用户ID
   */
  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
  }

  /**
   * 获取当前登录用户
   * @returns 当前用户或 null
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.currentUserId) {
      return null;
    }
    return await this.dataSource.getById(this.currentUserId);
  }

  // ==================== 用户管理 API ====================

  /**
   * 获取所有用户
   * @param filter 过滤条件
   * @returns 用户列表
   */
  async listUsers(filter?: UserFilter): Promise<User[]> {
    let users = await this.dataSource.getAll();

    if (filter) {
      users = users.filter((user) => {
        if (filter.role && user.role !== filter.role) {
          return false;
        }
        if (filter.status && user.status !== filter.status) {
          return false;
        }
        if (
          filter.department &&
          user.meta?.department !== filter.department
        ) {
          return false;
        }
        return true;
      });
    }

    return users;
  }

  /**
   * 根据ID获取用户
   * @param id 用户ID
   * @returns 用户详情或 null
   */
  async getUserById(id: string): Promise<User | null> {
    return await this.dataSource.getById(id);
  }

  /**
   * 根据邮箱获取用户
   * @param email 用户邮箱
   * @returns 用户详情或 null
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.dataSource.getByEmail(email);
  }

  /**
   * 创建用户
   * @param user 用户数据
   * @returns 创建的用户
   */
  async createUser(
    user: Omit<User, "id" | "createdAt">
  ): Promise<User> {
    return await this.dataSource.create(user);
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param updates 更新数据
   * @returns 更新后的用户或 null
   */
  async updateUser(
    id: string,
    updates: Partial<User>
  ): Promise<User | null> {
    return await this.dataSource.update(id, updates);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 是否删除成功
   */
  async deleteUser(id: string): Promise<boolean> {
    return await this.dataSource.delete(id);
  }

  /**
   * 搜索用户
   * @param options 搜索选项
   * @returns 匹配的用户列表
   */
  async searchUsers(options: UserSearchOptions): Promise<User[]> {
    const { query, filter } = options;
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return this.listUsers(filter);
    }

    let users = await this.listUsers(filter);

    users = users.filter((user) => {
      // 搜索名称
      if (user.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // 搜索邮箱
      if (user.email.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // 搜索部门
      if (
        user.meta?.department &&
        user.meta.department.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }
      // 搜索职位
      if (
        user.meta?.title &&
        user.meta.title.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }
      return false;
    });

    return users;
  }

  // ==================== 权限管理 API ====================

  /**
   * 检查用户是否有权限
   * @param user 用户
   * @param action 权限动作
   * @param context 权限上下文（可选）
   * @returns 是否有权限
   */
  hasPermission(
    user: User,
    action: PermissionAction,
    context?: PermissionContext
  ): boolean {
    // 基础权限检查
    const hasBasicPermission = checkPermission(
      user,
      action,
      this.rolePermissions
    );

    if (!hasBasicPermission) {
      return false;
    }

    // 上下文相关的额外检查
    if (context) {
      // 用户不能删除自己
      if (action === "user:delete" && context.targetUserId === user.id) {
        return false;
      }

      // 只有 owner 可以删除其他 owner
      if (action === "user:delete" && context.targetUserId) {
        const targetUser = userStore.getById(context.targetUserId);
        if (targetUser?.role === "owner" && user.role !== "owner") {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * 检查当前用户是否有权限
   * @param action 权限动作
   * @param context 权限上下文（可选）
   * @returns 是否有权限
   */
  async hasPermissionAsync(
    action: PermissionAction,
    context?: PermissionContext
  ): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user) {
      return false;
    }
    return this.hasPermission(user, action, context);
  }

  /**
   * 获取用户的所有权限
   * @param user 用户
   * @returns 权限列表
   */
  getUserPermissions(user: User): PermissionAction[] {
    return this.rolePermissions[user.role] || [];
  }

  /**
   * 获取角色的所有权限
   * @param role 角色
   * @returns 权限列表
   */
  getRolePermissions(role: UserRole): PermissionAction[] {
    return this.rolePermissions[role] || [];
  }

  /**
   * 检查用户是否可以访问指定项目
   * @param user 用户
   * @param projectId 项目ID
   * @returns 是否可以访问
   */
  canAccessProject(user: User, _projectId: string): boolean {
    // owner 和 admin 可以访问所有项目
    if (user.role === "owner" || user.role === "admin") {
      return true;
    }
    // member 需要具体授权（这里简化处理，实际应该检查项目成员列表）
    return this.hasPermission(user, "project:read");
  }

  /**
   * 检查用户是否可以管理指定项目
   * @param user 用户
   * @param _projectId 项目ID（预留参数）
   * @returns 是否可以管理
   */
  canManageProject(user: User, _projectId: string): boolean {
    return this.hasPermission(user, "project:update");
  }

  // ==================== 统计 API ====================

  /**
   * 获取用户统计信息
   * @returns 用户统计
   */
  async getUserStats(): Promise<{
    total: number;
    byRole: Record<UserRole, number>;
    byStatus: Record<UserStatus, number>;
    activeToday: number;
  }> {
    const users = await this.dataSource.getAll();

    const byRole: Record<UserRole, number> = {
      owner: 0,
      admin: 0,
      member: 0,
    };

    const byStatus: Record<UserStatus, number> = {
      active: 0,
      inactive: 0,
      suspended: 0,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let activeToday = 0;

    users.forEach((user) => {
      byRole[user.role]++;
      byStatus[user.status]++;

      if (user.lastLoginAt && user.lastLoginAt >= today) {
        activeToday++;
      }
    });

    return {
      total: users.length,
      byRole,
      byStatus,
      activeToday,
    };
  }

  // ==================== 配置管理 ====================

  /**
   * 切换数据源
   * @param dataSource 新的数据源
   */
  setDataSource(dataSource: IUserDataSource): void {
    this.dataSource = dataSource;
  }

  /**
   * 设置权限配置
   * @param permissions 权限配置
   */
  setRolePermissions(permissions: RolePermissions): void {
    this.rolePermissions = permissions;
  }
}

/** 默认用户中心实例 */
export const userCenter = new UserCenter();
