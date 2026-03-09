# Packages

This directory contains all shared packages used across the BHMS applications.

## Structure

```
packages/
├── api/              # tRPC API definitions and routers
├── api-client/       # API client utilities
├── auth/             # Authentication logic
├── config/           # Shared configurations
├── database/         # Prisma database client
├── eslint-config/    # ESLint configurations
├── layouts/          # ⚠️ DEPRECATED - consolidated into @bhms/shared
├── providers/        # ⚠️ DEPRECATED - consolidated into @bhms/shared
├── shared/           # Shared business logic, utilities, layouts, providers
├── types/            # TypeScript type definitions
├── typescript-config/# TypeScript configurations
├── ui/               # Shared UI components
├── utils/            # Utility functions
└── validation/       # Zod validation schemas
```

## Core Packages

### 🔧 API (`packages/api/`)
- tRPC routers and procedures
- API endpoint definitions
- Rate limiting middleware
- Redis caching utilities
- Audit logging
- Used by: apps/api, apps/web, apps/mobile

### 💾 Database (`packages/database/`)
- Prisma client and schema
- Database types and utilities
- Used by: apps/api, packages/api

### 🔐 Auth (`packages/auth/`)
- NextAuth.js configuration
- Authentication middleware
- Used by: apps/web, apps/api

### 🎨 UI (`packages/ui/`)
- Shared React components
- Design system components
- Used by: apps/web, apps/mobile

### ✅ Validation (`packages/validation/`)
- Zod schemas for validation
- Input/output type validation
- Used by: All apps and packages

### 🔄 Shared (`packages/shared/`)
**Consolidated package** containing:
- Business logic utilities (entities, features)
- Common types and constants
- Layout components (`DashboardLayout`, `AuthLayout`, `PublicLayout`)
- Provider components (`AppProviders`, `PublicProviders`)
- Formatters, validators, and general utilities
- Used by: All apps

## Package Consolidation (March 2026)

The following packages have been **consolidated** into `@bhms/shared`:

- `@bhms/layouts` → Use `@bhms/shared/layouts` instead
- `@bhms/providers` → Use `@bhms/shared/providers` instead

### Migration

```json
// package.json - Before
{
  "dependencies": {
    "@bhms/layouts": "workspace:*",
    "@bhms/providers": "workspace:*"
  }
}

// package.json - After
{
  "dependencies": {
    "@bhms/shared": "workspace:*"
  }
}
```

```typescript
// Imports - Before
import { AppProviders } from "@bhms/providers";
import { DashboardLayout } from "@bhms/layouts";

// Imports - After
import { AppProviders } from "@bhms/shared/providers";
import { DashboardLayout } from "@bhms/shared/layouts";
```

## Configuration Packages

### 📝 ESLint Config (`packages/eslint-config/`)
- Shared ESLint rules
- Code quality standards

### 📘 TypeScript Config (`packages/typescript-config/`)
- Shared TypeScript configurations
- Build settings

### ⚙️ Config (`packages/config/`)
- General shared configurations
- Environment-specific settings

## Utility Packages

### 🛠️ Utils (`packages/utils/`)
- General utility functions
- Helper methods

### 📋 Types (`packages/types/`)
- Shared TypeScript types
- Common interfaces

### 🌐 API Client (`packages/api-client/`)
- API client utilities
- HTTP request helpers

## Package Dependencies

```
apps/web → @bhms/ui, @bhms/api, @bhms/auth, @bhms/shared, @bhms/validation
apps/api → @bhms/api, @bhms/database, @bhms/auth, @bhms/shared, @bhms/validation
apps/mobile → @bhms/ui, @bhms/api, @bhms/shared, @bhms/validation

packages/api → @bhms/database, @bhms/validation, @bhms/shared
packages/auth → @bhms/database
packages/ui → @bhms/shared
packages/shared → @bhms/database, @bhms/ui, @bhms/validation
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

## Adding New Packages

1. Create directory in `packages/`
2. Add `package.json` with workspace dependencies
3. Ensure root `package.json` workspaces includes `packages/*`
4. Update `turbo.json` if needed
5. Add to relevant app dependencies