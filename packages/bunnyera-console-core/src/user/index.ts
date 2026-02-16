/**
 * UserCenter 模块入口
 * 用户系统 - 导出所有类型和实现
 */

// 类型定义
export type {
  User,
  UserRole,
  UserStatus,
  UserMeta,
  NotificationSettings,
  PermissionAction,
  RolePermissions,
  PermissionContext,
  UserFilter,
  UserSearchOptions,
  IUserDataSource,
  IAuthProvider,
} from "./types";

// 实现类
export { UserCenter, type UserCenterOptions } from "./UserCenter";

// Mock 数据和工具函数
export {
  userStore,
  defaultRolePermissions,
  checkPermission,
  getRolePermissions,
  roleDisplayNames,
  statusDisplayNames,
  permissionDisplayNames,
} from "./mockData";

// 默认实例
export { userCenter } from "./UserCenter";
