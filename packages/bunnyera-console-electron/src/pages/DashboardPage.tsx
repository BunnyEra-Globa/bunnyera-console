import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, StatCard } from '@/components/Card'
import { Button } from '@/components/Button'
import { cn, formatRelativeTime } from '@/lib/utils'
import {
  FolderKanban,
  Database,
  AlertTriangle,
  ScrollText,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight,
  Clock,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react'
import type { DashboardStats, Project, LogEntry } from '@/types'

// Mock data
const mockStats: DashboardStats = {
  totalProjects: 24,
  activeProjects: 12,
  totalResources: 156,
  totalLogs: 3420,
  errorCount: 3,
  warningCount: 12
}

const mockRecentProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesigning the company website with modern UI',
    status: 'active',
    progress: 65,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tags: ['design', 'frontend']
  },
  {
    id: '2',
    name: 'API Integration',
    description: 'Integrating third-party APIs for payment processing',
    status: 'active',
    progress: 40,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    tags: ['backend', 'api']
  },
  {
    id: '3',
    name: 'Mobile App',
    description: 'Developing cross-platform mobile application',
    status: 'paused',
    progress: 25,
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-18T10:20:00Z',
    tags: ['mobile', 'react-native']
  }
]

const mockRecentLogs: LogEntry[] = [
  {
    id: '1',
    level: 'error',
    message: 'Failed to connect to database',
    source: 'DatabaseService',
    timestamp: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    level: 'warn',
    message: 'API rate limit approaching',
    source: 'APIService',
    timestamp: '2024-01-20T15:25:00Z'
  },
  {
    id: '3',
    level: 'info',
    message: 'User authentication successful',
    source: 'AuthService',
    timestamp: '2024-01-20T15:20:00Z'
  },
  {
    id: '4',
    level: 'info',
    message: 'Scheduled task completed',
    source: 'Scheduler',
    timestamp: '2024-01-20T15:15:00Z'
  }
]

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  archived: 'bg-gray-100 text-gray-700'
}

const logLevelColors = {
  info: 'bg-blue-100 text-blue-700',
  warn: 'bg-amber-100 text-amber-700',
  error: 'bg-rose-100 text-rose-700',
  debug: 'bg-gray-100 text-gray-700'
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [recentProjects] = useState<Project[]>(mockRecentProjects)
  const [recentLogs] = useState<LogEntry[]>(mockRecentLogs)

  useEffect(() => {
    // Simulate fetching stats
    const timer = setTimeout(() => {
      setStats(mockStats)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <Button leftIcon={<Activity className="w-4 h-4" />}>
          View Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          description={`${stats.activeProjects} active`}
          icon={<FolderKanban className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
          color="purple"
        />
        <StatCard
          title="Resources"
          value={stats.totalResources}
          description="Files, links & notes"
          icon={<Database className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Total Logs"
          value={stats.totalLogs.toLocaleString()}
          description="Last 30 days"
          icon={<ScrollText className="w-6 h-6" />}
          trend={{ value: 24, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Issues"
          value={stats.errorCount + stats.warningCount}
          description={`${stats.errorCount} errors, ${stats.warningCount} warnings`}
          icon={<AlertTriangle className="w-6 h-6" />}
          trend={{ value: 5, isPositive: false }}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your latest project updates
              </p>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      'bg-gradient-to-br from-be-purple/20 to-be-blue/20'
                    )}>
                      <FolderKanban className="w-5 h-5 text-be-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-be-purple to-be-blue rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      statusColors[project.status]
                    )}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" leftIcon={<Zap className="w-4 h-4" />}>
                Create New Project
              </Button>
              <Button variant="outline" className="w-full justify-start" leftIcon={<Database className="w-4 h-4" />}>
                Add Resource
              </Button>
              <Button variant="outline" className="w-full justify-start" leftIcon={<TrendingUp className="w-4 h-4" />}>
                View Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Logs</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <span className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium mt-0.5',
                      logLevelColors[log.level]
                    )}>
                      {log.level}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{log.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{log.source}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(log.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">All Systems Operational</h4>
                <p className="text-sm text-muted-foreground">Last checked: {formatRelativeTime(new Date().toISOString())}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Running smoothly
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
