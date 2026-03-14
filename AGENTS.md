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
- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: tRPC, Express.js, Next.js API Routes
- **Database**: PostgreSQL 15 with Prisma ORM
- **Authentication**: NextAuth.js with role-based access control
- **Monorepo**: Turborepo with Bun package manager
- **Containerization**: Docker & Docker Compose

---

## Project Structure

```
HavenSpace/
├── apps/                          # Application layer
│   ├── (public)/        :3000     # Public marketplace (landing)
│   ├── server/          :3006     # Backend API server (tRPC)
│   ├── admin/           :3002     # Platform admin dashboard
│   ├── boarder/         :3004     # Boarder dashboard
│   └── landlord/        :3005     # Landlord management portal
│
├── packages/                      # Shared packages
│   ├── api/                       # tRPC routers & procedures
│   ├── auth/                      # NextAuth.js configuration
│   ├── config/                    # Shared configurations
│   ├── database/                  # Prisma schema & client
│   ├── eslint-config/             # Shared ESLint rules
│   ├── layouts/                   # Shared layout components
│   ├── providers/                 # React context providers
│   ├── shared/                    # Business logic & utilities
│   ├── typescript-config/         # Shared TS configurations
│   ├── ui/                        # Shared React components
│   └── validation/                # Zod validation schemas
│
├── docs/                          # Documentation
│   ├── PLAN.md                    # System specification
│   └── APPS.md                    # Application documentation
│
├── nginx/                         # Nginx configuration
├── .github/workflows/             # CI/CD pipelines
└── docker-compose*.yml            # Docker configurations
```

---

## Building & Running

### Prerequisites
- **Node.js** 18+
- **Bun** 1.1+
- **PostgreSQL** 14+ (or use Docker)
- **Git**

### Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database and auth configurations

# 3. Start Docker services (PostgreSQL, Redis)
bun run docker:up

# 4. Set up database
bun run db:push        # Push Prisma schema
bun run db:seed        # Seed sample data

# 5. Start all development servers
bun run dev
```

### Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all development servers (Turborepo) |
| `bun run build` | Build all applications |
| `bun run lint` | Run ESLint across all packages |
| `bun run lint:fix` | Fix ESLint issues |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run format` | Format code with Prettier |
| `bun run format:check` | Check code formatting |
| `bun run check:all` | Run lint + typecheck + format check |
| `bun run clean` | Clean node_modules and build artifacts |

### Database Commands

| Command | Description |
|---------|-------------|
| `bun run db:push` | Push schema changes to database |
| `bun run db:studio` | Open Prisma Studio GUI |
| `bun run db:seed` | Seed database with sample data |
| `bun run db:migrate` | Run database migrations |

### Individual App Development

```bash
# Start specific app
bun --filter @havenspace/public dev       # Public platform (:3000)
bun --filter @havenspace/api-server dev   # API server (:3006)
bun --filter @havenspace/admin dev        # Admin dashboard (:3002)
bun --filter @havenspace/boarder dev      # Boarder dashboard (:3004)
bun --filter @havenspace/landlord dev     # Landlord portal (:3005)

# Build specific app
bun --filter @havenspace/public build
bun --filter @havenspace/api-server build
# ... etc
```

### Docker Commands

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
| `apps/**/*.{js,jsx,ts,tsx}` | ESLint fix + Prettier |
| `packages/**/*.{js,jsx,ts,tsx}` | ESLint fix + Prettier |
| `*.{json,yaml,yml,md}` | Prettier |
| `*.prisma` | Prettier (Prisma plugin) |
| `**/*.{ts,tsx}` | TypeScript type check |

### ESLint Configuration
- Extends: `eslint:recommended`
- Parser: Default ESLint parser
- Environment: Node.js, ES2022
- Ignores: `node_modules/`, `.next/`, `dist/`, `.turbo/`, `apps/`

### Prettier Configuration
- Plugins: `prettier-plugin-prisma`, `prettier-plugin-tailwindcss`
- Configured via `.prettierrc`

### TypeScript Configuration
- **Target**: ES2022
- **Strict mode**: Enabled
- **Module resolution**: `bundler`
- **JSX**: `preserve` (Next.js)
- **Path aliases**: `@havenspace/*` mapped to packages

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI Pipeline (`.github/workflows/ci.yml`)
Triggered on push/PR to `main` and `develop`:

1. **Lint** - ESLint validation
2. **Typecheck** - TypeScript compilation check
3. **Test** - Jest tests with PostgreSQL test database
4. **Build** - Build all applications (matrix strategy)
5. **Docker Images** - Build and push to Docker Hub (main branch only)
6. **Deploy** - SSH deployment to production server (main branch only)

#### 2. CodeQL (`.github/workflows/codeql.yml`)
Security scanning for vulnerabilities.

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
1. Authentication handled via `packages/auth/` (NextAuth.js configuration)
2. Auth endpoints served through `apps/server/` API routes
3. Role-based redirect to appropriate dashboard after login
4. Session managed via NextAuth.js with JWT
5. API enforces role-based access control

### tRPC API Architecture
- All apps communicate with API server via tRPC
- Type-safe end-to-end communication
- Routers defined in `packages/api/`
- API server runs on port 3006

### Database Schema
Key entities: Users, Boarding Houses, Bookings, Payments, Messages, Reviews, Applications. See `packages/database/schema.prisma` for full schema.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Root workspace configuration & scripts |
| `turbo.json` | Turborepo task configuration |
| `tsconfig.json` | Base TypeScript configuration |
| `.env.example` | Environment variables template |
| `docker-compose.yml` | Local development services |
| `docker-compose.production.yml` | Production deployment |
| `commitlint.config.js` | Commit message validation rules |
| `lint-staged.config.js` | Pre-commit hook configuration |
| `.eslintrc.js` | ESLint configuration |
| `.prettierrc` | Prettier configuration |

---

## Documentation

| Document | Location |
|----------|----------|
| System Specification | `docs/PLAN.md` |
| Application Documentation | `docs/APPS.md` |
| Apps Documentation | `apps/README.md` |
| Packages Documentation | `packages/README.md` |

---

## Notes for AI Assistants

- **Monorepo awareness**: Changes may affect multiple apps/packages
- **Type safety**: Always maintain TypeScript type integrity
- **tRPC patterns**: Follow existing router/procedure patterns
- **Database migrations**: Use Prisma for all schema changes
- **Code style**: Match existing code conventions (naming, structure)
- **Testing**: Consider adding tests for new features
- **Documentation**: Update relevant docs when adding features
