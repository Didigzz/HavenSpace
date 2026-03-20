# @havenspace/validation

Zod validation schemas for the Haven Space platform.

## Overview

Centralized validation schemas using Zod for type-safe input/output validation across all applications.

## Installation

```bash
# Already available as workspace dependency
import { userSchemas, roomSchemas, ... } from '@havenspace/validation';
```

## Usage

### Schema Validation

```typescript
import { userSchemas } from "@havenspace/validation";

// Parse and validate
const user = userSchemas.create.parse(inputData);

// Safe parse
const result = userSchemas.update.safeParse(inputData);
if (!result.success) {
  console.error(result.error.errors);
}

// Type inference
type CreateUserInput = z.infer<typeof userSchemas.create>;
```

### Common Schemas

```typescript
import { commonSchemas } from "@havenspace/validation";

// Email validation
commonSchemas.email.parse("user@example.com");

// Password validation (min 8 chars, 1 uppercase, 1 number)
commonSchemas.password.parse("SecurePass123");

// Phone validation
commonSchemas.phone.parse("+639171234567");

// Pagination
commonSchemas.pagination.parse({ page: 1, limit: 10 });
```

## Available Schemas

### User Schemas

```typescript
import { userSchemas } from "@havenspace/validation";

userSchemas.create; // Create new user
userSchemas.update; // Update existing user
userSchemas.login; // Login credentials
userSchemas.register; // Registration data
userSchemas.changePassword;
```

### Property Schemas

```typescript
import { propertySchemas } from "@havenspace/validation";

propertySchemas.create;
propertySchemas.update;
propertySchemas.amenities;
propertySchemas.location;
```

### Room Schemas

```typescript
import { roomSchemas } from "@havenspace/validation";

roomSchemas.create;
roomSchemas.update;
roomSchemas.status;
roomSchemas.amenities;
```

### Booking Schemas

```typescript
import { bookingSchemas } from "@havenspace/validation";

bookingSchemas.create;
bookingSchemas.update;
bookingSchemas.status;
bookingSchemas.dateRange;
```

### Payment Schemas

```typescript
import { paymentSchemas } from "@havenspace/validation";

paymentSchemas.create;
paymentSchemas.update;
paymentSchemas.status;
paymentSchemas.amount;
```

### Boarder Schemas

```typescript
import { boarderSchemas } from "@havenspace/validation";

boarderSchemas.create;
boarderSchemas.update;
boarderSchemas.emergencyContact;
```

## Type Inference

All schemas export inferred TypeScript types:

```typescript
import {
  userSchemas,
  type UserCreateInput,
  type UserUpdateInput,
} from "@havenspace/validation";

// Use inferred types
const createUser = (data: UserCreateInput) => {
  // ...
};

// Or infer manually
type LoginInput = z.infer<typeof userSchemas.login>;
```

## Custom Error Messages

```typescript
import { userSchemas } from "@havenspace/validation";

try {
  userSchemas.create.parse(invalidData);
} catch (error) {
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      console.log(`${err.path.join(".")}: ${err.message}`);
    });
  }
}
```

## Best Practices

1. **Reuse common schemas** - Use commonSchemas for shared validations
2. **Extend for variations** - Use `.extend()` for create/update variations
3. **Type inference** - Always export inferred types
4. **Descriptive errors** - Provide clear error messages
5. **Server-side validation** - Never trust client-side only validation

## Schema Composition

```typescript
import { z } from "zod";
import { commonSchemas } from "@havenspace/validation";

const customSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  name: z.string().min(2),
});
```

## Related Packages

- `@havenspace/api` - Input validation for tRPC procedures
- `@havenspace/shared` - Shared validation utilities
- `@havenspace/database` - Schema matches Prisma types
- `@havenspace/ui` - Form validation with React Hook Form
