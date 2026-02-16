import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

// App information
const appInfo = {
  name: 'BunnyEra Console',
  version: '1.0.0',
  description: 'A modern control center for one-person company'
}

// Keep a global reference of the window object to prevent garbage collection
let mainWindow: BrowserWindow | null = null

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Get preload script path
const getPreloadPath = () => {
  if (isDev) {
    return path.join(__dirname, 'preload.js')
  }
  return path.join(__dirname, 'preload.js')
}

// Get HTML file URL
const getHTMLPath = () => {
  if (isDev) {
    return 'http://localhost:5173'
  }
  return `file://${path.join(__dirname, '../dist/index.html')}`
}

// Create the main application window
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    title: 'BunnyEra Console',
    show: false, // Don't show until ready
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Required for preload script to work properly
    },
    titleBarStyle: 'default',
    backgroundColor: '#ffffff',
  })

  // Load the app
  const htmlPath = getHTMLPath()
  
  if (isDev) {
    mainWindow.loadURL(htmlPath)
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    
    // Maximize window on first launch
    if (!mainWindow?.isMaximized()) {
      mainWindow?.maximize()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  createApplicationMenu()
}

// Create application menu
function createApplicationMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow?.webContents.reload()
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow?.webContents.reload()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
          click: () => {
            const fullScreen = mainWindow?.isFullScreen()
            mainWindow?.setFullScreen(!fullScreen)
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
          click: () => {
            mainWindow?.webContents.toggleDevTools()
          }
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            mainWindow?.minimize()
          }
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            mainWindow?.close()
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About BunnyEra Console',
          click: () => {
            // Send message to renderer to show about dialog
            mainWindow?.webContents.send('show-about')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC handlers
ipcMain.handle('get-app-info', () => {
  return appInfo
})

ipcMain.handle('log-message', (_event, message: string) => {
  console.log(`[Renderer Log]: ${message}`)
  return { success: true }
})

// App event handlers
app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, apps typically stay active until user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })
}

// Security: Prevent new window creation
app.on('web-contents-created', (_event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})
