/**
 * AIHub 模块入口
 * AI 工作中心 - 导出所有类型和实现
 */

// 类型定义
export type {
  Message,
  MessageRole,
  MessageContentType,
  MessageContent,
  MessageMeta,
  ToolCall,
  ChatSession,
  SessionContext,
  SessionConfig,
  AgentCapability,
  ParameterSchema,
  Agent,
  AgentMeta,
  WorkflowStep,
  WorkflowBranch,
  Workflow,
  WorkflowExecutionStatus,
  WorkflowExecution,
  WorkflowStepExecution,
  AgentTaskResult,
  IAIModelProvider,
  ISessionStorage,
} from "./types";

// 实现类
export { AIHub, type AIHubOptions } from "./AIHub";

// Mock 数据和工具
export {
  MockAIModelProvider,
  MemorySessionStorage,
  agentStore,
  workflowStore,
  sessionStorage,
  mockAIProvider,
  createMessage,
  createChatSession,
  mockRunAgentTask,
} from "./mockData";

// 默认实例
export { aiHub } from "./AIHub";
