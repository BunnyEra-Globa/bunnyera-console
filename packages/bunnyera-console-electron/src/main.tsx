import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Log that the renderer process has started
console.log('[Renderer] BunnyEra Console starting...')

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.bunnyeraAPI !== undefined
console.log('[Renderer] Running in Electron:', isElectron)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
