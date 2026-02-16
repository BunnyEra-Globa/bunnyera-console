# bunnyera-console-apps

A collection of internal applications for the BunnyEra Console. Each app is a page module running inside the `bunnyera-console-ui` layout.

## 📦 Installation

```bash

npm install bunnyera-console-apps
# or
yarn add bunnyera-console-apps
# or
pnpm add bunnyera-console-apps

📋 Included Applications

App	Component	Description
Dashboard	DashboardApp	Console overview showing project count, error count, recent activity, and resource statistics
Projects	ProjectsApp	Project center with list view, filters, and detail panel
Resources	ResourcesApp	Resource center with grouped view, search, and detail panel
AIHub	AIHubApp	AI workspace with chat interface and agent selection
LogCenter	LogCenterApp	Log center with level filters and error inspection
Notes	NotesApp	Notes app with list, edit, create/delete features
Settings	SettingsApp	Settings for theme, language, shortcuts, notifications, and more

🚀 Quick Start

Import a single app
tsx
import { DashboardApp } from 'bunnyera-console-apps';

function MyPage() {
  return <DashboardApp />;
}
Using the app registry
tsx
import { appRegistry, getAppById } from 'bunnyera-console-apps';

// Get all apps
console.log(appRegistry);

// Get app by ID
const dashboardApp = getAppById('dashboard');

// Render the app
const AppComponent = dashboardApp?.component;
return <AppComponent />;
Dynamic routing example
tsx
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

📖 API Documentation

DashboardApp
Console overview showing key metrics and recent activity.

tsx
interface DashboardAppProps {
  className?: string;
}

<DashboardApp className="my-dashboard" />
ProjectsApp
Project center supporting list view, filtering, and detail view.

tsx
interface ProjectsAppProps {
  className?: string;
}

<ProjectsApp className="my-projects" />
ResourcesApp
Resource center displaying grouped resources with search support.

tsx
interface ResourcesAppProps {
  className?: string;
}

<ResourcesApp className="my-resources" />
AIHubApp
AI workspace providing chat interface and agent selection.

tsx
interface AIHubAppProps {
  className?: string;
}

<AIHubApp className="my-aihub" />
LogCenterApp
Log center supporting level filtering and error inspection.

tsx
interface LogCenterAppProps {
  className?: string;
}

<LogCenterApp className="my-logs" />
NotesApp
Notes app supporting create, edit, and delete (stored in memory).

tsx
interface NotesAppProps {
  className?: string;
}

<NotesApp className="my-notes" />
SettingsApp
Settings app including theme, language, shortcuts, notifications, and more.

tsx
interface SettingsAppProps {
  className?: string;
}

<SettingsApp className="my-settings" />

🔧 Mock API

This package uses the bunnyera-console-core Mock API for data interactions.

tsx
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
const newNote = await mockApi.notes.create({ title: 'New Note', content: '' });

// Settings
const settings = await mockApi.settings.get();
await mockApi.settings.update({ theme: 'dark' });

🏗️ Project Structure

Code
bunnyera-console-apps/
├── src/
│   ├── apps/
│   │   ├── DashboardApp/      # Console overview
│   │   ├── ProjectsApp/       # Project center
│   │   ├── ResourcesApp/      # Resource center
│   │   ├── AIHubApp/          # AI workspace
│   │   ├── LogCenterApp/      # Log center
│   │   ├── NotesApp/          # Notes
│   │   └── SettingsApp/       # Settings
│   ├── core/
│   │   ├── mockApi.ts         # Mock API implementation
│   │   └── index.ts           # Core entry
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── index.ts               # Package entry
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

🛠️ Development

bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

📄 Dependencies

Peer Dependencies
react: ^18.0.0

react-dom: ^18.0.0

Dependencies
bunnyera-console-ui: Layout components (workspace)

bunnyera-console-core: Logic core (workspace)

📝 License

MIT License

🤝 Contributing

Issues and pull requests are welcome!

Made with ❤️ by BunnyEra Team
