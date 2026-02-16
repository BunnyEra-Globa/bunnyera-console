import { contextBridge, ipcRenderer } from 'electron'

// Define the API interface for TypeScript
export interface BunnyEraAPI {
  getAppInfo: () => Promise<{
    name: string
    version: string
    description: string
  }>
  log: (message: string) => Promise<{ success: boolean }>
  platform: string
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('bunnyeraAPI', {
  // Get application information
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  
  // Log a message to the main process
  log: (message: string) => ipcRenderer.invoke('log-message', message),
  
  // Platform information (read-only)
  platform: process.platform,
})

// Type declaration for the global window object
declare global {
  interface Window {
    bunnyeraAPI: BunnyEraAPI
  }
}

// Log that preload script has loaded
console.log('[Preload] BunnyEra API exposed to window.bunnyeraAPI')
