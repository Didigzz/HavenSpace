# @bhms/config

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
import { APP_URLS, getDashboardUrl } from '@bhms/config';
```

## Usage

### App URLs

```typescript
import { APP_URLS, getDashboardUrl, getFullDashboardUrl } from '@bhms/config';

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
import baseConfig from '@bhms/config/eslint';
import nextConfig from '@bhms/config/eslint/next';
import reactConfig from '@bhms/config/eslint/react';

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
  "extends": "@bhms/config/typescript/nextjs",
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
import baseConfig from '@bhms/config/tailwind';
import webConfig from '@bhms/config/tailwind/web';

export default {
  ...baseConfig,
  ...webConfig,
  content: ['./src/**/*.{ts,tsx}'],
};
```

## URL Utilities

```typescript
import { isExternalUrl, getAllAppUrls, type AppKey } from '@bhms/config';

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
├── src/
│   ├── index.ts          # Main exports
│   ├── urls.ts           # URL configuration
│   └── env-validator.ts  # Environment validation
├── eslint/
│   ├── base.js
│   ├── next.js
│   └── react.js
├── typescript/
│   ├── base.json
│   ├── nextjs.json
│   └── react-native.json
├── tailwind/
│   ├── base.js
│   └── web.js
└── package.json
```

## Environment Validation

```typescript
import { validateEnv } from '@bhms/config';

// Validate required environment variables
const env = validateEnv(process.env);
```

## Best Practices

1. **Centralize URLs** - Always use `@bhms/config` for app URLs
2. **Environment variables** - Use `.env` files, not hardcoded values
3. **Type safety** - Use `AppKey` type for app identifiers
4. **Extend configs** - Extend shared configs, don't duplicate
5. **Validation** - Validate required env vars at startup

## Related Packages

- `@bhms/auth` - Uses URL config for redirects
- `@bhms/ui` - Uses Tailwind config
- All apps - Use TypeScript and ESLint configs
