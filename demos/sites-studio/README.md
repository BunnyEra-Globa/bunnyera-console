# BunnyEra Sites Studio

A production-ready visual website builder inspired by Strikingly. Create beautiful, responsive websites with an intuitive drag-and-drop editor.

![BunnyEra Sites Studio](https://img.shields.io/badge/BunnyEra-Sites%20Studio-6366f1)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-ea2845)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748)

## Features

- **Visual Editor**: Intuitive drag-and-drop interface for building websites
- **Section System**: Pre-built sections (Hero, About, Features) with customizable properties
- **Template System**: Start with the BunnyEra Landing template
- **Real-time Preview**: See changes instantly as you edit
- **Responsive Design**: All sites are mobile-friendly by default
- **Authentication**: Secure JWT-based auth system
- **Dark Console UI**: Sleek OS-shell aesthetic with soft neon accents

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React DnD** (drag and drop)

### Backend
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**

### Monorepo
- **Turborepo** for build orchestration

## Project Structure

```
bunnyera-sites/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── package.json
├── turbo.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bunnyera-sites
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE bunnyera;
CREATE USER bunnyera_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bunnyera TO bunnyera_user;
```

Update your `.env` file:
```env
DATABASE_URL="postgresql://bunnyera_user:your_password@localhost:5432/bunnyera?schema=public"
```

## Available Scripts

### Root
- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run format` - Format code with Prettier

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

### Web (Frontend)
```bash
cd apps/web
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
```

### API (Backend)
```bash
cd apps/api
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run start    # Start production server
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Sites
- `GET /sites` - List all sites for current user
- `POST /sites` - Create new site
- `GET /sites/:id` - Get site by ID
- `PATCH /sites/:id` - Update site
- `DELETE /sites/:id` - Delete site
- `POST /sites/:id/publish` - Publish site

### Health
- `GET /health` - Health check

## Section Types

### Hero Section
Full-width hero with headline, subheadline, CTA buttons, and optional background image.

**Properties:**
- `headline` - Main heading text
- `subheadline` - Secondary text
- `ctaText` - Call-to-action button text
- `ctaLink` - CTA button link
- `backgroundImage` - Optional background image URL
- `alignment` - Text alignment (left, center, right)

### About Section
Company or personal information section with title, description, and optional image.

**Properties:**
- `title` - Section title
- `description` - Main content text
- `imageUrl` - Optional image URL
- `imagePosition` - Image position (left, right)

### Features Section
Grid of feature cards with icons, titles, and descriptions.

**Properties:**
- `title` - Section title
- `subtitle` - Optional subtitle
- `features` - Array of feature objects
  - `icon` - Icon name
  - `title` - Feature title
  - `description` - Feature description
- `columns` - Number of columns (2, 3, 4)

## Creating Custom Sections

1. Create a new component in `apps/web/src/components/sections/`
2. Register the section in `apps/web/src/lib/section-registry.ts`
3. Add the section type to the shared types

Example:
```typescript
// components/sections/CustomSection.tsx
export function CustomSection({ data }: SectionProps) {
  return <div>{data.content}</div>;
}

// lib/section-registry.ts
registry.register('custom', {
  component: CustomSection,
  defaultData: { content: 'Default content' },
  label: 'Custom Section'
});
```

## Deployment

### Frontend (Vercel)
```bash
cd apps/web
vercel --prod
```

### Backend (Railway/Render/Heroku)
```bash
cd apps/api
# Follow platform-specific deployment guides
```

### Database
Use managed PostgreSQL from:
- Railway
- Supabase
- AWS RDS
- DigitalOcean Managed Databases

## Environment Variables

### Production

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-production-secret"
JWT_EXPIRES_IN="7d"

# API
API_PORT=3001
API_URL="https://api.yourdomain.com"

# Web
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Environment
NODE_ENV="production"
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@bunnyera.com or join our Discord community.

---

Built with love by the BunnyEra Team 🐰
