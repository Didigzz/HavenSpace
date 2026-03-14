# Haven Space Applications Quick Reference

Complete reference for all applications in the Haven Space platform.

## 📊 Application Overview

| App | Port | URL | Purpose | Entry Point |
|-----|------|-----|---------|-------------|
| **Public** | 3000 | `http://localhost:3000` | Marketplace & discovery | `apps/(public)/src/app/page.tsx` |
| **API Server** | 3001 | `http://localhost:3001` | Backend tRPC API | `apps/api/src/index.ts` |
| **Admin** | 3002 | `http://localhost:3002` | Platform administration | `apps/admin/src/app/dashboard/page.tsx` |
| **Boarder** | 3004 | `http://localhost:3004` | Boarder (renter) dashboard | `apps/boarder/src/app/dashboard/page.tsx` |
| **Landlord** | 3005 | `http://localhost:3005` | Landlord property management | `apps/landlord/src/app/dashboard/page.tsx` |

---

## 🚀 Quick Start Commands

### Development

```bash
# Start ALL applications (full stack)
bun run dev:full

# Start specific app stacks
bun run dev:boarder     # Public + API + Boarder
bun run dev:landlord    # Public + API + Landlord
bun run dev:admin       # Public + API + Admin
bun run dev:public      # Public + API only

# Start individual apps
bun run public:dev      # Public marketplace
bun run api:dev         # API server
bun run boarder:dev     # Boarder dashboard
bun run landlord:dev    # Landlord portal
bun run admin:dev       # Admin dashboard
```

### Building

```bash
# Build all applications
bun run build:all

# Build specific app
bun run public:build
bun run boarder:build
bun run landlord:build
bun run admin:build
```

### Testing

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Test specific package
bun --filter @havenspace/ui test
```

---

## 🔌 Health Check Endpoints

Each application exposes a `/api/health` endpoint for monitoring:

| App | Health Check URL |
|-----|------------------|
| Public | `http://localhost:3000/api/health` |
| API Server | `http://localhost:3001/api/health` |
| Admin | `http://localhost:3002/api/health` |
| Boarder | `http://localhost:3004/api/health` |
| Landlord | `http://localhost:3005/api/health` |

### Example Response

```json
{
  "status": "healthy",
  "timestamp": "2026-03-09T12:00:00.000Z",
  "app": {
    "name": "@havenspace/boarder",
    "version": "1.0.0",
    "environment": "development"
  },
  "urls": {
    "boarder": "http://localhost:3004",
    "api": "http://localhost:3001"
  }
}
```

---

## 🗺️ Application Architecture

### Public Platform (`@havenspace/public`)
**Port 3000** - First point of contact for all users

**Features:**
- Property browsing and search
- Interactive map view
- Property detail pages
- User registration/login
- "Become a Landlord" application

**Key Routes:**
```
/                    → Homepage (featured listings)
/listings            → All listings with filters
/listings/[id]       → Property details
/map                 → Map view
/login               → Login page
/register            → Registration
/become-landlord     → Landlord application info
```

**Tech Stack:** Next.js 16, Tailwind CSS, Radix UI, Leaflet Maps

---

### API Server (`@havenspace/api-server`)
**Port 3001** - Backend API for all applications

**Features:**
- tRPC API endpoints
- Authentication middleware
- Database operations via Prisma
- File upload handling
- Email notifications

**Key Modules:**
```
src/
├── routers/         → tRPC routers
├── modules/         → Business logic modules
├── middleware/      → Auth & validation
└── health/          → Health check endpoint
```

**Tech Stack:** tRPC, Express.js, Prisma, NextAuth.js

---

### Admin Dashboard (`@havenspace/admin`)
**Port 3002** - Platform administration

**Features:**
- User management (boarders, landlords)
- Landlord application approval
- Content moderation
- Platform analytics
- Dispute resolution
- System configuration

**Key Routes:**
```
/dashboard           → Overview & stats
/users               → User management
/landlords           → Landlord applications
/listings            → Listing moderation
/analytics           → Platform analytics
/settings            → System settings
```

**Tech Stack:** Next.js, tRPC, TanStack Table, Charts

---

### Auth App (`@havenspace/auth-app`)
**Port 3003** - Centralized authentication

**Features:**
- User registration (boarder/landlord)
- Login with credentials
- Social authentication
- Password recovery
- Role-based redirects
- Account status handling (pending, suspended)

**Key Routes:**
```
/login               → Login form
/register            → Registration form
/forgot-password     → Password recovery
/callback            → OAuth callbacks
```

**Tech Stack:** NextAuth.js, Next.js, Tailwind CSS

---

### Boarder Dashboard (`@havenspace/boarder`)
**Port 3004** - Authenticated boarder experience

**Features:**
- Personal dashboard
- Browse & save properties
- Booking management
- Payment processing
- Messaging landlords
- Profile management

**Key Routes:**
```
/dashboard           → Overview & recent activity
/browse              → Search available properties
/bookings            → Manage bookings
/history             → Booking history
/saved               → Saved properties
/messages            → Inbox with landlords
/payments            → Payment history
/profile             → User profile
/settings            → Account settings
```

**Tech Stack:** Next.js, tRPC, Tailwind CSS, Radix UI, Zustand

---

### Landlord Portal (`@havenspace/landlord`)
**Port 3005** - Property management for landlords

**Features:**
- Property listing management
- Booking request handling
- Revenue tracking & analytics
- Tenant communication
- Property performance metrics
- Earnings & payout management

**Key Routes:**
```
/dashboard           → Overview & stats
/properties          → Manage listings
/properties/new      → Create listing
/bookings            → Booking requests
/tenants             → Current tenants
/earnings            → Revenue tracking
/messages            → Tenant communication
/analytics           → Property analytics
/settings            → Account settings
```

**Tech Stack:** Next.js, tRPC, Charts, Radix UI

---

## 🔐 Authentication Flow

```
1. User visits Public Platform (port 3000)
         ↓
2. Clicks "Login" or "Register"
         ↓
3. Authenticates via Auth App (port 3003)
         ↓
4. Redirected based on role:
   - BOARDER   → Boarder Dashboard (port 3004)
   - LANDLORD  → Landlord Portal (port 3005)
   - ADMIN     → Admin Dashboard (port 3002)
         ↓
5. Session maintained via httpOnly cookies
         ↓
6. All apps communicate with API (port 3001) via tRPC
```

---

## 🌐 Cross-App Navigation

### Using AppSwitcher Component

```tsx
import { AppSwitcher } from '@havenspace/ui';

function Header() {
  return (
    <header>
      <AppSwitcher />
    </header>
  );
}
```

### Using AppLink Component

```tsx
import { AppLink } from '@havenspace/ui';

function Navigation() {
  return (
    <nav>
      <AppLink app="boarder" path="/bookings">
        My Bookings
      </AppLink>
      <AppLink app="landlord" path="/properties">
        Manage Properties
      </AppLink>
    </nav>
  );
}
```

### Server-Side Redirects

```typescript
import { getAppUrl } from '@havenspace/ui';

export async function GET() {
  const userRole = await getUserRole();
  
  if (userRole === 'BOARDER') {
    return redirect(getAppUrl('boarder', '/dashboard'));
  }
  
  if (userRole === 'LANDLORD') {
    return redirect(getAppUrl('landlord', '/dashboard'));
  }
}
```

---

## 🔧 Environment Variables

### Required for All Apps

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/boarding_house_db?schema=public"

# Authentication
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# API
API_URL="http://localhost:3001"
```

### App-Specific URLs (Optional - have defaults)

```env
NEXT_PUBLIC_URL="http://localhost:3000"    # Public platform
ADMIN_URL="http://localhost:3002"          # Admin dashboard
AUTH_URL="http://localhost:3003"           # Auth app
BOARDER_URL="http://localhost:3004"        # Boarder dashboard
LANDLORD_URL="http://localhost:3005"       # Landlord portal
```

---

## 📦 Package Dependencies

### Workspace Packages

| Package | Description | Used By |
|---------|-------------|---------|
| `@havenspace/api` | tRPC routers | All apps |
| `@havenspace/auth` | Auth utilities | All apps |
| `@havenspace/config` | Shared config | All apps |
| `@havenspace/database` | Prisma client | API, server-side |
| `@havenspace/shared` | Business logic | All apps |
| `@havenspace/ui` | UI components | All frontend apps |
| `@havenspace/validation` | Zod schemas | All apps |

### App Dependencies

```
@havenspace/public    → @havenspace/ui, @havenspace/auth, @havenspace/shared, @havenspace/api
@havenspace/api-server → @havenspace/api, @havenspace/database, @havenspace/auth
@havenspace/boarder   → @havenspace/ui, @havenspace/api, @havenspace/shared, @havenspace/auth
@havenspace/landlord  → @havenspace/ui, @havenspace/api, @havenspace/shared, @havenspace/auth
@havenspace/admin     → @havenspace/ui, @havenspace/api, @havenspace/shared, @havenspace/auth
```

---

## 🐳 Docker Deployment

### Build Individual Images

```bash
# Public platform
docker build -t havenspace-public -f apps/\(public\)/Dockerfile .

# API server
docker build -t havenspace-api -f apps/api/Dockerfile .

# Boarder dashboard
docker build -t havenspace-boarder -f apps/boarder/Dockerfile .

# Landlord portal
docker build -t havenspace-landlord -f apps/landlord/Dockerfile .

# Admin dashboard
docker build -t havenspace-admin -f apps/admin/Dockerfile .
```

### Docker Compose

```bash
# Start all services
bun run docker:up

# Production deployment
docker-compose -f docker-compose.production.yml up -d
```

---

## 🧪 Testing Strategy

### Unit Tests
- Location: `src/**/*.test.tsx`
- Framework: Vitest + React Testing Library
- Run: `bun run test`

### Integration Tests
- Location: `e2e/**/*.spec.ts`
- Framework: Playwright
- Run: `bun run test:e2e`

### Test Coverage by App

| App | Coverage Target |
|-----|-----------------|
| Public | 80% |
| API Server | 90% |
| Boarder | 80% |
| Landlord | 80% |
| Admin | 75% |

---

## 📊 Monitoring & Observability

### Health Checks
- Endpoint: `/api/health` on each app
- Used by: Load balancers, CI/CD, monitoring tools

### Logs
- Development: Console output
- Production: Structured JSON logs
- Aggregation: Docker logs, external services

### Metrics
- Request latency
- Error rates
- Database query performance
- API response times

---

## 🔗 Related Documentation

- [Main README](../README.md) - Project overview
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guidelines
- [PLAN.md](PLAN.md) - System specification
- [packages/README.md](../packages/README.md) - Shared packages

---

**Last Updated:** March 9, 2026
