import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { cn, formatDateTime, formatRelativeTime } from '@/lib/utils'
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Info,
  AlertTriangle,
  XCircle,
  Bug,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Clock
} from 'lucide-react'
import type { LogEntry } from '@/types'

// Mock logs data
const mockLogs: LogEntry[] = [
  {
    id: '1',
    level: 'error',
    message: 'Failed to connect to database: Connection timeout after 30000ms',
    source: 'DatabaseService',
    timestamp: '2024-01-20T15:30:00Z',
    metadata: { retryCount: 3, host: 'db.bunnyera.local', port: 5432 }
  },
  {
    id: '2',
    level: 'warn',
    message: 'API rate limit approaching: 85% of quota used',
    source: 'APIService',
    timestamp: '2024-01-20T15:25:00Z',
    metadata: { quota: 1000, used: 850, resetTime: '2024-01-20T16:00:00Z' }
  },
  {
    id: '3',
    level: 'info',
    message: 'User authentication successful',
    source: 'AuthService',
    timestamp: '2024-01-20T15:20:00Z',
    metadata: { userId: 'user_123', method: 'oauth', provider: 'google' }
  },
  {
    id: '4',
    level: 'debug',
    message: 'Cache hit for key: project:list:all',
    source: 'CacheService',
    timestamp: '2024-01-20T15:15:00Z',
    metadata: { key: 'project:list:all', ttl: 300 }
  },
  {
    id: '5',
    level: 'info',
    message: 'Scheduled task completed: Daily backup',
    source: 'Scheduler',
    timestamp: '2024-01-20T15:00:00Z',
    metadata: { task: 'daily_backup', duration: 4523 }
  },
  {
    id: '6',
    level: 'warn',
    message: 'Slow query detected: SELECT * FROM projects took 2.5s',
    source: 'DatabaseService',
    timestamp: '2024-01-20T14:55:00Z',
    metadata: { query: 'SELECT * FROM projects', duration: 2500 }
  },
  {
    id: '7',
    level: 'error',
    message: 'File upload failed: File size exceeds limit',
    source: 'FileService',
    timestamp: '2024-01-20T14:50:00Z',
    metadata: { fileName: 'large-file.zip', size: 52428800, limit: 20971520 }
  },
  {
    id: '8',
    level: 'info',
    message: 'New project created: "Mobile App v2"',
    source: 'ProjectService',
    timestamp: '2024-01-20T14:45:00Z',
    metadata: { projectId: 'proj_456', projectName: 'Mobile App v2', userId: 'user_123' }
  },
  {
    id: '9',
    level: 'debug',
    message: 'Webhook received from GitHub',
    source: 'WebhookService',
    timestamp: '2024-01-20T14:40:00Z',
    metadata: { event: 'push', repository: 'bunnyera/console', branch: 'main' }
  },
  {
    id: '10',
    level: 'info',
    message: 'Email notification sent successfully',
    source: 'EmailService',
    timestamp: '2024-01-20T14:35:00Z',
    metadata: { to: 'user@example.com', subject: 'Project Update', template: 'project_update' }
  }
]

const levelConfig = {
  info: {
    label: 'Info',
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  warn: {
    label: 'Warning',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200'
  },
  error: {
    label: 'Error',
    icon: XCircle,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-200'
  },
  debug: {
    label: 'Debug',
    icon: Bug,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  }
}

export function LogsPage() {
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  const toggleExpand = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter
    return matchesSearch && matchesLevel && matchesSource
  })

  // Get unique sources for filter
  const sources = Array.from(new Set(logs.map(log => log.source)))

  // Calculate stats
  const stats = {
    total: logs.length,
    errors: logs.filter(l => l.level === 'error').length,
    warnings: logs.filter(l => l.level === 'warn').length,
    info: logs.filter(l => l.level === 'info').length
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logs</h1>
          <p className="text-muted-foreground mt-1">
            Monitor system activity and debug issues
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="outline" leftIcon={<Trash2 className="w-4 h-4" />}>
            Clear
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-600">{stats.errors}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.warnings}</p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.info}</p>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full h-10 pl-10 pr-4 rounded-lg',
                    'bg-muted/50 border-0',
                    'text-sm placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white',
                    'transition-all duration-200'
                  )}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className={cn(
                  'h-10 px-4 rounded-lg',
                  'bg-muted/50 border-0',
                  'text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'cursor-pointer'
                )}
              >
                <option value="all">All Levels</option>
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className={cn(
                  'h-10 px-4 rounded-lg',
                  'bg-muted/50 border-0',
                  'text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'cursor-pointer'
                )}
              >
                <option value="all">All Sources</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
              <Button variant="ghost" leftIcon={<RefreshCw className="w-4 h-4" />}>
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredLogs.map((log) => {
              const level = levelConfig[log.level]
              const LevelIcon = level.icon
              const isExpanded = expandedLogs.has(log.id)

              return (
                <div
                  key={log.id}
                  className={cn(
                    'hover:bg-muted/50 transition-colors',
                    log.level === 'error' && 'bg-rose-50/50'
                  )}
                >
                  <div
                    className="flex items-start gap-3 p-4 cursor-pointer"
                    onClick={() => toggleExpand(log.id)}
                  >
                    <button className="mt-0.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    <div className={cn(
                      'w-6 h-6 rounded flex items-center justify-center flex-shrink-0',
                      level.bgColor
                    )}>
                      <LevelIcon className={cn('w-3.5 h-3.5', level.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded', level.bgColor, level.color)}>
                          {level.label}
                        </span>
                        <span className="text-sm font-medium text-foreground">{log.source}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{log.message}</p>
                    </div>

                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Expanded Metadata */}
                  {isExpanded && log.metadata && (
                    <div className="px-4 pb-4 pl-14">
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Metadata</p>
                        <pre className="text-xs text-foreground overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(log.timestamp)}
                        </span>
                        <span>ID: {log.id}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ScrollText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No logs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setLevelFilter('all')
                setSourceFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
