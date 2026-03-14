# @havenspace/database

Database layer for the Haven Space platform using Prisma ORM.

## Overview

This package provides:
- Prisma schema definition for all domain entities
- Singleton Prisma client with Accelerate extension
- Database migrations and seeding utilities

## Installation

```bash
# Already available as workspace dependency
import { prisma } from '@havenspace/database';
```

## Usage

### Prisma Client

```typescript
import { prisma } from '@havenspace/database';

// Query database
const users = await prisma.user.findMany({
  where: { role: 'BOARDER' },
  include: { boarderProfile: true },
});

// Transaction
await prisma.$transaction(async (tx) => {
  const booking = await tx.booking.create({ data: {...} });
  const payment = await tx.payment.create({ data: {...} });
  return { booking, payment };
});
```

### Database Commands

```bash
# Generate Prisma client
bun run db:generate

# Push schema changes to database
bun run db:push

# Run migrations
bun run db:migrate

# Open Prisma Studio
bun run db:studio

# Seed database
bun run db:seed
```

## Schema Overview

### Core Entities

- **User** - Platform users with role-based access
- **Boarder** - Boarder profiles and information
- **Property** - Boarding house properties
- **Room** - Individual rooms within properties
- **Booking** - Room bookings and reservations
- **Payment** - Payment records and tracking
- **Message** - Communication between users
- **Review** - Property and landlord reviews
- **Utility** - Utility readings and billing

### Enums

- `UserRole` - LANDLORD, BOARDER, ADMIN
- `UserStatus` - PENDING, APPROVED, SUSPENDED
- `RoomStatus` - AVAILABLE, OCCUPIED, MAINTENANCE
- `PaymentStatus` - PENDING, PAID, OVERDUE
- `BookingStatus` - PENDING, CONFIRMED, CANCELLED, COMPLETED

## Features

### Singleton Pattern

The Prisma client uses a singleton pattern to prevent multiple instances in development:

```typescript
// src/client.ts
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
```

### Accelerate Extension

Includes Prisma Accelerate for connection pooling and performance:

```typescript
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());
```

### Soft Deletes

Key entities support soft deletes via `isActive` flag:
- Property
- Room
- Boarder

## Best Practices

1. **Use transactions** - For operations affecting multiple entities
2. **Include relations** - Use `include` to fetch related data efficiently
3. **Index frequently** - Add indexes for common query patterns
4. **Soft deletes** - Use `isActive` instead of hard deletes
5. **Type safety** - Always use Prisma types, avoid `any`

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/boarding_house_db?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/boarding_house_db?schema=public"
```

## Related Packages

- `@havenspace/api` - Uses Prisma client in repositories
- `@havenspace/shared` - Uses Prisma types
- `@havenspace/validation` - Validation schemas for entities

