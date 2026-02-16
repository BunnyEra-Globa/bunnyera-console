# 🐰 BunnyEra Console
 
<div align="center">
 
![BunnyEra Console Logo](https://img.shields.io/badge/🐰-BunnyEra%20Console-6366f1?style=for-the-badge&labelColor=1e293b)
 
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=flat-square)](https://github.com/bunnyera/bunnyera-console)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=flat-square&logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
 
[![Build Status](https://img.shields.io/github/workflow/status/bunnyera/bunnyera-console/CI?style=flat-square)](https://github.com/bunnyera/bunnyera-console/actions)
[![Downloads](https://img.shields.io/github/downloads/bunnyera/bunnyera-console/total?style=flat-square)](https://github.com/bunnyera/bunnyera-console/releases)
[![Stars](https://img.shields.io/github/stars/bunnyera/bunnyera-console?style=flat-square)](https://github.com/bunnyera/bunnyera-console/stargazers)
[![Forks](https://img.shields.io/github/forks/bunnyera/bunnyera-console?style=flat-square)](https://github.com/bunnyera/bunnyera-console/network/members)
[![Issues](https://img.shields.io/github/issues/bunnyera/bunnyera-console?style=flat-square)](https://github.com/bunnyera/bunnyera-console/issues)
 
**A Desktop-Grade Enterprise Console for Solo Entrepreneurs**
 
*Manage all your projects, resources, AI workflows, logs, and settings in one unified platform*
 
[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🌟 Features](#-features) • [💻 Development](#-development) • [🤝 Contributing](#-contributing)
 
</div>
 
---
 
## 🌟 Features
 
### 🎯 **Core Capabilities**
- **📊 Project Management** - Centralized project tracking and organization
- **🗂️ Resource Center** - Unified asset and resource management
- **🤖 AI Hub** - Integrated AI workflow automation
- **📝 Smart Logging** - Comprehensive activity and error tracking
- **⚙️ Settings Management** - Customizable preferences and configurations
- **📱 Responsive Design** - Optimized for desktop and web environments
 
### 🏗️ **Architecture Highlights**
- **🔧 Monorepo Structure** - Organized, scalable codebase
- **⚡ Lightning Fast** - Vite-powered development and building
- **🎨 Modern UI** - Tailwind CSS with custom theming
- **🖥️ Cross-Platform** - Electron-based desktop application
- **☁️ Cloud-Ready** - Gitpod integration for instant development
- **🔒 Enterprise-Grade** - Secure, reliable, and performant
 
---
 
## 🏗️ Project Structure
 
```
bunnyera-console/
├── 📦 packages/
│   ├── 🧠 bunnyera-console-core/      # Core Logic Layer (Brain)
│   │   ├── src/
│   │   │   ├── projects/             # Project management
│   │   │   ├── resources/            # Resource center
│   │   │   ├── ai-hub/              # AI workflow engine
│   │   │   ├── logs/                # Logging system
│   │   │   ├── auth/                # User authentication
│   │   │   └── mock/                # Mock data & APIs
│   │   └── package.json
│   │
│   ├── 🎨 bunnyera-console-ui/        # UI Framework (Layout + Components)
│   │   ├── src/
│   │   │   ├── components/          # Reusable UI components
│   │   │   ├── layouts/             # Layout components
│   │   │   ├── themes/              # Tailwind themes
│   │   │   └── hooks/               # Custom React hooks
│   │   └── package.json
│   │
│   ├── 📱 bunnyera-console-apps/      # Internal Applications
│   │   ├── src/
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   ├── projects/            # Project management app
│   │   │   ├── resources/           # Resource management app
│   │   │   ├── ai-hub/              # AI workflow app
│   │   │   ├── logs/                # Logging app
│   │   │   ├── notes/               # Notes app
│   │   │   └── settings/            # Settings app
│   │   └── package.json
│   │
│   └── 🖥️ bunnyera-console-electron/  # Desktop Application Shell
│       ├── src/
│       │   ├── main/                # Electron main process
│       │   ├── preload/             # Preload scripts
│       │   └── renderer/            # React frontend
│       ├── build/                   # Build configurations
│       └── package.json
│
├── 📄 README.md
├── 📜 LICENSE
├── 🔧 package.json
├── 🔧 pnpm-workspace.yaml
└── 🔧 tsconfig.json
```
 
---
 
## 🚀 Quick Start
 
### 🌩️ **Cloud Development (Recommended)**
 
Get started instantly without any local setup:
 
1. **Fork this repository** to your GitHub account
2. **Open in Gitpod**: `https://gitpod.io/#YOUR_REPO_URL`
3. **Wait for auto-setup** - Gitpod will automatically run:
   ```bash
   pnpm install
   cd packages/bunnyera-console-electron
   pnpm run dev
   ```
4. **Start developing** - Your BunnyEra Console is ready! 🎉
 
### 💻 **Local Development**
 
#### Prerequisites
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
 
#### Installation
```bash
# Clone the repository
git clone https://github.com/bunnyera/bunnyera-console.git
cd bunnyera-console
 
# Install dependencies
pnpm install
 
# Start development server
cd packages/bunnyera-console-electron
pnpm run dev
```
 
#### Available Scripts
```bash
# Development
pnpm run dev          # Start development server
pnpm run dev:web      # Start web version only
 
# Building
pnpm run build        # Build all packages
pnpm run build:web    # Build web version
pnpm run dist         # Build desktop distributables
 
# Testing
pnpm run test         # Run tests
pnpm run test:watch   # Run tests in watch mode
 
# Linting
pnpm run lint         # Lint all packages
pnpm run lint:fix     # Fix linting issues
```
 
---
 
## 📦 Desktop Distribution
 
Build desktop applications for all platforms:
 
```bash
cd packages/bunnyera-console-electron
pnpm run dist
```
 
**Generated Distributables:**
- 🪟 **Windows**: `.exe` installer
- 🍎 **macOS**: `.dmg` disk image
- 🐧 **Linux**: `.AppImage` portable app
 
---
 
## 🎨 Theming & Customization
 
BunnyEra Console features a beautiful, customizable theme system:
 
- **🎨 Primary Colors**: Blue-Purple gradient (`#6366f1` to `#8b5cf6`)
- **🌙 Dark Mode**: Full dark mode support
- **📱 Responsive**: Mobile-first design approach
- **🎯 Accessibility**: WCAG 2.1 AA compliant
 
### Custom Themes
```typescript
// packages/bunnyera-console-ui/src/themes/custom.ts
export const customTheme = {
  colors: {
    primary: '#your-color',
    secondary: '#your-secondary',
    // ... more customizations
  }
}
```
 
---
 
## 🔧 Configuration
 
### Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=https://api.bunnyera.com
VITE_APP_VERSION=2.0.0
VITE_ENABLE_MOCK=true
```
 
### Electron Configuration
```json
// packages/bunnyera-console-electron/electron-builder.json
{
  "appId": "com.bunnyera.console",
  "productName": "BunnyEra Console",
  "directories": {
    "output": "dist"
  }
}
```
 
---
 
## 🤖 AI Integration
 
BunnyEra Console includes powerful AI workflow capabilities:
 
- **🔗 Multi-Provider Support** - OpenAI, Anthropic, Google, and more
- **⚡ Workflow Automation** - Custom AI-powered workflows
- **📊 Analytics Dashboard** - Track AI usage and performance
- **🔒 Secure API Management** - Encrypted API key storage
 
---
 
## 🧪 Testing
 
```bash
# Run all tests
pnpm run test
 
# Run tests for specific package
pnpm run test --filter bunnyera-console-core
 
# Run E2E tests
pnpm run test:e2e
```
 
**Testing Stack:**
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Component Tests**: Storybook
 
---
 
## 📖 Documentation
 
- **📚 [API Documentation](docs/api.md)** - Complete API reference
- **🎨 [UI Components](docs/components.md)** - Component library guide
- **🏗️ [Architecture](docs/architecture.md)** - System architecture overview
- **🚀 [Deployment](docs/deployment.md)** - Deployment strategies
- **🔧 [Configuration](docs/configuration.md)** - Configuration options
 
---
 
## 🤝 Contributing
 
We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.
 
### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request
 
### Code Standards
- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Jest** for testing
 
---
 
## 📊 Roadmap
 
### 🎯 **Version 2.1** (Q2 2024)
- [ ] Plugin system architecture
- [ ] Advanced AI workflow builder
- [ ] Real-time collaboration features
- [ ] Mobile companion app
 
### 🚀 **Version 3.0** (Q4 2024)
- [ ] Cloud synchronization
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] API marketplace integration
 
---
 
## 🏢 About BUNNYERA LLC
 
**BUNNYERA LLC** is a technology company focused on building innovative tools for solo entrepreneurs and small teams. We believe in the power of automation, AI, and beautiful user experiences to transform how people work.
 
### 🌐 **Connect With Us**
- **🌍 Website**: [bunnyera.com](https://bunnyera.com)
- **📧 Email**: hello@bunnyera.com
- **🐦 Twitter**: [@BunnyEraHQ](https://twitter.com/BunnyEraHQ)
- **💼 LinkedIn**: [BUNNYERA LLC](https://linkedin.com/company/bunnyera)
 
---
 
## 📜 License
 
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
 
```
Copyright (c) 2024 BUNNYERA LLC
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```
 
---
 
## 🙏 Acknowledgments
 
- **⚡ Vite** - Lightning fast build tool
- **⚛️ React** - UI library
- **🖥️ Electron** - Desktop app framework
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **📦 pnpm** - Fast, disk space efficient package manager
 
---
 
## 📈 Stats
 
![GitHub repo size](https://img.shields.io/github/repo-size/bunnyera/bunnyera-console?style=flat-square)
![GitHub code size](https://img.shields.io/github/languages/code-size/bunnyera/bunnyera-console?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/bunnyera/bunnyera-console?style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/bunnyera/bunnyera-console?style=flat-square)
 
---
 
<div align="center">
 
**Made with ❤️ by [BUNNYERA LLC](https://bunnyera.com)**
 
*Empowering solo entrepreneurs with cutting-edge technology*
 
[![Follow on Twitter](https://img.shields.io/twitter/follow/BunnyEraHQ?style=social)](https://twitter.com/BunnyEraHQ)
[![Star on GitHub](https://img.shields.io/github/stars/bunnyera/bunnyera-console?style=social)](https://github.com/bunnyera/bunnyera-console)
 
</div>
