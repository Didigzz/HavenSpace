"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  DoorOpen,
  Users,
  Wrench,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@havenspace/shared/ui";
import { useProperty } from "@/lib/property-context";
import { getRoomsByProperty, mockRooms } from "@/lib/mock-data";
import { formatCurrency, cn, getStatusColor } from "@/lib/utils";
import type { Room } from "@/types";

const statusIcons = {
  AVAILABLE: CheckCircle,
  OCCUPIED: Users,
  MAINTENANCE: Wrench,
};

const statusLabels = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
};

function RoomCard({ room }: { room: Room }) {
  const StatusIcon = statusIcons[room.status];

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-1",
          room.status === "AVAILABLE" && "bg-green-500",
          room.status === "OCCUPIED" && "bg-blue-500",
          room.status === "MAINTENANCE" && "bg-yellow-500"
        )}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <DoorOpen className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Room {room.roomNumber}</CardTitle>
              <CardDescription>Floor {room.floor}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/rooms/${room.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/rooms/${room.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Room
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Room
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn("gap-1", getStatusColor(room.status.toLowerCase()))}
          >
            <StatusIcon className="h-3 w-3" />
            {statusLabels[room.status]}
          </Badge>
          <span className="text-lg font-bold">
            {formatCurrency(room.monthlyRate)}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Capacity</span>
            <span>{room.capacity} person(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Occupants</span>
            <span>
              {room.currentTenants} / {room.capacity}
            </span>
          </div>
        </div>

        {room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{room.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function RoomsPage() {
  const { currentProperty } = useProperty();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const allRooms = currentProperty
    ? getRoomsByProperty(currentProperty.id)
    : mockRooms;

  const filteredRooms = allRooms.filter((room) => {
    const matchesSearch = room.roomNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      room.status.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: allRooms.length,
    available: allRooms.filter((r) => r.status === "AVAILABLE").length,
    occupied: allRooms.filter((r) => r.status === "OCCUPIED").length,
    maintenance: allRooms.filter((r) => r.status === "MAINTENANCE").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground">
            Manage room inventory, pricing, and availability
          </p>
        </div>
        <Button asChild>
          <Link href="/rooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Rooms</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Available
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {stats.available}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Occupied
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {stats.occupied}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-500" />
              Maintenance
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {stats.maintenance}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="available">
              Available ({stats.available})
            </TabsTrigger>
            <TabsTrigger value="occupied">
              Occupied ({stats.occupied})
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              Maintenance ({stats.maintenance})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <DoorOpen className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium">No rooms found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first room"}
            </p>
            {!searchQuery && (
              <Button className="mt-4" asChild>
                <Link href="/rooms/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
