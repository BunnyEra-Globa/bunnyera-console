# BunnyEra Console UI

> BunnyEra Console 的桌面 UI 框架

一个现代化的 React UI 组件库，专为管理控制台设计。风格参考 Microsoft 365 Copilot（白 + 蓝紫 + 极简）。

## 特性

- 🎨 **现代设计** - 蓝紫渐变配色，极简风格
- 📦 **丰富组件** - 50+ 高质量 React 组件
- 🔧 **完整类型** - TypeScript 全面支持
- 🎯 **主题定制** - CSS 变量轻松定制主题
- 📱 **响应式** - 适配各种屏幕尺寸
- ⚡ **高性能** - 基于 React 18 优化

## 安装

```bash
npm install bunnyera-console-ui
# 或
yarn add bunnyera-console-ui
# 或
pnpm add bunnyera-console-ui
```

## 依赖

```bash
npm install react react-dom tailwindcss
```

## 快速开始

### 1. 配置 Tailwind CSS

在 `tailwind.config.js` 中引入主题配置：

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/bunnyera-console-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 你的自定义配置
    },
  },
  plugins: [],
};
```

### 2. 导入样式

在应用入口导入 CSS：

```tsx
// main.tsx 或 App.tsx
import 'bunnyera-console-ui/dist/index.css';
```

### 3. 使用组件

```tsx
import { Button, Card, Table, Modal } from 'bunnyera-console-ui';

function App() {
  return (
    <div>
      <Button variant="primary">点击我</Button>
      
      <Card title="项目统计">
        <p>内容区域</p>
      </Card>
    </div>
  );
}
```

## 布局系统

### 完整布局示例

```tsx
import {
  NavigationProvider,
  Layout,
  Sidebar,
  Header,
  Workspace,
  PageContainer,
  Button,
} from 'bunnyera-console-ui';

function Dashboard() {
  return (
    <NavigationProvider initialPage="dashboard">
      <Layout
        sidebarProps={{
          userName: '张三',
          userRole: '管理员',
          notificationCount: 3,
        }}
        headerProps={{
          onSearch: (query) => console.log('搜索:', query),
        }}
      >
        <PageContainer
          title="Dashboard"
          subtitle="欢迎回来，这是您今日的数据概览"
          extra={<Button variant="primary">新建项目</Button>}
        >
          {/* 页面内容 */}
        <div>Dashboard 内容</div>
        </PageContainer>
      </Layout>
    </NavigationProvider>
  );
}
```

## 组件列表

### 基础组件

- `Button` - 按钮
- `IconButton` - 图标按钮
- `ButtonGroup` - 按钮组

### 数据展示

- `Card` - 卡片
- `StatCard` - 统计卡片
- `Table` - 表格
- `List` - 列表
- `Badge` - 徽标
- `Tag` - 标签
- `Avatar` - 头像
- `EmptyState` - 空状态

### 表单组件

- `Input` - 输入框
- `SearchInput` - 搜索框
- `Textarea` - 文本域
- `Select` - 选择器
- `Checkbox` - 复选框
- `NumberInput` - 数字输入框

### 反馈组件

- `Modal` - 模态框
- `Drawer` - 抽屉
- `ConfirmModal` - 确认对话框

### 导航组件

- `Tabs` - 标签页
- `Sidebar` - 侧边栏
- `Header` - 顶部栏

### 布局组件

- `Layout` - 布局容器
- `Workspace` - 工作区
- `PageContainer` - 页面容器
- `Grid` - 网格布局
- `Flex` - 弹性布局

## Hooks

### 数据 Hooks

```tsx
import { useProjects, useResources, useAIHub, useLogs, useCurrentUser } from 'bunnyera-console-ui';

// 项目数据
const { projects, loading, createProject } = useProjects();

// 资源数据
const { resources, getChildren } = useResources();

// AI Hub 数据
const { models, agents, sendMessage } = useAIHub();

// 日志数据
const { logs, filterByLevel } = useLogs();

// 当前用户
const { user, logout, preferences } = useCurrentUser();
```

### 工具 Hooks

```tsx
import {
  useLocalStorage,
  useDebounce,
  useClickOutside,
  useWindowSize,
  useDarkMode,
} from 'bunnyera-console-ui';

// 本地存储
const [value, setValue] = useLocalStorage('key', defaultValue);

// 防抖
const debouncedValue = useDebounce(value, 500);

// 点击外部
const ref = useClickOutside<HTMLDivElement>(() => {
  // 处理点击外部
});

// 深色模式
const { isDark, toggle } = useDarkMode();
```

## 主题定制

### CSS 变量

```css
:root {
  /* 主色调 */
  --be-primary: #6366f1;
  --be-primary-hover: #4f46e5;
  --be-accent: #8b5cf6;
  
  /* 功能色 */
  --be-success: #10b981;
  --be-warning: #f59e0b;
  --be-danger: #ef4444;
  --be-info: #3b82f6;
  
  /* 中性色 */
  --be-surface: #ffffff;
  --be-background: #f8fafc;
  
  /* 文字颜色 */
  --be-text-primary: #0f172a;
  --be-text-secondary: #475569;
  --be-text-tertiary: #64748b;
  
  /* 边框 */
  --be-border: #e2e8f0;
}
```

### 深色主题

```tsx
// 设置深色主题
document.documentElement.setAttribute('data-theme', 'dark');
```

## 类型定义

```tsx
import type {
  User,
  Project,
  Resource,
  AIModel,
  AIAgent,
  LogEntry,
  ButtonProps,
  CardProps,
  TableColumn,
} from 'bunnyera-console-ui';
```

## 开发

```bash
# 克隆仓库
git clone https://github.com/bunnyera/console-ui.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 类型检查
npm run typecheck
```

## 目录结构

```
bunnyera-console-ui/
├── src/
│   ├── components/    # UI 组件
│   ├── layout/        # 布局组件
│   ├── hooks/         # React Hooks
│   ├── context/       # React Context
│   ├── theme/         # 主题和样式
│   ├── types/         # 类型定义
│   └── index.ts       # 入口文件
├── dist/              # 构建输出
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

MIT © BunnyEra Team
