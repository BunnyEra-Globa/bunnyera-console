/**
 * ResourceCenter 类型定义
 * 资源中心 - 管理所有企业资源
 */

/** 资源类型 */
export type ResourceType =
  | "file"
  | "image"
  | "video"
  | "doc"
  | "domain"
  | "server"
  | "database"
  | "apiKey"
  | "certificate"
  | "config";

/** 资源状态 */
export type ResourceStatus = "active" | "inactive" | "expired" | "pending";

/** 资源类型定义 */
export interface Resource {
  /** 资源唯一标识 */
  id: string;
  /** 资源名称 */
  name: string;
  /** 资源类型 */
  type: ResourceType;
  /** 资源状态 */
  status: ResourceStatus;
  /** 资源大小（字节，文件类资源适用） */
  size?: number;
  /** 资源路径/URL */
  path?: string;
  /** 关联项目ID */
  projectId?: string;
  /** 资源标签 */
  tags: string[];
  /** 创建时间 */
  createdAt: Date;
  /** 最后更新时间 */
  updatedAt: Date;
  /** 过期时间（证书、API Key等适用） */
  expiresAt?: Date;
  /** 资源描述 */
  description?: string;
  /** 元数据（各类型资源的扩展信息） */
  meta?: ResourceMeta;
}

/** 资源元数据（按类型扩展） */
export interface ResourceMeta {
  // 文件类资源
  mimeType?: string;
  extension?: string;
  // 服务器类资源
  hostname?: string;
  ip?: string;
  port?: number;
  region?: string;
  // 数据库类资源
  dbType?: "mysql" | "postgres" | "mongodb" | "redis" | "other";
  connectionString?: string;
  // 域名类资源
  registrar?: string;
  dnsRecords?: DnsRecord[];
  sslExpiry?: Date;
  // API Key 类资源
  keyPrefix?: string;
  permissions?: string[];
  rateLimit?: number;
  // 通用
  [key: string]: unknown;
}

/** DNS 记录 */
export interface DnsRecord {
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS";
  name: string;
  value: string;
  ttl: number;
}

/** 资源统计信息 */
export interface ResourceStats {
  /** 总资源数 */
  total: number;
  /** 按类型统计 */
  byType: Record<ResourceType, number>;
  /** 按状态统计 */
  byStatus: Record<ResourceStatus, number>;
  /** 总存储大小（字节） */
  totalSize: number;
  /** 即将过期的资源数 */
  expiringSoon: number;
  /** 已过期资源数 */
  expired: number;
}

/** 资源过滤条件 */
export interface ResourceFilter {
  /** 按类型过滤 */
  type?: ResourceType;
  /** 按类型列表过滤 */
  types?: ResourceType[];
  /** 按状态过滤 */
  status?: ResourceStatus;
  /** 按项目ID过滤 */
  projectId?: string;
  /** 按标签过滤 */
  tags?: string[];
  /** 只显示即将过期的 */
  expiringSoon?: boolean;
}

/** 资源搜索选项 */
export interface ResourceSearchOptions {
  /** 搜索关键词 */
  query: string;
  /** 过滤条件 */
  filter?: ResourceFilter;
}

/** 资源数据源接口 - 预留扩展点 */
export interface IResourceDataSource {
  /** 获取所有资源 */
  getAll(): Promise<Resource[]>;
  /** 根据ID获取资源 */
  getById(id: string): Promise<Resource | null>;
  /** 创建资源 */
  create(resource: Omit<Resource, "id" | "createdAt" | "updatedAt">): Promise<Resource>;
  /** 更新资源 */
  update(id: string, updates: Partial<Resource>): Promise<Resource | null>;
  /** 删除资源 */
  delete(id: string): Promise<boolean>;
}
