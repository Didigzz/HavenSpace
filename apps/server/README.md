# API Server (@bhms/api-server)

Backend API server for the Haven Space platform built with **Next.js 16**, **tRPC**, and **NextAuth.js**.

## Overview

This app serves as the central backend API for all BHMS applications (Public, Boarder, Landlord, Admin). It provides type-safe API endpoints using tRPC with role-based access control.

- **Port**: `3006`
- **Framework**: Next.js 16 (App Router)
- **API Protocol**: tRPC v11
- **Authentication**: NextAuth.js v5 (beta)

## Features

- ✅ **tRPC API** - Type-safe end-to-end communication
- ✅ **Role-based Access Control** - Public, protected, admin, landlord, and boarder procedures
- ✅ **NextAuth.js Integration** - JWT-based authentication with session management
- ✅ **Prisma ORM** - Database access via PostgreSQL
- ✅ **Zod Validation** - Runtime type validation
- ✅ **SuperJSON** - Enhanced JSON serialization
- ✅ **CORS Support** - Cross-origin requests enabled for development

## Project Structure

```
apps/api/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth.js endpoint
│   │   │   ├── health/route.ts               # Health check endpoint
│   │   │   └── trpc/[trpc]/route.ts          # tRPC endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth.ts                           # Authentication utilities
│   │   ├── health.ts                         # Health check logic
│   │   └── index.ts                          # API exports
│   └── lib/
│       └── trpc.ts                           # tRPC context & procedures
├── next.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun 1.1+
- PostgreSQL 14+ (or use Docker)

### Installation

```bash
# From project root
bun install
```

### Environment Variables

Copy `.env.example` to `.env` in the project root and configure:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/boarding_house_db?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3006"
```

### Development

```bash
# Start the API server
bun --filter @bhms/api-server dev

# Or from the app directory
cd apps/api
bun run dev
```

The server will start at `http://localhost:3006`

### Build

```bash
# Production build
bun --filter @bhms/api-server build

# Serverless build
bun --filter @bhms/api-server build:serverless
```

### Type Check

```bash
bun --filter @bhms/api-server typecheck
```

### Lint

```bash
bun --filter @bhms/api-server lint
```

## API Endpoints

### tRPC Endpoint

All tRPC procedures are accessible via:

```
POST/GET http://localhost:3006/api/trpc
```

### Authentication

```
POST http://localhost:3006/api/auth/[...nextauth]
```

### Health Check

```
GET http://localhost:3006/api/health
```

## tRPC Procedures

The API provides five types of procedures:

| Procedure | Access Level | Description |
|-----------|-------------|-------------|
| `publicProcedure` | Anyone | No authentication required |
| `protectedProcedure` | Authenticated users | Requires valid session |
| `adminProcedure` | Admin role only | Requires ADMIN role |
| `landlordProcedure` | Approved landlords | Requires LANDLORD role + APPROVED status |
| `boarderProcedure` | Active boarders | Requires BOARDER role + non-SUSPENDED status |

## Usage Example

### Client-side tRPC Call

```typescript
import { api } from '@bhms/api-client';

// Public procedure
const houses = await api.house.list.query();

// Protected procedure
const booking = await api.booking.create.mutate({
  houseId: '123',
  checkIn: '2026-04-01',
  checkOut: '2026-04-07',
});
```

### Adding a New Router

1. Create router in `packages/api/src/routers/`:

```typescript
// packages/api/src/routers/example.ts
import { createTRPCRouter, publicProcedure } from '@bhms/api';
import { z } from 'zod';

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello ${input.name}!`;
    }),
});
```

2. Register in `packages/api/src/index.ts`:

```typescript
export const createAppRouter = (...) => {
  return createTRPCRouter({
    // ...existing routers
    example: exampleRouter,
  });
};
```

## Architecture

### Serverless Deployment

The API is configured for serverless deployment:

- `output: 'standalone'` in `next.config.js`
- Uses Next.js App Router API routes
- Each endpoint deploys as an individual serverless function

### Authentication Flow

1. Client authenticates via NextAuth.js
2. Session stored in JWT cookie
3. tRPC context extracts session from request
4. Procedures validate user role and permissions

### Database Access

All database operations go through Prisma:

```typescript
import { db } from '@bhms/database';

const houses = await db.house.findMany();
```

## Testing

```bash
# Run tests (when implemented)
bun --filter @bhms/api-server test
```

## Deployment

### Docker

```bash
# Build API Docker image
bun run docker:build:api

# Run with Docker Compose
docker-compose up api
```

### Production

The API is automatically deployed via GitHub Actions CI/CD pipeline when merged to `main`.

## Troubleshooting

### tRPC Connection Issues

- Ensure API server is running on port 3006
- Check `NEXT_PUBLIC_API_URL` in client apps
- Verify CORS headers in development

### Authentication Errors

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches deployment URL
- Ensure session cookie is being sent with requests

### Database Connection

- Confirm PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run `bun run db:push` to sync schema

## Related Packages

- [`@bhms/api`](../../packages/api/) - tRPC router definitions
- [`@bhms/auth`](../../packages/auth/) - Authentication configuration
- [`@bhms/database`](../../packages/database/) - Prisma schema & client
- [`@bhms/validation`](../../packages/validation/) - Zod schemas
- [`@bhms/shared`](../../packages/shared/) - Shared business logic

## License

Private - BHMS Project
