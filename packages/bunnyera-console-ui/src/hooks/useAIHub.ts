import { useState, useEffect, useCallback } from 'react';
import type { AIModel, AIAgent, AIConversation, AIMessage } from '../types';

// ========================================
// Mock 数据
// ========================================

const MOCK_MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: '强大的多模态大语言模型，适用于复杂任务',
    capabilities: ['text-generation', 'code', 'analysis', 'reasoning'],
    status: 'available',
    pricing: {
      input: 0.03,
      output: 0.06,
      unit: '1K tokens',
    },
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: '快速且经济高效的模型，适合日常任务',
    capabilities: ['text-generation', 'chat', 'qa'],
    status: 'available',
    pricing: {
      input: 0.0015,
      output: 0.002,
      unit: '1K tokens',
    },
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Anthropic 最强大的模型，擅长推理和分析',
    capabilities: ['text-generation', 'analysis', 'coding', 'writing'],
    status: 'available',
    pricing: {
      input: 0.015,
      output: 0.075,
      unit: '1K tokens',
    },
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: '平衡性能和成本的模型',
    capabilities: ['text-generation', 'chat', 'analysis'],
    status: 'available',
    pricing: {
      input: 0.003,
      output: 0.015,
      unit: '1K tokens',
    },
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google 的多模态 AI 模型',
    capabilities: ['text-generation', 'multimodal', 'code'],
    status: 'maintenance',
  },
];

const MOCK_AGENTS: AIAgent[] = [
  {
    id: '1',
    name: '代码助手',
    description: '帮助编写、审查和优化代码',
    model: MOCK_MODELS[0],
    systemPrompt: '你是一个专业的编程助手，擅长多种编程语言。',
    tools: ['code-interpreter', 'file-reader'],
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-06-20T10:30:00Z',
  },
  {
    id: '2',
    name: '文档生成器',
    description: '自动生成技术文档和 API 文档',
    model: MOCK_MODELS[1],
    systemPrompt: '你是一个技术文档专家，擅长编写清晰、专业的文档。',
    tools: ['markdown-writer', 'template-renderer'],
    status: 'active',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-06-18T16:45:00Z',
  },
  {
    id: '3',
    name: '数据分析助手',
    description: '分析数据并提供洞察',
    model: MOCK_MODELS[2],
    systemPrompt: '你是一个数据分析专家，擅长从数据中发现模式和趋势。',
    tools: ['data-analyzer', 'chart-generator'],
    status: 'inactive',
    createdAt: '2024-03-10T14:15:00Z',
    updatedAt: '2024-05-20T11:00:00Z',
  },
];

const MOCK_CONVERSATIONS: AIConversation[] = [
  {
    id: '1',
    title: 'React 组件优化',
    agentId: '1',
    messages: [
      {
        id: '1',
        role: 'user',
        content: '如何优化 React 组件的性能？',
        timestamp: '2024-06-20T10:00:00Z',
      },
      {
        id: '2',
        role: 'assistant',
        content: '以下是优化 React 组件性能的几个建议：\n\n1. 使用 React.memo 避免不必要的重渲染\n2. 使用 useMemo 缓存计算结果\n3. 使用 useCallback 缓存回调函数\n4. 合理使用 useEffect 依赖项\n5. 使用代码分割和懒加载',
        timestamp: '2024-06-20T10:00:05Z',
      },
    ],
    createdAt: '2024-06-20T10:00:00Z',
    updatedAt: '2024-06-20T10:00:05Z',
  },
  {
    id: '2',
    title: 'API 文档生成',
    agentId: '2',
    messages: [
      {
        id: '1',
        role: 'user',
        content: '请帮我生成 REST API 文档模板',
        timestamp: '2024-06-18T16:00:00Z',
      },
    ],
    createdAt: '2024-06-18T16:00:00Z',
    updatedAt: '2024-06-18T16:00:00Z',
  },
];

// ========================================
// Hook 返回类型
// ========================================

export interface UseAIHubReturn {
  /** AI 模型列表 */
  models: AIModel[];
  /** AI 助手列表 */
  agents: AIAgent[];
  /** 对话列表 */
  conversations: AIConversation[];
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => void;
  /** 获取模型 */
  getModel: (id: string) => AIModel | undefined;
  /** 获取助手 */
  getAgent: (id: string) => AIAgent | undefined;
  /** 获取对话 */
  getConversation: (id: string) => AIConversation | undefined;
  /** 创建助手 */
  createAgent: (data: Partial<AIAgent>) => Promise<AIAgent>;
  /** 更新助手 */
  updateAgent: (id: string, data: Partial<AIAgent>) => Promise<AIAgent>;
  /** 删除助手 */
  deleteAgent: (id: string) => Promise<void>;
  /** 创建对话 */
  createConversation: (agentId: string, title?: string) => Promise<AIConversation>;
  /** 发送消息 */
  sendMessage: (conversationId: string, content: string) => Promise<AIMessage>;
  /** 删除对话 */
  deleteConversation: (id: string) => Promise<void>;
  /** 获取可用模型 */
  availableModels: AIModel[];
}

// ========================================
// useAIHub Hook
// ========================================

export function useAIHub(): UseAIHubReturn {
  const [models, setModels] = useState<AIModel[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 模拟获取数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setModels(MOCK_MODELS);
      setAgents(MOCK_AGENTS);
      setConversations(MOCK_CONVERSATIONS);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch AI Hub data'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 获取模型
  const getModel = useCallback((id: string): AIModel | undefined => {
    return models.find((m) => m.id === id);
  }, [models]);

  // 获取助手
  const getAgent = useCallback((id: string): AIAgent | undefined => {
    return agents.find((a) => a.id === id);
  }, [agents]);

  // 获取对话
  const getConversation = useCallback((id: string): AIConversation | undefined => {
    return conversations.find((c) => c.id === id);
  }, [conversations]);

  // 创建助手
  const createAgent = useCallback(async (data: Partial<AIAgent>): Promise<AIAgent> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const model = data.model || models[0];
    const newAgent: AIAgent = {
      id: String(Date.now()),
      name: data.name || 'New Agent',
      description: data.description || '',
      model,
      systemPrompt: data.systemPrompt || '',
      tools: data.tools || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAgents((prev) => [newAgent, ...prev]);
    return newAgent;
  }, [models]);

  // 更新助手
  const updateAgent = useCallback(async (id: string, data: Partial<AIAgent>): Promise<AIAgent> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const agentIndex = agents.findIndex((a) => a.id === id);
    if (agentIndex === -1) {
      throw new Error(`Agent with id ${id} not found`);
    }
    
    const updatedAgent = {
      ...agents[agentIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? updatedAgent : a))
    );
    
    return updatedAgent;
  }, [agents]);

  // 删除助手
  const deleteAgent = useCallback(async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // 创建对话
  const createConversation = useCallback(async (agentId: string, title?: string): Promise<AIConversation> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const agent = getAgent(agentId);
    const newConversation: AIConversation = {
      id: String(Date.now()),
      title: title || `与 ${agent?.name || 'AI'} 的对话`,
      agentId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setConversations((prev) => [newConversation, ...prev]);
    return newConversation;
  }, [getAgent]);

  // 发送消息
  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<AIMessage> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const userMessage: AIMessage = {
      id: String(Date.now()),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    // 模拟 AI 回复
    const aiMessage: AIMessage = {
      id: String(Date.now() + 1),
      role: 'assistant',
      content: `这是模拟的 AI 回复。您说的是："${content}"\n\n在实际应用中，这里会调用真实的 AI API 获取回复。`,
      timestamp: new Date().toISOString(),
    };
    
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage, aiMessage],
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    
    return aiMessage;
  }, []);

  // 删除对话
  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // 可用模型
  const availableModels = models.filter((m) => m.status === 'available');

  return {
    models,
    agents,
    conversations,
    loading,
    error,
    refresh: fetchData,
    getModel,
    getAgent,
    getConversation,
    createAgent,
    updateAgent,
    deleteAgent,
    createConversation,
    sendMessage,
    deleteConversation,
    availableModels,
  };
}

// ========================================
// useConversation Hook (单个对话)
// ========================================

export interface UseConversationReturn {
  /** 对话 */
  conversation: AIConversation | null;
  /** 助手 */
  agent: AIAgent | null;
  /** 加载状态 */
  loading: boolean;
  /** 发送消息 */
  send: (content: string) => Promise<void>;
  /** 清空对话 */
  clear: () => Promise<void>;
}

export function useConversation(id: string): UseConversationReturn {
  const { getConversation, getAgent, sendMessage, loading } = useAIHub();
  const [conversation, setConversation] = useState<AIConversation | null>(null);
  const [agent, setAgent] = useState<AIAgent | null>(null);

  useEffect(() => {
    const conv = getConversation(id);
    setConversation(conv || null);
    if (conv) {
      setAgent(getAgent(conv.agentId) || null);
    }
  }, [id, getConversation, getAgent]);

  const send = useCallback(
    async (content: string) => {
      if (!id) return;
      await sendMessage(id, content);
      // 更新本地对话状态
      const updated = getConversation(id);
      setConversation(updated || null);
    },
    [id, sendMessage, getConversation]
  );

  const clear = useCallback(async () => {
    // 清空对话消息
    setConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [],
            updatedAt: new Date().toISOString(),
          }
        : null
    );
  }, []);

  return {
    conversation,
    agent,
    loading,
    send,
    clear,
  };
}
