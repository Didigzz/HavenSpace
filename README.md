# Haven Space

A comprehensive multi-tenant platform for managing boarding houses, connecting landlords with boarders through a modern web experience.

## 🏠 Overview

Haven Space is a full-stack monorepo application that provides:

- **Public Marketplace**: Browse and discover boarding houses
- **Boarder Dashboard**: Manage bookings, payments, and communications
- **Landlord Portal**: Property management and tenant interactions
- **Admin Panel**: Platform oversight and user management

## 🏗️ Architecture

### Multi-Phase Platform Design

1. **Phase 1**: Public Platform (Marketplace & Discovery)
2. **Phase 2**: Boarder Dashboard (Authenticated Users)
3. **Phase 3**: Landlord Portal (Multi-Tenant Area)
4. **Phase 4**: Admin Dashboard (Platform Management)

### Technology Stack

- **Frontend**: Next.js 16, React 18, TypeScript
- **Backend**: tRPC, Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with role-based access
- **Styling**: Tailwind CSS, Radix UI
- **Monorepo**: Turborepo with Bun package manager

## 📁 Project Structure

```
├── apps/
│   ├── (public)/        # Public marketplace (:3000)
│   ├── server/          # Backend API server (tRPC + Auth) (:3006)
│   ├── admin/           # Platform admin dashboard (:3002)
│   ├── boarder/         # Boarder dashboard (:3004)
│   └── landlord/        # Landlord management portal (:3005)
├── packages/
│   ├── api/             # API route definitions
│   ├── auth/            # Authentication logic (NextAuth.js)
│   ├── database/        # Prisma schema and migrations
│   ├── shared/          # Shared utilities, layouts, providers
│   ├── ui/              # Shared UI components
│   └── validation/      # Zod schemas
└── docs/
    ├── PLAN.md          # System specification
    └── APPS.md          # Application documentation
```
## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun 1.1+
- PostgreSQL 14+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Didigzz/BoardingHouseSystem.git
cd BoardingHouseSystem

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and auth configurations

# Set up the database
bun run db:push
bun run db:seed

# Start development servers
bun run dev
```

### Development Servers

- **Public Platform**: http://localhost:3000
- **API Server**: http://localhost:3006
- **Admin Dashboard**: http://localhost:3002
- **Boarder Dashboard**: http://localhost:3004
- **Landlord Portal**: http://localhost:3005

## 🔧 Available Scripts

```bash
# Development
bun run dev              # Start all development servers
bun run api:dev          # Start API server only
bun run public:dev       # Start public platform only
bun run admin:dev        # Start admin dashboard only
bun run boarder:dev      # Start boarder dashboard only
bun run landlord:dev     # Start landlord portal only

# Building
bun run build            # Build all applications
bun run api:build        # Build API server only
bun run public:build     # Build public platform only
bun run admin:build      # Build admin dashboard only
bun run boarder:build    # Build boarder dashboard only
bun run landlord:build   # Build landlord portal only

# Database
bun run db:push          # Push schema changes
bun run db:studio        # Open Prisma Studio
bun run db:seed          # Seed database with sample data
bun run db:migrate       # Run migrations

# Code Quality
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint issues
bun run typecheck        # Run TypeScript checks
bun run format           # Format code with Prettier
bun run check:all        # Run all checks

# Docker
bun run docker:up        # Start services with Docker
bun run docker:dev       # Start development environment
bun run docker:down      # Stop Docker services
```
## 👥 User Roles & Access

### Boarders (Renters)
- Browse and search boarding houses
- Save favorite properties
- Request bookings and make payments
- Communicate with landlords
- Manage profile and booking history

### Landlords (Property Owners)
- Apply for landlord status (requires admin approval)
- Create and manage property listings
- Handle booking requests
- Communicate with boarders
- View earnings and analytics

### Platform Admins
- Review and approve landlord applications
- Moderate content and handle disputes
- Monitor platform analytics
- Manage users and system settings

## 🔐 Authentication & Security

- **Role-based Access Control**: Separate interfaces for each user type
- **Multi-tenant Architecture**: Landlord data isolation
- **Secure Authentication**: NextAuth.js with multiple providers
- **API Security**: tRPC with type-safe endpoints
- **Data Validation**: Zod schemas for all inputs

## 📱 Features

### Public Platform
- Property search and filtering
- Interactive map with property locations
- Detailed property listings with photos
- User registration and authentication

### Boarder Features
- Personal dashboard
- Saved properties and bookings
- In-platform messaging
- Payment processing
- Booking history and receipts

### Landlord Features
- Property management dashboard
- Booking request handling
- Revenue tracking and analytics
- Tenant communication tools
- Property performance metrics

### Admin Features
- User and landlord management
- Content moderation tools
- Platform analytics and reporting
- System configuration
- Dispute resolution
## 🗄️ Database Schema

The system uses a comprehensive database schema supporting:

- **Users**: Unified user table with role-based access
- **Boarding Houses**: Property listings with amenities and pricing
- **Bookings**: Reservation system with status tracking
- **Payments**: Transaction processing and history
- **Messages**: In-platform communication system
- **Reviews**: Property rating and feedback system
- **Applications**: Landlord approval workflow

See [docs/PLAN.md](docs/PLAN.md) for detailed ER diagrams.

## 🔄 CI/CD & Auto-merge

The project includes comprehensive GitHub Actions workflows:

- **Continuous Integration**: Lint, typecheck, test, and build
- **Auto-merge**: Safe automated merging for trusted changes
- **Dependabot**: Automated dependency updates
- **Security Scanning**: Vulnerability detection
- **Auto-labeling**: PR categorization based on changed files

See [apps/README.md](apps/README.md) for detailed development guidelines.

## 📚 Documentation

- [**PLAN.md**](docs/PLAN.md) - Complete system specification
- [**APPS.md**](docs/APPS.md) - Application documentation
- [**apps/README.md**](apps/README.md) - Application-specific documentation
- [**packages/README.md**](packages/README.md) - Package documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the development guidelines
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For questions, issues, or contributions:

- Create an [Issue](https://github.com/Didigzz/BoardingHouseSystem/issues)
- Start a [Discussion](https://github.com/Didigzz/BoardingHouseSystem/discussions)
- Contact the maintainers

---

**Built with ❤️ for the boarding house community**