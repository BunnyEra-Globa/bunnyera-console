# BunnyEra Console Core

Core runtime layer for BunnyEra Console.

## Responsibilities

- **System Info**: Get CPU, memory, OS, and version information
- **Logs**: Write, read, and clear logs with level filtering
- **Config**: Load and save user preferences (language, theme, AI settings)
- **Plugins**: Load, register, and manage plugins lifecycle
- **AI Runtime**: Support for OpenAI, Azure, DeepSeek, and Ollama
- **Filesystem**: Read, write, list, and delete files
- **IPC Handlers**: Electron main-renderer communication interface

---

## Installation

```bash
pnpm add bunnyera-console-core
```

## Build

```bash
pnpm --filter bunnyera-console-core build
```

## Usage in Electron Main Process

```typescript
import { app, BrowserWindow, ipcMain } from "electron";
import { registerCoreIpcHandlers } from "bunnyera-console-core";

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  registerCoreIpcHandlers(ipcMain);
  createWindow();
});
```

## Preload Script (preload.ts)

```typescript
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("core", {
  getSystemInfo: () => ipcRenderer.invoke("core:getSystemInfo"),
  getLogs: (limit?: number) => ipcRenderer.invoke("core:getLogs", limit),
  clearLogs: () => ipcRenderer.invoke("core:clearLogs"),
  writeLog: (type: "info" | "warn" | "error" | "system", message: string) =>
    ipcRenderer.invoke("core:writeLog", type, message),
  getConfig: () => ipcRenderer.invoke("core:getConfig"),
  saveConfig: (config: unknown) => ipcRenderer.invoke("core:saveConfig", config),
  listDirectory: (dir: string) => ipcRenderer.invoke("core:listDirectory", dir),
  readTextFile: (filePath: string) => ipcRenderer.invoke("core:readTextFile", filePath),
  writeTextFile: (filePath: string, content: string) =>
    ipcRenderer.invoke("core:writeTextFile", filePath, content),
  deletePath: (targetPath: string) => ipcRenderer.invoke("core:deletePath", targetPath),
  aiChat: (messages: { role: string; content: string }[]) =>
    ipcRenderer.invoke("core:aiChat", messages)
});
```

## Renderer Usage (UI)

```typescript
// TypeScript type definition
declare global {
  interface Window {
    core: {
      getSystemInfo: () => Promise<SystemInfo>;
      getLogs: (limit?: number) => Promise<LogEntry[]>;
      clearLogs: () => Promise<boolean>;
      writeLog: (type: "info" | "warn" | "error" | "system", message: string) => Promise<boolean>;
      getConfig: () => Promise<ConsoleConfig>;
      saveConfig: (config: ConsoleConfig) => Promise<boolean>;
      aiChat: (messages: AIMessage[]) => Promise<AIResponse>;
    };
  }
}

// Usage in React component
export async function fetchSystemInfo() {
  return window.core.getSystemInfo();
}

export async function fetchLogs(limit = 200) {
  return window.core.getLogs(limit);
}

export async function sendAIChat(messages: AIMessage[]) {
  return window.core.aiChat(messages);
}
```

## Available IPC Channels

| Channel | Description |
| --- | --- |
| core:getSystemInfo | Get system information (CPU, memory, OS, versions) |
| core:getLogs | Get logs with optional limit |
| core:clearLogs | Clear all logs |
| core:writeLog | Write a log entry |
| core:getConfig | Get current configuration |
| core:saveConfig | Save configuration |
| core:listDirectory | List directory contents |
| core:readTextFile | Read text file content |
| core:writeTextFile | Write text file |
| core:deletePath | Delete file or directory |
| core:aiChat | Send AI chat messages |

## Configuration Schema

```typescript
{
  language: "en" | "zh-CN",
  theme: "dark" | "light",
  ai: {
    provider: "openai" | "azure" | "deepseek" | "ollama",
    apiKey?: string,
    baseUrl?: string,
    model: string
  }
}
```

## AI Providers

### OpenAI

```json
{
  "ai": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4o-mini"
  }
}
```

### Azure OpenAI

```json
{
  "ai": {
    "provider": "azure",
    "apiKey": "your-azure-key",
    "baseUrl": "https://your-resource.openai.azure.com/",
    "model": "gpt-4"
  }
}
```

### DeepSeek

```json
{
  "ai": {
    "provider": "deepseek",
    "apiKey": "sk-...",
    "baseUrl": "https://api.deepseek.com",
    "model": "deepseek-chat"
  }
}
```

### Ollama (Local)

```json
{
  "ai": {
    "provider": "ollama",
    "baseUrl": "http://localhost:11434",
    "model": "llama2"
  }
}
```

## Module Structure

```text
bunnyera-console-core/
├── src/
│   ├── index.ts              # Main entry
│   ├── system/
│   │   └── systemInfo.ts     # System information service
│   ├── logs/
│   │   └── logService.ts     # Log service (winston-based)
│   ├── config/
│   │   └── configService.ts  # Configuration management (zod-validated)
│   ├── plugins/
│   │   └── pluginManager.ts  # Plugin lifecycle manager
│   ├── ai/
│   │   └── aiRuntime.ts      # AI runtime (multi-provider)
│   ├── fs/
│   │   └── fileService.ts    # Filesystem helpers
│   └── ipc/
│       └── ipcHandlers.ts    # Electron IPC handlers
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

Made with ❤️ by BunnyEra Team
