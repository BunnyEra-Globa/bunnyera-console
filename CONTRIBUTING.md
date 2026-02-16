
# 🤝 Contributing to BunnyEra Console

Thank you for your interest in contributing to BunnyEra Console! We welcome contributions from developers of all skill levels and backgrounds.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Contributing Guidelines](#-contributing-guidelines)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Coding Standards](#-coding-standards)
- [Testing Requirements](#-testing-requirements)
- [Documentation](#-documentation)
- [Community](#-community)

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Git** >= 2.20.0
- **VS Code** (recommended) with recommended extensions

### Quick Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bunnyera-console.git
   cd bunnyera-console
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/bunnyera/bunnyera-console.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Start development**:
   ```bash
   cd packages/bunnyera-console-electron
   pnpm run dev
   ```

## 🛠️ Development Setup

### Recommended VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "ms-playwright.playwright",
    "vitest.explorer"
  ]
}
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Development settings
VITE_APP_ENV=development
VITE_ENABLE_MOCK=true
VITE_API_BASE_URL=http://localhost:3001

# Optional: Enable debug logging
DEBUG=bunnyera:*
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug fixes** - Fix issues and improve stability
- ✨ **New features** - Add new functionality
- 📚 **Documentation** - Improve docs and examples
- 🎨 **UI/UX improvements** - Enhance user experience
- ⚡ **Performance** - Optimize code and reduce bundle size
- 🧪 **Tests** - Add or improve test coverage
- 🔧 **Tooling** - Improve development experience

### Before You Start

1. **Check existing issues** - Look for related issues or discussions
2. **Create an issue** - For new features or significant changes
3. **Get feedback** - Discuss your approach with maintainers
4. **Start small** - Begin with smaller contributions to get familiar

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
pnpm run test

# Run linting
pnpm run lint

# Test the build
pnpm run build

# Test the desktop app
cd packages/bunnyera-console-electron
pnpm run dist
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples of good commit messages
git commit -m "feat: add project template system"
git commit -m "fix: resolve memory leak in AI hub"
git commit -m "docs: update installation instructions"
git commit -m "test: add unit tests for resource manager"
```

### 5. Push and Create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

### 6. PR Requirements

Your pull request should:

- [ ] Have a clear title and description
- [ ] Reference related issues (e.g., "Fixes #123")
- [ ] Include tests for new functionality
- [ ] Pass all CI checks
- [ ] Be up to date with the main branch
- [ ] Have been tested locally

## 🐛 Issue Guidelines

### Bug Reports

When reporting bugs, please include:

- **Environment details** (OS, Node.js version, etc.)
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** or error messages
- **Minimal reproduction** if possible

### Feature Requests

For feature requests, please provide:

- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Alternatives considered**

### Issue Templates

We provide issue templates to help you structure your reports:

- 🐛 Bug Report
- ✨ Feature Request
- 📚 Documentation Issue
- ❓ Question / Discussion

## 📏 Coding Standards

### TypeScript

- Use **strict TypeScript** configuration
- Prefer **interfaces** over types for object shapes
- Use **explicit return types** for functions
- Avoid **any** type - use proper typing

```typescript
// ✅ Good
interface ProjectConfig {
  name: string;
  version: string;
  dependencies: string[];
}

function createProject(config: ProjectConfig): Project {
  // implementation
}

// ❌ Avoid
function createProject(config: any): any {
  // implementation
}
```

### React Components

- Use **functional components** with hooks
- Prefer **named exports** over default exports
- Use **TypeScript interfaces** for props
- Follow **React best practices**

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Create **custom components** for complex styles
- Follow **mobile-first** responsive design
- Use **CSS custom properties** for theming

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── __tests__/          # Test files
```

## 🧪 Testing Requirements

### Unit Tests

- Write tests for **all new functions**
- Use **Jest** and **React Testing Library**
- Aim for **>80% code coverage**
- Test **edge cases** and error conditions

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button variant="primary" onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button variant="primary" onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

- Test **component interactions**
- Test **API integrations**
- Use **MSW** for API mocking

### E2E Tests

- Test **critical user flows**
- Use **Playwright** for E2E testing
- Run tests in **CI/CD pipeline**

## 📚 Documentation

### Code Documentation

- Use **JSDoc** for function documentation
- Write **clear comments** for complex logic
- Document **API interfaces**

```typescript
/**
 * Creates a new project with the specified configuration.
 * 
 * @param config - The project configuration
 * @param options - Additional options for project creation
 * @returns Promise that resolves to the created project
 * 
 * @example
 * ```typescript
 * const project = await createProject({
 *   name: 'My Project',
 *   template: 'react'
 * });
 * ```
 */
export async function createProject(
  config: ProjectConfig,
  options?: CreateProjectOptions
): Promise<Project> {
  // implementation
}
```

### README Updates

When adding new features:

- Update the **feature list**
- Add **usage examples**
- Update **installation instructions** if needed

## 🌟 Recognition

Contributors are recognized in several ways:

- **Contributors section** in README
- **Release notes** mention significant contributions
- **GitHub achievements** and badges
- **Community highlights** on social media

## 💬 Community

### Getting Help

- **GitHub Discussions** - For questions and general discussion
- **GitHub Issues** - For bug reports and feature requests
- **Discord** - Real-time chat with the community
- **Twitter** - Follow [@BunnyEraHQ](https://twitter.com/BunnyEraHQ) for updates

### Communication Guidelines

- Be **respectful** and **inclusive**
- Use **clear** and **concise** language
- **Search existing** discussions before asking
- **Provide context** when asking for help

## 📞 Contact

For questions about contributing:

- **Email**: contributors@bunnyera.com
- **GitHub**: [@bunnyera](https://github.com/bunnyera)
- **Discord**: [BunnyEra Community](https://discord.gg/bunnyera)

---

Thank you for contributing to BunnyEra Console! 🐰✨

*Made with ❤️ by the BunnyEra community*
