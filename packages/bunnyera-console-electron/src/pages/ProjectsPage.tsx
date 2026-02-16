import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { cn, formatDate, truncate } from '@/lib/utils'
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Tag,
  TrendingUp,
  CheckCircle2,
  PauseCircle,
  Archive,
  PlayCircle
} from 'lucide-react'
import type { Project } from '@/types'

// Mock projects data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX principles, responsive design, and improved performance.',
    status: 'active',
    progress: 65,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tags: ['design', 'frontend', 'ui/ux']
  },
  {
    id: '2',
    name: 'API Integration',
    description: 'Integrating third-party payment APIs and implementing webhook handlers for real-time updates.',
    status: 'active',
    progress: 40,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    tags: ['backend', 'api', 'payment']
  },
  {
    id: '3',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application using React Native for iOS and Android.',
    status: 'paused',
    progress: 25,
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-18T10:20:00Z',
    tags: ['mobile', 'react-native', 'ios', 'android']
  },
  {
    id: '4',
    name: 'Database Migration',
    description: 'Migrating from MongoDB to PostgreSQL for better relational data handling.',
    status: 'completed',
    progress: 100,
    createdAt: '2023-12-20T08:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    tags: ['database', 'migration', 'backend']
  },
  {
    id: '5',
    name: 'Legacy System Archive',
    description: 'Archiving old legacy system data and documentation.',
    status: 'archived',
    progress: 100,
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2023-12-01T16:00:00Z',
    tags: ['archive', 'legacy']
  },
  {
    id: '6',
    name: 'AI Chatbot Integration',
    description: 'Implementing AI-powered customer support chatbot using OpenAI API.',
    status: 'active',
    progress: 55,
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
    tags: ['ai', 'chatbot', 'openai']
  }
]

const statusConfig = {
  active: {
    label: 'Active',
    icon: PlayCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200'
  },
  paused: {
    label: 'Paused',
    icon: PauseCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  }
}

export function ProjectsPage() {
  const [projects] = useState<Project[]>(mockProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your projects
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
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
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={cn(
                  'h-10 px-4 rounded-lg',
                  'bg-muted/50 border-0',
                  'text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'cursor-pointer'
                )}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const status = statusConfig[project.status]
          const StatusIcon = status.icon

          return (
            <Card key={project.id} hover className="group">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    'bg-gradient-to-br from-be-purple/20 to-be-blue/20'
                  )}>
                    <FolderKanban className="w-5 h-5 text-be-purple" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                      status.bgColor,
                      status.color
                    )}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <button className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {truncate(project.description, 100)}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        project.progress === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-be-purple to-be-blue'
                      )}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                    <div className="flex gap-1">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(project.updatedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <FolderKanban className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
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
