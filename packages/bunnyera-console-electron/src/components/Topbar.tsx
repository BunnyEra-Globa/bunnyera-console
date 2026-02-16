import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Bell,
  User,
  Command,
  Moon,
  Sun,
  MoreHorizontal
} from 'lucide-react'

interface TopbarProps {
  onSearch?: (query: string) => void
}

export function Topbar({ onSearch }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDark, setIsDark] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-border">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search projects, resources, logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full h-10 pl-10 pr-20 rounded-lg',
              'bg-muted/50 border-0',
              'text-sm placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white',
              'transition-all duration-200'
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
          </div>
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'p-2 rounded-lg text-muted-foreground',
            'hover:bg-muted hover:text-foreground',
            'transition-colors'
          )}
          title="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className={cn(
            'relative p-2 rounded-lg text-muted-foreground',
            'hover:bg-muted hover:text-foreground',
            'transition-colors'
          )}
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* User Menu */}
        <button
          className={cn(
            'flex items-center gap-2 p-1.5 pl-3 rounded-lg',
            'text-muted-foreground hover:bg-muted hover:text-foreground',
            'transition-colors'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-be-purple to-be-blue flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium">Admin</span>
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
