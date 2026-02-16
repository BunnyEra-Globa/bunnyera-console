/**
 * AIHub 类型定义
 * AI 工作中心 - 管理 AI 会话、代理和工作流
 */

/** 消息角色 */
export type MessageRole = "user" | "assistant" | "system" | "tool";

/** 消息内容类型 */
export type MessageContentType = "text" | "image" | "code" | "file";

/** 消息内容 */
export interface MessageContent {
  type: MessageContentType;
  content: string;
  language?: string; // 代码语言
  metadata?: Record<string, unknown>;
}

/** 消息类型定义 */
export interface Message {
  /** 消息唯一标识 */
  id: string;
  /** 所属会话ID */
  sessionId: string;
  /** 消息角色 */
  role: MessageRole;
  /** 消息内容 */
  content: string | MessageContent[];
  /** 发送时间 */
  timestamp: Date;
  /** 使用的模型（助手消息适用） */
  model?: string;
  /** token 使用量 */
  tokenCount?: number;
  /** 元数据 */
  meta?: MessageMeta;
}

/** 消息元数据 */
export interface MessageMeta {
  /** 是否已编辑 */
  edited?: boolean;
  /** 编辑时间 */
  editedAt?: Date;
  /** 引用消息ID */
  replyTo?: string;
  /** 附件列表 */
  attachments?: string[];
  /** 工具调用信息 */
  toolCalls?: ToolCall[];
  /** 其他自定义数据 */
  [key: string]: unknown;
}

/** 工具调用 */
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

/** 会话类型定义 */
export interface ChatSession {
  /** 会话唯一标识 */
  id: string;
  /** 会话标题 */
  title: string;
  /** 关联的代理ID */
  agentId?: string;
  /** 创建时间 */
  createdAt: Date;
  /** 最后更新时间 */
  updatedAt: Date;
  /** 消息列表 */
  messages: Message[];
  /** 会话上下文/记忆 */
  context?: SessionContext;
  /** 会话配置 */
  config?: SessionConfig;
}

/** 会话上下文 */
export interface SessionContext {
  /** 系统提示词 */
  systemPrompt?: string;
  /** 自定义变量 */
  variables?: Record<string, unknown>;
  /** 会话历史摘要 */
  summary?: string;
}

/** 会话配置 */
export interface SessionConfig {
  /** 使用的模型 */
  model?: string;
  /** 温度参数 */
  temperature?: number;
  /** 最大token数 */
  maxTokens?: number;
  /** 是否启用流式响应 */
  stream?: boolean;
  /** 工具列表 */
  tools?: string[];
}

/** 代理能力 */
export interface AgentCapability {
  /** 能力标识 */
  id: string;
  /** 能力名称 */
  name: string;
  /** 能力描述 */
  description: string;
  /** 所需参数 */
  parameters?: ParameterSchema;
}

/** 参数模式 */
export interface ParameterSchema {
  type: "object";
  properties: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
  }>;
  required?: string[];
}

/** 代理类型定义 */
export interface Agent {
  /** 代理唯一标识 */
  id: string;
  /** 代理名称 */
  name: string;
  /** 代理角色描述 */
  role: string;
  /** 系统提示词 */
  systemPrompt: string;
  /** 能力列表 */
  capabilities: AgentCapability[];
  /** 默认模型 */
  defaultModel: string;
  /** 标签 */
  tags: string[];
  /** 是否激活 */
  isActive: boolean;
  /** 创建时间 */
  createdAt: Date;
  /** 元数据 */
  meta?: AgentMeta;
}

/** 代理元数据 */
export interface AgentMeta {
  /** 头像URL */
  avatar?: string;
  /** 颜色主题 */
  color?: string;
  /** 版本 */
  version?: string;
  /** 作者 */
  author?: string;
  [key: string]: unknown;
}

/** 工作流步骤 */
export interface WorkflowStep {
  /** 步骤ID */
  id: string;
  /** 步骤名称 */
  name: string;
  /** 步骤类型 */
  type: "agent" | "condition" | "action" | "wait" | "end";
  /** 执行的代理ID（agent类型适用） */
  agentId?: string;
  /** 输入参数 */
  inputs?: Record<string, unknown>;
  /** 下一步骤ID */
  next?: string;
  /** 条件分支（condition类型适用） */
  branches?: WorkflowBranch[];
  /** 超时时间（秒） */
  timeout?: number;
}

/** 工作流分支 */
export interface WorkflowBranch {
  /** 条件表达式 */
  condition: string;
  /** 目标步骤ID */
  target: string;
}

/** 工作流类型定义 */
export interface Workflow {
  /** 工作流唯一标识 */
  id: string;
  /** 工作流名称 */
  name: string;
  /** 工作流描述 */
  description: string;
  /** 步骤列表 */
  steps: WorkflowStep[];
  /** 开始步骤ID */
  startStepId: string;
  /** 版本 */
  version: string;
  /** 是否激活 */
  isActive: boolean;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
  /** 标签 */
  tags: string[];
}

/** 工作流执行状态 */
export type WorkflowExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

/** 工作流执行实例 */
export interface WorkflowExecution {
  /** 执行ID */
  id: string;
  /** 工作流ID */
  workflowId: string;
  /** 执行状态 */
  status: WorkflowExecutionStatus;
  /** 输入参数 */
  inputs: Record<string, unknown>;
  /** 输出结果 */
  outputs?: Record<string, unknown>;
  /** 当前步骤ID */
  currentStepId?: string;
  /** 执行历史 */
  history: WorkflowStepExecution[];
  /** 开始时间 */
  startedAt: Date;
  /** 结束时间 */
  endedAt?: Date;
  /** 错误信息 */
  error?: string;
}

/** 工作流步骤执行记录 */
export interface WorkflowStepExecution {
  stepId: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: Date;
  endedAt?: Date;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  error?: string;
}

/** 代理任务结果 */
export interface AgentTaskResult {
  /** 是否成功 */
  success: boolean;
  /** 输出内容 */
  output: string;
  /** 使用的token数 */
  tokenCount?: number;
  /** 执行时间（毫秒） */
  executionTime?: number;
  /** 工具调用记录 */
  toolCalls?: ToolCall[];
  /** 错误信息 */
  error?: string;
}

/** AI 模型接口 - 预留扩展点 */
export interface IAIModelProvider {
  /** 发送消息并获取回复 */
  sendMessage(
    messages: Message[],
    config?: SessionConfig
  ): Promise<{
    content: string;
    tokenCount: number;
    model: string;
  }>;
  /** 流式发送消息 */
  streamMessage(
    messages: Message[],
    config?: SessionConfig,
    onChunk?: (chunk: string) => void
  ): Promise<{
    content: string;
    tokenCount: number;
    model: string;
  }>;
}

/** 会话存储接口 - 预留扩展点 */
export interface ISessionStorage {
  /** 保存会话 */
  save(session: ChatSession): Promise<void>;
  /** 获取会话 */
  get(id: string): Promise<ChatSession | null>;
  /** 获取所有会话 */
  getAll(): Promise<ChatSession[]>;
  /** 删除会话 */
  delete(id: string): Promise<boolean>;
}
