# Boarder Dashboard (@havenspace/boarder)

The Boarder Dashboard is the authenticated user interface for boarders (renters) to manage their boarding house experience. Built with **Next.js 16**, **React 18**, **TypeScript**, and **Tailwind CSS**.

## ðŸŽ¯ Overview

This application provides boarders with a comprehensive dashboard to:
- Browse and search available boarding houses
- Manage bookings and reservations
- Track payment history
- Communicate with landlords
- Save favorite properties
- Manage profile settings

## ðŸš€ Quick Start

### Development

```bash
# From the project root
bun --filter @havenspace/boarder dev

# Or directly
cd apps/boarder
bun run dev
```

The app runs on **http://localhost:3004**

### Building for Production

```bash
bun --filter @havenspace/boarder build
bun --filter @havenspace/boarder start
```

### Docker

```bash
# Build the boarder app Docker image
docker build -t havenspace-boarder -f apps/boarder/Dockerfile .

# Run with docker-compose (included in root docker-compose.yml)
```

## ðŸ“ Project Structure

```
apps/boarder/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/                      # Next.js 16 App Router
â”‚   â”‚   â”œâ”€â”€ (dashboard)/          # Authenticated dashboard routes
â”‚   â”‚   â”‚   â”œâ”€â”€ bookings/         # Booking management
â”‚   â”‚   â”‚   â”œâ”€â”€ browse/           # Browse available properties
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboard/        # Main dashboard overview
â”‚   â”‚   â”‚   â”œâ”€â”€ history/          # Booking history
â”‚   â”‚   â”‚   â”œâ”€â”€ messages/         # Messaging with landlords
â”‚   â”‚   â”‚   â”œâ”€â”€ payments/         # Payment processing & history
â”‚   â”‚   â”‚   â”œâ”€â”€ profile/          # User profile management
â”‚   â”‚   â”‚   â”œâ”€â”€ saved/            # Saved properties
â”‚   â”‚   â”‚   â”œâ”€â”€ settings/         # Account settings
â”‚   â”‚   â”‚   â””â”€â”€ layout.tsx        # Dashboard layout wrapper
â”‚   â”‚   â”œâ”€â”€ globals.css           # Global styles
â”‚   â”‚   â”œâ”€â”€ layout.tsx            # Root layout
â”‚   â”‚   â””â”€â”€ page.tsx              # Root page (redirects to dashboard)
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ layout/               # Layout components (navbar, sidebar, etc.)
â”‚   â”‚   â””â”€â”€ ui/                   # Reusable UI components
â”‚   â”œâ”€â”€ lib/                      # Utilities and helpers
â”‚   â””â”€â”€ providers.tsx             # Context providers (theme, query, auth)
â”œâ”€â”€ Dockerfile                    # Docker configuration
â”œâ”€â”€ next.config.js                # Next.js configuration
â”œâ”€â”€ package.json                  # Dependencies and scripts
â”œâ”€â”€ tailwind.config.ts            # Tailwind CSS configuration
â””â”€â”€ tsconfig.json                 # TypeScript configuration
```

## ðŸŽ¨ Features

### Dashboard Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Main overview with quick stats and recent activity |
| `/browse` | Search and filter available boarding houses |
| `/bookings` | Manage current and pending bookings |
| `/history` | View past booking history |
| `/saved` | Saved/favorite properties |
| `/messages` | In-app messaging with landlords |
| `/payments` | Payment processing and transaction history |
| `/profile` | User profile and preferences |
| `/settings` | Account settings and notifications |

### Core Capabilities

- **Property Discovery**: Browse, search, and filter boarding houses
- **Booking Management**: Request, view, and manage bookings
- **Payment Processing**: Secure payment handling with history tracking
- **Messaging**: Real-time communication with landlords
- **Favorites**: Save properties for later viewing
- **Profile Management**: Update personal information and preferences
- **Theme Support**: Light/dark mode toggle via `next-themes`
- **Responsive Design**: Mobile-friendly interface

## ðŸ› ï¸ Technology Stack

### Dependencies

| Package | Purpose |
|---------|---------|
| `next` (16.1.5) | React framework |
| `react` (18+) / `react-dom` (19+) | UI library |
| `@tanstack/react-query` | Data fetching and caching |
| `next-auth` (5.0.0-beta.30) | Authentication |
| `next-themes` | Dark/light theme |
| `zustand` | State management |
| `react-hook-form` + `@hookform/resolvers` | Form handling |
| `zod` | Schema validation |
| `date-fns` | Date utilities |
| `lucide-react` | Icon library |
| `@radix-ui/*` | Headless UI components |
| `tailwindcss` + `tailwindcss-animate` | Styling |
| `class-variance-authority` | Component variants |
| `clsx` + `tailwind-merge` | Class name utilities |

### Workspace Dependencies

- `@havenspace/database` - Prisma client and types
- `@havenspace/shared` - Shared utilities
- `@havenspace/ui` - Shared UI components
- `@havenspace/validation` - Zod validation schemas

## ðŸ” Authentication

The boarder app integrates with the Haven Space authentication system via **NextAuth.js**:

- Session-based authentication
- Role-based access control (Boarder role)
- Protected routes via middleware
- JWT token management

## ðŸŽ¨ UI Components

Built on **Radix UI** primitives with **Tailwind CSS**:

- Avatar, Buttons, Cards
- Dialogs, Dropdowns, Forms
- Toasts, Tooltips, Tabs
- Collapsible sections
- Scroll areas
- Custom theme support

## ðŸ“¡ API Integration

Communicates with the backend API server (`@havenspace/api-server`) via **tRPC**:

- Type-safe API calls
- Automatic type inference
- React Query integration
- Optimistic updates

## ðŸ”„ State Management

- **Zustand**: Client-side state for UI preferences
- **React Query**: Server state management
- **React Hook Form**: Form state handling

## ðŸ§ª Development

### Available Scripts

```bash
bun run dev          # Start development server (port 3004)
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run typecheck    # Run TypeScript checks
```

### Code Quality

```bash
# From project root
bun run lint         # ESLint
bun run typecheck    # TypeScript
bun run format       # Prettier
```

## ðŸ³ Docker

The boarder app includes a `Dockerfile` for containerized deployment:

```dockerfile
# Multi-stage build
1. Base: Node.js runtime
2. Builder: Install dependencies and build
3. Runner: Production-ready container
```

### Building the Image

```bash
docker build -t havenspace-boarder -f apps/boarder/Dockerfile .
```

### Running the Container

```bash
docker run -p 3004:3004 \
  -e DATABASE_URL=your_database_url \
  -e NEXTAUTH_SECRET=your_secret \
  -e NEXTAUTH_URL=http://localhost:3004 \
  -e API_URL=http://localhost:3001 \
  havenspace-boarder
```

## ðŸŒ Environment Variables

Required environment variables (copy from root `.env`):

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3004"

# API
API_URL="http://localhost:3001"
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Optional
NEXT_PUBLIC_APP_URL="http://localhost:3004"
```

## ðŸ“± Responsive Design

The boarder dashboard is fully responsive:

- **Desktop**: Full sidebar navigation with expanded layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu with bottom navigation

## ðŸ”— Related Packages

- [`@havenspace/api-server`](../api) - Backend API
- [`@havenspace/auth-app`](../(auth)) - Authentication application
- [`@havenspace/public`](../(public)) - Public marketplace
- [`@havenspace/landlord`](../landlord) - Landlord portal
- [`@havenspace/admin`](../admin) - Admin dashboard

## ðŸ“š Documentation

- [Main README](../../README.md) - Project overview
- [QWEN.md](../../QWEN.md) - Development guidelines
- [DEVELOPMENT.md](../../docs/DEVELOPMENT.md) - Development setup
- [PLAN.md](../../docs/PLAN.md) - System specification

## ðŸ¤ Contributing

When adding features to the boarder app:

1. Follow existing component patterns
2. Use tRPC for API calls
3. Add proper TypeScript types
4. Include error handling
5. Test responsive behavior
6. Update this README if adding major features

---

**Part of the Haven Space platform**

