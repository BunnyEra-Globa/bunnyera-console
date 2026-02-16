// ============================================
// AIHubApp - AI 工作中心
// ============================================

import React, { useEffect, useRef, useState } from 'react';
import { mockApi } from '../../core';
import type { Agent, ChatSession, ChatMessage } from '../../types';

// 消息气泡组件
interface MessageBubbleProps {
  message: ChatMessage;
  agent?: Agent;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, agent }) => {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      {/* 头像 */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: isUser ? '#3b82f6' : '#10b981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        flexShrink: 0,
      }}>
        {isUser ? '👤' : '🤖'}
      </div>

      {/* 消息内容 */}
      <div style={{
        maxWidth: '70%',
        padding: '12px 16px',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser ? '#3b82f6' : '#f3f4f6',
        color: isUser ? '#fff' : '#374151',
        fontSize: '14px',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
      }}>
        {!isUser && agent && (
          <div style={{
            fontSize: '11px',
            color: '#10b981',
            marginBottom: '4px',
            fontWeight: '500',
          }}>
            {agent.name}
          </div>
        )}
        {message.content}
      </div>

      {/* 时间 */}
      <div style={{
        fontSize: '11px',
        color: '#9ca3af',
        alignSelf: 'flex-end',
        whiteSpace: 'nowrap',
      }}>
        {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

// 会话列表项组件
interface SessionItemProps {
  session: ChatSession;
  agent?: Agent;
  isActive: boolean;
  onClick: () => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, agent, isActive, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: '12px 16px',
      borderRadius: '10px',
      cursor: 'pointer',
      background: isActive ? '#eff6ff' : 'transparent',
      border: `1px solid ${isActive ? '#bfdbfe' : 'transparent'}`,
      transition: 'all 0.2s',
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.currentTarget.style.background = '#f9fafb';
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.currentTarget.style.background = 'transparent';
      }
    }}
  >
    <div style={{
      fontWeight: '500',
      color: isActive ? '#1d4ed8' : '#374151',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}>
      {session.title}
    </div>
    <div style={{
      fontSize: '12px',
      color: '#6b7280',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span>{agent?.name || 'AI 助手'}</span>
      <span>{new Date(session.updatedAt).toLocaleDateString('zh-CN')}</span>
    </div>
  </div>
);

// ============================================
// AIHubApp 主组件
// ============================================

export interface AIHubAppProps {
  className?: string;
}

export const AIHubApp: React.FC<AIHubAppProps> = ({ className }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [agentsData, sessionsData] = await Promise.all([
        mockApi.aiHub.getAgents(),
        mockApi.aiHub.getSessions(),
      ]);
      setAgents(agentsData);
      setSessions(sessionsData);
      if (agentsData.length > 0) {
        setSelectedAgent(agentsData[0].id);
      }
      if (sessionsData.length > 0) {
        const firstSession = await mockApi.aiHub.getSessionById(sessionsData[0].id);
        setCurrentSession(firstSession);
      }
    } catch (error) {
      console.error('Failed to load AI Hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSessionClick = async (sessionId: string) => {
    const session = await mockApi.aiHub.getSessionById(sessionId);
    setCurrentSession(session);
  };

  const handleCreateSession = async () => {
    if (!selectedAgent) return;
    const agent = agents.find(a => a.id === selectedAgent);
    const newSession = await mockApi.aiHub.createSession(
      selectedAgent,
      `与 ${agent?.name || 'AI'} 的新对话`
    );
    setSessions([newSession, ...sessions]);
    setCurrentSession(newSession);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      await mockApi.aiHub.sendMessage(currentSession.id, message);
      const updatedSession = await mockApi.aiHub.getSessionById(currentSession.id);
      setCurrentSession(updatedSession);
      // 更新会话列表
      const updatedSessions = await mockApi.aiHub.getSessions();
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const getAgentById = (id: string) => agents.find(a => a.id === id);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#6b7280',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤖</div>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height: '100%', display: 'flex' }}>
      {/* 左侧会话列表 */}
      <div style={{
        width: '280px',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        background: '#f9fafb',
      }}>
        {/* 头部 */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 12px 0',
          }}>
            AI 工作中心
          </h2>

          {/* Agent 选择 */}
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '13px',
              background: '#fff',
              marginBottom: '12px',
            }}
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name} - {agent.description}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreateSession}
            style={{
              width: '100%',
              padding: '10px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>+</span> 新建对话
          </button>
        </div>

        {/* 会话列表 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px',
        }}>
          {sessions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
              <div style={{ fontSize: '13px' }}>暂无会话</div>
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.id} style={{ marginBottom: '4px' }}>
                <SessionItem
                  session={session}
                  agent={getAgentById(session.agentId)}
                  isActive={currentSession?.id === session.id}
                  onClick={() => handleSessionClick(session.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* 右侧对话区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
      }}>
        {currentSession ? (
          <>
            {/* 对话头部 */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 4px 0',
                }}>
                  {currentSession.title}
                </h3>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {getAgentById(currentSession.agentId)?.name || 'AI 助手'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: '#374151',
                }}>
                  重命名
                </button>
                <button style={{
                  padding: '8px 12px',
                  background: '#fee2e2',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: '#dc2626',
                }}>
                  删除
                </button>
              </div>
            </div>

            {/* 消息列表 */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {currentSession.messages.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#9ca3af',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                    开始新的对话
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    输入您的问题，{getAgentById(currentSession.agentId)?.name || 'AI 助手'} 将为您解答
                  </div>
                </div>
              ) : (
                currentSession.messages.map(message => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    agent={getAgentById(message.agentId || currentSession.agentId)}
                  />
                ))
              )}
              {sending && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}>
                    🤖
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px 16px 16px 4px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}>
                    <span style={{ display: 'inline-flex', gap: '4px' }}>
                      <span style={{ animation: 'bounce 1s infinite' }}>.</span>
                      <span style={{ animation: 'bounce 1s infinite 0.2s' }}>.</span>
                      <span style={{ animation: 'bounce 1s infinite 0.4s' }}>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end',
              }}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="输入您的问题... (Enter 发送, Shift+Enter 换行)"
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    resize: 'none',
                    minHeight: '44px',
                    maxHeight: '120px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sending}
                  style={{
                    padding: '12px 24px',
                    background: inputMessage.trim() && !sending ? '#3b82f6' : '#e5e7eb',
                    color: inputMessage.trim() && !sending ? '#fff' : '#9ca3af',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    cursor: inputMessage.trim() && !sending ? 'pointer' : 'not-allowed',
                    fontWeight: '500',
                  }}
                >
                  发送
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤖</div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>欢迎使用 AI 工作中心</div>
              <div style={{ fontSize: '14px' }}>选择一个会话或创建新对话开始</div>
            </div>
          </div>
        )}
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default AIHubApp;
