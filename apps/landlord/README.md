# Landlord Portal

The landlord management interface for the Haven Space platform. This application provides approved landlords with comprehensive tools to manage their properties, handle bookings, communicate with boarders, and track earnings.

## ðŸ¢ Overview

**Port**: 3005  
**URL**: http://localhost:3005  
**Purpose**: Property management and landlord operations

## âœ¨ Features

### Property Management

- **Property Listings**: Create, edit, and manage boarding house listings
- **Photo Management**: Upload and organize property images
- **Pricing Control**: Set rates, availability, and special offers
- **Amenity Management**: Define property features and amenities

### Booking Operations

- **Booking Requests**: Review and approve/reject booking requests
- **Calendar Management**: View availability and booking schedules
- **Guest Management**: Track current and past boarders
- **Booking Analytics**: Performance metrics and insights

### Financial Management

- **Revenue Tracking**: Monitor earnings and payment history
- **Payout Management**: Request and track payouts
- **Financial Reports**: Detailed financial analytics
- **Tax Documentation**: Generate tax-related reports

### Communication

- **Boarder Messaging**: Direct communication with guests
- **Booking Notifications**: Real-time booking updates
- **Support Channel**: Platform support access

## ðŸ—ï¸ Architecture

### Pages Structure

```
src/app/
â”œâ”€â”€ page.tsx                           # Dashboard redirect
â””â”€â”€ (admin)/
    â”œâ”€â”€ layout.tsx                     # Admin layout
    â”œâ”€â”€ dashboard/page.tsx             # Main dashboard
    â”œâ”€â”€ properties/
    â”‚   â”œâ”€â”€ page.tsx                   # Property list
    â”‚   â”œâ”€â”€ new/page.tsx              # Create property
    â”‚   â””â”€â”€ map/page.tsx              # Property map view
    â”œâ”€â”€ bookings/page.tsx              # Booking management
    â”œâ”€â”€ messages/page.tsx              # Communication center
    â”œâ”€â”€ earnings/page.tsx              # Financial overview
    â”œâ”€â”€ payments/page.tsx              # Payment history
    â”œâ”€â”€ tenants/
    â”‚   â”œâ”€â”€ page.tsx                   # Tenant list
    â”‚   â””â”€â”€ new/page.tsx              # Add tenant
    â”œâ”€â”€ maintenance/page.tsx           # Maintenance requests
    â”œâ”€â”€ notifications/page.tsx         # Notification center
    â””â”€â”€ settings/page.tsx              # Account settings
```

### Components Structure

```
src/components/
â”œâ”€â”€ dashboard/
â”‚   â”œâ”€â”€ stats-card.tsx                 # Dashboard statistics
â”‚   â”œâ”€â”€ revenue-chart.tsx              # Revenue visualization
â”‚   â”œâ”€â”€ occupancy-chart.tsx            # Occupancy metrics
â”‚   â”œâ”€â”€ recent-payments.tsx            # Payment history
â”‚   â””â”€â”€ upcoming-leases.tsx            # Upcoming bookings
â”œâ”€â”€ layout/
â”‚   â”œâ”€â”€ dashboard-layout.tsx           # Main layout
â”‚   â”œâ”€â”€ header.tsx                     # Dashboard header
â”‚   â”œâ”€â”€ sidebar.tsx                    # Navigation sidebar
â”‚   â””â”€â”€ index.ts                       # Layout exports
â””â”€â”€ ui/
    â”œâ”€â”€ avatar.tsx                     # User avatar
    â”œâ”€â”€ collapsible.tsx                # Collapsible sections
    â”œâ”€â”€ dropdown-menu.tsx              # Dropdown menus
    â””â”€â”€ index.ts                       # UI exports
```

## ðŸš€ Getting Started

### Prerequisites

- Node.js 18+
- Bun package manager
- Approved landlord account
- API server running

### Development

```bash
# Start development server
bun --filter @havenspace/landlord dev

# Or from app directory
cd apps/landlord
bun dev
```

The application will be available at http://localhost:3005

### Environment Variables

Create `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=your-secret-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# File Upload
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3001/upload
MAX_FILE_SIZE=10485760  # 10MB

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## ðŸ” Authentication & Authorization

### Access Control

- **Role Requirement**: User must have `landlord` role
- **Status Check**: Account must be `approved`
- **Tenant Isolation**: Access only to own properties and data

### Route Protection

```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Check if user is an approved landlord
    if (token?.role !== "landlord" || token?.status !== "approved") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
```

### Data Isolation

```typescript
// All queries automatically filter by landlord ID
const getProperties = async (landlordId: string) => {
  return await db.boardingHouse.findMany({
    where: {
      landlordId: landlordId, // Tenant isolation
    },
  });
};
```

## ðŸ  Property Management

### Property Creation

```typescript
interface PropertyData {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  pricePerMonth: number;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  images: File[];
  rules?: string;
  policies?: string;
}
```

### Property Features

- **Image Gallery**: Multiple property photos
- **Location Mapping**: Interactive map integration
- **Amenity Selection**: Predefined amenity options
- **Pricing Tiers**: Different room types and rates
- **Availability Calendar**: Room availability tracking

### Implementation Example

```typescript
const PropertyForm = () => {
  const createProperty = api.property.create.useMutation()
  const uploadImages = api.upload.images.useMutation()

  const handleSubmit = async (data: PropertyData) => {
    try {
      // Upload images first
      const imageUrls = await uploadImages.mutateAsync(data.images)

      // Create property with image URLs
      await createProperty.mutateAsync({
        ...data,
        images: imageUrls
      })

      toast.success('Property created successfully!')
      router.push('/properties')
    } catch (error) {
      toast.error('Failed to create property')
    }
  }

  return <PropertyFormComponent onSubmit={handleSubmit} />
}
```

## ðŸ“… Booking Management

### Booking Workflow

1. **Request Received**: Boarder submits booking request
2. **Review Process**: Landlord reviews request details
3. **Decision Making**: Approve or reject with reason
4. **Payment Processing**: Handle approved booking payments
5. **Check-in Management**: Coordinate guest arrival

### Booking States

```typescript
type BookingStatus =
  | "pending" // Awaiting landlord decision
  | "approved" // Approved by landlord
  | "confirmed" // Payment completed
  | "rejected" // Declined by landlord
  | "cancelled" // Cancelled
  | "active" // Currently occupied
  | "completed"; // Stay finished
```

### Booking Management Component

```typescript
const BookingRequestCard = ({ booking }: { booking: BookingRequest }) => {
  const approveBooking = api.booking.approve.useMutation()
  const rejectBooking = api.booking.reject.useMutation()

  const handleApprove = () => {
    approveBooking.mutate({
      bookingId: booking.id,
      message: 'Welcome! Looking forward to hosting you.'
    })
  }

  const handleReject = (reason: string) => {
    rejectBooking.mutate({
      bookingId: booking.id,
      reason
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <h3>{booking.boarder.name}</h3>
          <Badge>{booking.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>Dates: {booking.startDate} - {booking.endDate}</p>
        <p>Amount: ${booking.totalAmount}</p>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleApprove}>Approve</Button>
          <Button variant="outline" onClick={() => handleReject('Not available')}>
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## ðŸ’° Financial Management

### Revenue Tracking

- **Monthly Earnings**: Revenue by month
- **Property Performance**: Earnings per property
- **Occupancy Rates**: Utilization metrics
- **Payment Status**: Outstanding and completed payments

### Financial Dashboard

```typescript
const FinancialDashboard = () => {
  const { data: stats } = api.landlord.getFinancialStats.useQuery()

  return (
    <div className="financial-grid">
      <StatsCard
        title="Monthly Revenue"
        value={`$${stats?.monthlyRevenue || 0}`}
        change={stats?.revenueChange}
      />
      <StatsCard
        title="Total Properties"
        value={stats?.totalProperties || 0}
      />
      <StatsCard
        title="Occupancy Rate"
        value={`${stats?.occupancyRate || 0}%`}
      />
      <RevenueChart data={stats?.revenueHistory} />
      <OccupancyChart data={stats?.occupancyHistory} />
    </div>
  )
}
```

### Payout Management

```typescript
const PayoutRequest = () => {
  const requestPayout = api.payout.request.useMutation()
  const { data: balance } = api.landlord.getBalance.useQuery()

  const handlePayout = (amount: number) => {
    requestPayout.mutate({
      amount,
      method: 'bank_transfer',
      accountDetails: landlord.bankAccount
    })
  }

  return (
    <Card>
      <CardHeader>
        <h3>Available Balance</h3>
        <p className="text-2xl font-bold">${balance?.available || 0}</p>
      </CardHeader>
      <CardContent>
        <Button onClick={() => handlePayout(balance?.available)}>
          Request Payout
        </Button>
      </CardContent>
    </Card>
  )
}
```

## ðŸ“Š Analytics & Reporting

### Dashboard Metrics

- **Revenue Analytics**: Income trends and forecasts
- **Occupancy Analytics**: Booking patterns and utilization
- **Guest Analytics**: Boarder demographics and behavior
- **Performance Metrics**: Property comparison and optimization

### Chart Components

```typescript
const RevenueChart = ({ data }: { data: RevenueData[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

const OccupancyChart = ({ data }: { data: OccupancyData[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="property" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="occupancyRate" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}
```

## ðŸ’¬ Communication System

### Messaging Features

- **Boarder Communication**: Direct messaging with guests
- **Booking Context**: Messages linked to specific bookings
- **Automated Messages**: Welcome messages and reminders
- **Bulk Messaging**: Announcements to all boarders

### Message Management

```typescript
const MessageCenter = () => {
  const { data: conversations } = api.message.getConversations.useQuery()
  const [selectedConversation, setSelectedConversation] = useState(null)

  return (
    <div className="message-center">
      <ConversationList
        conversations={conversations}
        onSelect={setSelectedConversation}
      />
      {selectedConversation && (
        <MessageThread conversation={selectedConversation} />
      )}
    </div>
  )
}
```

## ðŸ”§ Maintenance Management

### Maintenance Features

- **Request Tracking**: Monitor maintenance requests
- **Vendor Management**: Coordinate with service providers
- **Cost Tracking**: Track maintenance expenses
- **Scheduling**: Plan and schedule maintenance work

### Maintenance Dashboard

```typescript
const MaintenanceOverview = () => {
  const { data: requests } = api.maintenance.getRequests.useQuery()

  const urgentRequests = requests?.filter(r => r.priority === 'urgent')
  const pendingRequests = requests?.filter(r => r.status === 'pending')

  return (
    <div className="maintenance-overview">
      <StatsCard
        title="Urgent Requests"
        value={urgentRequests?.length || 0}
        variant="danger"
      />
      <StatsCard
        title="Pending Requests"
        value={pendingRequests?.length || 0}
        variant="warning"
      />
      <MaintenanceRequestList requests={requests} />
    </div>
  )
}
```

## ðŸ§ª Testing

### Test Structure

```
src/__tests__/
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ property-form.test.tsx
â”‚   â”œâ”€â”€ booking-card.test.tsx
â”‚   â””â”€â”€ revenue-chart.test.tsx
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ dashboard.test.tsx
â”‚   â”œâ”€â”€ properties.test.tsx
â”‚   â””â”€â”€ bookings.test.tsx
â””â”€â”€ utils/
    â”œâ”€â”€ financial-calculations.test.tsx
    â””â”€â”€ booking-helpers.test.tsx
```

### Running Tests

```bash
# Unit tests
bun test

# Integration tests
bun run test:integration

# E2E tests
bun run test:e2e

# Test coverage
bun run test:coverage
```

## ðŸš€ Deployment

### Build Process

```bash
# Build for production
bun run build

# Start production server
bun start
```

### Environment Variables (Production)

```env
NEXTAUTH_URL=https://landlord.yourdomain.com
NEXTAUTH_SECRET=production-secret
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# File upload
NEXT_PUBLIC_UPLOAD_URL=https://api.yourdomain.com/upload
MAX_FILE_SIZE=10485760

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=production-token

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=production-analytics-id
```

## ðŸ“± Mobile Optimization

### Mobile Features

- **Responsive Design**: Optimized for mobile devices
- **Touch Navigation**: Mobile-friendly interactions
- **Image Optimization**: Fast loading property images
- **Offline Support**: Basic offline functionality

## ðŸ”§ Configuration

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ["property-images.com", "uploads.yourdomain.com"],
  },
  experimental: {
    appDir: true,
  },
};
```

### Tailwind Configuration

```javascript
// tailwind.config.ts
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        landlord: {
          primary: "#059669",
          secondary: "#0D9488",
        },
      },
    },
  },
};
```

## ðŸ“Š Performance

### Optimization Strategies

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component
- **Data Caching**: React Query caching
- **Lazy Loading**: Component lazy loading

### Performance Monitoring

- **Core Web Vitals**: Performance metrics
- **User Analytics**: Usage tracking
- **Error Monitoring**: Error tracking and reporting

## ðŸ¤ Contributing

1. Follow the component structure in `src/components/`
2. Use TypeScript for all new code
3. Add tests for new features
4. Follow tenant isolation patterns
5. Update documentation for changes

## ðŸ“š Related Documentation

- [Main README](../../README.md)
- [API Documentation](../api/README.md)
- [Boarder Dashboard](../boarder/README.md)
- [Development Guidelines](../../docs/DEVELOPMENT.md)
