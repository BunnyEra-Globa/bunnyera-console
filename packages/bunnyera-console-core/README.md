# BunnyEra Console Core

BunnyEra 企业控制台的核心逻辑层。这是一个纯 TypeScript 的 npm 包，不包含任何 UI 或浏览器 API 依赖。

## 产品定位

这是 BunnyEra Console（一个人公司的企业控制台）的「核心逻辑层」。UI、Electron、应用都依赖它，但它本身不包含任何 UI。

## 设计理念

- **极简清晰**：参考 Microsoft 365 Copilot 的设计风格，结构化、清晰
- **纯 TypeScript**：全部使用 TypeScript，提供完整的类型支持
- **零 UI 依赖**：不依赖 React、不依赖浏览器 API
- **可扩展**：所有外部资源（API / 数据库 / 云服务）一律用接口 + mock 实现，预留扩展点

## 安装

```bash
npm install bunnyera-console-core
```

## 快速开始

```typescript
import { BunnyEraCore } from 'bunnyera-console-core';

// 创建核心实例
const core = new BunnyEraCore();

// 初始化
await core.initialize();

// 获取项目列表
const projects = await core.project.listProjects();
console.log(projects);

// 获取资源统计
const stats = await core.resource.getResourceStats();
console.log(stats);

// 创建 AI 会话
const session = await core.ai.createChatSession("新会话");
await core.ai.sendMessage(session.id, "你好！");

// 记录日志
await core.log.logInfo('system', '系统启动成功');

// 获取当前用户
const user = await core.user.getCurrentUser();
console.log(user);
```

## 模块说明

### 1. ProjectCenter（项目中心）

管理所有项目信息。

#### 类型定义

```typescript
interface Project {
  id: string;
  name: string;
  status: "healthy" | "warning" | "error" | "paused";
  version: string;
  owner: string;
  tags: string[];
  updatedAt: Date;
  createdAt: Date;
  description?: string;
  url?: string;
  resourceIds?: string[];
}
```

#### API

| 方法 | 说明 |
|------|------|
| `listProjects(filter?)` | 获取项目列表 |
| `getProjectById(id)` | 根据ID获取项目 |
| `getProjectHealthSummary()` | 获取项目健康度摘要 |
| `searchProjects(options)` | 搜索项目 |
| `createProject(project)` | 创建项目 |
| `updateProject(id, updates)` | 更新项目 |
| `deleteProject(id)` | 删除项目 |

#### 使用示例

```typescript
import { projectCenter } from 'bunnyera-console-core';

// 获取所有项目
const projects = await projectCenter.listProjects();

// 按状态过滤
const healthyProjects = await projectCenter.listProjects({ status: "healthy" });

// 搜索项目
const results = await projectCenter.searchProjects({ 
  query: "bunnyera",
  includeDescription: true 
});

// 获取健康度摘要
const summary = await projectCenter.getProjectHealthSummary();
console.log(`健康度: ${summary.healthRate}%`);
```

---

### 2. ResourceCenter（资源中心）

管理所有企业资源（文件、服务器、域名、API Key 等）。

#### 资源类型

```typescript
type ResourceType = 
  | "file" 
  | "image" 
  | "video" 
  | "doc" 
  | "domain" 
  | "server" 
  | "database" 
  | "apiKey" 
  | "certificate" 
  | "config";
```

#### API

| 方法 | 说明 |
|------|------|
| `listResources(filter?)` | 获取资源列表 |
| `getResourceById(id)` | 根据ID获取资源 |
| `getResourceStats()` | 获取资源统计 |
| `searchResources(options)` | 搜索资源 |
| `getResourcesByProject(projectId)` | 获取项目的资源 |
| `getExpiringResources()` | 获取即将过期的资源 |

#### 使用示例

```typescript
import { resourceCenter, formatFileSize } from 'bunnyera-console-core';

// 获取所有资源
const resources = await resourceCenter.listResources();

// 按类型过滤
const images = await resourceCenter.listResources({ type: "image" });

// 获取统计
const stats = await resourceCenter.getResourceStats();
console.log(`总资源数: ${stats.total}`);
console.log(`总大小: ${formatFileSize(stats.totalSize)}`);

// 获取即将过期的资源
const expiring = await resourceCenter.getExpiringResources();
```

---

### 3. AIHub（AI 工作中心）

管理 AI 会话、代理和工作流。

#### 类型定义

```typescript
interface ChatSession {
  id: string;
  title: string;
  agentId?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  capabilities: AgentCapability[];
  defaultModel: string;
}
```

#### API

| 方法 | 说明 |
|------|------|
| `createChatSession(title?, agentId?)` | 创建会话 |
| `sendMessage(sessionId, content, config?)` | 发送消息 |
| `streamMessage(sessionId, content, onChunk?, config?)` | 流式发送消息 |
| `listAgents(onlyActive?)` | 获取代理列表 |
| `runAgentTask(agentId, payload)` | 运行代理任务 |

#### 使用示例

```typescript
import { aiHub } from 'bunnyera-console-core';

// 创建会话
const session = await aiHub.createChatSession("代码审查");

// 发送消息
const response = await aiHub.sendMessage(
  session.id, 
  "帮我优化这段代码..."
);
console.log(response.content);

// 流式发送
await aiHub.streamMessage(
  session.id,
  "写一个快速排序算法",
  (chunk) => process.stdout.write(chunk)
);

// 获取代理列表
const agents = await aiHub.listAgents();

// 运行代理任务
const result = await aiHub.runAgentTask("agent_002", {
  task: "analyze_code",
  code: "..."
});
```

---

### 4. LogCenter（日志中心）

管理系统日志。

#### 日志级别

```typescript
type LogLevel = "info" | "warn" | "error" | "debug";
type LogSource = "system" | "project" | "resource" | "ai" | "user" | "api" | "database" | "server" | "custom";
```

#### API

| 方法 | 说明 |
|------|------|
| `logInfo(source, message, meta?)` | 记录 info 日志 |
| `logWarn(source, message, meta?)` | 记录 warn 日志 |
| `logError(source, message, meta?)` | 记录 error 日志 |
| `logDebug(source, message, meta?)` | 记录 debug 日志 |
| `listLogs(filter?, page?, pageSize?)` | 查询日志 |
| `getRecentErrors(limit?)` | 获取最近错误 |
| `getLogStats()` | 获取日志统计 |

#### 使用示例

```typescript
import { logCenter } from 'bunnyera-console-core';

// 记录日志
await logCenter.logInfo('system', '系统启动');
await logCenter.logWarn('api', '响应时间较慢', { duration: 2500 });
await logCenter.logError('database', '连接失败', { errorCode: 'CONN_TIMEOUT' });

// 查询日志
const logs = await logCenter.listLogs(
  { level: "error", source: "api" },
  1,
  20
);

// 获取最近错误
const errors = await logCenter.getRecentErrors(10);

// 获取统计
const stats = await logCenter.getLogStats();
console.log(`错误率: ${stats.errorRate}%`);
```

---

### 5. UserCenter（用户系统）

管理用户和权限。

#### 角色定义

```typescript
type UserRole = "owner" | "admin" | "member";

type PermissionAction = 
  | "project:create" | "project:read" | "project:update" | "project:delete"
  | "resource:create" | "resource:read" | "resource:update" | "resource:delete"
  | "user:create" | "user:read" | "user:update" | "user:delete"
  | "ai:use" | "ai:manage"
  | "log:read" | "log:clear"
  | "setting:read" | "setting:update"
  | "admin:access";
```

#### 默认权限

| 角色 | 权限 |
|------|------|
| owner | 所有权限 |
| admin | 除删除 owner 外的所有权限 |
| member | 查看项目、创建资源、使用 AI 等基础权限 |

#### API

| 方法 | 说明 |
|------|------|
| `getCurrentUser()` | 获取当前用户 |
| `listUsers(filter?)` | 获取用户列表 |
| `hasPermission(user, action, context?)` | 检查权限 |
| `getUserPermissions(user)` | 获取用户的所有权限 |

#### 使用示例

```typescript
import { userCenter, checkPermission } from 'bunnyera-console-core';

// 设置当前用户（模拟登录）
userCenter.setCurrentUserId("user_001");

// 获取当前用户
const user = await userCenter.getCurrentUser();

// 获取所有用户
const users = await userCenter.listUsers();

// 检查权限
const canDelete = userCenter.hasPermission(user, "project:delete");

// 检查当前用户权限
const canUseAI = await userCenter.hasPermissionAsync("ai:use");

// 获取用户权限列表
const permissions = userCenter.getUserPermissions(user);
```

---

## 扩展点

所有外部依赖都通过接口抽象，你可以轻松接入真实实现：

### 自定义项目数据源

```typescript
import { IProjectDataSource, ProjectCenter } from 'bunnyera-console-core';

class MyProjectDataSource implements IProjectDataSource {
  async getAll(): Promise<Project[]> {
    // 从真实数据库获取
    return db.projects.findAll();
  }
  // ... 其他方法
}

const projectCenter = new ProjectCenter({
  dataSource: new MyProjectDataSource()
});
```

### 自定义 AI 模型提供者

```typescript
import { IAIModelProvider, AIHub } from 'bunnyera-console-core';

class OpenAIProvider implements IAIModelProvider {
  async sendMessage(messages, config) {
    // 调用 OpenAI API
    const response = await openai.chat.completions.create({...});
    return {
      content: response.choices[0].message.content,
      tokenCount: response.usage.total_tokens,
      model: response.model
    };
  }
  // ... streamMessage
}

const aiHub = new AIHub({
  modelProvider: new OpenAIProvider()
});
```

### 自定义日志存储

```typescript
import { ILogStorage, LogCenter } from 'bunnyera-console-core';

class ElasticsearchStorage implements ILogStorage {
  async save(entry: LogEntry): Promise<void> {
    await elasticsearch.index({
      index: 'logs',
      body: entry
    });
  }
  // ... 其他方法
}

const logCenter = new LogCenter({
  storage: new ElasticsearchStorage()
});
```

---

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 开发模式（监听）
npm run dev

# 清理
npm run clean
```

---

## 目录结构

```
bunnyera-console-core/
├── src/
│   ├── project/          # ProjectCenter 模块
│   │   ├── types.ts      # 类型定义
│   │   ├── mockData.ts   # Mock 数据
│   │   ├── ProjectCenter.ts  # 核心实现
│   │   └── index.ts      # 模块入口
│   ├── resource/         # ResourceCenter 模块
│   ├── ai/               # AIHub 模块
│   ├── log/              # LogCenter 模块
│   ├── user/             # UserCenter 模块
│   └── index.ts          # 主入口
├── package.json
├── tsconfig.json
└── README.md
```

---

## License

MIT
