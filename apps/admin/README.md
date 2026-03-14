# Admin Dashboard

The platform administration interface for the Haven Space platform. This application provides system administrators with comprehensive tools to manage users, review landlord applications, moderate content, and oversee platform operations.

## ⚙️ Overview

**Port**: 3002  
**URL**: http://localhost:3002  
**Purpose**: Platform administration and oversight

## ✨ Features

### User Management
- **User Overview**: View all platform users
- **Role Management**: Assign and modify user roles
- **Account Status**: Activate, suspend, or deactivate accounts
- **User Analytics**: User behavior and engagement metrics

### Landlord Management
- **Application Review**: Review and approve/reject landlord applications
- **Verification Process**: Document verification and background checks
- **Performance Monitoring**: Track landlord performance metrics
- **Compliance Management**: Ensure policy compliance

### Content Moderation
- **Listing Review**: Moderate property listings
- **Content Flagging**: Handle reported content
- **Image Moderation**: Review uploaded images
- **Policy Enforcement**: Enforce platform policies

### Platform Analytics
- **System Metrics**: Platform performance and usage
- **Financial Overview**: Revenue and transaction monitoring
- **Growth Analytics**: User acquisition and retention
- **Performance Reports**: Detailed analytics reports

### System Administration
- **Configuration Management**: Platform settings and configuration
- **Security Monitoring**: Security alerts and monitoring
- **Backup Management**: Data backup and recovery
- **Maintenance Tools**: System maintenance utilities

## 🏗️ Architecture

### Pages Structure
```
src/app/
├── page.tsx                           # Dashboard redirect
└── dashboard/
    ├── layout.tsx                     # Admin layout
    ├── page.tsx                       # Main dashboard
    ├── users/page.tsx                 # User management
    ├── applications/page.tsx          # Landlord applications
    ├── listings/page.tsx              # Property listings moderation
    ├── bookings/page.tsx              # Booking oversight
    ├── payments/page.tsx              # Payment monitoring
    ├── reports/page.tsx               # Analytics and reports
    └── settings/page.tsx              # System settings
```

### Components Structure
```
src/components/
├── layout/
│   ├── dashboard-layout.tsx           # Admin layout
│   ├── header.tsx                     # Admin header
│   ├── sidebar.tsx                    # Navigation sidebar
│   └── index.ts                       # Layout exports
└── ui/
    ├── avatar.tsx                     # User avatar
    ├── collapsible.tsx                # Collapsible sections
    ├── dropdown-menu.tsx              # Dropdown menus
    ├── scroll-area.tsx                # Scrollable areas
    └── index.ts                       # UI exports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun package manager
- Admin account with appropriate permissions
- API server running

### Development

```bash
# Start development server
bun --filter @bhms/admin dev

# Or from app directory
cd apps/admin
bun dev
```

The application will be available at http://localhost:3002

### Environment Variables

Create `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_EMAILS=superadmin@yourdomain.com

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## 🔐 Authentication & Authorization

### Access Control
- **Role Requirement**: User must have `admin` role
- **Permission Levels**: Different admin permission levels
- **Audit Logging**: All admin actions are logged

### Route Protection
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth
    
    // Check if user is an admin
    if (token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    // Check specific permissions for sensitive operations
    if (pathname.includes('/settings') && !token?.permissions?.includes('system_config')) {
      return NextResponse.redirect(new URL('/insufficient-permissions', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)
```

### Permission System
```typescript
interface AdminPermissions {
  user_management: boolean
  landlord_approval: boolean
  content_moderation: boolean
  system_config: boolean
  financial_oversight: boolean
  analytics_access: boolean
}
```

## 👥 User Management

### User Overview
- **User List**: Paginated list of all users
- **Search & Filter**: Find users by various criteria
- **Bulk Operations**: Perform actions on multiple users
- **User Details**: Comprehensive user information

### User Management Component
```typescript
const UserManagement = () => {
  const { data: users, isLoading } = api.admin.getUsers.useQuery({
    page: currentPage,
    limit: 50,
    filters: searchFilters
  })
  
  const updateUserStatus = api.admin.updateUserStatus.useMutation()
  
  const handleStatusChange = (userId: string, status: UserStatus) => {
    updateUserStatus.mutate({
      userId,
      status,
      reason: 'Admin action'
    })
  }
  
  return (
    <div className="user-management">
      <UserFilters onFiltersChange={setSearchFilters} />
      <UserTable
        users={users}
        onStatusChange={handleStatusChange}
        loading={isLoading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={users?.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
```

## 🏠 Landlord Application Review

### Application Process
1. **Application Submission**: Landlord submits application
2. **Document Review**: Admin reviews submitted documents
3. **Background Check**: Verify landlord credentials
4. **Decision Making**: Approve or reject with feedback
5. **Notification**: Inform landlord of decision

### Application Review Interface
```typescript
const ApplicationReview = ({ application }: { application: LandlordApplication }) => {
  const approveApplication = api.admin.approveApplication.useMutation()
  const rejectApplication = api.admin.rejectApplication.useMutation()
  
  const handleApprove = () => {
    approveApplication.mutate({
      applicationId: application.id,
      notes: 'Application approved after document verification'
    })
  }
  
  const handleReject = (reason: string) => {
    rejectApplication.mutate({
      applicationId: application.id,
      reason,
      feedback: 'Please resubmit with correct documentation'
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <h3>{application.user.name}</h3>
        <Badge>{application.status}</Badge>
      </CardHeader>
      <CardContent>
        <div className="application-details">
          <p>Business: {application.businessName}</p>
          <p>Tax ID: {application.taxId}</p>
          <p>Submitted: {application.createdAt}</p>
        </div>
        <DocumentViewer documents={application.documents} />
        <div className="actions">
          <Button onClick={handleApprove}>Approve</Button>
          <Button variant="destructive" onClick={() => handleReject('Incomplete documents')}>
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 📊 Platform Analytics

### Dashboard Metrics
- **User Growth**: Registration and activation trends
- **Revenue Analytics**: Platform revenue and commission tracking
- **Booking Analytics**: Booking patterns and success rates
- **Performance Metrics**: System performance and uptime

### Analytics Dashboard
```typescript
const AnalyticsDashboard = () => {
  const { data: stats } = api.admin.getPlatformStats.useQuery()
  
  return (
    <div className="analytics-dashboard">
      <div className="stats-grid">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change={stats?.userGrowth}
        />
        <StatsCard
          title="Active Landlords"
          value={stats?.activeLandlords || 0}
          change={stats?.landlordGrowth}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats?.monthlyRevenue || 0}`}
          change={stats?.revenueGrowth}
        />
        <StatsCard
          title="Platform Commission"
          value={`$${stats?.platformCommission || 0}`}
        />
      </div>
      
      <div className="charts-grid">
        <UserGrowthChart data={stats?.userGrowthData} />
        <RevenueChart data={stats?.revenueData} />
        <BookingTrendsChart data={stats?.bookingTrends} />
        <GeographicDistribution data={stats?.geoData} />
      </div>
    </div>
  )
}
```

## 🛡️ Content Moderation

### Moderation Features
- **Automated Flagging**: AI-powered content detection
- **Manual Review**: Human moderation workflow
- **Report Handling**: User-reported content management
- **Policy Enforcement**: Automated policy compliance

### Moderation Queue
```typescript
const ModerationQueue = () => {
  const { data: flaggedContent } = api.admin.getFlaggedContent.useQuery()
  const moderateContent = api.admin.moderateContent.useMutation()
  
  const handleModeration = (contentId: string, action: 'approve' | 'reject' | 'flag') => {
    moderateContent.mutate({
      contentId,
      action,
      moderatorNotes: 'Reviewed by admin'
    })
  }
  
  return (
    <div className="moderation-queue">
      {flaggedContent?.map(content => (
        <ModerationCard
          key={content.id}
          content={content}
          onModerate={handleModeration}
        />
      ))}
    </div>
  )
}
```

## 💰 Financial Oversight

### Financial Monitoring
- **Transaction Tracking**: Monitor all platform transactions
- **Commission Management**: Track platform commissions
- **Payout Oversight**: Manage landlord payouts
- **Financial Reports**: Generate financial reports

### Financial Dashboard
```typescript
const FinancialOverview = () => {
  const { data: financials } = api.admin.getFinancialOverview.useQuery()
  
  return (
    <div className="financial-overview">
      <div className="financial-stats">
        <StatsCard
          title="Total Revenue"
          value={`$${financials?.totalRevenue || 0}`}
        />
        <StatsCard
          title="Platform Commission"
          value={`$${financials?.platformCommission || 0}`}
        />
        <StatsCard
          title="Pending Payouts"
          value={`$${financials?.pendingPayouts || 0}`}
        />
      </div>
      
      <TransactionTable transactions={financials?.recentTransactions} />
      <PayoutQueue payouts={financials?.pendingPayoutRequests} />
    </div>
  )
}
```

## 🔧 System Configuration

### Configuration Management
- **Platform Settings**: Core platform configuration
- **Feature Flags**: Enable/disable features
- **Rate Limits**: API rate limiting configuration
- **Maintenance Mode**: System maintenance controls

### Settings Interface
```typescript
const SystemSettings = () => {
  const { data: settings } = api.admin.getSystemSettings.useQuery()
  const updateSettings = api.admin.updateSystemSettings.useMutation()
  
  const handleSettingsUpdate = (newSettings: SystemSettings) => {
    updateSettings.mutate(newSettings)
  }
  
  return (
    <div className="system-settings">
      <SettingsSection title="Platform Configuration">
        <SettingField
          label="Platform Name"
          value={settings?.platformName}
          onChange={(value) => handleSettingsUpdate({ ...settings, platformName: value })}
        />
        <SettingField
          label="Commission Rate"
          value={settings?.commissionRate}
          type="number"
          onChange={(value) => handleSettingsUpdate({ ...settings, commissionRate: value })}
        />
      </SettingsSection>
      
      <SettingsSection title="Feature Flags">
        <ToggleField
          label="Enable New Registrations"
          checked={settings?.allowRegistrations}
          onChange={(checked) => handleSettingsUpdate({ ...settings, allowRegistrations: checked })}
        />
        <ToggleField
          label="Maintenance Mode"
          checked={settings?.maintenanceMode}
          onChange={(checked) => handleSettingsUpdate({ ...settings, maintenanceMode: checked })}
        />
      </SettingsSection>
    </div>
  )
}
```

## 📈 Reporting System

### Report Types
- **User Reports**: User activity and engagement
- **Financial Reports**: Revenue and transaction reports
- **Performance Reports**: System performance metrics
- **Compliance Reports**: Regulatory compliance reports

### Report Generation
```typescript
const ReportGenerator = () => {
  const generateReport = api.admin.generateReport.useMutation()
  
  const handleGenerateReport = (type: ReportType, dateRange: DateRange) => {
    generateReport.mutate({
      type,
      dateRange,
      format: 'pdf'
    })
  }
  
  return (
    <div className="report-generator">
      <ReportTypeSelector onSelect={setReportType} />
      <DateRangePicker onSelect={setDateRange} />
      <Button onClick={() => handleGenerateReport(reportType, dateRange)}>
        Generate Report
      </Button>
    </div>
  )
}
```

## 🧪 Testing

### Test Structure
```
src/__tests__/
├── components/
│   ├── user-table.test.tsx
│   ├── application-review.test.tsx
│   └── moderation-queue.test.tsx
├── pages/
│   ├── dashboard.test.tsx
│   ├── users.test.tsx
│   └── applications.test.tsx
└── utils/
    ├── admin-helpers.test.tsx
    └── report-generators.test.tsx
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
NEXTAUTH_URL=https://admin.yourdomain.com
NEXTAUTH_SECRET=production-secret
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Admin configuration
ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_EMAILS=superadmin@yourdomain.com

# Monitoring
SENTRY_DSN=production-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=production-analytics-id
```

## 🔒 Security Considerations

### Security Features
- **Multi-factor Authentication**: Required for admin accounts
- **IP Whitelisting**: Restrict admin access by IP
- **Audit Logging**: Log all admin actions
- **Session Management**: Secure session handling

### Audit Trail
```typescript
const auditLog = {
  userId: admin.id,
  action: 'USER_STATUS_CHANGED',
  targetId: user.id,
  details: {
    oldStatus: 'active',
    newStatus: 'suspended',
    reason: 'Policy violation'
  },
  timestamp: new Date(),
  ipAddress: req.ip
}
```

## 📊 Performance

### Optimization Strategies
- **Data Pagination**: Efficient data loading
- **Caching**: Redis caching for frequently accessed data
- **Background Jobs**: Async processing for heavy operations
- **Database Optimization**: Optimized queries and indexes

## 🤝 Contributing

1. Follow the component structure in `src/components/`
2. Use TypeScript for all new code
3. Add comprehensive tests for admin features
4. Follow security best practices
5. Document all admin operations

## 📚 Related Documentation

- [Main README](../../README.md)
- [API Documentation](../api/README.md)
- [Security Guidelines](../../docs/SECURITY.md)
- [Development Guidelines](../../docs/DEVELOPMENT.md)