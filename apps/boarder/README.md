# Boarder Dashboard (@bhms/boarder)

The Boarder Dashboard is the authenticated user interface for boarders (renters) to manage their boarding house experience. Built with **Next.js 16**, **React 18**, **TypeScript**, and **Tailwind CSS**.

## 🎯 Overview

This application provides boarders with a comprehensive dashboard to:
- Browse and search available boarding houses
- Manage bookings and reservations
- Track payment history
- Communicate with landlords
- Save favorite properties
- Manage profile settings

## 🚀 Quick Start

### Development

```bash
# From the project root
bun --filter @bhms/boarder dev

# Or directly
cd apps/boarder
bun run dev
```

The app runs on **http://localhost:3004**

### Building for Production

```bash
bun --filter @bhms/boarder build
bun --filter @bhms/boarder start
```

### Docker

```bash
# Build the boarder app Docker image
docker build -t bhms-boarder -f apps/boarder/Dockerfile .

# Run with docker-compose (included in root docker-compose.yml)
```

## 📁 Project Structure

```
apps/boarder/
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── (dashboard)/          # Authenticated dashboard routes
│   │   │   ├── bookings/         # Booking management
│   │   │   ├── browse/           # Browse available properties
│   │   │   ├── dashboard/        # Main dashboard overview
│   │   │   ├── history/          # Booking history
│   │   │   ├── messages/         # Messaging with landlords
│   │   │   ├── payments/         # Payment processing & history
│   │   │   ├── profile/          # User profile management
│   │   │   ├── saved/            # Saved properties
│   │   │   ├── settings/         # Account settings
│   │   │   └── layout.tsx        # Dashboard layout wrapper
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Root page (redirects to dashboard)
│   ├── components/
│   │   ├── layout/               # Layout components (navbar, sidebar, etc.)
│   │   └── ui/                   # Reusable UI components
│   ├── lib/                      # Utilities and helpers
│   └── providers.tsx             # Context providers (theme, query, auth)
├── Dockerfile                    # Docker configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Features

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

## 🛠️ Technology Stack

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

- `@bhms/database` - Prisma client and types
- `@bhms/shared` - Shared utilities
- `@bhms/ui` - Shared UI components
- `@bhms/validation` - Zod validation schemas

## 🔐 Authentication

The boarder app integrates with the BHMS authentication system via **NextAuth.js**:

- Session-based authentication
- Role-based access control (Boarder role)
- Protected routes via middleware
- JWT token management

## 🎨 UI Components

Built on **Radix UI** primitives with **Tailwind CSS**:

- Avatar, Buttons, Cards
- Dialogs, Dropdowns, Forms
- Toasts, Tooltips, Tabs
- Collapsible sections
- Scroll areas
- Custom theme support

## 📡 API Integration

Communicates with the backend API server (`@bhms/api-server`) via **tRPC**:

- Type-safe API calls
- Automatic type inference
- React Query integration
- Optimistic updates

## 🔄 State Management

- **Zustand**: Client-side state for UI preferences
- **React Query**: Server state management
- **React Hook Form**: Form state handling

## 🧪 Development

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

## 🐳 Docker

The boarder app includes a `Dockerfile` for containerized deployment:

```dockerfile
# Multi-stage build
1. Base: Node.js runtime
2. Builder: Install dependencies and build
3. Runner: Production-ready container
```

### Building the Image

```bash
docker build -t bhms-boarder -f apps/boarder/Dockerfile .
```

### Running the Container

```bash
docker run -p 3004:3004 \
  -e DATABASE_URL=your_database_url \
  -e NEXTAUTH_SECRET=your_secret \
  -e NEXTAUTH_URL=http://localhost:3004 \
  -e API_URL=http://localhost:3001 \
  bhms-boarder
```

## 🌐 Environment Variables

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

## 📱 Responsive Design

The boarder dashboard is fully responsive:

- **Desktop**: Full sidebar navigation with expanded layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu with bottom navigation

## 🔗 Related Packages

- [`@bhms/api-server`](../api) - Backend API
- [`@bhms/auth-app`](../(auth)) - Authentication application
- [`@bhms/public`](../(public)) - Public marketplace
- [`@bhms/landlord`](../landlord) - Landlord portal
- [`@bhms/admin`](../admin) - Admin dashboard

## 📚 Documentation

- [Main README](../../README.md) - Project overview
- [QWEN.md](../../QWEN.md) - Development guidelines
- [DEVELOPMENT.md](../../docs/DEVELOPMENT.md) - Development setup
- [PLAN.md](../../docs/PLAN.md) - System specification

## 🤝 Contributing

When adding features to the boarder app:

1. Follow existing component patterns
2. Use tRPC for API calls
3. Add proper TypeScript types
4. Include error handling
5. Test responsive behavior
6. Update this README if adding major features

---

**Part of the Boarding House Management System (BHMS)**
