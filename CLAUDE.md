# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
npm run dev        # Start development server on port 3000 (or 3001 if occupied)
npm run build      # Build the production application
npm run start      # Start the production server
npm run lint       # Run ESLint
```

### Database Management
```bash
# PostgreSQL setup (see POSTGRESQL_SETUP.md for details)
# Default connection: postgresql://postgres:password@localhost:5432/kimuraya
# macOS default: postgresql://[your-username]@localhost:5432/kimuraya

npm run test:db     # Test database connection
npm run seed:admin  # Seed admin user for authentication (credentials: admin@example.com / password123)
npm run seed:users  # Seed multiple test users (see LOGIN_CREDENTIALS.md for all credentials)
```

## Architecture Overview

This is a multilingual Next.js 15.4.3 restaurant website with content management capabilities:

### Core Technologies
- **Framework**: Next.js 15.4.3 with App Router
- **TypeScript**: Strict mode enabled
- **Authentication**: Custom session-based auth with PostgreSQL (via Payload CMS)
- **Database**: PostgreSQL via pg driver
- **Styling**: Tailwind CSS v4 + Custom CSS (public/css/styles.css, public/css/language-switcher.css, public/css/nav-actions.css)
- **Charts**: Recharts for analytics dashboard
- **Content Storage**: JSON file-based content management (src/data/page-content.json)
- **CMS**: Payload CMS integration (payload.config.ts)
- **i18n**: Custom multilingual system supporting Japanese (default), English, Korean, and Chinese
- **Icons**: Lucide React

### Key Application Structure

1. **Public Landing Page** (`/`)
   - Displays restaurant information, menu, gallery
   - Content fetched from API endpoint `/api/content`
   - Main component: `HomePage.tsx`
   - Supports multilingual content through LanguageContext

2. **Admin Dashboard** (`/home`)
   - Protected route requiring authentication
   - Shows mock analytics data (not connected to Google Analytics)
   - Key features: traffic trends, device analytics, KPI cards

3. **Content Editor** (`/home/editor`)
   - Visual content management system
   - Allows editing text, images, and videos
   - Changes saved to `src/data/page-content.json`
   - Upload functionality saves to `public/uploads/`

### Multilingual Architecture
- **Language Support**: Japanese (ja), English (en), Korean (ko), Chinese (zh)
- **Language Context**: Client-side state management in `src/contexts/LanguageContext.tsx`
- **Language Switcher**: Dropdown component with flag icons in navigation
- **Translation System**:
  - Static translations: `src/lib/translations/static-translations.ts`
  - Content translations: Embedded in `page-content.json` with status tracking
  - Translation status: 'translated', 'auto-translated', or 'untranslated'
- **Cookie Storage**: Language preference saved for 1 year
- **Browser Detection**: Automatic language selection based on browser settings

### Content Management Flow
1. Content stored in `src/data/page-content.json` with multilingual support
2. API route `/api/content` serves content with caching disabled
3. Editor updates content via POST to `/api/content` (deep merge operation)
4. HomePage fetches content server-side for SEO
5. MultilingualText component handles language-specific rendering

### Authentication Flow
- Login at `/login` using credentials from seed:admin command
- Session stored in PostgreSQL database via Payload CMS
- Middleware protects `/home/*` and `/admin/*` routes (excluding /admin/login)
- Cookie-based authentication using 'payload-token'
- Logout clears session cookie

### Important Files
- `src/lib/content.ts` - Content fetching utility
- `src/lib/i18n.ts` - i18n configuration and utilities
- `src/lib/translations.ts` - Translation helper functions
- `src/app/api/content/route.ts` - Content API endpoints (GET/POST with deep merge)
- `src/app/HomePage.tsx` - Main landing page component
- `src/middleware.ts` - Authentication middleware
- `src/contexts/LanguageContext.tsx` - Language state management
- `src/components/LanguageSwitcher.tsx` - Language selection UI
- `src/components/MultilingualText.tsx` - Multilingual content renderer
- `src/data/page-content.json` - JSON content storage with multilingual data
- `payload.config.ts` - Payload CMS configuration
- `.env.local` - Environment variables including DATABASE_URI

### Development Notes
- Port 3000 often occupied, fallback to 3001
- No test framework configured
- Static files served from `public/`
- Image uploads stored in `public/uploads/`
- Database: PostgreSQL (connection string in `.env.local`)
- TypeScript path aliases: `@/*` → `./src/*`, `@payload-config` → `./payload.config.ts`
- Uses tsx for TypeScript execution (seed scripts)
- Styled-jsx included for component-scoped styles

### API Structure
- `/api/content` - Content management endpoints
- `/api/upload` - File upload handling
- `/api/[...slug]` - Payload CMS API routes

### Environment Notes
- Payload CMS dependencies included but configuration details not fully documented
- Content is managed through both Payload CMS and custom JSON-based system
- Analytics dashboard displays mock data (not connected to real analytics)
- Uses js-yaml for YAML parsing functionality