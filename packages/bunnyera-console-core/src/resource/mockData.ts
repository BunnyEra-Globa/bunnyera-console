/**
 * ResourceCenter Mock 数据源
 * 内存内数据存储，后续可替换为真实数据库
 */

import { Resource } from "./types";

/** 生成唯一ID */
function generateId(): string {
  return `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/** 格式化文件大小 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/** 初始 mock 资源数据 */
const initialResources: Resource[] = [
  // 文件类资源
  {
    id: "res_001",
    name: "project-specs.pdf",
    type: "file",
    status: "active",
    size: 2548000,
    path: "/documents/specs/project-specs.pdf",
    projectId: "proj_001",
    tags: ["specification", "pdf"],
    createdAt: new Date("2023-06-05T10:00:00Z"),
    updatedAt: new Date("2023-06-05T10:00:00Z"),
    description: "项目规格说明书",
    meta: {
      mimeType: "application/pdf",
      extension: "pdf",
    },
  },
  {
    id: "res_002",
    name: "architecture-diagram.png",
    type: "image",
    status: "active",
    size: 1256000,
    path: "/images/architecture-diagram.png",
    projectId: "proj_001",
    tags: ["diagram", "architecture"],
    createdAt: new Date("2023-06-10T14:30:00Z"),
    updatedAt: new Date("2023-08-15T09:00:00Z"),
    description: "系统架构图",
    meta: {
      mimeType: "image/png",
      extension: "png",
      width: 1920,
      height: 1080,
    },
  },
  // AI 项目资源
  {
    id: "res_003",
    name: "model-training-data.zip",
    type: "file",
    status: "active",
    size: 1073741824, // 1GB
    path: "/data/training/model-training-data.zip",
    projectId: "proj_002",
    tags: ["ml", "dataset", "training"],
    createdAt: new Date("2023-09-20T08:00:00Z"),
    updatedAt: new Date("2023-10-01T12:00:00Z"),
    description: "模型训练数据集",
    meta: {
      mimeType: "application/zip",
      extension: "zip",
    },
  },
  {
    id: "res_004",
    name: "demo-video.mp4",
    type: "video",
    status: "active",
    size: 52428800, // 50MB
    path: "/videos/demo-video.mp4",
    projectId: "proj_002",
    tags: ["demo", "presentation"],
    createdAt: new Date("2023-10-15T16:00:00Z"),
    updatedAt: new Date("2023-10-15T16:00:00Z"),
    description: "AI 功能演示视频",
    meta: {
      mimeType: "video/mp4",
      extension: "mp4",
      duration: 180,
    },
  },
  // 数据分析资源
  {
    id: "res_005",
    name: "analytics-db",
    type: "database",
    status: "active",
    projectId: "proj_003",
    tags: ["postgres", "analytics"],
    createdAt: new Date("2023-07-25T09:00:00Z"),
    updatedAt: new Date("2024-01-10T10:00:00Z"),
    description: "分析数据库",
    meta: {
      dbType: "postgres",
      hostname: "db-analytics.internal",
      port: 5432,
      region: "us-east-1",
    },
  },
  // 迁移工具资源
  {
    id: "res_006",
    name: "legacy-server-01",
    type: "server",
    status: "inactive",
    projectId: "proj_004",
    tags: ["legacy", "vm"],
    createdAt: new Date("2023-11-05T11:00:00Z"),
    updatedAt: new Date("2024-01-08T15:00:00Z"),
    description: "旧系统服务器",
    meta: {
      hostname: "legacy-01.old.internal",
      ip: "10.0.1.100",
      region: "us-west-1",
    },
  },
  // 移动端资源
  {
    id: "res_007",
    name: "app-store-screenshots",
    type: "image",
    status: "active",
    size: 5242880, // 5MB
    path: "/images/app-store/",
    projectId: "proj_005",
    tags: ["screenshot", "app-store"],
    createdAt: new Date("2023-10-12T13:00:00Z"),
    updatedAt: new Date("2023-10-12T13:00:00Z"),
    description: "应用商店截图",
  },
  {
    id: "res_008",
    name: "mobile-api-docs.md",
    type: "doc",
    status: "active",
    size: 45000,
    path: "/docs/mobile-api-docs.md",
    projectId: "proj_005",
    tags: ["documentation", "api"],
    createdAt: new Date("2023-10-20T09:30:00Z"),
    updatedAt: new Date("2023-12-01T11:00:00Z"),
    description: "移动端 API 文档",
    meta: {
      mimeType: "text/markdown",
      extension: "md",
    },
  },
  // API 网关资源
  {
    id: "res_009",
    name: "api.bunnyera.com",
    type: "domain",
    status: "active",
    projectId: "proj_006",
    tags: ["production", "api"],
    createdAt: new Date("2023-05-20T07:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
    description: "API 网关域名",
    expiresAt: new Date("2025-05-20T07:00:00Z"),
    meta: {
      registrar: "Cloudflare",
      sslExpiry: new Date("2024-06-01T00:00:00Z"),
      dnsRecords: [
        { type: "A", name: "api.bunnyera.com", value: "104.16.1.1", ttl: 300 },
        { type: "AAAA", name: "api.bunnyera.com", value: "2606:4700::1", ttl: 300 },
      ],
    },
  },
  // API Keys
  {
    id: "res_010",
    name: "Production API Key",
    type: "apiKey",
    status: "active",
    projectId: "proj_006",
    tags: ["production", "api-key"],
    createdAt: new Date("2023-06-01T00:00:00Z"),
    updatedAt: new Date("2023-12-01T00:00:00Z"),
    description: "生产环境 API Key",
    expiresAt: new Date("2024-12-01T00:00:00Z"),
    meta: {
      keyPrefix: "bk_live_",
      permissions: ["read", "write"],
      rateLimit: 10000,
    },
  },
  {
    id: "res_011",
    name: "Staging API Key",
    type: "apiKey",
    status: "active",
    projectId: "proj_006",
    tags: ["staging", "api-key"],
    createdAt: new Date("2023-06-01T00:00:00Z"),
    updatedAt: new Date("2023-06-01T00:00:00Z"),
    description: "测试环境 API Key",
    expiresAt: new Date("2024-06-01T00:00:00Z"),
    meta: {
      keyPrefix: "bk_test_",
      permissions: ["read"],
      rateLimit: 1000,
    },
  },
  // SSL 证书
  {
    id: "res_012",
    name: "wildcard.bunnyera.com",
    type: "certificate",
    status: "active",
    projectId: "proj_001",
    tags: ["ssl", "wildcard"],
    createdAt: new Date("2023-06-15T00:00:00Z"),
    updatedAt: new Date("2023-06-15T00:00:00Z"),
    description: "通配符 SSL 证书",
    expiresAt: new Date("2024-06-15T00:00:00Z"),
    meta: {
      issuer: "Let's Encrypt",
      domains: ["*.bunnyera.com", "bunnyera.com"],
    },
  },
  // 配置文件
  {
    id: "res_013",
    name: "app.config.json",
    type: "config",
    status: "active",
    size: 2048,
    path: "/config/app.config.json",
    projectId: "proj_001",
    tags: ["config", "json"],
    createdAt: new Date("2023-06-02T10:00:00Z"),
    updatedAt: new Date("2024-01-14T08:00:00Z"),
    description: "应用主配置文件",
    meta: {
      mimeType: "application/json",
      extension: "json",
    },
  },
];

/** 内存资源存储 */
class ResourceMemoryStore {
  private resources: Map<string, Resource> = new Map();

  constructor() {
    initialResources.forEach((resource) => {
      this.resources.set(resource.id, resource);
    });
  }

  /** 获取所有资源 */
  getAll(): Resource[] {
    return Array.from(this.resources.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /** 根据ID获取资源 */
  getById(id: string): Resource | null {
    return this.resources.get(id) || null;
  }

  /** 创建资源 */
  create(
    resource: Omit<Resource, "id" | "createdAt" | "updatedAt">
  ): Resource {
    const now = new Date();
    const newResource: Resource = {
      ...resource,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  /** 更新资源 */
  update(id: string, updates: Partial<Resource>): Resource | null {
    const resource = this.resources.get(id);
    if (!resource) return null;

    const updatedResource: Resource = {
      ...resource,
      ...updates,
      id: resource.id,
      updatedAt: new Date(),
    };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  /** 删除资源 */
  delete(id: string): boolean {
    return this.resources.delete(id);
  }

  /** 清空所有数据 */
  clear(): void {
    this.resources.clear();
  }

  /** 重置为初始数据 */
  reset(): void {
    this.clear();
    initialResources.forEach((resource) => {
      this.resources.set(resource.id, resource);
    });
  }
}

/** 单例存储实例 */
export const resourceStore = new ResourceMemoryStore();

/** 检查资源是否即将过期（默认30天内） */
export function isExpiringSoon(expiresAt?: Date, thresholdDays: number = 30): boolean {
  if (!expiresAt) return false;
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + thresholdDays);
  return expiresAt <= thresholdDate && expiresAt > new Date();
}

/** 检查资源是否已过期 */
export function isExpired(expiresAt?: Date): boolean {
  if (!expiresAt) return false;
  return expiresAt < new Date();
}
