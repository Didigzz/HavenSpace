"use client";

import * as React from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  Check,
  X,
  Clock,
  User,
  Building2,
  MessageSquare,
  Calendar,
  Eye,
} from "lucide-react";
import { Button } from "@havenspace/ui";
import { Input } from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import {
  Card,
  CardContent,
} from "@havenspace/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@havenspace/ui";
import { cn } from "@/lib/utils";

type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";

interface Booking {
  id: string;
  boarder: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  property: string;
  room: string;
  checkInDate: string;
  checkOutDate?: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  message?: string;
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: "1",
    boarder: { name: "Maria Santos", email: "maria@example.com", phone: "09171234567" },
    property: "Sunrise Residences",
    room: "Room 205",
    checkInDate: "2024-02-01",
    totalPrice: 5000,
    status: "pending",
    createdAt: "2024-01-15",
    message: "Looking for a quiet room for studying. I'm a medical student.",
  },
  {
    id: "2",
    boarder: { name: "Juan Dela Cruz", email: "juan@example.com", phone: "09181234567" },
    property: "Sunrise Residences",
    room: "Room 102",
    checkInDate: "2024-02-05",
    totalPrice: 4500,
    status: "pending",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    boarder: { name: "Ana Garcia", email: "ana@example.com", phone: "09191234567" },
    property: "Green Valley BH",
    room: "Room 301",
    checkInDate: "2024-01-20",
    totalPrice: 5500,
    status: "confirmed",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    boarder: { name: "Carlos Reyes", email: "carlos@example.com", phone: "09201234567" },
    property: "Metro Living Spaces",
    room: "Room 401",
    checkInDate: "2024-01-01",
    totalPrice: 6000,
    status: "active",
    createdAt: "2023-12-15",
  },
  {
    id: "5",
    boarder: { name: "Lisa Chen", email: "lisa@example.com", phone: "09211234567" },
    property: "Sunrise Residences",
    room: "Room 108",
    checkInDate: "2023-10-01",
    checkOutDate: "2024-01-15",
    totalPrice: 5000,
    status: "completed",
    createdAt: "2023-09-20",
  },
];

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: Check },
  active: { label: "Active", color: "bg-green-100 text-green-800", icon: User },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: Check },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: X },
};

function BookingCard({ booking, onAction }: { booking: Booking; onAction: (action: string, id: string) => void }) {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg font-semibold text-primary">
                {booking.boarder.name.charAt(0)}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{booking.boarder.name}</h4>
                <Badge className={cn("text-xs", status.color)}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {booking.boarder.email} • {booking.boarder.phone}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {booking.property}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {booking.room}
                </span>
              </div>
              {booking.message && (
                <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded p-2">
                  &quot;{booking.message}&quot;
                </p>
              )}
            </div>
          </div>
          <div className="text-right space-y-2">
            <p className="text-lg font-bold">₱{booking.totalPrice.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">per month</p>
            <p className="text-xs text-muted-foreground">
              Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        {booking.status === "pending" && (
          <div className="mt-4 flex gap-2 border-t pt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onAction("reject", booking.id)}
            >
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onAction("accept", booking.id)}
            >
              <Check className="mr-2 h-4 w-4" />
              Accept
            </Button>
            <Button size="sm" variant="ghost">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {booking.status === "confirmed" && (
          <div className="mt-4 flex gap-2 border-t pt-4">
            <Button size="sm" variant="outline" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button size="sm" className="flex-1" onClick={() => onAction("activate", booking.id)}>
              Mark as Checked In
            </Button>
          </div>
        )}
        
        {booking.status === "active" && (
          <div className="mt-4 flex gap-2 border-t pt-4">
            <Button size="sm" variant="outline" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [propertyFilter, setPropertyFilter] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState<string>("all");

  const handleAction = (action: string, bookingId: string) => {
    console.log(`Action: ${action} for booking: ${bookingId}`);
    // TODO: Implement API calls
  };

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.boarder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.boarder.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProperty = propertyFilter === "all" || booking.property === propertyFilter;
    
    const matchesTab = activeTab === "all" || booking.status === activeTab;

    return matchesSearch && matchesProperty && matchesTab;
  });

  const properties = [...new Set(mockBookings.map((b) => b.property))];
  
  const counts = {
    all: mockBookings.length,
    pending: mockBookings.filter(b => b.status === "pending").length,
    confirmed: mockBookings.filter(b => b.status === "confirmed").length,
    active: mockBookings.filter(b => b.status === "active").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage booking requests and active tenants
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or property..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Properties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map((property) => (
              <SelectItem key={property} value={property}>
                {property}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">{counts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed
            <Badge variant="secondary" className="ml-2">{counts.confirmed}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">{counts.active}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onAction={handleAction}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarCheck className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No bookings found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || propertyFilter !== "all"
                      ? "Try adjusting your filters"
                      : "You don't have any bookings yet"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
