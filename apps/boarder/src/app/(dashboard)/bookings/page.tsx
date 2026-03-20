"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Home,
  ChevronRight,
  Filter,
  Search,
  Eye,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@havenspace/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@havenspace/shared/ui";
import { Separator } from "@havenspace/shared/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

// Mock bookings data
const mockBookings = [
  {
    id: "1",
    propertyName: "Sunrise Dormitory",
    propertyImage: "/images/property-1.jpg",
    location: "Sampaloc, Manila",
    roomType: "Single Room",
    landlord: "John Santos",
    status: "active",
    checkIn: "2025-01-15",
    checkOut: "2025-07-15",
    monthlyRate: 5500,
    depositPaid: 11000,
    nextPayment: "2025-02-01",
    requestedAt: "2025-01-10",
  },
  {
    id: "2",
    propertyName: "Green Valley Boarding House",
    propertyImage: "/images/property-2.jpg",
    location: "Diliman, Quezon City",
    roomType: "Double Room",
    landlord: "Maria Garcia",
    status: "pending",
    checkIn: "2025-02-01",
    checkOut: "2025-08-01",
    monthlyRate: 6500,
    depositPaid: 0,
    nextPayment: null,
    requestedAt: "2025-01-18",
  },
  {
    id: "3",
    propertyName: "Metro Boarding House",
    propertyImage: "/images/property-3.jpg",
    location: "Cubao, Quezon City",
    roomType: "Single Room",
    landlord: "Pedro Reyes",
    status: "confirmed",
    checkIn: "2025-02-15",
    checkOut: "2025-08-15",
    monthlyRate: 5000,
    depositPaid: 10000,
    nextPayment: "2025-02-15",
    requestedAt: "2025-01-12",
  },
  {
    id: "4",
    propertyName: "University Residence",
    propertyImage: "/images/property-4.jpg",
    location: "España, Manila",
    roomType: "Studio",
    landlord: "Ana Cruz",
    status: "cancelled",
    checkIn: "2025-01-01",
    checkOut: "2025-06-01",
    monthlyRate: 4500,
    depositPaid: 0,
    nextPayment: null,
    requestedAt: "2024-12-20",
  },
  {
    id: "5",
    propertyName: "City Center Dorm",
    propertyImage: "/images/property-5.jpg",
    location: "Makati City",
    roomType: "Single Room",
    landlord: "Luis Tan",
    status: "completed",
    checkIn: "2024-06-01",
    checkOut: "2024-12-01",
    monthlyRate: 7000,
    depositPaid: 14000,
    nextPayment: null,
    requestedAt: "2024-05-15",
  },
];

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Loader className="h-4 w-4" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: <X className="h-4 w-4" />,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
    icon: <CheckCircle className="h-4 w-4" />,
  },
};

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeBookings = filteredBookings.filter(
    (b) => b.status === "active" || b.status === "confirmed"
  );
  const pendingBookings = filteredBookings.filter(
    (b) => b.status === "pending"
  );
  const pastBookings = filteredBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const selectedBookingData = mockBookings.find(
    (b) => b.id === selectedBooking
  );

  const handleCancelBooking = () => {
    console.log("Cancelling booking:", selectedBooking);
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const BookingCard = ({ booking }: { booking: (typeof mockBookings)[0] }) => (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="bg-muted flex h-32 flex-shrink-0 items-center justify-center sm:h-auto sm:w-40">
          <Home className="text-muted-foreground h-10 w-10" />
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="font-semibold">{booking.propertyName}</h3>
                <Badge className={statusConfig[booking.status]?.color}>
                  {statusConfig[booking.status]?.icon}
                  <span className="ml-1">
                    {statusConfig[booking.status]?.label}
                  </span>
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                {booking.location}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {formatCurrency(booking.monthlyRate)}
              </p>
              <p className="text-muted-foreground text-xs">/month</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Room Type</p>
              <p className="font-medium">{booking.roomType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Landlord</p>
              <p className="font-medium">{booking.landlord}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-in</p>
              <p className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {formatDate(booking.checkIn)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Check-out</p>
              <p className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {formatDate(booking.checkOut)}
              </p>
            </div>
          </div>

          {booking.nextPayment && (
            <div className="bg-muted/50 mt-4 rounded-lg p-3">
              <p className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Next payment due: </span>
                <span className="font-medium">
                  {formatDate(booking.nextPayment)}
                </span>
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedBooking(booking.id)}
            >
              <Eye className="mr-1 h-4 w-4" />
              View Details
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/messages?landlord=${booking.landlord}`}>
                <MessageSquare className="mr-1 h-4 w-4" />
                Message
              </Link>
            </Button>
            {(booking.status === "pending" ||
              booking.status === "confirmed") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => {
                  setSelectedBooking(booking.id);
                  setShowCancelDialog(true);
                }}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage your booking requests and reservations.
          </p>
        </div>
        <Button asChild>
          <Link href="/browse">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Tabs */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">
            Current ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {activeBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">No active bookings</h3>
                <p className="text-muted-foreground mt-2 text-center">
                  You don&apos;t have any active bookings at the moment.
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/browse">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">No pending requests</h3>
                <p className="text-muted-foreground mt-2 text-center">
                  All your booking requests have been processed.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">No past bookings</h3>
                <p className="text-muted-foreground mt-2 text-center">
                  Your booking history will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog
        open={!!selectedBooking && !showCancelDialog}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedBookingData && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBookingData?.propertyName}</DialogTitle>
                <DialogDescription>
                  Booking ID: #{selectedBookingData?.id}
                </DialogDescription>
              </DialogHeader>
              {selectedBookingData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const status = statusConfig[selectedBookingData.status];
                      if (!status) return null;
                      return (
                        <Badge className={status.color}>
                          {status.icon}
                          <span className="ml-1">{status.label}</span>
                        </Badge>
                      );
                    })()}
                    <span className="text-muted-foreground text-sm">
                      Requested on {formatDate(selectedBookingData.requestedAt)}
                    </span>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Location</p>
                      <p className="flex items-center gap-1 font-medium">
                        <MapPin className="h-4 w-4" />
                        {selectedBookingData?.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Room Type</p>
                      <p className="font-medium">
                        {selectedBookingData?.roomType}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Landlord</p>
                      <p className="font-medium">
                        {selectedBookingData?.landlord}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Monthly Rate
                      </p>
                      <p className="font-medium">
                        {formatCurrency(selectedBookingData?.monthlyRate || 0)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Check-in Date
                      </p>
                      <p className="font-medium">
                        {formatDate(selectedBookingData?.checkIn || "")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Check-out Date
                      </p>
                      <p className="font-medium">
                        {formatDate(selectedBookingData?.checkOut || "")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Deposit Paid
                      </p>
                      <p className="font-medium">
                        {formatCurrency(selectedBookingData?.depositPaid || 0)}
                      </p>
                    </div>
                    {selectedBookingData?.nextPayment && (
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Next Payment
                        </p>
                        <p className="font-medium text-orange-600">
                          {formatDate(selectedBookingData.nextPayment)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" asChild>
                  <Link
                    href={`/messages?landlord=${selectedBookingData?.landlord}`}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Landlord
                  </Link>
                </Button>
                {selectedBookingData?.status === "active" && (
                  <Button asChild>
                    <Link href="/payments">Make Payment</Link>
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBookingData && (
            <div className="py-4">
              <p className="font-medium">{selectedBookingData.propertyName}</p>
              <p className="text-muted-foreground text-sm">
                Check-in: {formatDate(selectedBookingData.checkIn)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
