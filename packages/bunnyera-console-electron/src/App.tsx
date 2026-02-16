import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { AIHubPage } from '@/pages/AIHubPage'
import { LogsPage } from '@/pages/LogsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useEffect } from 'react'
import { logToMain } from '@/lib/utils'

function App() {
  useEffect(() => {
    // Log app initialization
    logToMain('BunnyEra Console initialized')

    // Add electron class to body if running in Electron
    if (typeof window !== 'undefined' && window.bunnyeraAPI !== undefined) {
      document.body.classList.add('electron')
    }
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/ai-hub" element={<AIHubPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
