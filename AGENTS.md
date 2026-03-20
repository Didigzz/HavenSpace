# Haven Space - Project Context

## Project Overview

Haven Space is a comprehensive **multi-tenant monorepo platform** for managing boarding houses, connecting landlords with boarders through modern web interfaces. Built with **Next.js 16**, **React 18**, **TypeScript**, **tRPC**, **Prisma**, and **PostgreSQL**, the platform follows a phased architecture serving multiple user roles.

### Core User Roles
| Role | Access Level | Status Required |
|------|-------------|-----------------|
| **Boarder** | Browse, book, message, pay | Active (no approval) |
| **Landlord** | Manage listings, bookings, earnings | Requires admin approval |
| **Admin** | Full platform oversight, user management | Admin role |

### Technology Stack
- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS 4.x, Radix UI
- **Backend**: tRPC v11, Next.js API Routes, ORPC
- **Database**: PostgreSQL 15 with Prisma ORM v7, Neon Database support
- **Authentication**: NextAuth.js v5 (beta) with role-based access control
- **Caching**: Redis (ioredis)
- **Monorepo**: Turborepo v2 with Bun 1.1+ package manager
- **Containerization**: Docker & Docker Compose
- **Testing**: Vitest with coverage support
- **State Management**: Zustand, TanStack Query v5

---

## Project Structure

```
HavenSpace/
├── apps/                              # Application layer
│   ├── (public)/          :3000       # Public marketplace (landing)
│   ├── server/            :3006       # Backend API server (tRPC + Auth)
│   ├── admin/             :3002       # Platform admin dashboard
│   ├── boarder/           :3004       # Boarder dashboard
│   └── landlord/          :3005       # Landlord management portal
│
├── packages/                          # Shared packages
│   ├── api/                           # tRPC/ORPC routers & procedures
│   │   ├── modules/                   # Feature-based API modules
│   │   │   ├── boarder/               # Boarder-related APIs
│   │   │   ├── dashboard/             # Dashboard statistics APIs
│   │   │   ├── payment/               # Payment processing APIs
│   │   │   ├── room/                  # Room management APIs
│   │   │   └── user/                  # User management APIs
│   │   ├── routers/                   # Route definitions
│   │   ├── middleware/                # Custom middleware (rate limiting, etc.)
│   │   └── lib/                       # Shared utilities
│   ├── auth/                          # NextAuth.js v5 configuration
│   ├── config/                        # Shared configurations
│   │   ├── eslint/                    # ESLint configurations
│   │   ├── tailwind/                  # Tailwind CSS configurations
│   │   └── typescript/                # TypeScript configurations
│   ├── database/                      # Prisma schema & client
│   │   ├── prisma/                    # Schema file & seed data
│   │   └── src/                       # Client exports
│   ├── shared/                        # Shared business logic & UI components
│   │   ├── components/                # Reusable React components
│   │   ├── features/                  # Feature-specific logic
│   │   ├── lib/                       # Utility functions
│   │   └── ui/                        # Shared UI components
│   ├── validation/                    # Zod validation schemas
│   └── typescript-config/             # Base TypeScript configuration
│
├── docs/                              # Documentation
│   ├── GUIDELINES.md                  # Development guidelines
│   └── PRESENTATION.md                # Project presentation info
│
├── nginx/                             # Nginx configuration & SSL
├── .github/workflows/                 # CI/CD pipelines
├── .husky/                            # Git hooks
└── docker-compose*.yml                # Docker configurations
```

---

## Building & Running

### Prerequisites
- **Node.js** 18+
- **Bun** 1.1+
- **PostgreSQL** 14+ (or use Docker)
- **Redis** 7+ (or use Docker)
- **Git**

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database, auth, and Redis configurations

# 3. Start Docker services (PostgreSQL, Redis)
bun run docker:up

# 4. Set up database
bun run db:push        # Push Prisma schema
bun run db:seed        # Seed sample data

# 5. Start all development servers
bun run dev
```

### Development Commands

#### General Development
| Command | Description |
|---------|-------------|
| `bun run dev` | Start all development servers (Turborepo) |
| `bun run dev:full` | Start all apps (public + api + boarder + landlord + admin) |
| `bun run dev:boarder` | Start boarder stack (public + api + boarder) |
| `bun run dev:landlord` | Start landlord stack (public + api + landlord) |
| `bun run dev:admin` | Start admin stack (public + api + admin) |
| `bun run dev:public` | Start public stack (public + api) |

#### Building
| Command | Description |
|---------|-------------|
| `bun run build` | Build all applications |
| `bun run build:all` | Build all apps explicitly |
| `bun run build:boarder` | Build boarder app |
| `bun run build:landlord` | Build landlord app |
| `bun run build:admin` | Build admin app |
| `bun run build:public` | Build public app |

#### Code Quality
| Command | Description |
|---------|-------------|
| `bun run lint` | Run ESLint across all packages |
| `bun run lint:fix` | Fix ESLint issues automatically |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run test` | Run tests across all packages |
| `bun run test:coverage` | Run tests with coverage reports |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Check code formatting |
| `bun run check:all` | Run lint + typecheck + format check |
| `bun run clean` | Clean node_modules and build artifacts |

#### Database
| Command | Description |
|---------|-------------|
| `bun run db:push` | Push schema changes to database |
| `bun run db:studio` | Open Prisma Studio GUI |
| `bun run db:seed` | Seed database with sample data |
| `bun run db:migrate` | Run database migrations |

#### Individual App Development
```bash
# Start specific app
bun run api:dev        # API server (:3006)
bun run public:dev     # Public platform (:3000)
bun run admin:dev      # Admin dashboard (:3002)
bun run boarder:dev    # Boarder dashboard (:3004)
bun run landlord:dev   # Landlord portal (:3005)

# Build specific app
bun run api:build      # Build API server
bun run public:build   # Build public platform
bun run admin:build    # Build admin dashboard
bun run boarder:build  # Build boarder dashboard
bun run landlord:build # Build landlord portal
```

#### Docker
| Command | Description |
|---------|-------------|
| `bun run docker:up` | Start services (PostgreSQL, Redis) |
| `bun run docker:dev` | Start development environment |
| `bun run docker:down` | Stop Docker services |
| `bun run docker:logs` | View service logs |
| `bun run docker:build:api` | Build API Docker image |
| `bun run docker:clean` | Clean Docker system |

---

## Development Conventions

### Commit Messages (Conventional Commits)

The project uses **commitlint** with the following types:

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance tasks |
| `revert` | Reverting a commit |

**Examples:**
```bash
git commit -m "feat: add property bookmarking feature"
git commit -m "fix: resolve booking date validation issue"
git commit -m "docs: update API endpoint documentation"
```

### Code Quality (lint-staged + Husky)

Pre-commit hooks automatically run on staged files:

| File Type | Actions |
|-----------|---------|
| `apps/**/*.{js,jsx,ts,tsx}` | ESLint fix + Prettier + git add |
| `packages/**/*.{js,jsx,ts,tsx}` | ESLint fix + Prettier + git add |
| `*.{js,cjs,mjs}` | Prettier + git add |
| `*.{json,yaml,yml,md}` | Prettier + git add |
| `*.{css,scss}` | Prettier + git add |
| `*.prisma` | Prettier (Prisma plugin) + git add |
| `**/*.{ts,tsx}` | TypeScript type check (runs once for all) |

### ESLint Configuration
- Extends: `eslint:recommended`
- Parser: `@typescript-eslint/parser`
- Environment: Node.js, ES2022, Browser
- Ignores: `node_modules/`, `.next/`, `dist/`, `.turbo/`, `*.config.js`, `*.config.mjs`, `coverage/`
- TypeScript Overrides: Enhanced type checking for `.ts` and `.tsx` files
- Rules: `no-unused-vars` (warn with `_` pattern), `no-console` (warn only for warn/error), `@typescript-eslint/no-explicit-any` (warn)

### Prettier Configuration
- Plugins: `prettier-plugin-prisma`, `prettier-plugin-tailwindcss`
- Configured via `.prettierrc`
- Settings: semicolons, double quotes, 2-space tabs, es5 trailing commas, 80 char width

### TypeScript Configuration
- **Target**: ES2022
- **Strict mode**: Enabled
- **Module resolution**: `bundler`
- **JSX**: `preserve` (Next.js)
- **Path aliases**: Configured per workspace
- **Plugins**: Next.js plugin for JSX support

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI Pipeline (`.github/workflows/ci.yml`)
Triggered on push/PR to `main` and `develop`:

1. **Lint** - ESLint validation
2. **Typecheck** - TypeScript compilation check
3. **Test** - Vitest tests with PostgreSQL test database
4. **Build** - Build all applications (matrix strategy)
5. **Docker Images** - Build and push to Docker Hub (main branch only)
6. **Deploy** - SSH deployment to production server (main branch only)

#### 2. CodeQL (`.github/workflows/codeql.yml`)
Security scanning for vulnerabilities.

#### 3. GitHub Pages (`.github/workflows/github-pages.yml`)
Documentation deployment.

### Dependabot
Automated dependency updates for:
- Root npm dependencies
- Individual apps (admin, api)
- Packages (database, auth, ui)
- GitHub Actions

---

## Architecture Notes

### Multi-Phase Platform Design

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Public Platform (Marketplace & Discovery) | Core |
| **Phase 2** | Boarder Dashboard (Authenticated Users) | Core |
| **Phase 3** | Landlord Portal (Multi-Tenant) | Core |
| **Phase 4** | Admin Dashboard (Platform Management) | Core |

### Authentication Flow
1. Authentication handled via `packages/auth/` (NextAuth.js v5 beta configuration)
2. Auth endpoints served through `apps/server/` API routes
3. Role-based redirect to appropriate dashboard after login
4. Session managed via NextAuth.js with JWT
5. API enforces role-based access control via middleware

### tRPC/ORPC API Architecture
- **Dual System**: Supports both tRPC v11 and ORPC v1
- All apps communicate with API server via type-safe APIs
- Type-safe end-to-end communication
- Routers defined in `packages/api/src/modules/` by feature
  - **boarder**: Boarder-related operations
  - **dashboard**: Statistics and analytics
  - **payment**: Payment processing
  - **room**: Room management
  - **user**: User management
  - **admin**: Admin operations
  - **property**: Property listings
  - **booking**: Booking management
  - **auditLog**: Audit logging
- API server runs on port 3006
- Middleware support: rate limiting, authentication, authorization

### Database Schema
Key entities (PostgreSQL with Prisma ORM v7):
- **Users**: Unified user table with role-based access (LANDLORD, BOARDER, ADMIN)
- **LandlordProfile**: Landlord application and verification
- **Properties**: Boarding house listings
- **Rooms**: Individual rooms within properties
- **Bookings**: Reservation system
- **Payments**: Transaction processing (RENT, UTILITY, DEPOSIT, OTHER)
- **UtilityReadings**: Utility consumption tracking
- **AuditLog**: System activity tracking
- Supported adapters: PostgreSQL, Neon Serverless

See `packages/database/prisma/schema.prisma` for full schema.

### Infrastructure
- **Caching**: Redis for session management and rate limiting
- **File Storage**: Support for Google Cloud Platform (GCP) buckets
- **Email**: SMTP support for notifications
- **Webhooks**: Stripe integration for payments

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Root workspace configuration & scripts |
| `turbo.json` | Turborepo task configuration |
| `tsconfig.json` | Base TypeScript configuration |
| `.eslintrc.js` | ESLint configuration |
| `.prettierrc` | Prettier configuration |
| `commitlint.config.js` | Commit message validation rules |
| `lint-staged.config.js` | Pre-commit hook configuration |
| `.env.example` | Environment variables template |
| `docker-compose.yml` | Local development services |
| `docker-compose.production.yml` | Production deployment |
| `docker-compose.dev.yml` | Development environment |
| `nginx/nginx.conf` | Nginx reverse proxy configuration |

---

## Documentation

| Document | Location |
|----------|----------|
| Development Guidelines | `docs/GUIDELINES.md` |
| Presentation Info | `docs/PRESENTATION.md` |
| Project README | `README.md` |
| Apps README | `apps/README.md` |
| Packages README | `packages/README.md` |

---

## Notes for AI Assistants

### Architecture Awareness
- **Monorepo structure**: Changes may affect multiple apps/packages
- **Type safety**: Always maintain TypeScript type integrity
- **tRPC/ORPC patterns**: Follow existing router/procedure patterns
- **Feature-based modules**: API modules organized by domain (boarder, dashboard, payment, etc.)
- **Database migrations**: Use Prisma for all schema changes
- **Code style**: Match existing code conventions (naming, structure)

### Development Guidelines
- **Testing**: Consider adding tests for new features using Vitest
- **Documentation**: Update relevant docs when adding features
- **Environment variables**: Check `turbo.json` for available global environment variables
- **Role-based access**: Always consider user roles (BOARDER, LANDLORD, ADMIN) when implementing features
- **State management**: Use Zustand for global state, TanStack Query for server state
- **UI components**: Prefer Radix UI for accessible, unstyled components
- **Styling**: Use Tailwind CSS 4.x with Tailwind Animate plugin

### API Development
- **Module structure**: New API endpoints should be added to appropriate module in `packages/api/src/modules/`
- **Middleware**: Use custom middleware for authentication, rate limiting, and authorization
- **Validation**: Use Zod schemas from `packages/validation` for input validation
- **Error handling**: Follow existing error handling patterns
- **Type safety**: Leverage tRPC/ORPC for end-to-end type safety

### Frontend Development
- **Shared components**: Reusable components should go in `packages/shared/src/ui/`
- **Feature-specific logic**: Domain logic should be in `packages/shared/src/features/`
- **Layouts**: Shared layouts in `packages/shared/src/components/layouts/`
- **Providers**: React context providers in `packages/shared/src/components/providers/`

### Database
- **Schema changes**: Update `packages/database/prisma/schema.prisma`
- **Migrations**: Use `bun run db:migrate` for production migrations
- **Seeding**: Update `packages/database/prisma/seed.ts` for test data
- **Client import**: Import from `@havenspace/database` for type-safe queries

### Deployment
- **Docker**: Use provided Dockerfiles for each app
- **Nginx**: Configure reverse proxy via `nginx/nginx.conf`
- **SSL**: Certificates in `nginx/ssl/` directory
- **Environment**: Use `.env.production` for production settings