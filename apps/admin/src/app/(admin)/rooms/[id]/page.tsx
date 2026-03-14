"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  DoorOpen,
  Users,
  Calendar,
  Wrench,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@havenspace/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@havenspace/ui";
import { mockRooms, mockTenants, mockMaintenanceRequests, mockProperties } from "@/lib/mock-data";
import { formatCurrency, formatDate, cn, getStatusColor } from "@/lib/utils";
import { useToast } from "@havenspace/ui";

const statusConfig = {
  AVAILABLE: {
    label: "Available",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-50 border-green-200",
  },
  OCCUPIED: {
    label: "Occupied",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
  },
  MAINTENANCE: {
    label: "Under Maintenance",
    icon: Wrench,
    color: "text-yellow-500",
    bg: "bg-yellow-50 border-yellow-200",
  },
};

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const room = mockRooms.find((r) => r.id === id);
  const property = room
    ? mockProperties.find((p) => p.id === room.propertyId)
    : null;
  const roomTenants = room
    ? mockTenants.filter((t) => t.roomId === room.id && t.isActive)
    : [];
  const roomMaintenance = room
    ? mockMaintenanceRequests.filter((m) => m.roomId === room.id)
    : [];

  if (!room) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <DoorOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Room not found</h2>
          <p className="text-muted-foreground">The room you&apos;re looking for doesn&apos;t exist.</p>
          <Button className="mt-4" asChild>
            <Link href="/rooms">Back to Rooms</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[room.status];
  const StatusIcon = statusInfo.icon;
  const occupancyRate = Math.round(((room.currentTenants?.length || 0) / room.capacity) * 100);

  const handleDelete = () => {
    // In production, this would be an API call
    console.log("Deleting room:", id);
    toast({
      title: "Room Deleted",
      description: `Room ${room.roomNumber} has been deleted.`,
    });
    router.push("/rooms");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/rooms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Room {room.roomNumber}
              </h1>
              <Badge
                variant="secondary"
                className={cn("gap-1", getStatusColor(room.status.toLowerCase()))}
              >
                <StatusIcon className="h-3 w-3" />
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {property?.name || "Unknown Property"} • Floor {room.floor}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/rooms/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Room {room.roomNumber}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All data associated with this room
                  will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Monthly Rate</CardDescription>
                <CardTitle className="text-2xl">
                  {formatCurrency(room.monthlyRate)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Occupancy</CardDescription>
                <CardTitle className="text-2xl">
                  {room.currentTenants?.length || 0} / {room.capacity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      occupancyRate === 100 ? "bg-green-500" : "bg-blue-500"
                    )}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Available Slots</CardDescription>
                <CardTitle className="text-2xl">
                  {room.capacity - (room.currentTenants?.length || 0)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="tenants" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tenants">
                Current Tenants ({roomTenants.length})
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                Maintenance ({roomMaintenance.length})
              </TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="tenants">
              <Card>
                <CardHeader>
                  <CardTitle>Current Tenants</CardTitle>
                  <CardDescription>
                    Tenants currently assigned to this room
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {roomTenants.length > 0 ? (
                    <div className="space-y-4">
                      {roomTenants.map((tenant) => (
                        <div
                          key={tenant.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {tenant.firstName} {tenant.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {tenant.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(tenant.monthlyRent ?? 0)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Since {formatDate(tenant.moveInDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 font-medium">No Tenants</h3>
                      <p className="text-sm text-muted-foreground">
                        This room is currently vacant
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link href="/tenants/new">Assign Tenant</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Requests</CardTitle>
                  <CardDescription>
                    Service and maintenance history for this room
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {roomMaintenance.length > 0 ? (
                    <div className="space-y-4">
                      {roomMaintenance.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-start justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg",
                                request.status === "COMPLETED"
                                  ? "bg-green-100"
                                  : request.status === "IN_PROGRESS"
                                  ? "bg-blue-100"
                                  : "bg-yellow-100"
                              )}
                            >
                              {request.status === "COMPLETED" ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : request.status === "IN_PROGRESS" ? (
                                <Clock className="h-5 w-5 text-blue-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{request.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {request.description}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Reported: {formatDate(request.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              request.priority === "HIGH" && "border-red-500 text-red-500",
                              request.priority === "MEDIUM" && "border-yellow-500 text-yellow-500",
                              request.priority === "LOW" && "border-green-500 text-green-500"
                            )}
                          >
                            {request.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 font-medium">No Maintenance Requests</h3>
                      <p className="text-sm text-muted-foreground">
                        No maintenance requests have been submitted for this room
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <Link href="/maintenance/new">Report Issue</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Room History</CardTitle>
                  <CardDescription>
                    Timeline of events and changes for this room
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Room Created</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(room.createdAt || new Date())}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(room.updatedAt || new Date())}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Number</span>
                <span className="font-medium">{room.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Floor</span>
                <span className="font-medium">{room.floor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">{room.capacity} person(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rate</span>
                <span className="font-medium">{formatCurrency(room.monthlyRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={cn("gap-1", getStatusColor(room.status.toLowerCase()))}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusInfo.label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              {room.amenities && room.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No amenities listed</p>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {room.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{room.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/tenants/new?roomId=${room.id}`}>
                  <Users className="mr-2 h-4 w-4" />
                  Assign New Tenant
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/maintenance/new?roomId=${room.id}`}>
                  <Wrench className="mr-2 h-4 w-4" />
                  Report Maintenance
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/payments?roomId=${room.id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Payments
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
