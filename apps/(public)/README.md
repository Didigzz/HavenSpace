# Public Platform

The public-facing marketplace for the Haven Space platform. This application serves as the discovery layer where visitors can browse, search, and view boarding house listings, and includes integrated authentication.

## 🌐 Overview

**Port**: 3000
**URL**: http://localhost:3000
**Purpose**: Public marketplace, property discovery, and authentication

## ✨ Features

### Property Discovery
- **Browse Listings**: View all available boarding houses
- **Advanced Search**: Filter by location, price, amenities, availability
- **Interactive Map**: See property locations with clustering
- **Property Details**: Comprehensive listing pages with photo galleries

### Authentication
- **Login/Register**: Integrated authentication with NextAuth.js
- **Role-based Registration**: Sign up as Boarder or Landlord
- **Social Login**: OAuth providers (Google, Facebook, etc.)
- **Session Management**: Secure session handling

### Public Information
- **About Pages**: Platform information and how it works
- **Contact**: Support and inquiry forms
- **Terms & Privacy**: Legal documentation

## 🔐 Authentication

Authentication is **built into this app** using NextAuth.js:

| Page | Route |
|------|-------|
| Login | `/login` |
| Register | `/register` |
| Become a Landlord | `/become-landlord` |

After successful authentication, users are redirected to their role-specific dashboard:
- **Boarders** → Boarder Dashboard (port 3004)
- **Landlords** → Landlord Portal (port 3005)
- **Admins** → Admin Dashboard (port 3002)

## 🏗️ Architecture

### Pages Structure
```
src/app/
├── page.tsx                 # Homepage with featured listings
├── listings/
│   ├── page.tsx            # All listings with search/filter
│   └── [id]/page.tsx       # Individual property details
├── map/
│   └── page.tsx            # Map view of all properties
├── login/
│   └── page.tsx            # Login page
├── register/
│   └── page.tsx            # Registration page
├── become-landlord/
│   └── page.tsx            # Landlord information page
├── api/
│   ├── auth/[...nextauth]/ # NextAuth.js API route
│   └── register/           # User registration API
└── not-found.tsx           # 404 page
```

### Components
```
src/components/
├── layout/
│   ├── header.tsx          # Main navigation
│   ├── footer.tsx          # Site footer
│   └── theme-toggle.tsx    # Dark/light mode
└── listings/
    ├── listing-card.tsx    # Property card component
    └── search-filters.tsx  # Search and filter UI
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun package manager
- PostgreSQL database (for API connection)

### Development

```bash
# Install dependencies (from root)
bun install

# Start development server
bun --filter @bhms/public dev

# Or from root
bun run web:dev
```

The application will be available at http://localhost:3000

### Environment Variables

Create `.env.local` in this directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Map Configuration (optional)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

## 🎨 UI Components

### Layout Components
- **Header**: Navigation with login/register buttons
- **Footer**: Links and company information
- **Theme Toggle**: Light/dark mode switcher

### Listing Components
- **ListingCard**: Property preview with image, price, location
- **SearchFilters**: Location, price range, amenities filters
- **MapView**: Interactive map with property markers

### Form Components
- **RegisterForm**: User registration with role selection
- **ContactForm**: Inquiry and support forms

## 🔍 Search & Filtering

### Search Parameters
```typescript
interface SearchParams {
  location?: string
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  availableRooms?: number
  sortBy?: 'price' | 'rating' | 'distance'
  sortOrder?: 'asc' | 'desc'
}
```

### Filter Implementation
```typescript
// Example search hook
const { data: properties, isLoading } = api.property.search.useQuery({
  location: searchParams.location,
  priceRange: {
    min: searchParams.minPrice,
    max: searchParams.maxPrice
  },
  amenities: searchParams.amenities,
  limit: 20,
  offset: page * 20
})
```

## 🗺️ Map Integration

### Map Features
- Property location markers
- Clustering for dense areas
- Popup with property preview
- Search within map bounds

### Implementation
```typescript
// Map component with property markers
<MapContainer center={[14.5995, 120.9842]} zoom={11}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {properties.map(property => (
    <Marker 
      key={property.id} 
      position={[property.latitude, property.longitude]}
    >
      <Popup>
        <PropertyPopup property={property} />
      </Popup>
    </Marker>
  ))}
</MapContainer>
```

## 🔐 Authentication Implementation

Authentication uses NextAuth.js with credentials provider:

```tsx
// In your component
import { signIn, signOut, useSession } from "next-auth/react";

// Sign in
await signIn("credentials", { email, password });

// Sign out
await signOut();

// Get session
const { data: session } = useSession();
```

### User Journey

1. **Browse** - User discovers properties on Public Platform (port 3000)
2. **Auth** - User clicks "Sign up" → fills registration form
3. **Dashboard** - After auth, user redirected to role-specific dashboard

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly navigation
- Optimized image loading
- Simplified search interface
- Swipeable property galleries

## 🎯 SEO & Performance

### SEO Features
- Server-side rendering with Next.js
- Dynamic meta tags for property pages
- Structured data for property listings
- Sitemap generation

### Performance Optimizations
- Image optimization with Next.js Image
- Lazy loading for property lists
- Infinite scroll for large datasets
- Caching with React Query

## 🧪 Testing

### Test Structure
```
src/__tests__/
├── components/
│   ├── listing-card.test.tsx
│   └── search-filters.test.tsx
├── pages/
│   ├── homepage.test.tsx
│   └── listings.test.tsx
└── utils/
    └── search.test.tsx
```

### Running Tests
```bash
# Unit tests
bun test

# E2E tests
bun run test:e2e

# Test coverage
bun run test:coverage
```

## 🚀 Deployment

### Build
```bash
# Build for production
bun run build

# Start production server
bun start
```

### Environment Variables (Production)
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=production-secret
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative with good Next.js support
- **Docker**: Container deployment option

## 📊 Analytics

### Tracking Events
- Property views
- Search queries
- Registration conversions
- Contact form submissions

### Implementation
```typescript
// Example analytics tracking
import { analytics } from '@/lib/analytics'

const handlePropertyView = (propertyId: string) => {
  analytics.track('Property Viewed', {
    propertyId,
    source: 'listing_page'
  })
}
```

## 🔧 Configuration

### Next.js Config
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-image-domain.com'],
  },
  experimental: {
    appDir: true,
  },
}
```

### Tailwind Config
```javascript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  }
}
```

## 🤝 Contributing

1. Follow the component structure in `src/components/`
2. Use TypeScript for all new code
3. Add tests for new features
4. Follow the existing naming conventions
5. Update this README for significant changes

## 📚 Related Documentation

- [Main README](../../README.md)
- [API Documentation](../api/README.md)
- [Development Guidelines](../../DEVELOPMENT.md)
- [Architecture Overview](../../flow.md)