"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Phone,
  Mail,
  User,
  Car,
  DoorOpen,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Wifi,
  Shield,
  Dumbbell,
  Utensils,
  Shirt,
  Camera,
  Droplets,
  Zap,
  Wind,
  Tv,
  Building,
  Sparkles,
  Wrench,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@havenspace/shared/ui";
import { Separator } from "@/components/ui/separator";
import {
  mockProperties,
  getRoomsByProperty,
  getTenantsByProperty,
} from "@/lib/mock-data";
import {
  formatCurrency,
  formatDate,
  calculateOccupancyRate,
  cn,
  getStatusColor,
} from "@/lib/utils";
import type { Property, PropertyAmenity, PropertyRule } from "@/types";

// Lazy load map component
const MapView = React.lazy(() => import("@/components/map/map-view"));

// Icon mapping for amenities
const amenityIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  wifi: Wifi,
  car: Car,
  shirt: Shirt,
  utensils: Utensils,
  shield: Shield,
  camera: Camera,
  droplets: Droplets,
  zap: Zap,
  wind: Wind,
  tv: Tv,
  dumbbell: Dumbbell,
  building: Building,
  sparkles: Sparkles,
  wrench: Wrench,
};

function ImageGallery({ images }: { images: Property["images"] }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-lg">
        <Building className="text-muted-foreground h-16 w-16" />
      </div>
    );
  }

  const sortedImages = [...images].sort((a, b) => a.order - b.order);
  const selectedImage = sortedImages[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      {/* Main Image */}
      <div className="group relative">
        <div
          className="aspect-video w-full cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setIsLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage?.url}
            alt={selectedImage?.alt}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        <div className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
          {selectedIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setIsLightboxOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage?.url || ""}
            alt={selectedImage?.alt || ""}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/60 px-4 py-2 text-white">
            {selectedIndex + 1} / {sortedImages.length}
          </div>
        </div>
      )}
    </>
  );
}

function AmenityBadge({ amenity }: { amenity: PropertyAmenity }) {
  const Icon = amenityIcons[amenity.icon || ""] || Sparkles;
  return (
    <div className="flex items-center gap-2 rounded-lg border p-3">
      <Icon className="text-primary h-5 w-5" />
      <span className="text-sm font-medium">{amenity.name}</span>
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const property = mockProperties.find((p) => p.id === propertyId);
  const rooms = property ? getRoomsByProperty(propertyId) : [];
  const tenants = property ? getTenantsByProperty(propertyId) : [];

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Property Not Found</h1>
        <p className="text-muted-foreground">
          The property you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
      </div>
    );
  }

  const occupancyRate = calculateOccupancyRate(
    property.occupiedRooms ?? 0,
    property.totalRooms ?? 0
  );
  const availableRooms = rooms.filter((r) => r.status === "AVAILABLE").length;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
  const maintenanceRooms = rooms.filter(
    (r) => r.status === "MAINTENANCE"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/properties">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {property.name}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {property.address}, {property.city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(getStatusColor(property.status))}
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
          <Button asChild>
            <Link href={`/properties/${property.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Images and Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-4">
              <ImageGallery
                images={
                  property.images?.map((url, i) => ({
                    id: `img-${i}`,
                    url,
                    alt: "",
                    order: i,
                    isPrimary: i === 0,
                  })) || []
                }
              />
            </CardContent>
          </Card>

          {/* Tabs for Details */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {property.description || "No description available."}
                  </p>
                </CardContent>
              </Card>

              {/* Nearby Landmarks */}
              {property.nearbyLandmarks &&
                property.nearbyLandmarks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Nearby Landmarks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {property.nearbyLandmarks.map((landmark, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <MapPin className="text-muted-foreground h-4 w-4" />
                            {landmark}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

              {/* Public Transport */}
              {property.publicTransport &&
                property.publicTransport.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Public Transportation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {property.publicTransport.map((transport, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Car className="text-muted-foreground h-4 w-4" />
                            {transport}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

            <TabsContent value="amenities">
              <Card>
                <CardHeader>
                  <CardTitle>Property Amenities</CardTitle>
                  <CardDescription>
                    Facilities and services available at this property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {property.amenities.map((name) => (
                        <AmenityBadge
                          key={name}
                          amenity={{ id: name, name, icon: "sparkles" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No amenities listed.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>House Rules & Restrictions</CardTitle>
                  <CardDescription>
                    Please read and follow these rules during your stay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {property.rules && property.rules.length > 0 ? (
                    <div className="space-y-4">
                      {property.rules.map((rule) => (
                        <div
                          key={rule.id}
                          className="border-primary border-l-4 pl-4"
                        >
                          <h4 className="font-semibold">{rule.title}</h4>
                          <p className="text-muted-foreground text-sm">
                            {rule.description}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {(rule as PropertyRule).category || "general"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No rules specified.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Property Location</CardTitle>
                  <CardDescription>
                    {property.location?.address ||
                      `${property.address}, ${property.city}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {property.location ? (
                    <div className="h-[400px] overflow-hidden rounded-lg border">
                      <Suspense
                        fallback={
                          <div className="bg-muted flex h-full items-center justify-center">
                            Loading map...
                          </div>
                        }
                      >
                        <MapView
                          center={[
                            property.location.latitude,
                            property.location.longitude,
                          ]}
                          markerPosition={[
                            property.location.latitude,
                            property.location.longitude,
                          ]}
                          zoom={16}
                          interactive={true}
                        />
                      </Suspense>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Location not set.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Stats and Contact */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Occupancy Rate</span>
                </div>
                <span className="font-bold">{occupancyRate}%</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-blue-600" />
                  <span>Total Rooms</span>
                </div>
                <span className="font-bold">{property.totalRooms}</span>
              </div>
              <div className="ml-6 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Available</span>
                  <span>{availableRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Occupied</span>
                  <span>{occupiedRooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Maintenance</span>
                  <span>{maintenanceRooms}</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>Active Tenants</span>
                </div>
                <span className="font-bold">
                  {tenants.filter((t) => t.isActive).length}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>Monthly Revenue</span>
                </div>
                <span className="font-bold">
                  {formatCurrency(property.monthlyRevenue ?? 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">
                  Monthly Rent Range
                </p>
                <p className="text-2xl font-bold">
                  {property.minRent && property.maxRent
                    ? `${formatCurrency(property.minRent)} - ${formatCurrency(property.maxRent)}`
                    : "Contact for pricing"}
                </p>
              </div>
              {property.parkingType && property.parkingType !== "none" && (
                <div>
                  <p className="text-muted-foreground text-sm">Parking</p>
                  <p className="font-medium">
                    {property.parkingType === "free"
                      ? "Free parking available"
                      : `${formatCurrency(property.parkingRate || 0)}/month`}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {property.parkingSpaces} spaces available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.managerName && (
                <div className="flex items-center gap-3">
                  <User className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Property Manager
                    </p>
                    <p className="font-medium">{property.managerName}</p>
                  </div>
                </div>
              )}
              {property.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <a
                      href={`tel:${property.contactPhone}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {property.contactPhone}
                    </a>
                  </div>
                </div>
              )}
              {property.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <a
                      href={`mailto:${property.contactEmail}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {property.contactEmail}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="text-muted-foreground space-y-2 pt-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created: {formatDate(property.createdAt || new Date())}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Last updated: {formatDate(property.updatedAt || new Date())}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
