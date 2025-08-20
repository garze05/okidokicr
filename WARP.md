# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Architecture

OkiDoki is a full-stack web application for a Costa Rican event planning company. The project follows a monorepo structure with separate frontend and backend applications:

### Frontend (Astro.js)

- **Framework**: Astro 5.x with React components for interactive elements
- **Styling**: TailwindCSS 4.x with DaisyUI components
- **Location**: Root directory (`/`)
- **Key directories**:
  - `src/components/` - React components organized by feature (admin, landing, shared)
  - `src/pages/` - File-based routing with Astro pages
  - `src/layouts/` - Layout components for consistent page structure
  - `src/utils/` - Utility functions and auth helpers

### Backend (Express.js API)

- **Framework**: Express.js with Prisma ORM
- **Database**: MySQL with Prisma migrations
- **Location**: `api/` directory
- **Key directories**:
  - `api/src/controllers/` - Business logic for services, auth, tags, uploads
  - `api/src/routes/` - API route definitions
  - `api/src/middlewares/` - Auth middleware
  - `api/prisma/` - Database schema and migrations

### Database Schema

The application manages:

- **Services** - Event planning services with gallery images and videos
- **Tags** - Categorization system for services
- **Media** - Images and videos stored via Cloudinary integration

## Development Commands

### Frontend Development

```bash
# Start development server (port 4321)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Backend Development

```bash
# Navigate to API directory
cd api

# Start API development server (port 4000)
pnpm dev

# Start production server
pnpm start

# Database operations
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Run migrations in development
npx prisma migrate deploy  # Deploy migrations to production
npx prisma db push         # Push schema changes without migration
```

### Database Setup

```bash
cd api

# Start local MySQL database
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Seed database (if seed file exists)
npx prisma db seed
```

### Code Quality

```bash
# Format code (both frontend and backend)
npx prettier --write .

# The project uses Prettier with Astro and TailwindCSS plugins
```

## Environment Configuration

### Frontend (.env)

The frontend uses environment variables primarily for API endpoints. Variables are typically prefixed with `PUBLIC_` for client-side access.

### Backend (api/.env)

Required environment variables (see `api/.env.example`):

- `DATABASE_URL` - MySQL connection string
- `CLOUDINARY_*` - Image/video upload service credentials
- `JWT_SECRET` - Authentication token secret
- `ADMIN_USER` / `ADMIN_PASSWORD` - Admin authentication credentials

## Key Features & Components

### Admin System

- **Location**: `src/components/admin/` and `src/pages/admin/`
- **Authentication**: JWT-based with protected routes
- **Features**: Service management, tag management, media uploads

### Public Catalog

- **Location**: `src/components/landing/catalog/`
- **Features**: Service browsing, filtering, search functionality
- **Dynamic routing**: `/catalogo/[id].astro` for individual service pages

### Media Management

- **Images**: Stored in Cloudinary, managed through upload controller
- **Local assets**: `src/images/` for static assets
- **Component**: Drag-and-drop upload functionality in admin panel

## Deployment

### Frontend

- **Platform**: Netlify (configured in `astro.config.mjs`)
- **Build command**: `pnpm build`
- **Deploy**: Automatic on push to main branch

### Backend

- **Platform**: Oracle Cloud
- **Process manager**: PM2
- **Deployment**: GitHub Actions workflow (`.github/workflows/deploy-backend.yml`)
- **Steps**: Git pull, npm install, Prisma generate/migrate, PM2 restart

## Path Aliases

The project uses path aliases for clean imports:

- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@pages/*` → `src/pages/*`
- `@data/*` → `src/data/*`
- `@images/*` → `src/images/*`
- `@styles/*` → `src/styles/*`
- `@utils/*` → `src/utils/*`

## Technology Stack

### Frontend

- Astro 5.x (Static Site Generator)
- React 19.x (Interactive components)
- TailwindCSS 4.x + DaisyUI (Styling)
- AlpineJS (Lightweight interactivity)
- Swiper (Carousels)
- PhotoSwipe (Image galleries)
- AOS (Scroll animations)

### Backend

- Express.js 5.x (Web framework)
- Prisma (ORM and migrations)
- MySQL (Database)
- Cloudinary (Media storage)
- bcrypt (Password hashing)
- JWT (Authentication)
- Multer (File uploads)

## Important Notes

- The application serves the Costa Rican market (Spanish language)
- CORS is configured for production domain `okidokicr.com` and local development
- Admin panel requires authentication with hardcoded credentials (stored in environment variables)
- Database uses MySQL with Prisma for type-safe database access
- Media files are handled through Cloudinary integration, not local storage
