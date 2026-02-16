# bunnyera-console-apps

BunnyEra Console 的内部应用集合。每个 App 都是运行在 `bunnyera-console-ui` 布局中的一个页面模块。

## 📦 安装

```bash
npm install bunnyera-console-apps
# 或
yarn add bunnyera-console-apps
# 或
pnpm add bunnyera-console-apps
```

## 📋 包含的应用

| 应用 | 组件名 | 描述 |
|------|--------|------|
| Dashboard | `DashboardApp` | 控制台总览，显示项目数量、错误数量、最近活动、资源统计 |
| Projects | `ProjectsApp` | 项目中心，项目列表、筛选、详情面板 |
| Resources | `ResourcesApp` | 资源中心，按类型分组、搜索、详情面板 |
| AIHub | `AIHubApp` | AI 工作中心，Chat 界面、Agent 选择 |
| LogCenter | `LogCenterApp` | 日志中心，日志列表、级别筛选、错误查看 |
| Notes | `NotesApp` | 笔记，列表+编辑、创建/编辑/删除 |
| Settings | `SettingsApp` | 设置，主题、语言、快捷键、通知等 |

## 🚀 快速开始

### 导入单个应用

```tsx
import { DashboardApp } from 'bunnyera-console-apps';

function MyPage() {
  return <DashboardApp />;
}
```

### 使用应用注册表

```tsx
import { appRegistry, getAppById } from 'bunnyera-console-apps';

// 获取所有应用
console.log(appRegistry);

// 根据 ID 获取应用
const dashboardApp = getAppById('dashboard');

// 渲染应用
const AppComponent = dashboardApp?.component;
return <AppComponent />;
```

### 动态路由示例

```tsx
import { appRegistry } from 'bunnyera-console-apps';
import { Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      {appRegistry.map(app => (
        <Route
          key={app.id}
          path={app.path}
          element={<app.component />}
        />
      ))}
    </Routes>
  );
}
```

## 📖 API 文档

### DashboardApp

控制台总览应用，显示关键指标和最近活动。

```tsx
interface DashboardAppProps {
  className?: string;
}

<DashboardApp className="my-dashboard" />
```

### ProjectsApp

项目中心应用，支持项目列表、筛选和详情查看。

```tsx
interface ProjectsAppProps {
  className?: string;
}

<ProjectsApp className="my-projects" />
```

### ResourcesApp

资源中心应用，按类型分组显示资源，支持搜索。

```tsx
interface ResourcesAppProps {
  className?: string;
}

<ResourcesApp className="my-resources" />
```

### AIHubApp

AI 工作中心应用，提供 Chat 界面和 Agent 选择。

```tsx
interface AIHubAppProps {
  className?: string;
}

<AIHubApp className="my-aihub" />
```

### LogCenterApp

日志中心应用，支持级别筛选和错误查看。

```tsx
interface LogCenterAppProps {
  className?: string;
}

<LogCenterApp className="my-logs" />
```

### NotesApp

笔记应用，支持创建、编辑、删除笔记（前端内存存储）。

```tsx
interface NotesAppProps {
  className?: string;
}

<NotesApp className="my-notes" />
```

### SettingsApp

设置应用，包含主题、语言、快捷键、通知等设置。

```tsx
interface SettingsAppProps {
  className?: string;
}

<SettingsApp className="my-settings" />
```

## 🔧 Mock API

本包使用 `bunnyera-console-core` 提供的 Mock API 进行数据交互。

```tsx
import { mockApi } from 'bunnyera-console-apps';

// Dashboard
const stats = await mockApi.dashboard.getStats();
const activities = await mockApi.dashboard.getRecentActivities(10);

// Projects
const projects = await mockApi.projects.getList({ status: 'active' });
const project = await mockApi.projects.getById('proj-1');

// Resources
const resources = await mockApi.resources.getList({ type: 'image' });
const groups = await mockApi.resources.getGroups();

// AIHub
const agents = await mockApi.aiHub.getAgents();
const sessions = await mockApi.aiHub.getSessions();

// Logs
const logs = await mockApi.logs.getList({ level: 'error' });
const errors = await mockApi.logs.getRecentErrors(5);

// Notes
const notes = await mockApi.notes.getList();
const newNote = await mockApi.notes.create({ title: '新笔记', content: '' });

// Settings
const settings = await mockApi.settings.get();
await mockApi.settings.update({ theme: 'dark' });
```

## 🏗️ 项目结构

```
bunnyera-console-apps/
├── src/
│   ├── apps/
│   │   ├── DashboardApp/      # 控制台总览
│   │   ├── ProjectsApp/       # 项目中心
│   │   ├── ResourcesApp/      # 资源中心
│   │   ├── AIHubApp/          # AI 工作中心
│   │   ├── LogCenterApp/      # 日志中心
│   │   ├── NotesApp/          # 笔记
│   │   └── SettingsApp/       # 设置
│   ├── core/
│   │   ├── mockApi.ts         # Mock API 实现
│   │   └── index.ts           # Core 入口
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   └── index.ts               # 包入口
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 📄 依赖

### Peer Dependencies
- `react`: ^18.0.0
- `react-dom`: ^18.0.0

### Dependencies
- `bunnyera-console-ui`: 布局组件（workspace）
- `bunnyera-console-core`: 逻辑核心（workspace）

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ by BunnyEra Team
