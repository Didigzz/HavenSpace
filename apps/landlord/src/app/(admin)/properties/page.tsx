"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Building2,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@havenspace/ui";
import { Input } from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import { Progress } from "@havenspace/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProperties } from "@/lib/mock-data";
import { formatCurrency, cn, getStatusColor, calculateOccupancyRate } from "@/lib/utils";
import type { Property } from "@/types";

function PropertyCard({ property }: { property: Property }) {
  const occupancyRate = calculateOccupancyRate(property.occupiedRooms, property.totalRooms);

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          property.status === "active" && "bg-green-500",
          property.status === "inactive" && "bg-gray-500",
          property.status === "maintenance" && "bg-yellow-500"
        )}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{property.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.address}, {property.city}
              </CardDescription>
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
                <Link href={`/properties/${property.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/properties/${property.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Property
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={getStatusColor(property.status)}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
          <div className="text-right">
            <span className="text-lg font-bold">{formatCurrency(property.monthlyRevenue)}</span>
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
          </div>
        </div>

        {/* Occupancy Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy Rate</span>
            <span className="font-medium">{occupancyRate}%</span>
          </div>
          <Progress value={occupancyRate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{property.occupiedRooms} occupied</span>
            <span>{property.totalRooms - property.occupiedRooms} available</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{property.totalRooms}</p>
              <p className="text-xs text-muted-foreground">Total Rooms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{property.occupiedRooms}</p>
              <p className="text-xs text-muted-foreground">Occupied</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredProperties = mockProperties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockProperties.length,
    active: mockProperties.filter((p) => p.status === "active").length,
    totalRooms: mockProperties.reduce((sum, p) => sum + p.totalRooms, 0),
    totalRevenue: mockProperties.reduce((sum, p) => sum + p.monthlyRevenue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your boarding house properties
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Properties</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Properties</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Rooms</CardDescription>
            <CardTitle className="text-3xl">{stats.totalRooms}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Monthly Revenue</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(stats.totalRevenue)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first property"}
            </p>
            {!searchQuery && (
              <Button className="mt-4" asChild>
                <Link href="/properties/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
