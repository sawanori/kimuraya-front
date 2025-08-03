# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
npm run dev        # Start development server on port 3000 (or 3001 if occupied)
npm run build      # Build the production application (runs prisma generate first)
npm run start      # Start the production server
npm run lint       # Run ESLint
```

### Database Management
```bash
# PostgreSQL setup (see POSTGRESQL_SETUP.md for details)
# Default connection: postgresql://postgres:password@localhost:5432/kimuraya
# macOS default: postgresql://[your-username]@localhost:5432/kimuraya

npm run test:db              # Test database connection
npm run seed:admin           # Seed admin user for authentication (credentials: admin@example.com / password123)
npm run seed:users           # Seed multiple test users (see LOGIN_CREDENTIALS.md for all credentials)
npm run migrate:multitenant  # Migrate to multi-tenant architecture
npm run add:tenant           # Add a new tenant (interactive CLI)
npm run list:tenants         # List all tenants

# Prisma Commands
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate:dev   # Run database migrations in development
npm run prisma:migrate:deploy # Deploy migrations to production
npm run prisma:studio        # Open Prisma Studio database GUI
npm run prisma:db:push       # Push schema changes to database
npm run prisma:db:pull       # Pull schema from database
npm run prisma:seed          # Run database seeding
```

## Architecture Overview

This is a multilingual Next.js 15.4.3 restaurant website with content management capabilities:

### Core Technologies
- **Framework**: Next.js 15.4.3 with App Router
- **TypeScript**: Strict mode enabled
- **Authentication**: Custom session-based auth with PostgreSQL (via Payload CMS)
- **Database**: PostgreSQL via pg driver
- **ORMs**: Dual ORM setup - Payload CMS for content, Prisma for complex queries
- **Styling**: Tailwind CSS v4 + Custom CSS (public/css/styles.css, public/css/language-switcher.css, public/css/nav-actions.css)
- **Charts**: Recharts for analytics dashboard
- **Content Storage**: JSON file-based content management (src/data/page-content.json)
- **CMS**: Payload CMS v3.48.0 integration (payload.config.ts)
- **i18n**: Custom multilingual system supporting Japanese (default), English, Korean, and Chinese
- **Icons**: Lucide React
- **Cloud Storage**: Cloudflare R2 for media uploads (S3-compatible)
- **Multi-tenancy**: Host-based tenant detection with Row-Level Security (RLS)

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

4. **Google Business Profile Management** (`/home/gbp`)
   - Review management interface (currently mock data)
   - Configurable response templates
   - Prepared for Google Business Profile API integration

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
- Role-based access: admin/user roles with super admin capabilities

### Multi-tenant Architecture
- Host-based tenant detection (e.g., tenant1.domain.com, tenant2.domain.com)
- PostgreSQL Row-Level Security (RLS) for data isolation
- Tenant context managed via PostgreSQL session variables
- Middleware intercepts requests and sets tenant context
- Collections include tenantId field for data isolation
- Tenant management CLI tools for adding/listing tenants
- Super Admin can access all tenants

### Row-Level Security (RLS) Implementation
- **Tenant Context Utility**: `src/util/dbTenant.ts` manages PostgreSQL session variables
- **Session Variables**: `app.current_tenant`, `app.current_user_id`, `app.is_super_admin`
- **Automatic Context Setting**: Hooks in collections automatically set tenant context
- **Context Clearing**: Session variables are cleared after operations

### API Security Features
- **API Key Encryption**: AES-256-GCM encryption for sensitive API keys
- **Secure Storage**: API keys stored encrypted in database
- **Server-side Only**: Decryption happens only on server-side
- **Tenant-specific APIs**: Each tenant can have separate API configurations

### Important Files
- `src/lib/content.ts` - Content fetching utility
- `src/lib/i18n.ts` - i18n configuration and utilities
- `src/lib/translations.ts` - Translation helper functions
- `src/lib/crypto.ts` - Encryption/decryption utilities for API keys
- `src/app/api/content/route.ts` - Content API endpoints (GET/POST with deep merge)
- `src/app/HomePage.tsx` - Main landing page component
- `src/middleware.ts` - Authentication and multi-tenant middleware
- `src/contexts/LanguageContext.tsx` - Language state management
- `src/components/LanguageSwitcher.tsx` - Language selection UI
- `src/components/MultilingualText.tsx` - Multilingual content renderer
- `src/data/page-content.json` - JSON content storage with multilingual data
- `src/util/dbTenant.ts` - Database tenant context management
- `payload.config.ts` - Payload CMS configuration
- `prisma/schema.prisma` - Prisma database schema
- `.env.local` - Environment variables including DATABASE_URI

### Development Notes
- Port 3000 often occupied, fallback to 3001
- No test framework configured
- Static files served from `public/`
- Image uploads stored in `public/uploads/`
- Database: PostgreSQL (connection string in `.env.local`)
- TypeScript path aliases: `@/*` → `./src/*`, `@payload-config` → `./payload.config.ts`
- Uses tsx for TypeScript execution (seed scripts and CLI tools)
- Styled-jsx included for component-scoped styles
- Prisma client generates to `src/generated/prisma/` (git-ignored)
- Build process requires `prisma generate` before `next build`

### API Structure
- `/api/content` - Content management endpoints
- `/api/upload` - File upload handling
- `/api/[...slug]` - Payload CMS API routes
- `/api/tenant/reviews` - Tenant-specific review API (Google Business Profile integration)

### Environment Configuration (.env.local)
```bash
DATABASE_URI=postgresql://[username]@localhost:5432/kimuraya
PAYLOAD_SECRET=your-super-secret-key-change-this-in-production
NEXT_PUBLIC_ENABLE_HOST_MW=true  # Enable multi-tenant host detection

# Cloudflare R2 (S3-compatible storage)
S3_ENDPOINT=https://[account].r2.cloudflarestorage.com
S3_BUCKET=payload-media
S3_ACCESS_KEY=[your-access-key]
S3_SECRET_KEY=[your-secret-key]
```

### Environment Notes
- No test framework configured (no Jest, Vitest, or testing-library)
- Content is managed through both Payload CMS and custom JSON-based system
- Analytics dashboard displays mock data (not connected to real analytics)
- Uses js-yaml for YAML parsing functionality
- Uses tsx for TypeScript execution (seed scripts and CLI tools)
- Dual ORM setup: Payload CMS for content management, Prisma for complex queries

## Troubleshooting

### /home routes not displaying
If the `/home` routes are not accessible:

1. **Missing API endpoints**: The `/home` page requires authentication endpoints:
   - `/api/users/me` - Returns current user information
   - `/api/users/logout` - Handles user logout
   
2. **Authentication flow**:
   - Ensure you're logged in via `/login`
   - Check that `payload-token` cookie is set
   - Verify database connection with `npm run test:db`
   - Run `npm run seed:admin` to create admin user

3. **Multi-tenant middleware**:
   - If `NEXT_PUBLIC_ENABLE_HOST_MW=true`, the middleware adds tenant filtering
   - This may affect authentication checks
   - Try setting `NEXT_PUBLIC_ENABLE_HOST_MW=false` for debugging

4. **Port conflicts**:
   - Next.js defaults to port 3000, but often falls back to 3001 or 3002
   - Check the console output for the actual port being used

### Database Issues
- Ensure PostgreSQL is running and accessible
- Verify DATABASE_URI in `.env.local`
- Run `npm run prisma:generate` if Prisma client is missing
- Use `npm run prisma:studio` to inspect database directly