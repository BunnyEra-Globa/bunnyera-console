/**
 * AIHub Mock 数据和实现
 * 内存内数据存储和模拟 AI 响应
 */

import {
  ChatSession,
  Message,
  Agent,
  Workflow,
  AgentTaskResult,
  IAIModelProvider,
  ISessionStorage,
  SessionConfig,
  MessageRole,
} from "./types";

/** 生成唯一ID */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/** 模拟 AI 模型提供者 */
export class MockAIModelProvider implements IAIModelProvider {
  private mockResponses: Map<string, string> = new Map([
    [
      "default",
      "我理解您的需求。作为您的 AI 助手，我可以帮助您完成各种任务。请告诉我更多细节。",
    ],
    [
      "code",
      '```typescript\nfunction greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n```\n\n这是一个简单的 TypeScript 函数示例。',
    ],
    [
      "analysis",
      "根据您提供的数据，我进行了以下分析：\n\n1. **趋势分析**：数据显示稳定增长\n2. **异常检测**：发现 2 个异常点\n3. **建议**：建议优化资源配置\n\n需要更详细的报告吗？",
    ],
    [
      "greeting",
      "您好！我是 BunnyEra AI 助手。有什么可以帮助您的吗？",
    ],
  ]);

  async sendMessage(
    messages: Message[],
    config?: SessionConfig
  ): Promise<{
    content: string;
    tokenCount: number;
    model: string;
  }> {
    // 模拟网络延迟
    await this.delay(500 + Math.random() * 1000);

    const lastMessage = messages[messages.length - 1];
    const content =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : lastMessage.content[0]?.content || "";

    // 根据内容选择响应
    let response = this.mockResponses.get("default")!;
    if (content.toLowerCase().includes("code") || content.includes("```")) {
      response = this.mockResponses.get("code")!;
    } else if (content.toLowerCase().includes("分析") || content.toLowerCase().includes("data")) {
      response = this.mockResponses.get("analysis")!;
    } else if (messages.length === 1) {
      response = this.mockResponses.get("greeting")!;
    }

    // 模拟 token 计算
    const tokenCount = Math.floor(response.length / 4);

    return {
      content: response,
      tokenCount,
      model: config?.model || "mock-gpt-4",
    };
  }

  async streamMessage(
    messages: Message[],
    config?: SessionConfig,
    onChunk?: (chunk: string) => void
  ): Promise<{
    content: string;
    tokenCount: number;
    model: string;
  }> {
    const result = await this.sendMessage(messages, config);

    // 模拟流式输出
    if (onChunk) {
      const chunks = result.content.split(/(?<=\s)/);
      for (const chunk of chunks) {
        onChunk(chunk);
        await this.delay(50);
      }
    }

    return result;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** 添加自定义 mock 响应 */
  setMockResponse(key: string, response: string): void {
    this.mockResponses.set(key, response);
  }
}

/** 内存会话存储 */
export class MemorySessionStorage implements ISessionStorage {
  private sessions: Map<string, ChatSession> = new Map();

  async save(session: ChatSession): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async get(id: string): Promise<ChatSession | null> {
    return this.sessions.get(id) || null;
  }

  async getAll(): Promise<ChatSession[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  async delete(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  clear(): void {
    this.sessions.clear();
  }
}

/** 初始代理数据 */
export const initialAgents: Agent[] = [
  {
    id: "agent_001",
    name: "通用助手",
    role: "全能型 AI 助手，可以回答各种问题",
    systemPrompt:
      "你是一个 helpful 的 AI 助手。请用简洁清晰的中文回答用户的问题。",
    capabilities: [
      {
        id: "chat",
        name: "对话",
        description: "进行自然语言对话",
      },
      {
        id: "summarize",
        name: "总结",
        description: "总结长文本内容",
      },
    ],
    defaultModel: "gpt-4",
    tags: ["general", "assistant"],
    isActive: true,
    createdAt: new Date("2023-06-01T00:00:00Z"),
    meta: {
      avatar: "🤖",
      color: "#6366f1",
      version: "1.0.0",
    },
  },
  {
    id: "agent_002",
    name: "代码专家",
    role: "专业的编程助手，精通多种编程语言",
    systemPrompt:
      "你是一个专业的编程助手。请提供高质量、可运行的代码，并解释关键部分。",
    capabilities: [
      {
        id: "code",
        name: "编写代码",
        description: "编写各种编程语言的代码",
      },
      {
        id: "debug",
        name: "调试",
        description: "帮助调试代码问题",
      },
      {
        id: "review",
        name: "代码审查",
        description: "审查代码质量",
      },
    ],
    defaultModel: "gpt-4",
    tags: ["code", "developer"],
    isActive: true,
    createdAt: new Date("2023-07-15T00:00:00Z"),
    meta: {
      avatar: "💻",
      color: "#10b981",
      version: "1.2.0",
    },
  },
  {
    id: "agent_003",
    name: "数据分析师",
    role: "数据分析专家，擅长数据可视化和洞察提取",
    systemPrompt:
      "你是一个数据分析师。请帮助用户分析数据，提供有价值的洞察和建议。",
    capabilities: [
      {
        id: "analyze",
        name: "数据分析",
        description: "分析数据集并生成报告",
      },
      {
        id: "visualize",
        name: "可视化",
        description: "建议数据可视化方案",
      },
    ],
    defaultModel: "gpt-4",
    tags: ["data", "analytics"],
    isActive: true,
    createdAt: new Date("2023-08-01T00:00:00Z"),
    meta: {
      avatar: "📊",
      color: "#f59e0b",
      version: "1.0.5",
    },
  },
  {
    id: "agent_004",
    name: "DevOps 助手",
    role: "DevOps 专家，帮助自动化部署和基础设施管理",
    systemPrompt:
      "你是一个 DevOps 专家。请帮助用户优化 CI/CD 流程、容器化和云基础设施。",
    capabilities: [
      {
        id: "deploy",
        name: "部署",
        description: "协助应用部署",
      },
      {
        id: "infra",
        name: "基础设施",
        description: "基础设施即代码建议",
      },
      {
        id: "monitor",
        name: "监控",
        description: "监控和告警配置",
      },
    ],
    defaultModel: "gpt-4",
    tags: ["devops", "infrastructure"],
    isActive: true,
    createdAt: new Date("2023-09-10T00:00:00Z"),
    meta: {
      avatar: "🚀",
      color: "#ef4444",
      version: "0.9.0",
    },
  },
  {
    id: "agent_005",
    name: "产品经理",
    role: "产品专家，帮助需求分析和产品规划",
    systemPrompt:
      "你是一个产品经理。请帮助用户分析需求、制定产品路线图和优先级。",
    capabilities: [
      {
        id: "prd",
        name: "需求文档",
        description: "编写产品需求文档",
      },
      {
        id: "roadmap",
        name: "路线图",
        description: "制定产品路线图",
      },
    ],
    defaultModel: "gpt-4",
    tags: ["product", "management"],
    isActive: false,
    createdAt: new Date("2023-10-01T00:00:00Z"),
    meta: {
      avatar: "📋",
      color: "#8b5cf6",
      version: "0.5.0",
    },
  },
];

/** 初始工作流数据 */
export const initialWorkflows: Workflow[] = [
  {
    id: "workflow_001",
    name: "代码审查流程",
    description: "自动化的代码审查工作流",
    steps: [
      {
        id: "step_001",
        name: "代码分析",
        type: "agent",
        agentId: "agent_002",
        inputs: { task: "analyze_code" },
        next: "step_002",
      },
      {
        id: "step_002",
        name: "生成报告",
        type: "action",
        next: "step_003",
      },
      {
        id: "step_003",
        name: "完成",
        type: "end",
      },
    ],
    startStepId: "step_001",
    version: "1.0.0",
    isActive: true,
    createdAt: new Date("2023-11-01T00:00:00Z"),
    updatedAt: new Date("2023-11-01T00:00:00Z"),
    tags: ["code", "review"],
  },
  {
    id: "workflow_002",
    name: "数据分析流程",
    description: "自动化数据分析工作流",
    steps: [
      {
        id: "step_001",
        name: "数据预处理",
        type: "action",
        next: "step_002",
      },
      {
        id: "step_002",
        name: "数据分析",
        type: "agent",
        agentId: "agent_003",
        inputs: { task: "analyze" },
        next: "step_003",
      },
      {
        id: "step_003",
        name: "生成可视化",
        type: "action",
        next: "step_004",
      },
      {
        id: "step_004",
        name: "完成",
        type: "end",
      },
    ],
    startStepId: "step_001",
    version: "1.0.0",
    isActive: true,
    createdAt: new Date("2023-11-15T00:00:00Z"),
    updatedAt: new Date("2023-11-15T00:00:00Z"),
    tags: ["data", "analytics"],
  },
];

/** 内存代理存储 */
class AgentMemoryStore {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    initialAgents.forEach((agent) => {
      this.agents.set(agent.id, agent);
    });
  }

  getAll(): Agent[] {
    return Array.from(this.agents.values());
  }

  getById(id: string): Agent | null {
    return this.agents.get(id) || null;
  }

  getActive(): Agent[] {
    return this.getAll().filter((agent) => agent.isActive);
  }
}

/** 内存工作流存储 */
class WorkflowMemoryStore {
  private workflows: Map<string, Workflow> = new Map();

  constructor() {
    initialWorkflows.forEach((workflow) => {
      this.workflows.set(workflow.id, workflow);
    });
  }

  getAll(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  getById(id: string): Workflow | null {
    return this.workflows.get(id) || null;
  }
}

/** 单例存储实例 */
export const agentStore = new AgentMemoryStore();
export const workflowStore = new WorkflowMemoryStore();
export const sessionStorage = new MemorySessionStorage();
export const mockAIProvider = new MockAIModelProvider();

/** 创建新消息 */
export function createMessage(
  sessionId: string,
  role: MessageRole,
  content: string
): Message {
  return {
    id: generateId("msg"),
    sessionId,
    role,
    content,
    timestamp: new Date(),
  };
}

/** 创建新会话 */
export function createChatSession(
  title: string = "新会话",
  agentId?: string
): ChatSession {
  const now = new Date();
  return {
    id: generateId("session"),
    title,
    agentId,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

/** 模拟代理任务执行 */
export async function mockRunAgentTask(
  agent: Agent,
  payload: Record<string, unknown>
): Promise<AgentTaskResult> {
  // 模拟执行延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const taskType = payload.task as string;

  const responses: Record<string, string> = {
    analyze_code:
      "代码审查完成。\n\n**发现的问题：**\n1. 缺少错误处理\n2. 变量命名不够清晰\n3. 建议添加单元测试\n\n**优点：**\n- 代码结构清晰\n- 注释完整",
    analyze:
      "数据分析完成。\n\n**关键发现：**\n- 用户活跃度增长 15%\n- 转化率提升 8%\n- 建议关注留存率",
    default: `任务 "${taskType}" 已完成。代理 "${agent.name}" 成功处理了您的请求。`,
  };

  const output = responses[taskType] || responses.default;

  return {
    success: true,
    output,
    tokenCount: Math.floor(output.length / 4),
    executionTime: 1000,
  };
}
