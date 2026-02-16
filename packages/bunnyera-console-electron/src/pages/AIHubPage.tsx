import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { cn, generateId } from '@/lib/utils'
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  MoreHorizontal,
  Plus,
  MessageSquare,
  Trash2,
  Settings,
  Wand2
} from 'lucide-react'
import type { ChatMessage } from '@/types'

// Mock AI responses
const mockResponses: Record<string, string> = {
  'hello': 'Hello! I\'m your AI assistant. How can I help you today?',
  'hi': 'Hi there! What can I do for you?',
  'help': 'I can help you with:\n\n• Answering questions about your projects\n• Summarizing documents\n• Writing code snippets\n• Brainstorming ideas\n• And much more!\n\nWhat would you like to explore?',
  'default': 'I understand you\'re asking about that. As an AI assistant integrated into BunnyEra Console, I can help you manage your projects, analyze resources, and provide insights. Could you provide more details about what you\'d like to know?'
}

const mockChatHistory = [
  { id: '1', title: 'Project Planning Help', date: '2024-01-20' },
  { id: '2', title: 'Code Review Request', date: '2024-01-19' },
  { id: '3', title: 'API Design Discussion', date: '2024-01-18' },
]

export function AIHubPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your BunnyEra AI assistant. I can help you with project management, code review, brainstorming, and more. What would you like to work on today?',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeChat, setActiveChat] = useState('current')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    return mockResponses.default
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: getAIResponse(userMessage.content),
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your BunnyEra AI assistant. I can help you with project management, code review, brainstorming, and more. What would you like to work on today?',
        timestamp: new Date().toISOString()
      }
    ])
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in">
      {/* Sidebar - Chat History */}
      <div className="w-64 flex-shrink-0 hidden lg:flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-4 flex flex-col h-full">
            <Button
              className="w-full mb-4"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={clearChat}
            >
              New Chat
            </Button>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                  activeChat === 'current'
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-foreground'
                )}
                onClick={() => setActiveChat('current')}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm truncate">Current Chat</span>
              </div>

              <div className="pt-4 pb-2">
                <p className="text-xs font-medium text-muted-foreground px-3">Recent</p>
              </div>

              {mockChatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors group',
                    activeChat === chat.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-foreground'
                  )}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{chat.date}</p>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted-foreground/20 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <button className="flex items-center gap-2 px-3 py-2 w-full rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-be-purple to-be-blue flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">BunnyEra AI</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={clearChat}
            >
              Reset
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-4',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                message.role === 'user'
                  ? 'bg-muted'
                  : 'bg-gradient-to-br from-be-purple to-be-blue'
              )}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={cn(
                'flex-1 max-w-[80%]',
                message.role === 'user' && 'text-right'
              )}>
                <div
                  className={cn(
                    'inline-block text-left px-4 py-3 rounded-2xl',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>

                {/* Message Actions */}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded hover:bg-muted" title="Copy">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-muted" title="Helpful">
                      <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-muted" title="Not helpful">
                      <ThumbsDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-be-purple to-be-blue flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className={cn(
                  'w-full px-4 py-3 pr-12 rounded-xl',
                  'bg-muted border-0 resize-none',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'transition-all duration-200'
                )}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'p-2 rounded-lg transition-colors',
                  inputValue.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted-foreground/20 text-muted-foreground cursor-not-allowed'
                )}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </Card>

      {/* Quick Actions Sidebar */}
      <div className="w-64 flex-shrink-0 hidden xl:block">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                Summarize document
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                Generate code snippet
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                Brainstorm ideas
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                Review project plan
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                Analyze logs
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="font-medium text-foreground mb-3 text-sm">Tips</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Be specific in your questions
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Use /help for commands
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  Reference projects by name
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
