"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  MapPin,
  Home,
  Search,
  Filter,
  Download,
  Star,
  Eye,
  ChevronRight,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import { Button } from "@havenspace/ui";
import { Input } from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@havenspace/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@havenspace/ui";
import { Separator } from "@havenspace/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock history data
const mockBookingHistory = [
  {
    id: "BH-001",
    propertyName: "City Center Dorm",
    propertyImage: "/images/property-1.jpg",
    location: "Makati City",
    roomType: "Single Room",
    landlord: "Luis Tan",
    checkIn: "2024-06-01",
    checkOut: "2024-12-01",
    duration: "6 months",
    monthlyRate: 7000,
    totalPaid: 42000,
    status: "completed",
    rating: 4.5,
    review: "Great place to stay! Very clean and well-maintained.",
  },
  {
    id: "BH-002",
    propertyName: "Student Haven",
    propertyImage: "/images/property-2.jpg",
    location: "Taft Ave, Manila",
    roomType: "Double Room",
    landlord: "Rosa Santos",
    checkIn: "2024-01-15",
    checkOut: "2024-05-31",
    duration: "5 months",
    monthlyRate: 4000,
    totalPaid: 20000,
    status: "completed",
    rating: 4.0,
    review: null,
  },
  {
    id: "BH-003",
    propertyName: "Metro Residences",
    propertyImage: "/images/property-3.jpg",
    location: "Cubao, Quezon City",
    roomType: "Single Room",
    landlord: "Pedro Garcia",
    checkIn: "2023-08-01",
    checkOut: "2023-12-31",
    duration: "5 months",
    monthlyRate: 5000,
    totalPaid: 25000,
    status: "completed",
    rating: 3.5,
    review: "Good value for money. Location is convenient.",
  },
];

const mockPaymentHistory = [
  {
    id: "PH-001",
    propertyName: "City Center Dorm",
    type: "monthly",
    amount: 7000,
    status: "completed",
    date: "2024-11-01",
    method: "GCash",
    period: "November 2024",
  },
  {
    id: "PH-002",
    propertyName: "City Center Dorm",
    type: "monthly",
    amount: 7000,
    status: "completed",
    date: "2024-10-01",
    method: "GCash",
    period: "October 2024",
  },
  {
    id: "PH-003",
    propertyName: "City Center Dorm",
    type: "monthly",
    amount: 7000,
    status: "completed",
    date: "2024-09-01",
    method: "Bank Transfer",
    period: "September 2024",
  },
  {
    id: "PH-004",
    propertyName: "Student Haven",
    type: "monthly",
    amount: 4000,
    status: "completed",
    date: "2024-05-01",
    method: "PayMaya",
    period: "May 2024",
  },
  {
    id: "PH-005",
    propertyName: "Student Haven",
    type: "refund",
    amount: -4000,
    status: "completed",
    date: "2024-06-05",
    method: "Bank Transfer",
    period: "Deposit Refund",
  },
];

const mockActivityLog = [
  {
    id: "AL-001",
    type: "booking",
    title: "Booking Confirmed",
    description: "Your booking at Sunrise Dormitory has been confirmed.",
    timestamp: "2025-01-15T10:30:00",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  {
    id: "AL-002",
    type: "payment",
    title: "Payment Received",
    description: "Payment of ₱5,500 for January 2025 rent received.",
    timestamp: "2025-01-15T10:30:00",
    icon: CreditCard,
    iconColor: "text-blue-500",
  },
  {
    id: "AL-003",
    type: "message",
    title: "New Message",
    description: "John Santos from Sunrise Dormitory sent you a message.",
    timestamp: "2025-01-14T15:45:00",
    icon: AlertCircle,
    iconColor: "text-yellow-500",
  },
  {
    id: "AL-004",
    type: "booking",
    title: "Booking Request Sent",
    description: "You requested to book Green Valley Boarding House.",
    timestamp: "2025-01-12T09:00:00",
    icon: Clock,
    iconColor: "text-orange-500",
  },
  {
    id: "AL-005",
    type: "booking",
    title: "Booking Completed",
    description: "Your stay at City Center Dorm has ended.",
    timestamp: "2024-12-01T00:00:00",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
];

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);

  const selectedBookingData = mockBookingHistory.find(
    (b) => b.id === selectedBooking
  );

  const filteredBookings = mockBookingHistory.filter((booking) => {
    const matchesSearch =
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear =
      yearFilter === "all" ||
      new Date(booking.checkIn).getFullYear().toString() === yearFilter;
    return matchesSearch && matchesYear;
  });

  const filteredPayments = mockPaymentHistory.filter((payment) => {
    const matchesSearch =
      payment.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear =
      yearFilter === "all" ||
      new Date(payment.date).getFullYear().toString() === yearFilter;
    return matchesSearch && matchesYear;
  });

  const totalSpent = mockPaymentHistory
    .filter((p) => p.amount > 0)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunds = Math.abs(
    mockPaymentHistory.filter((p) => p.amount < 0).reduce((sum, p) => sum + p.amount, 0)
  );

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minutes ago`;
      }
      return `${hours} hours ago`;
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return formatDate(timestamp);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            History
          </h1>
          <p className="text-muted-foreground">
            View your booking and payment history.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBookingHistory.length}</div>
            <p className="text-xs text-muted-foreground">Completed bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">Time as boarder</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">All time payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRefunds)}
            </div>
            <p className="text-xs text-muted-foreground">Deposit refunds</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="bookings">Booking History</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[200px]"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[120px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Booking History */}
        <TabsContent value="bookings" className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No booking history</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Your completed bookings will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="h-32 sm:h-auto sm:w-48 bg-muted flex items-center justify-center flex-shrink-0">
                    <Home className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.propertyName}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.location}
                        </p>
                      </div>
                      {booking.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{booking.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{booking.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Room Type</p>
                        <p className="font-medium">{booking.roomType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Rate</p>
                        <p className="font-medium">
                          {formatCurrency(booking.monthlyRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Paid</p>
                        <p className="font-medium text-green-600">
                          {formatCurrency(booking.totalPaid)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </div>

                    {booking.review && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm italic">&quot;{booking.review}&quot;</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(booking.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {!booking.review && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking.id);
                            setShowRatingDialog(true);
                          }}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Leave Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/browse?similar=${booking.id}`}>
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Book Again
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Payment History */}
        <TabsContent value="payments">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          Transaction
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Property
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Period
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Amount
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Method
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-muted/30">
                          <td className="p-4">
                            <p className="font-medium">{payment.id}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {payment.type}
                            </p>
                          </td>
                          <td className="p-4">
                            <p>{payment.propertyName}</p>
                          </td>
                          <td className="p-4">
                            <p>{payment.period}</p>
                          </td>
                          <td className="p-4">
                            <p
                              className={`font-semibold ${
                                payment.amount < 0
                                  ? "text-green-600"
                                  : ""
                              }`}
                            >
                              {payment.amount < 0 ? "+" : ""}
                              {formatCurrency(Math.abs(payment.amount))}
                            </p>
                          </td>
                          <td className="p-4">
                            <p>{payment.method}</p>
                          </td>
                          <td className="p-4">
                            <p>{formatDate(payment.date)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Track all your activities on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityLog.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="relative">
                      <div
                        className={`p-2 rounded-full bg-muted ${activity.iconColor}`}
                      >
                        <activity.icon className="h-4 w-4" />
                      </div>
                      {index !== mockActivityLog.length - 1 && (
                        <div className="absolute left-1/2 top-10 h-full w-px bg-border -translate-x-1/2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog
        open={!!selectedBooking && !showRatingDialog}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedBookingData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBookingData.propertyName}</DialogTitle>
                <DialogDescription>Booking #{selectedBookingData.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedBookingData.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{selectedBookingData.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Landlord</p>
                    <p className="font-medium">{selectedBookingData.landlord}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedBookingData.duration}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">
                      {formatDate(selectedBookingData.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">
                      {formatDate(selectedBookingData.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Rate</p>
                    <p className="font-medium">
                      {formatCurrency(selectedBookingData.monthlyRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(selectedBookingData.totalPaid)}
                    </p>
                  </div>
                </div>
                {selectedBookingData.review && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your Review
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedBookingData.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium">
                          {selectedBookingData.rating}
                        </span>
                      </div>
                      <p className="text-sm italic">
                        &quot;{selectedBookingData.review}&quot;
                      </p>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" asChild>
                  <Link href={`/browse?property=${selectedBookingData.id}`}>
                    View Property
                  </Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
