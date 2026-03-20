"use client";

import * as React from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  User,
  Filter,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Separator,
} from "@havenspace/shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  cn,
  formatDate,
  formatCurrency,
  getInitials,
  getRelativeTime,
  formatDateTime,
} from "@/lib/utils";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

interface BookingData {
  id: string;
  listing: {
    id: string;
    title: string;
    address: string;
    landlord: string;
  };
  boarder: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
  };
  room: string;
  monthlyRent: number;
  status: BookingStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  paymentStatus: "paid" | "pending" | "overdue";
}

// Mock bookings data
const mockBookings: BookingData[] = [
  {
    id: "BK001",
    listing: {
      id: "l1",
      title: "Sunny View Boarding House",
      address: "123 Main Street, Manila",
      landlord: "Maria Santos",
    },
    boarder: {
      id: "b1",
      name: "Juan Cruz",
      email: "juan.cruz@example.com",
      phone: "+63 918 234 5678",
      avatar: null,
    },
    room: "Room 101",
    monthlyRent: 5000,
    status: "active",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    endDate: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 50),
    paymentStatus: "paid",
  },
  {
    id: "BK002",
    listing: {
      id: "l2",
      title: "Green Residence Dormitory",
      address: "456 Oak Avenue, Quezon City",
      landlord: "Carlos Tan",
    },
    boarder: {
      id: "b2",
      name: "Sofia Mendoza",
      email: "sofia.mendoza@example.com",
      phone: "+63 919 345 6789",
      avatar: null,
    },
    room: "Room 205",
    monthlyRent: 4500,
    status: "pending",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    endDate: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    paymentStatus: "pending",
  },
  {
    id: "BK003",
    listing: {
      id: "l1",
      title: "Sunny View Boarding House",
      address: "123 Main Street, Manila",
      landlord: "Maria Santos",
    },
    boarder: {
      id: "b3",
      name: "Pedro Garcia",
      email: "pedro.garcia@example.com",
      phone: "+63 920 456 7890",
      avatar: null,
    },
    room: "Room 102",
    monthlyRent: 5000,
    status: "confirmed",
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    endDate: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    paymentStatus: "paid",
  },
  {
    id: "BK004",
    listing: {
      id: "l3",
      title: "Premium Suites Manila",
      address: "321 Elm Street, Pasig",
      landlord: "Ana Reyes",
    },
    boarder: {
      id: "b4",
      name: "Lisa Tan",
      email: "lisa.tan@example.com",
      phone: "+63 921 567 8901",
      avatar: null,
    },
    room: "Suite A",
    monthlyRent: 8000,
    status: "completed",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 185),
    paymentStatus: "paid",
  },
  {
    id: "BK005",
    listing: {
      id: "l4",
      title: "Student Housing Complex",
      address: "654 Maple Drive, Taguig",
      landlord: "Carlos Tan",
    },
    boarder: {
      id: "b5",
      name: "Mark Santos",
      email: "mark.santos@example.com",
      phone: "+63 922 678 9012",
      avatar: null,
    },
    room: "Room 310",
    monthlyRent: 4000,
    status: "cancelled",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    endDate: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    paymentStatus: "pending",
  },
  {
    id: "BK006",
    listing: {
      id: "l2",
      title: "Green Residence Dormitory",
      address: "456 Oak Avenue, Quezon City",
      landlord: "Carlos Tan",
    },
    boarder: {
      id: "b6",
      name: "Anna Lee",
      email: "anna.lee@example.com",
      phone: "+63 923 789 0123",
      avatar: null,
    },
    room: "Room 108",
    monthlyRent: 4500,
    status: "active",
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    endDate: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 95),
    paymentStatus: "overdue",
  },
];

const statusColors: Record<BookingStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const paymentStatusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusIcons: Record<
  BookingStatus,
  React.ComponentType<{ className?: string }>
> = {
  pending: Clock,
  confirmed: CalendarCheck,
  active: CheckCircle,
  completed: CheckCircle,
  cancelled: CalendarX,
};

export default function BookingsPage() {
  const [filter, setFilter] = React.useState<"all" | BookingStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedBooking, setSelectedBooking] =
    React.useState<BookingData | null>(null);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.boarder.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const bookingCounts = {
    all: mockBookings.length,
    pending: mockBookings.filter((b) => b.status === "pending").length,
    confirmed: mockBookings.filter((b) => b.status === "confirmed").length,
    active: mockBookings.filter((b) => b.status === "active").length,
    completed: mockBookings.filter((b) => b.status === "completed").length,
    cancelled: mockBookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bookings Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor all bookings across the platform
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingCounts.all}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CalendarCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingCounts.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingCounts.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <CalendarX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingCounts.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as typeof filter)}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search bookings..."
                className="w-full pl-9 md:w-72"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Boarder</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => {
                  const StatusIcon = statusIcons[booking.status];
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">
                        {booking.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(booking.boarder.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {booking.boarder.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {booking.boarder.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="line-clamp-1 text-sm font-medium">
                            {booking.listing.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {booking.listing.landlord}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{booking.room}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(booking.monthlyRent)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            statusColors[booking.status]
                          )}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            paymentStatusColors[booking.paymentStatus]
                          )}
                        >
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(booking.startDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedBooking.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Badge className={cn(statusColors[selectedBooking.status])}>
                    {selectedBooking.status}
                  </Badge>
                  <Badge
                    className={cn(
                      paymentStatusColors[selectedBooking.paymentStatus]
                    )}
                  >
                    Payment: {selectedBooking.paymentStatus}
                  </Badge>
                </div>

                {/* Boarder Info */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <User className="h-4 w-4" />
                    Boarder Information
                  </h4>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(selectedBooking.boarder.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedBooking.boarder.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {selectedBooking.boarder.email}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {selectedBooking.boarder.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listing Info */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 font-semibold">
                    <Building2 className="h-4 w-4" />
                    Listing Information
                  </h4>
                  <div className="space-y-2 rounded-lg border p-4">
                    <p className="font-medium">
                      {selectedBooking.listing.title}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {selectedBooking.listing.address}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Landlord: {selectedBooking.listing.landlord}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">Room</p>
                    <p className="font-medium">{selectedBooking.room}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      Monthly Rent
                    </p>
                    <p className="font-medium">
                      {formatCurrency(selectedBooking.monthlyRent)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">Start Date</p>
                    <p className="font-medium">
                      {formatDate(selectedBooking.startDate)}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">End Date</p>
                    <p className="font-medium">
                      {selectedBooking.endDate
                        ? formatDate(selectedBooking.endDate)
                        : "Ongoing"}
                    </p>
                  </div>
                </div>

                {/* Created */}
                <div className="text-muted-foreground text-sm">
                  <p>Created: {formatDateTime(selectedBooking.createdAt)}</p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
