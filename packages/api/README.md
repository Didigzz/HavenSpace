# @havenspace/api - tRPC API Server

Backend API server for the Haven Space platform using tRPC and Express.js.

## Overview

This package provides the complete tRPC API implementation for Haven Space, following Domain-Driven Design (DDD) and Clean Architecture principles.

## Architecture

The API is organized using a **modular monolith** architecture with Clear Architecture layers:

```
api/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ modules/           # Domain modules (modular monolith)
â”‚   â”‚   â””â”€â”€ room/
â”‚   â”‚       â”œâ”€â”€ domain/    # Entities, value objects, domain events
â”‚   â”‚       â”œâ”€â”€ application/  # Services, handlers, DTOs
â”‚   â”‚       â”œâ”€â”€ infrastructure/ # Repositories, event handlers
â”‚   â”‚       â””â”€â”€ presentation/  # tRPC routers, controllers
â”‚   â”œâ”€â”€ routers/           # Legacy router structure
â”‚   â”‚   â”œâ”€â”€ user.router.ts
â”‚   â”‚   â”œâ”€â”€ property.router.ts
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”œâ”€â”€ trpc.ts           # tRPC initialization
â”‚   â”œâ”€â”€ orpc.ts           # oRPC initialization (alternative)
â”‚   â””â”€â”€ routers.ts        # Router composition
```

## Usage

### Starting the API Server

```bash
# Development
bun --filter @havenspace/api dev

# Production
bun --filter @havenspace/api build
bun --filter @havenspace/api start
```

### Calling API from Client

```typescript
import { api } from '@havenspace/api-client';

// Query
const rooms = await api.room.getAll.useQuery({ propertyId: '123' });

// Mutation
await api.room.create.useMutation({
  roomNumber: '101',
  floor: 1,
  capacity: 2,
  monthlyRate: 5000,
});
```

## Domain Modules

### Room Module
- **Entities**: Room
- **Value Objects**: RoomStatus
- **Events**: RoomCreated, RoomUpdated, RoomDeleted, RoomStatusChanged
- **Services**: RoomService
- **Repositories**: RoomRepository

### Boarder Module
- **Entities**: Boarder
- **Events**: BoarderCreated, BoarderUpdated, BoarderDeleted
- **Services**: BoarderService

### Payment Module
- **Entities**: Payment
- **Value Objects**: PaymentStatus, PaymentType
- **Events**: PaymentCreated, PaymentPaid, PaymentOverdue
- **Services**: PaymentService

### User Module
- **Entities**: User
- **Value Objects**: UserRole
- **Events**: UserRegistered, UserUpdated
- **Services**: UserService

## tRPC Routers

The API exposes the following routers:

- `user` - User management and authentication
- `property` - Property listings and management
- `room` - Room inventory and status
- `boarder` - Boarder management
- `payment` - Payment processing
- `booking` - Booking management
- `message` - Messaging system
- `review` - Review system
- `utility` - Utility tracking
- `dashboard` - Dashboard statistics

## Authentication

All protected routes require authentication via NextAuth.js session. The tRPC context includes:

```typescript
interface Context {
  session: Session | null;
  user: User | null;
  prisma: PrismaClient;
}
```

## Best Practices

1. **Domain-first** - Business logic belongs in domain layer
2. **Thin routers** - Routers should delegate to application services
3. **Type-safe** - Use Zod schemas for input validation
4. **Event-driven** - Emit domain events for side effects
5. **Repository pattern** - Abstract database access

## Related Packages

- `@havenspace/database` - Prisma client and schema
- `@havenspace/validation` - Zod schemas
- `@havenspace/shared` - Shared types and utilities
- `@havenspace/auth` - Authentication configuration

