/**
 * AIHub 核心实现
 * AI 工作中心 - 管理 AI 会话、代理和工作流
 */

import {
  ChatSession,
  Message,
  Agent,
  Workflow,
  AgentTaskResult,
  SessionConfig,
  IAIModelProvider,
  ISessionStorage,
} from "./types";
import {
  agentStore,
  workflowStore,
  sessionStorage,
  mockAIProvider,
  createMessage,
  createChatSession,
  mockRunAgentTask,
} from "./mockData";

/** AIHub 配置选项 */
export interface AIHubOptions {
  /** AI 模型提供者 */
  modelProvider?: IAIModelProvider;
  /** 会话存储 */
  sessionStorage?: ISessionStorage;
}

/**
 * AIHub 类
 * 管理 AI 会话、代理和工作流
 */
export class AIHub {
  private modelProvider: IAIModelProvider;
  private storage: ISessionStorage;

  constructor(options: AIHubOptions = {}) {
    this.modelProvider = options.modelProvider || mockAIProvider;
    this.storage = options.sessionStorage || sessionStorage;
  }

  // ==================== 会话管理 ====================

  /**
   * 创建新会话
   * @param title 会话标题
   * @param agentId 关联的代理ID
   * @returns 新创建的会话
   */
  async createChatSession(
    title: string = "新会话",
    agentId?: string
  ): Promise<ChatSession> {
    const session = createChatSession(title, agentId);
    await this.storage.save(session);
    return session;
  }

  /**
   * 发送消息
   * @param sessionId 会话ID
   * @param content 消息内容
   * @param config 会话配置
   * @returns 助手回复消息
   */
  async sendMessage(
    sessionId: string,
    content: string,
    config?: SessionConfig
  ): Promise<Message> {
    // 获取会话
    const session = await this.storage.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // 创建用户消息
    const userMessage = createMessage(sessionId, "user", content);
    session.messages.push(userMessage);

    // 构建消息历史（包含系统提示词）
    const messages: Message[] = [];

    // 添加系统提示词（如果有）
    if (session.context?.systemPrompt) {
      messages.push({
        id: "system",
        sessionId,
        role: "system",
        content: session.context.systemPrompt,
        timestamp: new Date(),
      });
    } else if (session.agentId) {
      // 使用代理的系统提示词
      const agent = agentStore.getById(session.agentId);
      if (agent) {
        messages.push({
          id: "system",
          sessionId,
          role: "system",
          content: agent.systemPrompt,
          timestamp: new Date(),
        });
      }
    }

    // 添加历史消息（限制最近20条）
    messages.push(...session.messages.slice(-20));

    // 调用 AI 模型
    const response = await this.modelProvider.sendMessage(
      messages,
      config || session.config
    );

    // 创建助手消息
    const assistantMessage: Message = {
      id: `msg_${Date.now()}_assistant`,
      sessionId,
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      model: response.model,
      tokenCount: response.tokenCount,
    };

    session.messages.push(assistantMessage);
    session.updatedAt = new Date();

    // 保存会话
    await this.storage.save(session);

    return assistantMessage;
  }

  /**
   * 流式发送消息
   * @param sessionId 会话ID
   * @param content 消息内容
   * @param onChunk 收到数据块时的回调
   * @param config 会话配置
   * @returns 完整的助手回复消息
   */
  async streamMessage(
    sessionId: string,
    content: string,
    onChunk?: (chunk: string) => void,
    config?: SessionConfig
  ): Promise<Message> {
    const session = await this.storage.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // 创建用户消息
    const userMessage = createMessage(sessionId, "user", content);
    session.messages.push(userMessage);

    // 构建消息历史
    const messages: Message[] = [];
    if (session.context?.systemPrompt) {
      messages.push({
        id: "system",
        sessionId,
        role: "system",
        content: session.context.systemPrompt,
        timestamp: new Date(),
      });
    } else if (session.agentId) {
      const agent = agentStore.getById(session.agentId);
      if (agent) {
        messages.push({
          id: "system",
          sessionId,
          role: "system",
          content: agent.systemPrompt,
          timestamp: new Date(),
        });
      }
    }
    messages.push(...session.messages.slice(-20));

    // 流式调用
    const response = await this.modelProvider.streamMessage(
      messages,
      config || session.config,
      onChunk
    );

    // 创建助手消息
    const assistantMessage: Message = {
      id: `msg_${Date.now()}_assistant`,
      sessionId,
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      model: response.model,
      tokenCount: response.tokenCount,
    };

    session.messages.push(assistantMessage);
    session.updatedAt = new Date();
    await this.storage.save(session);

    return assistantMessage;
  }

  /**
   * 获取会话详情
   * @param sessionId 会话ID
   * @returns 会话详情或 null
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    return await this.storage.get(sessionId);
  }

  /**
   * 获取所有会话
   * @returns 会话列表
   */
  async listSessions(): Promise<ChatSession[]> {
    return await this.storage.getAll();
  }

  /**
   * 删除会话
   * @param sessionId 会话ID
   * @returns 是否删除成功
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    return await this.storage.delete(sessionId);
  }

  // ==================== 代理管理 ====================

  /**
   * 获取所有代理
   * @param onlyActive 是否只返回激活的代理
   * @returns 代理列表
   */
  async listAgents(onlyActive: boolean = true): Promise<Agent[]> {
    if (onlyActive) {
      return agentStore.getActive();
    }
    return agentStore.getAll();
  }

  /**
   * 根据ID获取代理
   * @param agentId 代理ID
   * @returns 代理详情或 null
   */
  async getAgent(agentId: string): Promise<Agent | null> {
    return agentStore.getById(agentId);
  }

  /**
   * 运行代理任务
   * @param agentId 代理ID
   * @param payload 任务参数
   * @returns 任务结果
   */
  async runAgentTask(
    agentId: string,
    payload: Record<string, unknown>
  ): Promise<AgentTaskResult> {
    const agent = agentStore.getById(agentId);
    if (!agent) {
      return {
        success: false,
        output: "",
        error: `Agent not found: ${agentId}`,
      };
    }

    if (!agent.isActive) {
      return {
        success: false,
        output: "",
        error: `Agent is not active: ${agentId}`,
      };
    }

    return await mockRunAgentTask(agent, payload);
  }

  // ==================== 工作流管理 ====================

  /**
   * 获取所有工作流
   * @returns 工作流列表
   */
  async listWorkflows(): Promise<Workflow[]> {
    return workflowStore.getAll();
  }

  /**
   * 根据ID获取工作流
   * @param workflowId 工作流ID
   * @returns 工作流详情或 null
   */
  async getWorkflow(workflowId: string): Promise<Workflow | null> {
    return workflowStore.getById(workflowId);
  }

  // ==================== 配置管理 ====================

  /**
   * 设置 AI 模型提供者
   * @param provider 模型提供者
   */
  setModelProvider(provider: IAIModelProvider): void {
    this.modelProvider = provider;
  }

  /**
   * 设置会话存储
   * @param storage 会话存储
   */
  setSessionStorage(storage: ISessionStorage): void {
    this.storage = storage;
  }
}

/** 默认 AIHub 实例 */
export const aiHub = new AIHub();
