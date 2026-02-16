/**
 * ResourceCenter 模块入口
 * 资源中心 - 导出所有类型和实现
 */

// 类型定义
export type {
  Resource,
  ResourceType,
  ResourceStatus,
  ResourceMeta,
  DnsRecord,
  ResourceStats,
  ResourceFilter,
  ResourceSearchOptions,
  IResourceDataSource,
} from "./types";

// 实现类
export { ResourceCenter, type ResourceCenterOptions } from "./ResourceCenter";

// Mock 数据和工具函数
export {
  resourceStore,
  formatFileSize,
  isExpiringSoon,
  isExpired,
} from "./mockData";

// 默认实例
export { resourceCenter } from "./ResourceCenter";
