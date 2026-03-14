# @havenspace/config

Shared configuration for the Haven Space platform.

## Overview

Centralized configuration for:
- Application URLs
- Environment validation
- ESLint configurations
- TypeScript configurations
- Tailwind CSS configurations

## Installation

```bash
# Already available as workspace dependency
import { APP_URLS, getDashboardUrl } from '@havenspace/config';
```

## Usage

### App URLs

```typescript
import { APP_URLS, getDashboardUrl, getFullDashboardUrl } from '@havenspace/config';

// Get specific app URL
const publicUrl = APP_URLS.public;  // http://localhost:3000
const api_url = APP_URLS.api;       // http://localhost:3001
const adminUrl = APP_URLS.admin;    // http://localhost:3002

// Get dashboard URL by role
const landlordDashboard = getDashboardUrl('LANDLORD');
const boarderDashboard = getDashboardUrl('BOARDER');

// Get full URL with path
const fullUrl = getFullDashboardUrl('ADMIN', '/users');
```

### Environment Variables

Configure in `.env`:

```env
# App URLs
NEXT_PUBLIC_URL=http://localhost:3000
API_URL=http://localhost:3001
ADMIN_URL=http://localhost:3002
AUTH_URL=http://localhost:3003
BOARDER_URL=http://localhost:3004
LANDLORD_URL=http://localhost:3005
```

## Configuration Exports

### ESLint

```javascript
// eslint.config.js
import baseConfig from '@havenspace/config/eslint';
import nextConfig from '@havenspace/config/eslint/next';
import reactConfig from '@havenspace/config/eslint/react';

export default [
  ...baseConfig,
  ...nextConfig,
  ...reactConfig,
];
```

### TypeScript

```json
// tsconfig.json
{
  "extends": "@havenspace/config/typescript/nextjs",
  "compilerOptions": {
    // Additional options
  }
}
```

Available configs:
- `typescript` - Base TypeScript config
- `typescript/nextjs` - Next.js specific
- `typescript/react-native` - React Native specific

### Tailwind CSS

```javascript
// tailwind.config.js
import baseConfig from '@havenspace/config/tailwind';
import webConfig from '@havenspace/config/tailwind/web';

export default {
  ...baseConfig,
  ...webConfig,
  content: ['./src/**/*.{ts,tsx}'],
};
```

## URL Utilities

```typescript
import { isExternalUrl, getAllAppUrls, type AppKey } from '@havenspace/config';

// Check if URL is external
const isExternal = isExternalUrl('http://localhost:3001', 'public');

// Get all URLs
const allUrls = getAllAppUrls();
// { public: '...', api: '...', admin: '...', ... }

// Type-safe app key
const app: AppKey = 'boarder';
```

## Package Structure

```
config/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ index.ts          # Main exports
â”‚   â”œâ”€â”€ urls.ts           # URL configuration
â”‚   â””â”€â”€ env-validator.ts  # Environment validation
â”œâ”€â”€ eslint/
â”‚   â”œâ”€â”€ base.js
â”‚   â”œâ”€â”€ next.js
â”‚   â””â”€â”€ react.js
â”œâ”€â”€ typescript/
â”‚   â”œâ”€â”€ base.json
â”‚   â”œâ”€â”€ nextjs.json
â”‚   â””â”€â”€ react-native.json
â”œâ”€â”€ tailwind/
â”‚   â”œâ”€â”€ base.js
â”‚   â””â”€â”€ web.js
â””â”€â”€ package.json
```

## Environment Validation

```typescript
import { validateEnv } from '@havenspace/config';

// Validate required environment variables
const env = validateEnv(process.env);
```

## Best Practices

1. **Centralize URLs** - Always use `@havenspace/config` for app URLs
2. **Environment variables** - Use `.env` files, not hardcoded values
3. **Type safety** - Use `AppKey` type for app identifiers
4. **Extend configs** - Extend shared configs, don't duplicate
5. **Validation** - Validate required env vars at startup

## Related Packages

- `@havenspace/auth` - Uses URL config for redirects
- `@havenspace/ui` - Uses Tailwind config
- All apps - Use TypeScript and ESLint configs

