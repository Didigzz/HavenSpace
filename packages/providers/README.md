# âš ï¸ DEPRECATED - Package Consolidated

This package has been **deprecated** and its contents have been moved to `@havenspace/shared`.

## Migration

Replace imports:

```typescript
// Before
import { AppProviders } from "@havenspace/providers";
import { DashboardLayout } from "@havenspace/layouts";

// After
import { AppProviders } from "@havenspace/shared/providers";
import { DashboardLayout } from "@havenspace/shared/layouts";
```

## Update package.json

```json
{
  "dependencies": {
    "@havenspace/shared": "workspace:*"
  }
}
```

Remove:
- `@havenspace/providers`
- `@havenspace/layouts`

## Reason

As part of architecture improvements (March 2026), we consolidated small packages to reduce complexity and dependency chains.

