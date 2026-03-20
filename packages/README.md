# Packages

This directory contains all shared packages used across the Haven Space applications.

## Structure

```
packages/
├── api/              # tRPC/ORPC API routers and procedures
├── auth/             # NextAuth.js authentication configuration
├── config/           # Shared configurations (ESLint, Tailwind, TypeScript)
├── database/         # Prisma database client and schema
├── shared/           # Shared business logic, utilities, and UI components
└── validation/       # Zod validation schemas
```

## Core Packages

### 🔧 API (`packages/api/`)
- tRPC v11 and ORPC v1 routers and procedures
- Feature-based API modules (boarder, dashboard, payment, room, user, admin, property, booking)
- Middleware (rate limiting, authentication, authorization)
- Redis caching utilities
- Audit logging
- Used by: apps/server, all frontend apps

### 💾 Database (`packages/database/`)
- Prisma ORM v7 client and schema
- PostgreSQL and Neon Database adapters
- Database types and utilities
- Seed data for development
- Used by: apps/server, packages/api, packages/auth

### 🔐 Auth (`packages/auth/`)
- NextAuth.js v5 configuration
- Role-based access control (BOARDER, LANDLORD, ADMIN)
- Authentication middleware
- Used by: apps/server, apps/(public)

### ✅ Validation (`packages/validation/`)
- Zod schemas for input/output validation
- Shared validation utilities
- Used by: packages/api, apps/server

### 🔄 Shared (`packages/shared/`)
**Consolidated package** containing:
- Business logic utilities (features, components)
- Shared UI components (Radix UI based)
- Layout components (`DashboardLayout`, `AuthLayout`, `PublicLayout`)
- Provider components (`AppProviders`, `PublicProviders`)
- Formatters, validators, and general utilities
- Used by: All frontend apps

## Configuration Packages

### ⚙️ Config (`packages/config/`)
- ESLint configurations (`eslint/base.js`, `eslint/next.js`, `eslint/react.js`)
- Tailwind CSS configurations
- TypeScript configurations
- Used by: All packages and apps

## Package Dependencies

```
apps/(public)    → @havenspace/auth, @havenspace/shared, @havenspace/validation
apps/server      → @havenspace/api, @havenspace/database, @havenspace/auth
apps/boarder     → @havenspace/shared, @havenspace/validation
apps/landlord    → @havenspace/shared, @havenspace/validation
apps/admin       → @havenspace/shared, @havenspace/validation

packages/api     → @havenspace/database, @havenspace/validation, @havenspace/shared
packages/auth    → @havenspace/database
packages/shared  → @havenspace/database, @havenspace/validation
```

## Development

### Install Dependencies
```bash
bun install
```

### Build All Packages
```bash
bun run build
```

### Type Check All Packages
```bash
bun run typecheck
```

### Lint All Packages
```bash
bun run lint
```

### Test All Packages
```bash
bun run test
```

## Individual Package Commands

```bash
# API package
bun --filter @havenspace/api lint
bun --filter @havenspace/api typecheck
bun --filter @havenspace/api test

# Auth package
bun --filter @havenspace/auth lint
bun --filter @havenspace/auth typecheck

# Database package
bun --filter @havenspace/database db:generate
bun --filter @havenspace/database db:push
bun --filter @havenspace/database db:seed
bun --filter @havenspace/database lint

# Shared package
bun --filter @havenspace/shared lint
bun --filter @havenspace/shared typecheck
bun --filter @havenspace/shared test

# Validation package
bun --filter @havenspace/validation lint
bun --filter @havenspace/validation typecheck
```

## Adding New Packages

1. Create directory in `packages/`
2. Add `package.json` with workspace dependencies (`@havenspace/*`)
3. Ensure root `package.json` workspaces includes `packages/*`
4. Add `tsconfig.json` extending `@havenspace/typescript-config/base`
5. Add `eslint.config.js` for linting (ESLint v9+ flat config)
6. Update `turbo.json` if custom build pipelines needed
7. Add to relevant app dependencies
