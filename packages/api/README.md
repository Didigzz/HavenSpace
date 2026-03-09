# @bhms/api - tRPC API Server

Backend API server for the Boarding House Management System (BHMS) using tRPC and Express.js.

## Overview

This package provides the complete tRPC API implementation for BHMS, following Domain-Driven Design (DDD) and Clean Architecture principles.

## Architecture

The API is organized using a **modular monolith** architecture with Clear Architecture layers:

```
api/
├── src/
│   ├── modules/           # Domain modules (modular monolith)
│   │   └── room/
│   │       ├── domain/    # Entities, value objects, domain events
│   │       ├── application/  # Services, handlers, DTOs
│   │       ├── infrastructure/ # Repositories, event handlers
│   │       └── presentation/  # tRPC routers, controllers
│   ├── routers/           # Legacy router structure
│   │   ├── user.router.ts
│   │   ├── property.router.ts
│   │   └── ...
│   ├── trpc.ts           # tRPC initialization
│   ├── orpc.ts           # oRPC initialization (alternative)
│   └── routers.ts        # Router composition
```

## Usage

### Starting the API Server

```bash
# Development
bun --filter @bhms/api dev

# Production
bun --filter @bhms/api build
bun --filter @bhms/api start
```

### Calling API from Client

```typescript
import { api } from '@bhms/api-client';

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

- `@bhms/database` - Prisma client and schema
- `@bhms/validation` - Zod schemas
- `@bhms/shared` - Shared types and utilities
- `@bhms/auth` - Authentication configuration
