/**
 * ProjectCenter 类型定义
 * 项目中心 - 管理所有项目信息
 */

/** 项目状态 */
export type ProjectStatus = "healthy" | "warning" | "error" | "paused";

/** 项目类型定义 */
export interface Project {
  /** 项目唯一标识 */
  id: string;
  /** 项目名称 */
  name: string;
  /** 项目状态 */
  status: ProjectStatus;
  /** 当前版本 */
  version: string;
  /** 项目负责人 */
  owner: string;
  /** 项目标签 */
  tags: string[];
  /** 最后更新时间 */
  updatedAt: Date;
  /** 创建时间 */
  createdAt: Date;
  /** 项目描述 */
  description?: string;
  /** 项目URL */
  url?: string;
  /** 关联资源ID列表 */
  resourceIds?: string[];
}

/** 项目健康度摘要 */
export interface ProjectHealthSummary {
  /** 总项目数 */
  total: number;
  /** 健康项目数 */
  healthy: number;
  /** 警告项目数 */
  warning: number;
  /** 错误项目数 */
  error: number;
  /** 暂停项目数 */
  paused: number;
  /** 健康度百分比 (0-100) */
  healthRate: number;
}

/** 项目查询过滤条件 */
export interface ProjectFilter {
  /** 按状态过滤 */
  status?: ProjectStatus;
  /** 按标签过滤 */
  tags?: string[];
  /** 按负责人过滤 */
  owner?: string;
}

/** 项目搜索选项 */
export interface ProjectSearchOptions {
  /** 搜索关键词 */
  query: string;
  /** 是否包含描述 */
  includeDescription?: boolean;
  /** 过滤条件 */
  filter?: ProjectFilter;
}

/** 项目数据源接口 - 预留扩展点 */
export interface IProjectDataSource {
  /** 获取所有项目 */
  getAll(): Promise<Project[]>;
  /** 根据ID获取项目 */
  getById(id: string): Promise<Project | null>;
  /** 创建项目 */
  create(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project>;
  /** 更新项目 */
  update(id: string, updates: Partial<Project>): Promise<Project | null>;
  /** 删除项目 */
  delete(id: string): Promise<boolean>;
}
