# Landlord Portal

The landlord management interface for the Haven Space platform. This application provides approved landlords with comprehensive tools to manage their properties, handle bookings, communicate with boarders, and track earnings.

## 🏢 Overview

**Port**: 3005  
**URL**: http://localhost:3005  
**Purpose**: Property management and landlord operations

## ✨ Features

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

## 🏗️ Architecture

### Pages Structure
```
src/app/
├── page.tsx                           # Dashboard redirect
└── (admin)/
    ├── layout.tsx                     # Admin layout
    ├── dashboard/page.tsx             # Main dashboard
    ├── properties/
    │   ├── page.tsx                   # Property list
    │   ├── new/page.tsx              # Create property
    │   └── map/page.tsx              # Property map view
    ├── bookings/page.tsx              # Booking management
    ├── messages/page.tsx              # Communication center
    ├── earnings/page.tsx              # Financial overview
    ├── payments/page.tsx              # Payment history
    ├── tenants/
    │   ├── page.tsx                   # Tenant list
    │   └── new/page.tsx              # Add tenant
    ├── maintenance/page.tsx           # Maintenance requests
    ├── notifications/page.tsx         # Notification center
    └── settings/page.tsx              # Account settings
```

### Components Structure
```
src/components/
├── dashboard/
│   ├── stats-card.tsx                 # Dashboard statistics
│   ├── revenue-chart.tsx              # Revenue visualization
│   ├── occupancy-chart.tsx            # Occupancy metrics
│   ├── recent-payments.tsx            # Payment history
│   └── upcoming-leases.tsx            # Upcoming bookings
├── layout/
│   ├── dashboard-layout.tsx           # Main layout
│   ├── header.tsx                     # Dashboard header
│   ├── sidebar.tsx                    # Navigation sidebar
│   └── index.ts                       # Layout exports
└── ui/
    ├── avatar.tsx                     # User avatar
    ├── collapsible.tsx                # Collapsible sections
    ├── dropdown-menu.tsx              # Dropdown menus
    └── index.ts                       # UI exports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun package manager
- Approved landlord account
- API server running

### Development

```bash
# Start development server
bun --filter @bhms/landlord dev

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

## 🔐 Authentication & Authorization

### Access Control
- **Role Requirement**: User must have `landlord` role
- **Status Check**: Account must be `approved`
- **Tenant Isolation**: Access only to own properties and data

### Route Protection
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth
    
    // Check if user is an approved landlord
    if (token?.role !== 'landlord' || token?.status !== 'approved') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)
```

### Data Isolation
```typescript
// All queries automatically filter by landlord ID
const getProperties = async (landlordId: string) => {
  return await db.boardingHouse.findMany({
    where: {
      landlordId: landlordId  // Tenant isolation
    }
  })
}
```

## 🏠 Property Management

### Property Creation
```typescript
interface PropertyData {
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  pricePerMonth: number
  totalRooms: number
  availableRooms: number
  amenities: string[]
  images: File[]
  rules?: string
  policies?: string
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

## 📅 Booking Management

### Booking Workflow
1. **Request Received**: Boarder submits booking request
2. **Review Process**: Landlord reviews request details
3. **Decision Making**: Approve or reject with reason
4. **Payment Processing**: Handle approved booking payments
5. **Check-in Management**: Coordinate guest arrival

### Booking States
```typescript
type BookingStatus = 
  | 'pending'     // Awaiting landlord decision
  | 'approved'    // Approved by landlord
  | 'confirmed'   // Payment completed
  | 'rejected'    // Declined by landlord
  | 'cancelled'   // Cancelled
  | 'active'      // Currently occupied
  | 'completed'   // Stay finished
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

## 💰 Financial Management

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

## 📊 Analytics & Reporting

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

## 💬 Communication System

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

## 🔧 Maintenance Management

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

## 🧪 Testing

### Test Structure
```
src/__tests__/
├── components/
│   ├── property-form.test.tsx
│   ├── booking-card.test.tsx
│   └── revenue-chart.test.tsx
├── pages/
│   ├── dashboard.test.tsx
│   ├── properties.test.tsx
│   └── bookings.test.tsx
└── utils/
    ├── financial-calculations.test.tsx
    └── booking-helpers.test.tsx
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

## 🚀 Deployment

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

## 📱 Mobile Optimization

### Mobile Features
- **Responsive Design**: Optimized for mobile devices
- **Touch Navigation**: Mobile-friendly interactions
- **Image Optimization**: Fast loading property images
- **Offline Support**: Basic offline functionality

## 🔧 Configuration

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['property-images.com', 'uploads.yourdomain.com'],
  },
  experimental: {
    appDir: true,
  }
}
```

### Tailwind Configuration
```javascript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        landlord: {
          primary: '#059669',
          secondary: '#0D9488'
        }
      }
    }
  }
}
```

## 📊 Performance

### Optimization Strategies
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component
- **Data Caching**: React Query caching
- **Lazy Loading**: Component lazy loading

### Performance Monitoring
- **Core Web Vitals**: Performance metrics
- **User Analytics**: Usage tracking
- **Error Monitoring**: Error tracking and reporting

## 🤝 Contributing

1. Follow the component structure in `src/components/`
2. Use TypeScript for all new code
3. Add tests for new features
4. Follow tenant isolation patterns
5. Update documentation for changes

## 📚 Related Documentation

- [Main README](../../README.md)
- [API Documentation](../api/README.md)
- [Boarder Dashboard](../boarder/README.md)
- [Development Guidelines](../../docs/DEVELOPMENT.md)