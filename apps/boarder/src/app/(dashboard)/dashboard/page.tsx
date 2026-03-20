"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Home,
  Bookmark,
  Calendar,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  MapPin,
  Bell,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { Button } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import { formatCurrency } from "@/lib/utils";

// Mock data
const stats = [
  {
    title: "Active Bookings",
    value: "2",
    description: "Current reservations",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Saved Listings",
    value: "8",
    description: "Bookmarked properties",
    icon: Bookmark,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Unread Messages",
    value: "3",
    description: "New conversations",
    icon: MessageSquare,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Spent",
    value: formatCurrency(45000),
    description: "This month",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

const recentBookings = [
  {
    id: "1",
    propertyName: "Sunrise Dormitory",
    location: "Sampaloc, Manila",
    status: "active",
    checkIn: "Jan 15, 2025",
    monthlyRate: 5500,
    image: "/images/property-1.jpg",
  },
  {
    id: "2",
    propertyName: "Green Valley Boarding House",
    location: "Diliman, Quezon City",
    status: "pending",
    checkIn: "Feb 1, 2025",
    monthlyRate: 6500,
    image: "/images/property-2.jpg",
  },
];

const savedListings = [
  {
    id: "1",
    name: "University Residence",
    location: "España, Manila",
    price: 4500,
    rating: 4.8,
    image: "/images/listing-1.jpg",
  },
  {
    id: "2",
    name: "Metro Boarding House",
    location: "Cubao, Quezon City",
    price: 5000,
    rating: 4.5,
    image: "/images/listing-2.jpg",
  },
  {
    id: "3",
    name: "Cozy Student Dorm",
    location: "Taft Ave, Manila",
    price: 5500,
    rating: 4.7,
    image: "/images/listing-3.jpg",
  },
];

const recentMessages = [
  {
    id: "1",
    from: "John (Sunrise Dormitory)",
    message: "Your payment has been received. Thank you!",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    from: "Maria (Green Valley BH)",
    message: "The room is ready for your viewing tomorrow.",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: "3",
    from: "Support Team",
    message: "Welcome to Haven Space! Let us know if you need help.",
    time: "1 day ago",
    unread: false,
  },
];

const upcomingPayments = [
  {
    id: "1",
    property: "Sunrise Dormitory",
    amount: 5500,
    dueDate: "Jan 31, 2025",
    status: "upcoming",
  },
  {
    id: "2",
    property: "Green Valley Boarding House",
    amount: 6500,
    dueDate: "Feb 1, 2025",
    status: "pending",
  },
];

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      upcoming: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={styles[status] || styles.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {greeting}, Juan! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your bookings today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/browse">
              <Search className="mr-2 h-4 w-4" />
              Browse Listings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/bookings">
              <Calendar className="mr-2 h-4 w-4" />
              My Bookings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} ${stat.color} rounded-full p-2`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/bookings">
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg">
                  <Home className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-semibold">
                      {booking.propertyName}
                    </h4>
                    {getStatusBadge(booking.status)}
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    {booking.location}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Check-in: {booking.checkIn}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(booking.monthlyRate)}
                  </p>
                  <p className="text-muted-foreground text-xs">/month</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Upcoming Payments
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/payments">
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{payment.property}</p>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    Due: {payment.dueDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(payment.amount)}
                  </p>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline" asChild>
              <Link href="/payments">Pay Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Saved Listings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Saved Listings
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/saved">
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {savedListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/browse/${listing.id}`}
                  className="group overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
                >
                  <div className="bg-muted flex h-24 items-center justify-center">
                    <Home className="text-muted-foreground h-8 w-8 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="p-3">
                    <h4 className="truncate text-sm font-medium">
                      {listing.name}
                    </h4>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {formatCurrency(listing.price)}
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {listing.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/messages">
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.map((message) => (
              <Link
                key={message.id}
                href={`/messages/${message.id}`}
                className="hover:bg-accent block rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {message.from}
                      </p>
                      {message.unread && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {message.message}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {message.time}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/browse" className="flex flex-col items-center gap-2">
                <Search className="h-5 w-5" />
                <span>Search Properties</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link
                href="/profile"
                className="flex flex-col items-center gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Update Profile</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link
                href="/history"
                className="flex flex-col items-center gap-2"
              >
                <Clock className="h-5 w-5" />
                <span>View History</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link
                href="/settings"
                className="flex flex-col items-center gap-2"
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
