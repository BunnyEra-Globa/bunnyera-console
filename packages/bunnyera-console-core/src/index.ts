/**
 * BunnyEra Console Core
 * =====================
 * BunnyEra 企业控制台核心逻辑层
 *
 * 这是一个纯 TypeScript 的核心逻辑包，不包含任何 UI 或浏览器 API。
 * 所有外部依赖（数据库、云服务、AI 模型）都通过接口抽象，便于后续接入真实实现。
 *
 * @packageDocumentation
 */

// ==================== ProjectCenter ====================
export {
  // 类型
  type Project,
  type ProjectStatus,
  type ProjectHealthSummary,
  type ProjectFilter,
  type ProjectSearchOptions,
  type IProjectDataSource,
  // 实现
  ProjectCenter,
  type ProjectCenterOptions,
  // Mock 数据
  projectStore,
  getStatusPriority,
  // 默认实例
  projectCenter,
} from "./project";

// ==================== ResourceCenter ====================
export {
  // 类型
  type Resource,
  type ResourceType,
  type ResourceStatus,
  type ResourceMeta,
  type DnsRecord,
  type ResourceStats,
  type ResourceFilter,
  type ResourceSearchOptions,
  type IResourceDataSource,
  // 实现
  ResourceCenter,
  type ResourceCenterOptions,
  // Mock 数据和工具
  resourceStore,
  formatFileSize,
  isExpiringSoon,
  isExpired,
  // 默认实例
  resourceCenter,
} from "./resource";

// ==================== AIHub ====================
export {
  // 类型
  type Message,
  type MessageRole,
  type MessageContentType,
  type MessageContent,
  type MessageMeta,
  type ToolCall,
  type ChatSession,
  type SessionContext,
  type SessionConfig,
  type AgentCapability,
  type ParameterSchema,
  type Agent,
  type AgentMeta,
  type WorkflowStep,
  type WorkflowBranch,
  type Workflow,
  type WorkflowExecutionStatus,
  type WorkflowExecution,
  type WorkflowStepExecution,
  type AgentTaskResult,
  type IAIModelProvider,
  type ISessionStorage,
  // 实现
  AIHub,
  type AIHubOptions,
  // Mock 数据和工具
  MockAIModelProvider,
  MemorySessionStorage,
  agentStore,
  workflowStore,
  sessionStorage,
  mockAIProvider,
  createMessage,
  createChatSession,
  mockRunAgentTask,
  // 默认实例
  aiHub,
} from "./ai";

// ==================== LogCenter ====================
export {
  // 类型
  type LogEntry,
  type LogLevel,
  type LogSource,
  type LogMeta,
  type LogFilter,
  type LogStats,
  type LogPageResult,
  type ILogStorage,
  type ILogHandler,
  type ILogFormatter,
  // 实现
  LogCenter,
  type LogCenterOptions,
  // Mock 数据和工具
  logStorage,
  createLogEntry,
  logLevelPriority,
  getLogLevelColor,
  formatLogTime,
  // 默认实例
  logCenter,
} from "./log";

// ==================== UserCenter ====================
export {
  // 类型
  type User,
  type UserRole,
  type UserStatus,
  type UserMeta,
  type NotificationSettings,
  type PermissionAction,
  type RolePermissions,
  type PermissionContext,
  type UserFilter,
  type UserSearchOptions,
  type IUserDataSource,
  type IAuthProvider,
  // 实现
  UserCenter,
  type UserCenterOptions,
  // Mock 数据和工具
  userStore,
  defaultRolePermissions,
  checkPermission,
  getRolePermissions,
  roleDisplayNames,
  statusDisplayNames,
  permissionDisplayNames,
  // 默认实例
  userCenter,
} from "./user";

// ==================== 版本信息 ====================
export const VERSION = "0.1.0";
export const PACKAGE_NAME = "bunnyera-console-core";

// ==================== 完整核心类 ====================

/**
 * BunnyEra Console Core 主类
 * 整合所有中心，提供统一入口
 */
import { ProjectCenter } from "./project";
import { ResourceCenter } from "./resource";
import { AIHub } from "./ai";
import { LogCenter } from "./log";
import { UserCenter } from "./user";

export interface BunnyEraCoreOptions {
  project?: ConstructorParameters<typeof ProjectCenter>[0];
  resource?: ConstructorParameters<typeof ResourceCenter>[0];
  ai?: ConstructorParameters<typeof AIHub>[0];
  log?: ConstructorParameters<typeof LogCenter>[0];
  user?: ConstructorParameters<typeof UserCenter>[0];
}

/**
 * BunnyEra Console Core 主类
 *
 * 示例用法：
 * ```typescript
 * import { BunnyEraCore } from 'bunnyera-console-core';
 *
 * const core = new BunnyEraCore();
 *
 * // 项目操作
 * const projects = await core.project.listProjects();
 *
 * // 资源操作
 * const stats = await core.resource.getResourceStats();
 *
 * // AI 操作
 * const session = await core.ai.createChatSession();
 *
 * // 日志操作
 * await core.log.logInfo('system', '系统启动');
 *
 * // 用户操作
 * const user = await core.user.getCurrentUser();
 * ```
 */
export class BunnyEraCore {
  /** 项目中心 */
  project: ProjectCenter;
  /** 资源中心 */
  resource: ResourceCenter;
  /** AI 中心 */
  ai: AIHub;
  /** 日志中心 */
  log: LogCenter;
  /** 用户中心 */
  user: UserCenter;

  constructor(options: BunnyEraCoreOptions = {}) {
    this.project = new ProjectCenter(options.project);
    this.resource = new ResourceCenter(options.resource);
    this.ai = new AIHub(options.ai);
    this.log = new LogCenter(options.log);
    this.user = new UserCenter(options.user);
  }

  /**
   * 初始化所有模块
   * 可以在这里执行启动时的初始化逻辑
   */
  async initialize(): Promise<void> {
    // 记录启动日志
    await this.log.logInfo("system", "BunnyEra Console Core 初始化完成", {
      version: VERSION,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 获取系统健康状态
   */
  async getHealthStatus(): Promise<{
    status: "healthy" | "degraded" | "unhealthy";
    modules: Record<string, boolean>;
    timestamp: Date;
  }> {
    const modules: Record<string, boolean> = {
      project: true,
      resource: true,
      ai: true,
      log: true,
      user: true,
    };

    // 检查各模块状态
    try {
      await this.project.getProjectHealthSummary();
    } catch {
      modules.project = false;
    }

    try {
      await this.resource.getResourceStats();
    } catch {
      modules.resource = false;
    }

    const allHealthy = Object.values(modules).every((v) => v);
    const anyHealthy = Object.values(modules).some((v) => v);

    return {
      status: allHealthy ? "healthy" : anyHealthy ? "degraded" : "unhealthy",
      modules,
      timestamp: new Date(),
    };
  }
}

/** 默认核心实例 */
export const bunnyEraCore = new BunnyEraCore();

// 默认导出
export default BunnyEraCore;
