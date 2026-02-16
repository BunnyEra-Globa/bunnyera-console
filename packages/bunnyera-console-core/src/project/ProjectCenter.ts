/**
 * ProjectCenter 核心实现
 * 项目中心 - 提供项目管理的完整 API
 */

import {
  Project,
  ProjectHealthSummary,
  ProjectFilter,
  ProjectSearchOptions,
  IProjectDataSource,
} from "./types";
import { projectStore } from "./mockData";

/** 项目中心配置选项 */
export interface ProjectCenterOptions {
  /** 自定义数据源（可选） */
  dataSource?: IProjectDataSource;
}

/**
 * 项目中心类
 * 管理所有项目的查询、统计和操作
 */
export class ProjectCenter {
  private dataSource: IProjectDataSource;

  constructor(options: ProjectCenterOptions = {}) {
    // 使用传入的数据源或默认内存存储
    this.dataSource =
      options.dataSource || this.createDefaultDataSource();
  }

  /**
   * 创建默认数据源（基于内存存储）
   */
  private createDefaultDataSource(): IProjectDataSource {
    return {
      getAll: async () => projectStore.getAll(),
      getById: async (id: string) => projectStore.getById(id),
      create: async (project) => projectStore.create(project),
      update: async (id, updates) => projectStore.update(id, updates),
      delete: async (id: string) => projectStore.delete(id),
    };
  }

  /**
   * 获取所有项目列表
   * @param filter 可选的过滤条件
   * @returns 项目列表（按更新时间倒序）
   */
  async listProjects(filter?: ProjectFilter): Promise<Project[]> {
    let projects = await this.dataSource.getAll();

    if (filter) {
      projects = projects.filter((project) => {
        // 状态过滤
        if (filter.status && project.status !== filter.status) {
          return false;
        }
        // 标签过滤（项目需包含所有指定标签）
        if (filter.tags && filter.tags.length > 0) {
          const hasAllTags = filter.tags.every((tag) =>
            project.tags.includes(tag)
          );
          if (!hasAllTags) return false;
        }
        // 负责人过滤
        if (filter.owner && project.owner !== filter.owner) {
          return false;
        }
        return true;
      });
    }

    return projects;
  }

  /**
   * 根据ID获取项目详情
   * @param id 项目ID
   * @returns 项目详情或 null
   */
  async getProjectById(id: string): Promise<Project | null> {
    return await this.dataSource.getById(id);
  }

  /**
   * 获取项目健康度摘要
   * @returns 健康度统计信息
   */
  async getProjectHealthSummary(): Promise<ProjectHealthSummary> {
    const projects = await this.dataSource.getAll();

    const total = projects.length;
    const healthy = projects.filter((p) => p.status === "healthy").length;
    const warning = projects.filter((p) => p.status === "warning").length;
    const error = projects.filter((p) => p.status === "error").length;
    const paused = projects.filter((p) => p.status === "paused").length;

    // 计算健康度百分比（健康项目占比，暂停项目不计入）
    const activeProjects = total - paused;
    const healthRate =
      activeProjects > 0 ? Math.round((healthy / activeProjects) * 100) : 100;

    return {
      total,
      healthy,
      warning,
      error,
      paused,
      healthRate,
    };
  }

  /**
   * 搜索项目
   * @param options 搜索选项
   * @returns 匹配的项目列表
   */
  async searchProjects(options: ProjectSearchOptions): Promise<Project[]> {
    const { query, includeDescription = true, filter } = options;
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return this.listProjects(filter);
    }

    let projects = await this.listProjects(filter);

    projects = projects.filter((project) => {
      // 搜索名称
      if (project.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // 搜索描述
      if (
        includeDescription &&
        project.description &&
        project.description.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }
      // 搜索标签
      if (
        project.tags.some((tag) =>
          tag.toLowerCase().includes(lowerQuery)
        )
      ) {
        return true;
      }
      // 搜索负责人
      if (project.owner.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // 搜索版本号
      if (project.version.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      return false;
    });

    return projects;
  }

  /**
   * 创建新项目
   * @param project 项目数据（不含ID和时间戳）
   * @returns 创建的项目
   */
  async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<Project> {
    return await this.dataSource.create(project);
  }

  /**
   * 更新项目
   * @param id 项目ID
   * @param updates 更新数据
   * @returns 更新后的项目或 null
   */
  async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<Project | null> {
    return await this.dataSource.update(id, updates);
  }

  /**
   * 删除项目
   * @param id 项目ID
   * @returns 是否删除成功
   */
  async deleteProject(id: string): Promise<boolean> {
    return await this.dataSource.delete(id);
  }

  /**
   * 按状态分组获取项目
   * @returns 按状态分组的项目映射
   */
  async getProjectsByStatus(): Promise<Record<string, Project[]>> {
    const projects = await this.dataSource.getAll();
    const grouped: Record<string, Project[]> = {
      healthy: [],
      warning: [],
      error: [],
      paused: [],
    };

    projects.forEach((project) => {
      grouped[project.status].push(project);
    });

    // 每个组内按更新时间倒序
    Object.keys(grouped).forEach((status) => {
      grouped[status].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
    });

    return grouped;
  }

  /**
   * 获取最近更新的项目
   * @param limit 数量限制（默认10）
   * @returns 最近更新的项目列表
   */
  async getRecentlyUpdated(limit: number = 10): Promise<Project[]> {
    const projects = await this.dataSource.getAll();
    return projects.slice(0, limit);
  }

  /**
   * 切换数据源（用于动态切换存储）
   * @param dataSource 新的数据源
   */
  setDataSource(dataSource: IProjectDataSource): void {
    this.dataSource = dataSource;
  }
}

/** 默认项目中心实例 */
export const projectCenter = new ProjectCenter();
