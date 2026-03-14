# @havenspace/shared

Shared business logic, utilities, and type definitions for the Haven Space platform.

## Overview

This package contains reusable code shared across all applications in the monorepo:

- **Entities** - Domain entity type definitions
- **Features** - Feature-specific utilities
- **Lib** - Utility functions (debounce, throttle, formatters, validators)
- **Types** - Common TypeScript types and interfaces
- **Kernel** - DDD base classes (Entity, ValueObject, AggregateRoot, DomainEvent)

## Installation

```bash
# Already available as workspace dependency
import { ... } from '@havenspace/shared';
```

## Usage

### Utilities

```typescript
import { cn, debounce, throttle, formatDate, formatCurrency } from '@havenspace/shared';

// Class name merging (Tailwind)
const className = cn('base-class', isActive && 'active-class');

// Debounce function
const debouncedSearch = debounce((query: string) => {
  // Search logic
}, 300);

// Throttle function
const throttledScroll = throttle(() => {
  // Scroll logic
}, 100);

// Formatters
const formattedDate = formatDate(new Date());
const formattedCurrency = formatCurrency(1000, 'PHP');
```

### Types

```typescript
import { PaginationParams, ApiResponse, UserRole } from '@havenspace/shared';

const params: PaginationParams = {
  page: 1,
  limit: 10,
};

const response: ApiResponse<User[]> = {
  data: users,
  meta: { total: 100, page: 1, limit: 10 },
};
```

### Domain Entities

```typescript
import { User, Boarder, Room, Payment } from '@havenspace/shared/entities';
```

### DDD Base Classes

```typescript
import { Entity, ValueObject, AggregateRoot, DomainEvent } from '@havenspace/shared/kernel';
```

## Package Structure

```
shared/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ entities/       # Domain entity types
â”‚   â”œâ”€â”€ features/       # Feature utilities
â”‚   â”œâ”€â”€ lib/            # Utility functions
â”‚   â”œâ”€â”€ types/          # TypeScript types
â”‚   â”œâ”€â”€ kernel/         # DDD base classes
â”‚   â””â”€â”€ index.ts        # Main exports
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## Dependencies

- `@havenspace/database` - Database client and types
- `@havenspace/validation` - Zod validation schemas
- `clsx` + `tailwind-merge` - Class name utilities
- `zustand` - State management utilities

## Best Practices

1. **Keep it lightweight** - Avoid heavy dependencies
2. **Pure functions** - Utilities should be pure and side-effect free
3. **Type-safe** - Always provide TypeScript types
4. **Well-tested** - Critical utilities should have unit tests
5. **Document exports** - Add JSDoc comments to public APIs

## Related Packages

- `@havenspace/ui` - Uses shared utilities for components
- `@havenspace/api` - Uses shared types and entities
- `@havenspace/validation` - Used for input validation
- `@havenspace/database` - Used for database types

