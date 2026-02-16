/**
 * ProjectCenter Mock 数据源
 * 内存内数据存储，后续可替换为真实数据库
 */

import { Project, ProjectStatus } from "./types";

/** 生成唯一ID */
function generateId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/** 初始 mock 项目数据 */
const initialProjects: Project[] = [
  {
    id: "proj_001",
    name: "BunnyEra Console",
    status: "healthy",
    version: "1.2.0",
    owner: "admin@bunnyera.com",
    tags: ["core", "dashboard", "enterprise"],
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    createdAt: new Date("2023-06-01T08:00:00Z"),
    description: "BunnyEra 企业控制台主项目",
    url: "https://console.bunnyera.com",
    resourceIds: ["res_001", "res_002"],
  },
  {
    id: "proj_002",
    name: "AI Assistant Platform",
    status: "warning",
    version: "0.8.5",
    owner: "ai-team@bunnyera.com",
    tags: ["ai", "ml", "experimental"],
    updatedAt: new Date("2024-01-14T16:45:00Z"),
    createdAt: new Date("2023-09-15T09:00:00Z"),
    description: "AI 助手平台，集成多种大模型",
    url: "https://ai.bunnyera.com",
    resourceIds: ["res_003", "res_004"],
  },
  {
    id: "proj_003",
    name: "Data Analytics Engine",
    status: "healthy",
    version: "2.1.3",
    owner: "data@bunnyera.com",
    tags: ["data", "analytics", "backend"],
    updatedAt: new Date("2024-01-15T08:20:00Z"),
    createdAt: new Date("2023-07-20T10:00:00Z"),
    description: "数据分析引擎，处理海量业务数据",
    resourceIds: ["res_005"],
  },
  {
    id: "proj_004",
    name: "Legacy Migration Tool",
    status: "error",
    version: "1.0.0",
    owner: "devops@bunnyera.com",
    tags: ["migration", "legacy", "maintenance"],
    updatedAt: new Date("2024-01-10T14:00:00Z"),
    createdAt: new Date("2023-11-01T11:00:00Z"),
    description: "旧系统迁移工具，当前遇到兼容性问题",
    resourceIds: ["res_006"],
  },
  {
    id: "proj_005",
    name: "Mobile App v3",
    status: "paused",
    version: "3.0.0-beta",
    owner: "mobile@bunnyera.com",
    tags: ["mobile", "ios", "android"],
    updatedAt: new Date("2024-01-05T09:30:00Z"),
    createdAt: new Date("2023-10-10T08:00:00Z"),
    description: "移动端应用第三版，因资源调整暂停开发",
    resourceIds: ["res_007", "res_008"],
  },
  {
    id: "proj_006",
    name: "API Gateway",
    status: "healthy",
    version: "4.2.1",
    owner: "backend@bunnyera.com",
    tags: ["api", "gateway", "infrastructure"],
    updatedAt: new Date("2024-01-15T12:00:00Z"),
    createdAt: new Date("2023-05-15T07:00:00Z"),
    description: "API 网关服务，统一入口管理",
    url: "https://api.bunnyera.com",
    resourceIds: ["res_009"],
  },
];

/** 内存项目存储 */
class ProjectMemoryStore {
  private projects: Map<string, Project> = new Map();

  constructor() {
    // 初始化数据
    initialProjects.forEach((project) => {
      this.projects.set(project.id, project);
    });
  }

  /** 获取所有项目 */
  getAll(): Project[] {
    return Array.from(this.projects.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /** 根据ID获取项目 */
  getById(id: string): Project | null {
    return this.projects.get(id) || null;
  }

  /** 创建项目 */
  create(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Project {
    const now = new Date();
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  /** 更新项目 */
  update(id: string, updates: Partial<Project>): Project | null {
    const project = this.projects.get(id);
    if (!project) return null;

    const updatedProject: Project = {
      ...project,
      ...updates,
      id: project.id, // 确保ID不被修改
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  /** 删除项目 */
  delete(id: string): boolean {
    return this.projects.delete(id);
  }

  /** 清空所有数据（用于测试） */
  clear(): void {
    this.projects.clear();
  }

  /** 重置为初始数据（用于测试） */
  reset(): void {
    this.clear();
    initialProjects.forEach((project) => {
      this.projects.set(project.id, project);
    });
  }
}

/** 单例存储实例 */
export const projectStore = new ProjectMemoryStore();

/** 获取项目状态优先级（用于排序） */
export function getStatusPriority(status: ProjectStatus): number {
  const priority: Record<ProjectStatus, number> = {
    error: 0,
    warning: 1,
    paused: 2,
    healthy: 3,
  };
  return priority[status];
}
