
# 🏗️ BunnyEra Console v2.0 - 完整项目结构

bunnyera-console/
├── 📁 .github/                           # GitHub 配置和模板
│   ├── workflows/                        # CI/CD 工作流
│   │   ├── build.yml                     # 构建和测试工作流
│   │   ├── release.yml                   # 发布工作流
│   │   └── test.yml                      # 测试套件工作流
│   ├── ISSUE_TEMPLATE/                   # Issue 模板
│   │   ├── bug_report.md                 # Bug 报告模板
│   │   ├── feature_request.md            # 功能请求模板
│   │   └── documentation.md              # 文档问题模板
│   └── PULL_REQUEST_TEMPLATE.md          # PR 模板
│
├── 📁 docs/                              # 项目文档
│   ├── index.md                          # 文档首页
│   ├── architecture/                     # 架构文档
│   │   ├── overview.md                   # 系统架构总览
│   │   ├── modules.md                    # 模块详细说明
│   │   └── data-flow.md                  # 数据流图
│   ├── api/                              # API 文档
│   │   ├── console.md                    # 控制台 API
│   │   ├── projects.md                   # 项目管理 API
│   │   ├── resources.md                  # 资源管理 API
│   │   └── ai-hub.md                     # AI Hub API
│   ├── development/                      # 开发指南
│   │   ├── setup.md                      # 开发环境搭建
│   │   ├── workflow.md                   # 开发工作流
│   │   └── contributing.md               # 贡献指南
│   ├── guides/                           # 用户指南
│   │   ├── getting-started.md            # 快速开始
│   │   ├── projects.md                   # 项目管理指南
│   │   ├── resources.md                  # 资源管理指南
│   │   └── ai-workflows.md               # AI 工作流指南
│   ├── assets/                           # 文档资源
│   │   ├── screenshots/                  # 截图
│   │   ├── diagrams/                     # 架构图
│   │   └── icons/                        # 图标
│   ├── faq.md                            # 常见问题
│   └── roadmap.md                        # 产品路线图
│
├── 📁 packages/                          # Monorepo 包目录
│   ├── 🧠 bunnyera-console-core/         # 核心逻辑层
│   │   ├── src/
│   │   │   ├── projects/                 # 项目管理
│   │   │   │   ├── manager.ts            # 项目管理器
│   │   │   │   ├── templates.ts          # 项目模板
│   │   │   │   ├── automation.ts         # 项目自动化
│   │   │   │   └── types.ts              # 类型定义
│   │   │   ├── resources/                # 资源管理
│   │   │   │   ├── manager.ts            # 资源管理器
│   │   │   │   ├── storage.ts            # 存储抽象
│   │   │   │   ├── indexer.ts            # 资源索引
│   │   │   │   └── types.ts              # 类型定义
│   │   │   ├── ai-hub/                   # AI 工作流引擎
│   │   │   │   ├── engine.ts             # 工作流执行引擎
│   │   │   │   ├── providers/            # AI 提供商集成
│   │   │   │   │   ├── openai.ts         # OpenAI 集成
│   │   │   │   │   ├── anthropic.ts      # Anthropic 集成
│   │   │   │   │   ├── google.ts         # Google AI 集成
│   │   │   │   │   └── base.ts           # 基础提供商类
│   │   │   │   ├── workflows/            # 工作流定义
│   │   │   │   │   ├── text-generation.ts # 文本生成工作流
│   │   │   │   │   ├── image-analysis.ts  # 图像分析工作流
│   │   │   │   │   └── data-processing.ts # 数据处理工作流
│   │   │   │   └── types.ts              # 类型定义
│   │   │   ├── logs/                     # 日志系统
│   │   │   │   ├── logger.ts             # 核心日志功能
│   │   │   │   ├── storage.ts            # 日志存储
│   │   │   │   ├── filters.ts            # 日志过滤
│   │   │   │   └── types.ts              # 类型定义
│   │   │   ├── auth/                     # 认证系统
│   │   │   │   ├── manager.ts            # 认证管理器
│   │   │   │   ├── storage.ts            # 凭证存储
│   │   │   │   ├── providers.ts          # 认证提供商
│   │   │   │   └── types.ts              # 类型定义
│   │   │   ├── storage/                  # 数据持久化
│   │   │   │   ├── database.ts           # 数据库抽象
│   │   │   │   ├── migrations.ts         # 数据库迁移
│   │   │   │   ├── models/               # 数据模型
│   │   │   │   │   ├── project.ts        # 项目模型
│   │   │   │   │   ├── resource.ts       # 资源模型
│   │   │   │   │   ├── workflow.ts       # 工作流模型
│   │   │   │   │   └── user.ts           # 用户模型
│   │   │   │   └── types.ts              # 类型定义
│   │   │   ├── api/                      # API 层
│   │   │   │   ├── client.ts             # API 客户端
│   │   │   │   ├── endpoints.ts          # API 端点定义
│   │   │   │   ├── middleware.ts         # API 中间件
│   │   │   │   └── types.ts              # 类型定义
│   │   │   ├── utils/                    # 工具函数
│   │   │   │   ├── validation.ts         # 数据验证工具
│   │   │   │   ├── encryption.ts         # 加密工具
│   │   │   │   ├── filesystem.ts         # 文件系统工具
│   │   │   │   └── helpers.ts            # 通用辅助函数
│   │   │   └── index.ts                  # 主导出文件
│   │   ├── tests/                        # 测试文件
│   │   │   ├── __mocks__/                # Mock 文件
│   │   │   ├── projects/                 # 项目管理测试
│   │   │   ├── resources/                # 资源管理测试
│   │   │   ├── ai-hub/                   # AI Hub 测试
│   │   │   └── utils/                    # 工具函数测试
│   │   ├── package.json                  # 包配置
│   │   ├── tsconfig.json                 # TypeScript 配置
│   │   ├── vitest.config.ts              # Vitest 配置
│   │   └── README.md                     # 包说明文档
│   │
│   ├── 🎨 bunnyera-console-ui/           # UI 框架和组件
│   │   ├── src/
│   │   │   ├── components/               # 可复用 UI 组件
│   │   │   │   ├── ui/                   # 基础 UI 元素
│   │   │   │   │   ├── Button/           # 按钮组件
│   │   │   │   │   │   ├── Button.tsx    # 组件实现
│   │   │   │   │   │   ├── Button.test.tsx # 组件测试
│   │   │   │   │   │   ├── Button.stories.tsx # Storybook 故事
│   │   │   │   │   │   └── index.ts      # 导出文件
│   │   │   │   │   ├── Input/            # 输入组件
│   │   │   │   │   ├── Modal/            # 模态框组件
│   │   │   │   │   ├── Table/            # 表格组件
│   │   │   │   │   ├── Card/             # 卡片组件
│   │   │   │   │   ├── Badge/            # 徽章组件
│   │   │   │   │   ├── Avatar/           # 头像组件
│   │   │   │   │   ├── Tooltip/          # 工具提示组件
│   │   │   │   │   ├── Loading/          # 加载组件
│   │   │   │   │   ├── Alert/            # 警告组件
│   │   │   │   │   └── index.ts          # UI 组件导出
│   │   │   │   ├── layout/               # 布局组件
│   │   │   │   │   ├── Sidebar/          # 侧边栏组件
│   │   │   │   │   ├── Header/           # 头部组件
│   │   │   │   │   ├── Workspace/        # 工作区组件
│   │   │   │   │   ├── Container/        # 容器组件
│   │   │   │   │   ├── Grid/             # 网格组件
│   │   │   │   │   └── index.ts          # 布局组件导出
│   │   │   │   ├── forms/                # 表单组件
│   │   │   │   │   ├── FormField/        # 表单字段组件
│   │   │   │   │   ├── FormGroup/        # 表单组组件
│   │   │   │   │   ├── Select/           # 选择器组件
│   │   │   │   │   ├── Checkbox/         # 复选框组件
│   │   │   │   │   ├── Radio/            # 单选框组件
│   │   │   │   │   ├── Switch/           # 开关组件
│   │   │   │   │   └── index.ts          # 表单组件导出
│   │   │   │   └── index.ts              # 所有组件导出
│   │   │   ├── hooks/                    # 自定义 React Hooks
│   │   │   │   ├── useTheme.ts           # 主题管理 Hook
│   │   │   │   ├── useLocalStorage.ts    # 本地存储 Hook
│   │   │   │   ├── useDebounce.ts        # 防抖 Hook
│   │   │   │   ├── useKeyboard.ts        # 键盘事件 Hook
│   │   │   │   ├── useWindowSize.ts      # 窗口大小 Hook
│   │   │   │   └── index.ts              # Hooks 导出
│   │   │   ├── themes/                   # 主题定义
│   │   │   │   ├── default.ts            # 默认主题
│   │   │   │   ├── dark.ts               # 深色主题
│   │   │   │   ├── light.ts              # 浅色主题
│   │   │   │   ├── colors.ts             # 颜色定义
│   │   │   │   └── index.ts              # 主题导出
│   │   │   ├── icons/                    # 图标组件
│   │   │   │   ├── components/           # 图标组件
│   │   │   │   ├── assets/               # 图标资源
│   │   │   │   └── index.ts              # 图标导出
│   │   │   ├── styles/                   # 全局样式
│   │   │   │   ├── globals.css           # 全局 CSS
│   │   │   │   ├── components.css        # 组件样式
│   │   │   │   ├── utilities.css         # 工具类
│   │   │   │   └── animations.css        # 动画样式
│   │   │   ├── utils/                    # UI 工具函数
│   │   │   │   ├── classNames.ts         # 类名工具
│   │   │   │   ├── colors.ts             # 颜色工具
│   │   │   │   ├── animations.ts         # 动画工具
│   │   │   │   └── responsive.ts         # 响应式工具
│   │   │   └── index.ts                  # 主导出文件
│   │   ├── .storybook/                   # Storybook 配置
│   │   │   ├── main.ts                   # 主配置
│   │   │   ├── preview.ts                # 预览配置
│   │   │   └── theme.ts                  # 主题配置
│   │   ├── stories/                      # Storybook 故事
│   │   ├── tests/                        # 测试文件
│   │   ├── tailwind.config.js            # Tailwind 配置
│   │   ├── postcss.config.js             # PostCSS 配置
│   │   ├── package.json                  # 包配置
│   │   ├── tsconfig.json                 # TypeScript 配置
│   │   ├── vite.config.ts                # Vite 配置
│   │   └── README.md                     # 包说明文档
│   │
│   ├── 📱 bunnyera-console-apps/         # 内部应用模块
│   │   ├── src/
│   │   │   ├── dashboard/                # 仪表板应用
│   │   │   │   ├── components/           # 仪表板组件
│   │   │   │   │   ├── OverviewCards.tsx # 概览卡片
│   │   │   │   │   ├── RecentActivity.tsx # 最近活动
│   │   │   │   │   ├── QuickActions.tsx  # 快速操作
│   │   │   │   │   ├── SystemStatus.tsx  # 系统状态
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # 仪表板 Hooks
│   │   │   │   │   ├── useDashboardData.ts # 仪表板数据
│   │   │   │   │   ├── useSystemMetrics.ts # 系统指标
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── pages/                # 仪表板页面
│   │   │   │   │   ├── DashboardPage.tsx # 主仪表板页面
│   │   │   │   │   └── index.ts          # 页面导出
│   │   │   │   └── index.ts              # 仪表板导出
│   │   │   ├── projects/                 # 项目管理应用
│   │   │   │   ├── components/           # 项目组件
│   │   │   │   │   ├── ProjectList.tsx   # 项目列表
│   │   │   │   │   ├── ProjectCard.tsx   # 项目卡片
│   │   │   │   │   ├── ProjectDetail.tsx # 项目详情
│   │   │   │   │   ├── ProjectForm.tsx   # 项目表单
│   │   │   │   │   ├── ProjectTemplates.tsx # 项目模板
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # 项目 Hooks
│   │   │   │   │   ├── useProjects.ts    # 项目数据
│   │   │   │   │   ├── useProjectForm.ts # 项目表单
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── pages/                # 项目页面
│   │   │   │   │   ├── ProjectsPage.tsx  # 项目列表页面
│   │   │   │   │   ├── ProjectDetailPage.tsx # 项目详情页面
│   │   │   │   │   ├── CreateProjectPage.tsx # 创建项目页面
│   │   │   │   │   └── index.ts          # 页面导出
│   │   │   │   └── index.ts              # 项目应用导出
│   │   │   ├── resources/                # 资源管理应用
│   │   │   │   ├── components/           # 资源组件
│   │   │   │   │   ├── ResourceBrowser.tsx # 资源浏览器
│   │   │   │   │   ├── ResourceGrid.tsx  # 资源网格
│   │   │   │   │   ├── ResourceList.tsx  # 资源列表
│   │   │   │   │   ├── ResourceUpload.tsx # 资源上传
│   │   │   │   │   ├── ResourceSearch.tsx # 资源搜索
│   │   │   │   │   ├── ResourceTags.tsx  # 资源标签
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # 资源 Hooks
│   │   │   │   │   ├── useResources.ts   # 资源数据
│   │   │   │   │   ├── useResourceUpload.ts # 资源上传
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── pages/                # 资源页面
│   │   │   │   │   ├── ResourcesPage.tsx # 资源管理页面
│   │   │   │   │   └── index.ts          # 页面导出
│   │   │   │   └── index.ts              # 资源应用导出
│   │   │   ├── ai-hub/                   # AI Hub 应用
│   │   │   │   ├── components/           # AI Hub 组件
│   │   │   │   │   ├── WorkflowBuilder.tsx # 工作流构建器
│   │   │   │   │   ├── WorkflowList.tsx  # 工作流列表
│   │   │   │   │   ├── WorkflowEditor.tsx # 工作流编辑器
│   │   │   │   │   ├── ExecutionMonitor.tsx # 执行监控
│   │   │   │   │   ├── ProviderConfig.tsx # 提供商配置
│   │   │   │   │   ├── WorkflowTemplates.tsx # 工作流模板
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # AI Hub Hooks
│   │   │   │   │   ├── useWorkflows.ts   # 工作流数据
│   │   │   │   │   ├── useAIProviders.ts # AI 提供商
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── pages/                # AI Hub 页面
│   │   │   │   │   ├── AIHubPage.tsx     # AI Hub 主页面
│   │   │   │   │   ├── WorkflowDetailPage.tsx # 工作流详情页面
│   │   │   │   │   └── index.ts          # 页面导出
│   │   │   │   └── index.ts              # AI Hub 导出
│   │   │   ├── logs/                     # 日志应用
│   │   │   │   ├── components/           # 日志组件
│   │   │   │   │   ├── LogViewer.tsx     # 日志查看器
│   │   │   │   │   ├── LogFilters.tsx    # 日志过滤器
│   │   │   │   │   ├── LogSearch.tsx     # 日志搜索
│   │   │   │   │   ├── LogExport.tsx     # 日志导出
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # 日志 Hooks
│   │   │   │   │   ├── useLogs.ts        # 日志数据
│   │   │   │   │   ├── useLogFilters.ts  # 日志过滤
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── pages/                # 日志页面
│   │   │   │   │   ├── LogsPage.tsx      # 日志页面
│   │   │   │   │   └── index.ts          # 页面导出
│   │   │   │   └── index.ts              # 日志应用导出
│   │   │   ├── notes/                    # 笔记应用
│   │   │   │   ├── components/           # 笔记组件
│   │   │   │   │   ├── NoteEditor.tsx    # 笔记编辑器
│   │   │   │   │   ├── NoteList.tsx      # 笔记列表
│   │   │   │   │   ├── NoteSearch.tsx    # 笔记搜索
│   │   │   │   │   ├── NoteTags.tsx      # 笔记标签
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # 笔记 Hooks
│   │   │   │   │   ├── useNotes.ts       # 笔记数据
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── pages/                # 笔记页面
│   │   │   │   │   ├── NotesPage.tsx     # 笔记页面
│   │   │   │   │   └── index.ts          # 页面导出
│   │   │   │   └── index.ts              # 笔记应用导出
│   │   │   ├── settings/                 # 设置应用
│   │   │   │   ├── components/           # 设置组件
│   │   │   │   │   ├── GeneralSettings.tsx # 通用设置
│   │   │   │   │   ├── ThemeSettings.tsx # 主题设置
│   │   │   │   │   ├── NotificationSettings.tsx # 通知设置
│   │   │   │   │   ├── SecuritySettings.tsx # 安全设置
│   │   │   │   │   ├── AdvancedSettings.tsx # 高级设置
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # 设置 Hooks
│   │   │   │   │   ├── useSettings.ts    # 设置数据
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── pages/                # 设置页面
│   │   │   │   │   ├── SettingsPage.tsx  # 设置页面
│   │   │   │   │   └── index.ts          # 页面导出
│   │   │   │   └── index.ts              # 设置应用导出
│   │   │   ├── shared/                   # 共享应用组件
│   │   │   │   ├── components/           # 共享组件
│   │   │   │   │   ├── ErrorBoundary.tsx # 错误边界
│   │   │   │   │   ├── LoadingSpinner.tsx # 加载动画
│   │   │   │   │   ├── EmptyState.tsx    # 空状态
│   │   │   │   │   ├── ConfirmDialog.tsx # 确认对话框
│   │   │   │   │   └── index.ts          # 组件导出
│   │   │   │   ├── hooks/                # 共享 Hooks
│   │   │   │   │   ├── useApi.ts         # API Hook
│   │   │   │   │   ├── useAuth.ts        # 认证 Hook
│   │   │   │   │   ├── useNotifications.ts # 通知 Hook
│   │   │   │   │   └── index.ts          # Hooks 导出
│   │   │   │   ├── utils/                # 共享工具
│   │   │   │   │   ├── constants.ts      # 常量定义
│   │   │   │   │   ├── helpers.ts        # 辅助函数
│   │   │   │   │   ├── formatters.ts     # 格式化函数
│   │   │   │   │   └── validators.ts     # 验证函数
│   │   │   │   └── index.ts              # 共享导出
│   │   │   └── index.ts                  # 主导出文件
│   │   ├── tests/                        # 测试文件
│   │   ├── package.json                  # 包配置
│   │   ├── tsconfig.json                 # TypeScript 配置
│   │   ├── vite.config.ts                # Vite 配置
│   │   └── README.md                     # 包说明文档
│   │
│   └── 🖥️ bunnyera-console-electron/     # 桌面应用外壳
│       ├── src/
│       │   ├── main/                     # Electron 主进程
│       │   │   ├── index.ts              # 主进程入口点
│       │   │   ├── window.ts             # 窗口管理
│       │   │   ├── menu.ts               # 应用菜单
│       │   │   ├── updater.ts            # 自动更新器
│       │   │   ├── ipc.ts                # IPC 处理器
│       │   │   ├── security.ts           # 安全配置
│       │   │   ├── protocol.ts           # 自定义协议
│       │   │   └── utils.ts              # 主进程工具
│       │   ├── preload/                  # 预加载脚本
│       │   │   ├── index.ts              # 主预加载脚本
│       │   │   ├── api.ts                # 暴露的 API
│       │   │   ├── security.ts           # 安全辅助函数
│       │   │   └── types.ts              # 类型定义
│       │   ├── renderer/                 # React 前端
│       │   │   ├── src/
│       │   │   │   ├── App.tsx           # 主应用组件
│       │   │   │   ├── main.tsx          # React 入口点
│       │   │   │   ├── router.tsx        # 应用路由
│       │   │   │   ├── pages/            # 应用页面
│       │   │   │   │   ├── Dashboard.tsx # 仪表板页面
│       │   │   │   │   ├── Projects.tsx  # 项目页面
│       │   │   │   │   ├── Resources.tsx # 资源页面
│       │   │   │   │   ├── AIHub.tsx     # AI Hub 页面
│       │   │   │   │   ├── Logs.tsx      # 日志页面
│       │   │   │   │   ├── Notes.tsx     # 笔记页面
│       │   │   │   │   ├── Settings.tsx  # 设置页面
│       │   │   │   │   └── index.ts      # 页面导出
│       │   │   │   ├── components/       # 渲染器组件
│       │   │   │   │   ├── Layout.tsx    # 布局组件
│       │   │   │   │   ├── Navigation.tsx # 导航组件
│       │   │   │   │   ├── TitleBar.tsx  # 标题栏组件
│       │   │   │   │   └── index.ts      # 组件导出
│       │   │   │   ├── hooks/            # 渲染器 Hooks
│       │   │   │   │   ├── useElectron.ts # Electron API Hook
│       │   │   │   │   ├── useWindow.ts  # 窗口管理 Hook
│       │   │   │   │   └── index.ts      # Hooks 导出
│       │   │   │   ├── utils/            # 渲染器工具
│       │   │   │   │   ├── electron.ts   # Electron 工具
│       │   │   │   │   └── constants.ts  # 常量定义
│       │   │   │   └── styles/           # 样式文件
│       │   │   │       ├── globals.css   # 全局样式
│       │   │   │       └── app.css       # 应用样式
│       │   │   ├── public/               # 静态资源
│       │   │   │   ├── favicon.ico       # 网站图标
│       │   │   │   └── manifest.json     # Web 应用清单
│       │   │   ├── index.html            # HTML 模板
│       │   │   ├── vite.config.ts        # Vite 配置
│       │   │   └── tsconfig.json         # TypeScript 配置
│       │   └── types/                    # 类型定义
│       │       ├── electron.d.ts         # Electron 类型
│       │       ├── global.d.ts           # 全局类型
│       │       └── window.d.ts           # 窗口类型
│       ├── build/                        # 构建配置
│       │   ├── icon.png                  # 应用图标
│       │   ├── icon.ico                  # Windows 图标
│       │   ├── icon.icns                 # macOS 图标
│       │   ├── entitlements.plist        # macOS 权限
│       │   ├── notarize.js               # macOS 公证
│       │   └── installer.nsh             # Windows 安装器脚本
│       ├── dist/                         # 构建输出
│       │   ├── win-unpacked/             # Windows 未打包版本
│       │   ├── mac/                      # macOS 应用
│       │   ├── linux-unpacked/           # Linux 未打包版本
│       │   ├── BunnyEra Console Setup.exe # Windows 安装器
│       │   ├── BunnyEra Console.dmg      # macOS 磁盘镜像
│       │   └── BunnyEra Console.AppImage # Linux AppImage
│       ├── electron-builder.json         # Electron Builder 配置
│       ├── package.json                  # 包配置
│       ├── tsconfig.json                 # TypeScript 配置
│       └── README.md                     # 包说明文档
│
├── 📁 scripts/                           # 自动化脚本
│   ├── sync-version.js                   # 版本同步脚本
│   ├── clean.js                          # 清理脚本
│   ├── build-all.js                      # 统一构建脚本
│   ├── deploy.js                         # 部署脚本
│   ├── test-all.js                       # 测试脚本
│   └── release.js                        # 发布脚本
│
├── 📁 tests/                             # 全局测试配置
│   ├── vitest.config.ts                  # Vitest 配置
│   ├── playwright.config.ts              # Playwright 配置
│   ├── setup.ts                          # 测试设置
│   ├── global-setup.ts                   # 全局设置
│   ├── global-teardown.ts                # 全局清理
│   ├── core.test.ts                      # 核心功能测试
│   ├── e2e/                              # E2E 测试
│   │   ├── app.e2e.ts                    # 应用 E2E 测试
│   │   ├── projects.e2e.ts               # 项目 E2E 测试
│   │   ├── resources.e2e.ts              # 资源 E2E 测试
│   │   └── ai-hub.e2e.ts                 # AI Hub E2E 测试
│   ├── fixtures/                         # 测试夹具
│   │   ├── projects.json                 # 项目测试数据
│   │   ├── resources.json                # 资源测试数据
│   │   └── workflows.json                # 工作流测试数据
│   └── __mocks__/                        # 全局 Mock
│       ├── electron.ts                   # Electron Mock
│       ├── fs.ts                         # 文件系统 Mock
│       └── api.ts                        # API Mock
│
├── 📄 .editorconfig                      # 编辑器配置
├── 📄 .gitignore                         # Git 忽略文件
├── 📄 .eslintrc.js                       # ESLint 配置
├── 📄 .prettierrc                        # Prettier 配置
├── 📄 .prettierignore                    # Prettier 忽略文件
├── 📄 .husky/                            # Git Hooks
│   ├── pre-commit                        # 提交前钩子
│   ├── pre-push                          # 推送前钩子
│   └── commit-msg                        # 提交消息钩子
├── 📄 tsconfig.json                      # 根 TypeScript 配置
├── 📄 tailwind.config.js                 # Tailwind CSS 配置
├── 📄 postcss.config.js                  # PostCSS 配置
├── 📄 package.json                       # 根包配置
├── 📄 pnpm-workspace.yaml                # pnpm 工作区配置
├── 📄 pnpm-lock.yaml                     # pnpm 锁定文件
├── 📄 LICENSE                            # MIT 许可证
├── 📄 README.md                          # 项目说明文档
├── 📄 CONTRIBUTING.md                    # 贡献指南
├── 📄 CHANGELOG.md                       # 变更日志
├── 📄 CODE_OF_CONDUCT.md                 # 行为准则
├── 📄 SECURITY.md                        # 安全政策
└── 📄 PROJECT_STRUCTURE.md               # 项目结构说明（本文件）

# 📊 项目统计

## 📦 包结构
- **4 个核心包**: core, ui, apps, electron
- **Monorepo 架构**: 使用 pnpm workspaces 管理
- **TypeScript 全覆盖**: 100% TypeScript 代码

## 🧪 测试覆盖
- **单元测试**: Vitest + React Testing Library
- **E2E 测试**: Playwright 跨浏览器测试
- **组件测试**: Storybook 组件开发和测试
- **测试覆盖率**: 目标 >80% 代码覆盖率

## 🔧 开发工具
- **构建工具**: Vite (快速构建)
- **包管理器**: pnpm (高效依赖管理)
- **代码质量**: ESLint + Prettier + Husky
- **类型检查**: TypeScript 严格模式

## 🚀 部署方式
- **桌面应用**: Electron + Electron Builder
- **跨平台**: Windows, macOS, Linux
- **自动更新**: Electron Updater
- **CI/CD**: GitHub Actions 自动化

## 📚 文档系统
- **API 文档**: 完整的 API 参考文档
- **架构文档**: 系统设计和架构说明
- **用户指南**: 详细的使用指南
- **开发文档**: 开发环境搭建和贡献指南

## 🎯 核心特性
- **项目管理**: 完整的项目生命周期管理
- **资源中心**: 统一的资源管理和组织
- **AI 工作流**: 多提供商 AI 集成和自动化
- **智能日志**: 全面的活动跟踪和分析
- **设置管理**: 可定制的偏好设置和配置

---

**🐰 BunnyEra Console v2.0** - 为独立创业者打造的桌面级企业控制台

*由 [BUNNYERA LLC](https://bunnyera.com) 用 ❤️ 制作*
```
