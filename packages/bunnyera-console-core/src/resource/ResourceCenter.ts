/**
 * ResourceCenter 核心实现
 * 资源中心 - 提供资源管理的完整 API
 */

import {
  Resource,
  ResourceType,
  ResourceStatus,
  ResourceStats,
  ResourceFilter,
  ResourceSearchOptions,
  IResourceDataSource,
} from "./types";
import { resourceStore, isExpiringSoon, isExpired } from "./mockData";

/** 资源中心配置选项 */
export interface ResourceCenterOptions {
  /** 自定义数据源（可选） */
  dataSource?: IResourceDataSource;
  /** 即将过期的天数阈值（默认30天） */
  expiringThresholdDays?: number;
}

/**
 * 资源中心类
 * 管理所有资源的查询、统计和操作
 */
export class ResourceCenter {
  private dataSource: IResourceDataSource;
  private expiringThresholdDays: number;

  constructor(options: ResourceCenterOptions = {}) {
    this.dataSource = options.dataSource || this.createDefaultDataSource();
    this.expiringThresholdDays = options.expiringThresholdDays || 30;
  }

  /**
   * 创建默认数据源
   */
  private createDefaultDataSource(): IResourceDataSource {
    return {
      getAll: async () => resourceStore.getAll(),
      getById: async (id: string) => resourceStore.getById(id),
      create: async (resource) => resourceStore.create(resource),
      update: async (id, updates) => resourceStore.update(id, updates),
      delete: async (id: string) => resourceStore.delete(id),
    };
  }

  /**
   * 获取所有资源列表
   * @param filter 可选的过滤条件
   * @returns 资源列表
   */
  async listResources(filter?: ResourceFilter): Promise<Resource[]> {
    let resources = await this.dataSource.getAll();

    if (filter) {
      resources = resources.filter((resource) => {
        // 类型过滤（单类型）
        if (filter.type && resource.type !== filter.type) {
          return false;
        }
        // 类型过滤（多类型）
        if (filter.types && !filter.types.includes(resource.type)) {
          return false;
        }
        // 状态过滤
        if (filter.status && resource.status !== filter.status) {
          return false;
        }
        // 项目ID过滤
        if (filter.projectId && resource.projectId !== filter.projectId) {
          return false;
        }
        // 标签过滤
        if (filter.tags && filter.tags.length > 0) {
          const hasAllTags = filter.tags.every((tag) =>
            resource.tags.includes(tag)
          );
          if (!hasAllTags) return false;
        }
        // 即将过期过滤
        if (filter.expiringSoon) {
          if (!isExpiringSoon(resource.expiresAt)) {
            return false;
          }
        }
        return true;
      });
    }

    return resources;
  }

  /**
   * 根据ID获取资源详情
   * @param id 资源ID
   * @returns 资源详情或 null
   */
  async getResourceById(id: string): Promise<Resource | null> {
    return await this.dataSource.getById(id);
  }

  /**
   * 获取资源统计信息
   * @returns 资源统计摘要
   */
  async getResourceStats(): Promise<ResourceStats> {
    const resources = await this.dataSource.getAll();

    // 初始化统计对象
    const byType: Record<ResourceType, number> = {
      file: 0,
      image: 0,
      video: 0,
      doc: 0,
      domain: 0,
      server: 0,
      database: 0,
      apiKey: 0,
      certificate: 0,
      config: 0,
    };

    const byStatus: Record<ResourceStatus, number> = {
      active: 0,
      inactive: 0,
      expired: 0,
      pending: 0,
    };

    let totalSize = 0;
    let expiringSoon = 0;
    let expired = 0;

    resources.forEach((resource) => {
      // 按类型统计
      byType[resource.type]++;
      // 按状态统计
      byStatus[resource.status]++;
      // 总大小
      if (resource.size) {
        totalSize += resource.size;
      }
      // 过期统计
      if (isExpiringSoon(resource.expiresAt)) {
        expiringSoon++;
      }
      if (isExpired(resource.expiresAt)) {
        expired++;
      }
    });

    return {
      total: resources.length,
      byType,
      byStatus,
      totalSize,
      expiringSoon,
      expired,
    };
  }

  /**
   * 搜索资源
   * @param options 搜索选项
   * @returns 匹配的资源列表
   */
  async searchResources(options: ResourceSearchOptions): Promise<Resource[]> {
    const { query, filter } = options;
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return this.listResources(filter);
    }

    let resources = await this.listResources(filter);

    resources = resources.filter((resource) => {
      // 搜索名称
      if (resource.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      // 搜索描述
      if (
        resource.description &&
        resource.description.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }
      // 搜索标签
      if (
        resource.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      ) {
        return true;
      }
      // 搜索路径
      if (
        resource.path &&
        resource.path.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }
      // 搜索元数据
      if (resource.meta) {
        const metaStr = JSON.stringify(resource.meta).toLowerCase();
        if (metaStr.includes(lowerQuery)) {
          return true;
        }
      }
      return false;
    });

    return resources;
  }

  /**
   * 创建新资源
   * @param resource 资源数据
   * @returns 创建的资源
   */
  async createResource(
    resource: Omit<Resource, "id" | "createdAt" | "updatedAt">
  ): Promise<Resource> {
    return await this.dataSource.create(resource);
  }

  /**
   * 更新资源
   * @param id 资源ID
   * @param updates 更新数据
   * @returns 更新后的资源或 null
   */
  async updateResource(
    id: string,
    updates: Partial<Resource>
  ): Promise<Resource | null> {
    return await this.dataSource.update(id, updates);
  }

  /**
   * 删除资源
   * @param id 资源ID
   * @returns 是否删除成功
   */
  async deleteResource(id: string): Promise<boolean> {
    return await this.dataSource.delete(id);
  }

  /**
   * 按类型分组获取资源
   * @returns 按类型分组的资源映射
   */
  async getResourcesByType(): Promise<Record<ResourceType, Resource[]>> {
    const resources = await this.dataSource.getAll();
    const grouped: Record<ResourceType, Resource[]> = {
      file: [],
      image: [],
      video: [],
      doc: [],
      domain: [],
      server: [],
      database: [],
      apiKey: [],
      certificate: [],
      config: [],
    };

    resources.forEach((resource) => {
      grouped[resource.type].push(resource);
    });

    return grouped;
  }

  /**
   * 获取项目的所有资源
   * @param projectId 项目ID
   * @returns 资源列表
   */
  async getResourcesByProject(projectId: string): Promise<Resource[]> {
    return this.listResources({ projectId });
  }

  /**
   * 获取即将过期的资源
   * @returns 即将过期的资源列表
   */
  async getExpiringResources(): Promise<Resource[]> {
    const resources = await this.dataSource.getAll();
    return resources.filter((resource) =>
      isExpiringSoon(resource.expiresAt, this.expiringThresholdDays)
    );
  }

  /**
   * 切换数据源
   * @param dataSource 新的数据源
   */
  setDataSource(dataSource: IResourceDataSource): void {
    this.dataSource = dataSource;
  }
}

/** 默认资源中心实例 */
export const resourceCenter = new ResourceCenter();
