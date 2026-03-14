# Modular Monolith Architecture

This directory contains the modular monolith implementation for the Haven Space platform.

## Architecture Overview

The system is organized into domain modules, each following Clean Architecture principles:

### Module Structure

Each module (e.g., `room`, `boarder`, `payment`) contains:

```
module-name/
├── domain/                    # Business logic (no external dependencies)
│   ├── entities/            # Aggregate roots and entities
│   ├── value-objects/       # Immutable value objects
│   ├── services/            # Domain services
│   └── repositories/        # Repository interfaces
├── application/             # Use cases and orchestration
│   ├── commands/           # Write operations
│   ├── queries/            # Read operations
│   └── handlers/           # Command/Query handlers
├── infrastructure/          # External integrations
│   ├── persistence/        # Database implementations
│   └── events/             # Domain events
└── presentation/            # API layer (oRPC routers)
    └── module.router.ts
```

### Layers

#### Domain Layer
- **Pure business logic**
- No external dependencies
- Contains entities, value objects, domain services, and repository interfaces
- Framework-agnostic

#### Application Layer
- **Use cases and orchestration**
- Commands (write operations) and Queries (read operations)
- Handlers that coordinate domain logic
- No framework dependencies

#### Infrastructure Layer
- **External integrations**
- Database access (Prisma implementations)
- Event publishing
- Can be swapped without affecting domain logic

#### Presentation Layer
- **API contracts**
- oRPC routers
- HTTP concerns only
- Thin layer that delegates to application handlers

### Benefits

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Testability**: Domain and application logic can be tested in isolation
3. **Maintainability**: Easy to locate and modify business logic
4. **Scalability**: Modules can be extracted into microservices if needed
5. **Flexibility**: Infrastructure can be swapped without affecting business logic

### Current Modules

- **room**: Room management (completed)
- **boarder**: Boarder management (pending migration)
- **payment**: Payment processing (pending migration)
- **utility**: Utility tracking (pending migration)
- **user**: User management (pending migration)
- **dashboard**: Dashboard analytics (pending migration)

### Migration Strategy

1. Keep existing code working during migration
2. Create new module structure alongside old one
3. Migrate module by module (room is complete)
4. Update imports gradually
5. Remove old structure once complete

### Example: Room Module

The Room module demonstrates the complete modular monolith structure:

```typescript
// Domain
import { Room } from './modules/room/domain/entities/room.entity';
import { RoomService } from './modules/room/domain/services/room.service';

// Application
import { CreateRoomHandler } from './modules/room/application/handlers/create-room.handler';

// Infrastructure
import { PrismaRoomRepository } from './modules/room/infrastructure/persistence/prisma-room.repository';

// Presentation
import { createRoomRouter } from './modules/room/presentation/room.router';
```

### Next Steps

1. Migrate remaining modules following the Room module pattern
2. Add domain events for cross-module communication
3. Implement event bus for module integration
4. Add comprehensive tests for each layer
5. Update documentation for each module