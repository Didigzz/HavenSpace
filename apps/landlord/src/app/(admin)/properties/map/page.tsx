"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  List,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Building2,
  Users,
  DollarSign,
  Save,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@bhms/ui";
import { Input } from "@bhms/ui";
import { Badge } from "@bhms/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bhms/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bhms/ui";
import { Label } from "@bhms/ui";
import { cn } from "@/lib/utils";
import { MALAYBALAY_BOUNDS } from "@/components/map/map-picker";

// Dynamic import for Leaflet-based components (no SSR)
const MapPicker = dynamic(() => import("@/components/map/map-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center rounded-lg">
      <div className="text-muted-foreground text-sm">Loading map...</div>
    </div>
  ),
});

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  rooms: {
    total: number;
    occupied: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  status: "active" | "inactive" | "maintenance";
  isPublished: boolean;
}

// Mock data with Malaybalay City, Bukidnon coordinates
const mockProperties: Property[] = [
  {
    id: "1",
    name: "Sunrise Residences",
    address: "Purok 5, Brgy. Casisang",
    city: "Malaybalay City",
    latitude: 8.1575,
    longitude: 125.1276,
    rooms: { total: 20, occupied: 17 },
    priceRange: { min: 2500, max: 4500 },
    status: "active",
    isPublished: true,
  },
  {
    id: "2",
    name: "Green Valley BH",
    address: "Sayre Highway, Brgy. Sumpong",
    city: "Malaybalay City",
    latitude: 8.1610,
    longitude: 125.1310,
    rooms: { total: 12, occupied: 11 },
    priceRange: { min: 3500, max: 5500 },
    status: "active",
    isPublished: true,
  },
  {
    id: "3",
    name: "Hilltop Living Spaces",
    address: "Brgy. Bangcud, Near Capitol",
    city: "Malaybalay City",
    latitude: 8.1520,
    longitude: 125.1340,
    rooms: { total: 15, occupied: 12 },
    priceRange: { min: 3000, max: 5000 },
    status: "active",
    isPublished: true,
  },
  {
    id: "4",
    name: "Student Haven",
    address: "Brgy. Sumpong, Near BSU Gate",
    city: "Malaybalay City",
    latitude: 8.1635,
    longitude: 125.1290,
    rooms: { total: 25, occupied: 20 },
    priceRange: { min: 2000, max: 3500 },
    status: "active",
    isPublished: true,
  },
  {
    id: "5",
    name: "Pine View Lodge",
    address: "Brgy. Dalwangan",
    city: "Malaybalay City",
    latitude: null,
    longitude: null,
    rooms: { total: 18, occupied: 0 },
    priceRange: { min: 3000, max: 5000 },
    status: "maintenance",
    isPublished: false,
  },
];

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-800" },
  maintenance: {
    label: "Maintenance",
    color: "bg-yellow-100 text-yellow-800",
  },
};

// Toast helper component
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[2000] flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5",
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      {message}
      <button onClick={onClose} className="ml-2">
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function PropertyCard({
  property,
  isSelected,
  isEditing,
  onClick,
  onEdit,
}: {
  property: Property;
  isSelected: boolean;
  isEditing: boolean;
  onClick: () => void;
  onEdit: () => void;
}) {
  const occupancyRate = Math.round(
    (property.rooms.occupied / property.rooms.total) * 100
  );
  const status = statusConfig[property.status];
  const hasLocation =
    property.latitude !== null && property.longitude !== null;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        isEditing && "ring-2 ring-orange-400"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold truncate">{property.name}</h4>
              <Badge className={cn("text-xs shrink-0", status.color)}>
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {property.address}
            </p>
            <p className="text-xs text-muted-foreground">{property.city}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span>{property.rooms.total} rooms</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span>{occupancyRate}%</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span>₱{property.priceRange.min.toLocaleString()}</span>
          </div>
        </div>

        {/* Location status */}
        <div className="mt-3 flex items-center gap-2">
          {hasLocation ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <MapPin className="h-3 w-3" />
              Location pinned ({property.latitude?.toFixed(4)},{" "}
              {property.longitude?.toFixed(4)})
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-orange-600">
              <AlertTriangle className="h-3 w-3" />
              No location set
            </span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant={isEditing ? "default" : "outline"}
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <MapPin className="mr-1 h-3 w-3" />
            {isEditing ? "Pinning..." : hasLocation ? "Move Pin" : "Set Pin"}
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href={`/properties/${property.id}`}>
              <Eye className="mr-1 h-3 w-3" />
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MapViewPage() {
  const [properties, setProperties] = React.useState(mockProperties);
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<
    string | null
  >(null);
  const [editingPropertyId, setEditingPropertyId] = React.useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [pendingLat, setPendingLat] = React.useState<number | null>(null);
  const [pendingLng, setPendingLng] = React.useState<number | null>(null);
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const editingProperty = editingPropertyId
    ? properties.find((p) => p.id === editingPropertyId)
    : null;

  const selectedProperty = selectedPropertyId
    ? properties.find((p) => p.id === selectedPropertyId)
    : null;

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get the lat/lng to show on the map
  const displayLat = editingProperty
    ? pendingLat ?? editingProperty.latitude
    : selectedProperty
      ? selectedProperty.latitude
      : null;

  const displayLng = editingProperty
    ? pendingLng ?? editingProperty.longitude
    : selectedProperty
      ? selectedProperty.longitude
      : null;

  const handleStartEdit = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (!prop) return;

    setEditingPropertyId(propertyId);
    setSelectedPropertyId(propertyId);
    setPendingLat(prop.latitude);
    setPendingLng(prop.longitude);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!editingPropertyId) return;
    setPendingLat(lat);
    setPendingLng(lng);
  };

  const handleSaveLocation = async () => {
    if (!editingPropertyId || pendingLat === null || pendingLng === null) {
      setToast({
        message: "Please click on the map to place a pin first.",
        type: "error",
      });
      return;
    }

    // Validate within Malaybalay bounds
    if (
      pendingLat < MALAYBALAY_BOUNDS.south ||
      pendingLat > MALAYBALAY_BOUNDS.north ||
      pendingLng < MALAYBALAY_BOUNDS.west ||
      pendingLng > MALAYBALAY_BOUNDS.east
    ) {
      setToast({
        message:
          "Location must be within Malaybalay City, Bukidnon service area.",
        type: "error",
      });
      return;
    }

    // Check for duplicate coordinates
    const duplicate = properties.find(
      (p) =>
        p.id !== editingPropertyId &&
        p.latitude !== null &&
        p.longitude !== null &&
        Math.abs(p.latitude - pendingLat) < 0.0001 &&
        Math.abs(p.longitude - pendingLng) < 0.0001
    );

    if (duplicate) {
      setToast({
        message: `Location too close to "${duplicate.name}". Please choose a different spot.`,
        type: "error",
      });
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await updatePropertyLocation({ id: editingPropertyId, latitude: pendingLat, longitude: pendingLng });

      // Update local state (simulating API save)
      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingPropertyId
            ? { ...p, latitude: pendingLat, longitude: pendingLng }
            : p
        )
      );

      setToast({
        message: `Location saved for "${editingProperty?.name}"! It will appear on the tenant map.`,
        type: "success",
      });

      setEditingPropertyId(null);
      setPendingLat(null);
      setPendingLng(null);
    } catch (error) {
      setToast({
        message: "Failed to save location. Please try again.",
        type: "error",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingPropertyId(null);
    setPendingLat(null);
    setPendingLng(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Map</h1>
          <p className="text-muted-foreground">
            Pin and manage boarding house locations in Malaybalay City, Bukidnon
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/properties">
              <List className="mr-2 h-4 w-4" />
              List View
            </Link>
          </Button>
          <Button asChild>
            <Link href="/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Editing Banner */}
      {editingProperty && (
        <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <MapPin className="h-5 w-5 text-orange-600 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-orange-800">
              Pinning location for: {editingProperty.name}
            </p>
            <p className="text-sm text-orange-600">
              Click on the map to place the pin. Drag it to adjust. Location
              must be within the Malaybalay City service area (blue dashed
              rectangle).
            </p>
            {pendingLat !== null && pendingLng !== null && (
              <p className="text-xs text-orange-500 mt-1">
                Coordinates: {pendingLat.toFixed(6)}, {pendingLng.toFixed(6)}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleSaveLocation}
              disabled={pendingLat === null || pendingLng === null}
            >
              <Save className="mr-1 h-3 w-3" />
              Save Location
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Property List */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "property" : "properties"} found
          </p>
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isSelected={selectedPropertyId === property.id}
              isEditing={editingPropertyId === property.id}
              onClick={() => {
                setSelectedPropertyId(property.id);
                if (!editingPropertyId) {
                  // If not in editing mode, just select
                }
              }}
              onEdit={() => handleStartEdit(property.id)}
            />
          ))}
          {filteredProperties.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No properties found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardContent className="p-0 h-[calc(100vh-300px)] min-h-[400px]">
            <MapPicker
              latitude={displayLat}
              longitude={displayLng}
              onChange={handleMapClick}
              readOnly={!editingPropertyId}
              height="100%"
              className="rounded-none border-0"
            />
          </CardContent>
        </Card>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
