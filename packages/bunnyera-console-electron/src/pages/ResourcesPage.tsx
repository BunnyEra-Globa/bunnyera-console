import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Button } from '@/components/Button'
import { cn, formatDate, truncate } from '@/lib/utils'
import {
  Database,
  Plus,
  Search,
  Filter,
  FileText,
  Folder,
  Link2,
  StickyNote,
  MoreVertical,
  Download,
  ExternalLink,
  Copy,
  Trash2,
  Grid3X3,
  List,
  Image as ImageIcon
} from 'lucide-react'
import type { Resource } from '@/types'

// Mock resources data
const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Project Requirements.pdf',
    type: 'file',
    size: '2.4 MB',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tags: ['document', 'requirements']
  },
  {
    id: '2',
    name: 'Design Assets',
    type: 'folder',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    tags: ['design', 'assets']
  },
  {
    id: '3',
    name: 'API Documentation',
    type: 'link',
    url: 'https://api.docs.example.com',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-18T10:20:00Z',
    tags: ['api', 'docs']
  },
  {
    id: '4',
    name: 'Meeting Notes - Jan 20',
    type: 'note',
    content: 'Discussion points:\n- Review Q1 goals\n- Discuss new features\n- Assign tasks',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    tags: ['meeting', 'notes']
  },
  {
    id: '5',
    name: 'Logo Assets.zip',
    type: 'file',
    size: '15.8 MB',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    tags: ['design', 'logo']
  },
  {
    id: '6',
    name: 'Style Guide',
    type: 'link',
    url: 'https://styleguide.example.com',
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-16T14:00:00Z',
    tags: ['design', 'styleguide']
  },
  {
    id: '7',
    name: 'Database Schema',
    type: 'note',
    content: 'Users table:\n- id (PK)\n- email\n- name\n- created_at\n\nProjects table:\n- id (PK)\n- name\n- user_id (FK)',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-19T11:00:00Z',
    tags: ['database', 'schema']
  },
  {
    id: '8',
    name: 'Screenshots',
    type: 'folder',
    createdAt: '2024-01-14T16:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
    tags: ['images', 'screenshots']
  }
]

const typeConfig = {
  file: {
    label: 'File',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  folder: {
    label: 'Folder',
    icon: Folder,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  link: {
    label: 'Link',
    icon: Link2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  note: {
    label: 'Note',
    icon: StickyNote,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
}

export function ResourcesPage() {
  const [resources] = useState<Resource[]>(mockResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === 'all' || resource.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Manage your files, links, and notes
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add Resource
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
                  placeholder="Search resources..."
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={cn(
                  'h-10 px-4 rounded-lg',
                  'bg-muted/50 border-0',
                  'text-sm text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'cursor-pointer'
                )}
              >
                <option value="all">All Types</option>
                <option value="file">Files</option>
                <option value="folder">Folders</option>
                <option value="link">Links</option>
                <option value="note">Notes</option>
              </select>
              <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResources.map((resource) => {
            const type = typeConfig[resource.type]
            const TypeIcon = type.icon

            return (
              <Card key={resource.id} hover className="group">
                <CardContent className="p-4">
                  {/* Icon & Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      type.bgColor
                    )}>
                      <TypeIcon className={cn('w-6 h-6', type.color)} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {resource.type === 'link' && (
                        <button className="p-1.5 rounded hover:bg-muted" title="Open link">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button className="p-1.5 rounded hover:bg-muted" title="Copy">
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted" title="Delete">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-medium text-foreground mb-1 truncate">{resource.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', type.bgColor, type.color)}>
                      {type.label}
                    </span>
                    {resource.size && (
                      <span className="text-xs text-muted-foreground">{resource.size}</span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex gap-1">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(resource.updatedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredResources.map((resource) => {
                const type = typeConfig[resource.type]
                const TypeIcon = type.icon

                return (
                  <div
                    key={resource.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      type.bgColor
                    )}>
                      <TypeIcon className={cn('w-5 h-5', type.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{resource.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={cn('text-xs px-1.5 py-0.5 rounded', type.bgColor, type.color)}>
                          {type.label}
                        </span>
                        {resource.size && <span>{resource.size}</span>}
                        <span>•</span>
                        <span>{formatDate(resource.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {resource.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {resource.type === 'link' && (
                        <button className="p-2 rounded hover:bg-muted" title="Open link">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button className="p-2 rounded hover:bg-muted" title="Copy">
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded hover:bg-muted" title="Delete">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Database className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setTypeFilter('all')
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
