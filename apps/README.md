# Applications

This directory contains all the applications that make up the Boarding House Management System. Each application serves a specific user role and provides a tailored experience.

## 🏗️ Architecture Overview

The BHMS follows a multi-application architecture where each user type gets a dedicated interface:

```
apps/
├── (auth)/          # Centralized authentication
├── (public)/        # Public marketplace
├── admin/           # Platform administration
├── api/             # Backend API server
├── boarder/         # Boarder dashboard
└── landlord/        # Landlord management
```

## 📱 Applications

### 🔐 Authentication App (`(auth)/`)
**Port**: 3003  
**Purpose**: Centralized authentication and user onboarding

**Features**:
- User registration and login
- Role-based redirects
- Account status handling (pending, suspended)
- Password recovery
- Social authentication

**Tech Stack**: Next.js, NextAuth.js, Tailwind CSS

---

### 🌐 Public Platform (`(public)/`)
**Port**: 3000  
**Purpose**: Public marketplace and property discovery

**Features**:
- Browse boarding house listings
- Advanced search and filtering
- Interactive map with property locations
- Property detail pages with galleries
- "Become a Landlord" application flow
- Guest access (no authentication required)

**Tech Stack**: Next.js, Tailwind CSS, Radix UI, Leaflet Maps

---

### 🏠 Boarder Dashboard (`boarder/`)
**Port**: 3004  
**Purpose**: Authenticated boarder experience

**Features**:
- Personal dashboard with booking overview
- Browse and save properties
- Request bookings and make payments
- Message landlords
- Booking history and receipts
- Profile management

**Tech Stack**: Next.js, tRPC, Tailwind CSS, Radix UI

---

### 🏢 Landlord Portal (`landlord/`)
**Port**: 3005  
**Purpose**: Property management for approved landlords

**Features**:
- Property listing management
- Booking request handling
- Revenue tracking and analytics
- Tenant communication
- Property performance metrics
- Earnings and payout management

**Tech Stack**: Next.js, tRPC, Tailwind CSS, Radix UI, Charts

---

### ⚙️ Admin Dashboard (`admin/`)
**Port**: 3002  
**Purpose**: Platform administration and oversight

**Features**:
- User and landlord management
- Landlord application review
- Content moderation
- Platform analytics and reporting
- System configuration
- Dispute resolution

**Tech Stack**: Next.js, tRPC, Tailwind CSS, Radix UI, Data Tables

---

### 🔌 API Server (`api/`)
**Port**: 3001
**Purpose**: Backend API serving all applications

**Features**:
- tRPC API endpoints
- Authentication middleware
- Role-based access control
- Database operations
- File upload handling
- Email notifications

**Tech Stack**: Next.js API Routes, tRPC, Prisma, NextAuth.js

## 🚀 Development

### Starting Individual Apps

```bash
# Start specific application
bun --filter @bhms/public dev          # Public platform
bun --filter @bhms/boarder dev         # Boarder dashboard
bun --filter @bhms/landlord dev        # Landlord portal
bun --filter @bhms/admin dev           # Admin dashboard
bun --filter @bhms/api-server dev      # API server

# Or use convenience scripts
bun run web:dev                        # Public platform
bun run api:dev                        # API server
```

### Building Applications

```bash
# Build all applications
bun run build

# Build specific application
bun --filter @bhms/public build
bun --filter @bhms/admin build
# ... etc
```

## 🔗 Inter-App Communication

### API Communication
All web applications communicate with the API server through tRPC:

```typescript
// Example tRPC client usage
import { api } from '@/lib/trpc'

const { data: properties } = api.property.list.useQuery({
  limit: 10,
  filters: { location: 'Manila' }
})
```

### Authentication Flow
1. Users authenticate through the `(auth)` app
2. Based on role and status, they're redirected to appropriate app
3. Each app validates authentication and role permissions
4. API enforces role-based access control

### Shared State
- Authentication state managed by NextAuth.js
- User preferences stored in database
- Real-time updates via tRPC subscriptions

## 🎨 Design System

All applications share a consistent design system:

- **UI Components**: Shared via `@bhms/ui` package
- **Styling**: Tailwind CSS with shared configuration
- **Icons**: Lucide React icons
- **Themes**: Light/dark mode support
- **Responsive**: Mobile-first design approach

## 🔒 Security

### Authentication
- NextAuth.js with multiple providers
- JWT tokens with secure httpOnly cookies
- Role-based access control (RBAC)
- Session management and refresh

### Authorization
- Route-level protection
- API endpoint guards
- Component-level access control
- Tenant data isolation for landlords

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection with Content Security Policy
- CSRF protection built into Next.js

## 📊 Monitoring

### Development
- Hot reload for all applications
- TypeScript error reporting
- ESLint and Prettier integration
- Real-time log aggregation

### Production
- Error boundary components
- Performance monitoring
- User analytics (privacy-compliant)
- Health check endpoints

## 🧪 Testing

Each application includes:
- Unit tests for utilities and hooks
- Component testing with React Testing Library
- Integration tests for API endpoints
- E2E tests for critical user flows

```bash
# Run tests for specific app
bun --filter @bhms/public test
bun --filter @bhms/admin test

# Run all tests
bun run test
```

## 📦 Deployment

### Individual Deployment
Each application can be deployed independently:

```bash
# Build and deploy specific app
bun --filter @bhms/public build
# Deploy to your hosting platform
```

### Monorepo Deployment
Or deploy as a monorepo with shared infrastructure:

```bash
# Build all applications
bun run build

# Deploy with Docker
bun run docker:build
```

## 🔧 Configuration

Each application has its own configuration:

- **Environment Variables**: `.env.local` files
- **Next.js Config**: `next.config.js`
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `tailwind.config.ts`

Shared configurations are inherited from the `packages/config` directory.

---

For detailed information about each application, see their individual README files.