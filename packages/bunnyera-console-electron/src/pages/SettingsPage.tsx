import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input, Select } from '@/components/Input'
import { cn } from '@/lib/utils'
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Globe,
  Bell,
  Shield,
  Database,
  Keyboard,
  Info,
  ChevronRight,
  Check,
  Laptop,
  Save,
  RotateCcw
} from 'lucide-react'
import type { AppSettings } from '@/types'

// Mock settings
const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  notifications: true,
  autoSave: true,
  sidebarCollapsed: false
}

const languageOptions = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'ko-KR', label: '한국어' }
]

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState('general')

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    // Mock save
    console.log('Saving settings:', settings)
    setHasChanges(false)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  const settingsSections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'about', label: 'About', icon: Info }
  ]

  return (
    <div className="flex gap-6 animate-in h-[calc(100vh-8rem)]">
      {/* Settings Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Card className="h-full">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Customize your BunnyEra Console experience
              </p>
            </div>
            {hasChanges && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  onClick={resetSettings}
                >
                  Reset
                </Button>
                <Button
                  leftIcon={<Save className="w-4 h-4" />}
                  onClick={saveSettings}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Language & Region</CardTitle>
                  <CardDescription>
                    Choose your preferred language and regional settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    label="Language"
                    options={languageOptions}
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Auto Save</CardTitle>
                  <CardDescription>
                    Automatically save your work as you make changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Enable Auto Save</p>
                      <p className="text-sm text-muted-foreground">
                        Changes will be saved automatically every 30 seconds
                      </p>
                    </div>
                    <button
                      onClick={() => updateSetting('autoSave', !settings.autoSave)}
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors relative',
                        settings.autoSave ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                          settings.autoSave ? 'left-7' : 'left-1'
                        )}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Choose how BunnyEra Console looks to you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => updateSetting('theme', 'light')}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        settings.theme === 'light'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      )}
                    >
                      <Sun className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                      <p className="font-medium text-foreground">Light</p>
                      {settings.theme === 'light' && (
                        <Check className="w-4 h-4 mx-auto mt-2 text-primary" />
                      )}
                    </button>

                    <button
                      onClick={() => updateSetting('theme', 'dark')}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        settings.theme === 'dark'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      )}
                    >
                      <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                      <p className="font-medium text-foreground">Dark</p>
                      {settings.theme === 'dark' && (
                        <Check className="w-4 h-4 mx-auto mt-2 text-primary" />
                      )}
                    </button>

                    <button
                      onClick={() => updateSetting('theme', 'system')}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        settings.theme === 'system'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      )}
                    >
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium text-foreground">System</p>
                      {settings.theme === 'system' && (
                        <Check className="w-4 h-4 mx-auto mt-2 text-primary" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sidebar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Start Collapsed</p>
                      <p className="text-sm text-muted-foreground">
                        Start with the sidebar collapsed
                      </p>
                    </div>
                    <button
                      onClick={() => updateSetting('sidebarCollapsed', !settings.sidebarCollapsed)}
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors relative',
                        settings.sidebarCollapsed ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                          settings.sidebarCollapsed ? 'left-7' : 'left-1'
                        )}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-foreground">Enable Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about important events
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('notifications', !settings.notifications)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      settings.notifications ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                        settings.notifications ? 'left-7' : 'left-1'
                      )}
                    />
                  </button>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-3">Notification Types</h4>
                  <div className="space-y-3">
                    {['Project Updates', 'System Alerts', 'Weekly Reports', 'Team Mentions'].map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{type}</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy</CardTitle>
                  <CardDescription>
                    Control your privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-foreground">Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        Help improve BunnyEra by sending anonymous usage data
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-foreground">Crash Reports</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically send crash reports to help us fix issues
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Change Password</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Two-Factor Authentication</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Active Sessions</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Data Settings */}
          {activeSection === 'data' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Storage</CardTitle>
                  <CardDescription>
                    Manage your local data and storage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Storage Used</span>
                      <span className="text-sm text-muted-foreground">245 MB / 1 GB</span>
                    </div>
                    <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full w-[24%] bg-gradient-to-r from-be-purple to-be-blue rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <span>Export Data</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Import Data</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between text-destructive hover:text-destructive">
                    <span>Clear All Data</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Shortcuts Settings */}
          {activeSection === 'shortcuts' && (
            <Card>
              <CardHeader>
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>
                  Customize your keyboard shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'New Project', shortcut: 'Ctrl + N' },
                    { action: 'Search', shortcut: 'Ctrl + K' },
                    { action: 'Save', shortcut: 'Ctrl + S' },
                    { action: 'Refresh', shortcut: 'Ctrl + R' },
                    { action: 'Toggle Sidebar', shortcut: 'Ctrl + B' },
                    { action: 'Settings', shortcut: 'Ctrl + ,' }
                  ].map(({ action, shortcut }) => (
                    <div
                      key={action}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-foreground">{action}</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                        {shortcut}
                      </kbd>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* About Settings */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-be-purple to-be-blue flex items-center justify-center">
                    <Laptop className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text mb-1">BunnyEra Console</h2>
                  <p className="text-muted-foreground mb-4">Version 1.0.0</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    A modern control center for one-person companies.
                    Manage projects, resources, AI workflows, and more.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Version</span>
                    <span className="text-sm font-medium">1.0.0 (Build 2024.01.20)</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Electron</span>
                    <span className="text-sm font-medium">28.0.0</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">React</span>
                    <span className="text-sm font-medium">18.2.0</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Node.js</span>
                    <span className="text-sm font-medium">20.10.0</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" size="sm">Documentation</Button>
                    <Button variant="outline" size="sm">Release Notes</Button>
                    <Button variant="outline" size="sm">Report Issue</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
