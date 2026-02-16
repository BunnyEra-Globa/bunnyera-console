# BunnyEra Console

A modern desktop control center for one-person companies. Built with Electron, React, TypeScript, and Tailwind CSS.

![BunnyEra Console](https://img.shields.io/badge/BunnyEra-Console-blueviolet)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F?logo=electron)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-06B6D4?logo=tailwindcss)

## Features

- **Dashboard** - Overview of projects, resources, and system status
- **Projects** - Manage and track all your projects with progress indicators
- **Resources** - Organize files, links, and notes
- **AI Hub** - Chat interface for AI assistance
- **Logs** - Monitor system activity and debug issues
- **Settings** - Customize appearance, notifications, and preferences

## Tech Stack

- **Electron** - Desktop application framework
- **Vite** - Fast build tool and dev server
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

## Project Structure

```
bunnyera-console/
├── electron/              # Electron main process
│   ├── main.ts           # Main entry point
│   └── preload.ts        # Preload script with contextBridge
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── Layout.tsx
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── pages/            # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ResourcesPage.tsx
│   │   ├── AIHubPage.tsx
│   │   ├── LogsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── lib/              # Utility functions
│   │   └── utils.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── index.html
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this repository:
```bash
cd bunnyera-console
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the app in development mode:

```bash
npm run dev
```

This will:
1. Start the Vite dev server
2. Launch Electron with hot reload

### Building

Build the production version:

```bash
npm run build
```

This creates:
- `dist/` - Frontend build
- `dist-electron/` - Electron main process build

### Packaging

Create distributable packages:

```bash
# All platforms
npm run dist

# Windows only
npm run dist:win

# macOS only
npm run dist:mac

# Linux only
npm run dist:linux
```

Output will be in the `release/` directory.

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:electron` | Build Electron main process |
| `npm run dist` | Build and package for all platforms |
| `npm run dist:win` | Build and package for Windows |
| `npm run dist:mac` | Build and package for macOS |
| `npm run dist:linux` | Build and package for Linux |
| `npm run preview` | Preview production build |

## Customization

### Theme Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --be-primary: #6366f1;
  --be-accent: #3b82f6;
  --be-purple: #8b5cf6;
  --be-blue: #0ea5e9;
}
```

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation item in `src/components/Sidebar.tsx`

### Mock Data

All business data is stored as mock data in the page components. Replace with real API calls as needed:

```typescript
// In your page component
const [data, setData] = useState(mockData)

// Replace with:
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData)
}, [])
```

## IPC Communication

The preload script exposes a safe API to the renderer process:

```typescript
// In renderer process
window.bunnyeraAPI.getAppInfo()  // Get app info
window.bunnyeraAPI.log(message)  // Log to main process
window.bunnyeraAPI.platform      // Get platform info
```

Add new IPC handlers in:
- `electron/preload.ts` - Expose API
- `electron/main.ts` - Handle IPC calls

## Packaging Configuration

Edit `package.json` build section:

```json
{
  "build": {
    "appId": "com.bunnyera.console",
    "productName": "BunnyEra Console",
    "mac": {
      "target": "dmg"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

## License

MIT

## Author

BunnyEra
