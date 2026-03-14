# Packages

This directory contains all shared packages used across the Haven Space applications.

## Structure

```
packages/
â”œâ”€â”€ api/              # tRPC API definitions and routers
â”œâ”€â”€ api-client/       # API client utilities
â”œâ”€â”€ auth/             # Authentication logic
â”œâ”€â”€ config/           # Shared configurations
â”œâ”€â”€ database/         # Prisma database client
â”œâ”€â”€ eslint-config/    # ESLint configurations
â”œâ”€â”€ layouts/          # âš ï¸ DEPRECATED - consolidated into @havenspace/shared
â”œâ”€â”€ providers/        # âš ï¸ DEPRECATED - consolidated into @havenspace/shared
â”œâ”€â”€ shared/           # Shared business logic, utilities, layouts, providers
â”œâ”€â”€ types/            # TypeScript type definitions
â”œâ”€â”€ typescript-config/# TypeScript configurations
â”œâ”€â”€ ui/               # Shared UI components
â”œâ”€â”€ utils/            # Utility functions
â””â”€â”€ validation/       # Zod validation schemas
```

## Core Packages

### ðŸ”§ API (`packages/api/`)
- tRPC routers and procedures
- API endpoint definitions
- Rate limiting middleware
- Redis caching utilities
- Audit logging
- Used by: apps/api, apps/web

### ðŸ’¾ Database (`packages/database/`)
- Prisma client and schema
- Database types and utilities
- Used by: apps/api, packages/api

### ðŸ” Auth (`packages/auth/`)
- NextAuth.js configuration
- Authentication middleware
- Used by: apps/web, apps/api

### ðŸŽ¨ UI (`packages/ui/`)
- Shared React components
- Design system components
- Used by: All frontend apps

### âœ… Validation (`packages/validation/`)
- Zod schemas for validation
- Input/output type validation
- Used by: All apps and packages

### ðŸ”„ Shared (`packages/shared/`)
**Consolidated package** containing:
- Business logic utilities (entities, features)
- Common types and constants
- Layout components (`DashboardLayout`, `AuthLayout`, `PublicLayout`)
- Provider components (`AppProviders`, `PublicProviders`)
- Formatters, validators, and general utilities
- Used by: All apps

## Package Consolidation (March 2026)

The following packages have been **consolidated** into `@havenspace/shared`:

- `@havenspace/layouts` â†’ Use `@havenspace/shared/layouts` instead
- `@havenspace/providers` â†’ Use `@havenspace/shared/providers` instead

### Migration

```json
// package.json - Before
{
  "dependencies": {
    "@havenspace/layouts": "workspace:*",
    "@havenspace/providers": "workspace:*"
  }
}

// package.json - After
{
  "dependencies": {
    "@havenspace/shared": "workspace:*"
  }
}
```

```typescript
// Imports - Before
import { AppProviders } from "@havenspace/providers";
import { DashboardLayout } from "@havenspace/layouts";

// Imports - After
import { AppProviders } from "@havenspace/shared/providers";
import { DashboardLayout } from "@havenspace/shared/layouts";
```

## Configuration Packages

### ðŸ“ ESLint Config (`packages/eslint-config/`)
- Shared ESLint rules
- Code quality standards

### ðŸ“˜ TypeScript Config (`packages/typescript-config/`)
- Shared TypeScript configurations
- Build settings

### âš™ï¸ Config (`packages/config/`)
- General shared configurations
- Environment-specific settings

## Utility Packages

### ðŸ› ï¸ Utils (`packages/utils/`)
- General utility functions
- Helper methods

### ðŸ“‹ Types (`packages/types/`)
- Shared TypeScript types
- Common interfaces

### ðŸŒ API Client (`packages/api-client/`)
- API client utilities
- HTTP request helpers

## Package Dependencies

```
apps/web â†’ @havenspace/ui, @havenspace/api, @havenspace/auth, @havenspace/shared, @havenspace/validation
apps/api â†’ @havenspace/api, @havenspace/database, @havenspace/auth, @havenspace/shared, @havenspace/validation

packages/api â†’ @havenspace/database, @havenspace/validation, @havenspace/shared
packages/auth â†’ @havenspace/database
packages/ui â†’ @havenspace/shared
packages/shared â†’ @havenspace/database, @havenspace/ui, @havenspace/validation
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

