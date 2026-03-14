# @bhms/auth

Authentication and authorization utilities for the Haven Space platform using NextAuth.js.

## Overview

This package provides:
- NextAuth.js configuration with Credentials provider
- Role-based authorization guards
- tRPC authentication middleware
- Session management utilities

## Installation

```bash
# Already available as workspace dependency
import { guards, middleware } from '@bhms/auth';
```

## Usage

### NextAuth Configuration

```typescript
// apps/(auth)/api/auth/[...nextauth]/route.ts
import { authConfig } from '@bhms/auth/config';
import NextAuth from 'next-auth';

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
```

### Edge-Compatible Config

For edge runtime (no database access):

```typescript
import { authConfigEdge } from '@bhms/auth';
```

### Authorization Guards

```typescript
import {
  isLandlord,
  isBoarder,
  isAdmin,
  hasRole,
  canAccessLandlordDashboard,
  getRedirectUrl
} from '@bhms/auth';

// Check role
if (isLandlord(user.role)) {
  // Landlord-specific logic
}

// Check multiple roles
if (hasRole(user.role, ['ADMIN', 'LANDLORD'])) {
  // Admin or landlord logic
}

// Check dashboard access
if (canAccessLandlordDashboard(user.role, user.status)) {
  // Access granted
}

// Get redirect URL after login
const redirectUrl = getRedirectUrl(user.role, user.status);
```

### tRPC Middleware

```typescript
import { createAuthMiddleware } from '@bhms/auth/middleware';
import { auth } from '@bhms/auth/config';

const authMiddleware = createAuthMiddleware();

export const router = publicRouter.middleware(authMiddleware).query('...', {
  resolve: ({ ctx, input }) => {
    // ctx.session is available
    // ctx.user is available
  },
});
```

## User Roles

| Role | Description | Dashboard |
|------|-------------|-----------|
| `LANDLORD` | Property owners | `/landlord/dashboard` |
| `BOARDER` | Renters/tenants | `/boarder/dashboard` |
| `ADMIN` | Platform administrators | `/admin/dashboard` |

## User Status

| Status | Description | Access |
|--------|-------------|--------|
| `PENDING` | Awaiting approval | Limited |
| `APPROVED` | Active and approved | Full |
| `SUSPENDED` | Suspended account | None |

## Session Types

The package extends NextAuth session types:

```typescript
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: UserStatus;
    } & DefaultSession['user'];
  }
}
```

## Configuration

### Environment Variables

```env
# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3003"

# App URLs (for redirects)
NEXT_PUBLIC_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3002"
AUTH_URL="http://localhost:3003"
BOARDER_URL="http://localhost:3004"
LANDLORD_URL="http://localhost:3005"
```

## Best Practices

1. **Use guards** - Always check role and status before sensitive operations
2. **Edge-compatible** - Use `authConfigEdge` for edge runtime
3. **Type-safe sessions** - Extend session types properly
4. **Centralized URLs** - Use `@bhms/config` for redirect URLs
5. **Middleware protection** - Protect all tRPC routes with auth middleware

## Related Packages

- `@bhms/config` - Centralized URL configuration
- `@bhms/database` - User database operations
- `@bhms/api` - tRPC authentication
- `@bhms/shared` - Shared types and utilities
