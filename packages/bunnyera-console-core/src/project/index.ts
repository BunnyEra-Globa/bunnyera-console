/**
 * ProjectCenter 模块入口
 * 项目中心 - 导出所有类型和实现
 */

// 类型定义
export type {
  Project,
  ProjectStatus,
  ProjectHealthSummary,
  ProjectFilter,
  ProjectSearchOptions,
  IProjectDataSource,
} from "./types";

// 实现类
export { ProjectCenter, type ProjectCenterOptions } from "./ProjectCenter";

// Mock 数据（开发测试用）
export { projectStore, getStatusPriority } from "./mockData";

// 默认实例
export { projectCenter } from "./ProjectCenter";
