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
npm run seed:admin  # Seed admin user for authentication
```

## Architecture Overview

This is a Next.js 15.4.3 restaurant website with content management capabilities:

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Authentication**: Custom session-based auth with SQLite
- **Database**: SQLite via better-sqlite3
- **Styling**: Tailwind CSS + Custom CSS
- **Charts**: Recharts for analytics dashboard
- **Content Storage**: JSON file-based content management

### Key Application Structure

1. **Public Landing Page** (`/`)
   - Displays restaurant information, menu, gallery
   - Content fetched from API endpoint `/api/content`
   - Main component: `HomePage.tsx`

2. **Admin Dashboard** (`/home`)
   - Protected route requiring authentication
   - Shows mock analytics data (not connected to Google Analytics)
   - Key features: traffic trends, device analytics, KPI cards

3. **Content Editor** (`/home/editor`)
   - Visual content management system
   - Allows editing text, images, and videos
   - Changes saved to `src/data/page-content.json`
   - Upload functionality saves to `public/uploads/`

### Content Management Flow
1. Content stored in `src/data/page-content.json`
2. API route `/api/content` serves content with caching disabled
3. Editor updates content via POST to `/api/content`
4. HomePage fetches content server-side for SEO

### Authentication Flow
- Login at `/login` using hardcoded credentials
- Session stored in SQLite database
- Middleware protects `/home/*` routes
- Logout clears session

### Important Files
- `src/lib/content.ts` - Content fetching utility
- `src/app/api/content/route.ts` - Content API endpoints
- `src/app/HomePage.tsx` - Main landing page component
- `src/middleware.ts` - Authentication middleware
- `public/css/styles.css` - Main stylesheet

### Development Notes
- Port 3000 often occupied, fallback to 3001
- No test framework configured
- Static files served from `public/`
- Image uploads stored in `public/uploads/`
- Database file: `kimuraya.db`