"use client";

import {
  Building2,
  DoorOpen,
  CalendarCheck,
  MessageSquare,
  Eye,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useProperty } from "@/lib/property-context";
import { getDashboardStats } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  StatsCard,
  RevenueChart,
  OccupancyChart,
} from "@/components/dashboard";
import { Skeleton, Button, Badge, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@havenspace/ui";

export default function DashboardPage() {
  const { currentProperty, isLoading } = useProperty();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = getDashboardStats(currentProperty?.id);

  // Mock pending booking requests
  const pendingBookings = [
    { id: 1, name: "Maria Santos", property: "Sunrise Residences", room: "Room 205", date: "2024-01-15", status: "pending" },
    { id: 2, name: "Juan Dela Cruz", property: "Sunrise Residences", room: "Room 102", date: "2024-01-14", status: "pending" },
    { id: 3, name: "Ana Garcia", property: "Green Valley BH", room: "Room 301", date: "2024-01-14", status: "pending" },
  ];

  // Mock recent messages
  const recentMessages = [
    { id: 1, from: "Carlos Reyes", message: "Is the room still available?", time: "2 hours ago", unread: true },
    { id: 2, from: "Lisa Chen", message: "When can I schedule a viewing?", time: "5 hours ago", unread: true },
    { id: 3, from: "Mark Johnson", message: "Thanks for the information!", time: "1 day ago", unread: false },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your properties.
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Building2 className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={3}
          description="Active listings"
          icon={Building2}
        />
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
          description={`${stats.occupancyRate}% occupancy rate`}
          icon={DoorOpen}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Pending Bookings"
          value={pendingBookings.length}
          description="Awaiting your response"
          icon={CalendarCheck}
          className={pendingBookings.length > 0 ? "border-yellow-500/50" : ""}
        />
        <StatsCard
          title="This Month&apos;s Earnings"
          value={formatCurrency(stats.monthlyRevenue)}
          description="+12% from last month"
          icon={Wallet}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      {/* Pending Booking Requests & Messages */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Pending Booking Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Pending Booking Requests</CardTitle>
              <CardDescription>Review and respond to booking requests</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/bookings/pending">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.property} • {booking.room}
                    </p>
                    <p className="text-xs text-muted-foreground">Requested: {booking.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Decline</Button>
                    <Button size="sm">Accept</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
              <CardDescription>Communication with potential boarders</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium">{msg.from.charAt(0)}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{msg.from}</p>
                      {msg.unread && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart propertyId={currentProperty?.id} />
        <OccupancyChart propertyId={currentProperty?.id} />
      </div>

      {/* Property Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>Quick overview of your listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Sunrise Residences", occupancy: 85, revenue: 45000, views: 234 },
              { name: "Green Valley BH", occupancy: 70, revenue: 32000, views: 189 },
              { name: "Metro Living Spaces", occupancy: 95, revenue: 58000, views: 312 },
            ].map((property) => (
              <div key={property.name} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{property.name}</h4>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/properties/${property.name.toLowerCase().replace(/\s/g, '-')}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">{property.occupancy}%</p>
                    <p className="text-xs text-muted-foreground">Occupancy</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">₱{(property.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{property.views}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="col-span-2 h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  );
}
