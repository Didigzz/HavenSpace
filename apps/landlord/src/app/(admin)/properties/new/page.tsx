"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Image as ImageIcon,
  Upload,
  X,
  Plus,
  DollarSign,
  Bed,
  Bath,
  Wifi,
  Car,
  Tv,
  Wind,
  Utensils,
  Shield,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@bhms/ui";
import { Input } from "@bhms/ui";
import { Label } from "@bhms/ui";
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
import { Separator } from "@bhms/ui";
import { cn } from "@/lib/utils";
import { MALAYBALAY_BOUNDS } from "@/components/map/map-picker";

// Dynamic import for map picker (no SSR)
const MapPicker = dynamic(() => import("@/components/map/map-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-muted animate-pulse flex items-center justify-center rounded-lg border">
      <div className="text-muted-foreground text-sm">Loading map...</div>
    </div>
  ),
});

const AMENITIES = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "tv", label: "TV/Cable", icon: Tv },
  { id: "aircon", label: "Air Conditioning", icon: Wind },
  { id: "kitchen", label: "Kitchen Access", icon: Utensils },
  { id: "security", label: "24/7 Security", icon: Shield },
  { id: "laundry", label: "Laundry", icon: Bath },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "",
    totalRooms: "",
    availableRooms: "",
    priceMin: "",
    priceMax: "",
    latitude: "",
    longitude: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In production, upload to cloud storage and get URLs
      // For now, create object URLs for preview
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate location is within Malaybalay City bounds
      if (formData.latitude && formData.longitude) {
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        if (
          lat < MALAYBALAY_BOUNDS.south || lat > MALAYBALAY_BOUNDS.north ||
          lng < MALAYBALAY_BOUNDS.west || lng > MALAYBALAY_BOUNDS.east
        ) {
          alert("Property location must be within Malaybalay City, Bukidnon service area.");
          setIsSubmitting(false);
          return;
        }
      }

      // TODO: Call API to create property
      // await createProperty({ ...formData, images, amenities: selectedAmenities });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.push("/properties");
    } catch (error) {
      console.error("Failed to create property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground">
            Create a new boarding house listing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  General details about your property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Sunrise Residences"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your property, including features, nearby landmarks, and what makes it special..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boarding-house">Boarding House</SelectItem>
                      <SelectItem value="dormitory">Dormitory</SelectItem>
                      <SelectItem value="apartment">Apartment Building</SelectItem>
                      <SelectItem value="bedspace">Bedspace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
                <CardDescription>
                  Property address and map location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street, Barangay..."
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="e.g., Quezon City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Province/State *</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="e.g., Metro Manila"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      placeholder="e.g., 1100"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                {/* Map picker */}
                <div className="space-y-2">
                  <Label>Pin Location on Map *</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Click on the map to pin your property location within Malaybalay City, Bukidnon.
                    You can also drag the pin to adjust.
                  </p>
                  <MapPicker
                    latitude={formData.latitude ? parseFloat(formData.latitude) : null}
                    longitude={formData.longitude ? parseFloat(formData.longitude) : null}
                    onChange={(lat, lng) => {
                      setFormData(prev => ({
                        ...prev,
                        latitude: lat.toFixed(6),
                        longitude: lng.toFixed(6),
                      }));
                    }}
                    height="300px"
                  />
                  {formData.latitude && formData.longitude && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <MapPin className="h-3 w-3" />
                      Location pinned: {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
                    </div>
                  )}
                  {!formData.latitude && !formData.longitude && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      Click the map to set your property location
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        placeholder="e.g., 8.1575"
                        value={formData.latitude}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        placeholder="e.g., 125.1276"
                        value={formData.longitude}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Property Images
                </CardTitle>
                <CardDescription>
                  Upload photos of your property (max 10 images)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2">Cover Photo</Badge>
                      )}
                    </div>
                  ))}
                  {images.length < 10 && (
                    <label className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click to upload
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  First image will be used as the cover photo. Recommended: 1920x1080px
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Room & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  Rooms & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="totalRooms">Total Rooms *</Label>
                  <Input
                    id="totalRooms"
                    name="totalRooms"
                    type="number"
                    min="1"
                    placeholder="e.g., 10"
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableRooms">Available Rooms</Label>
                  <Input
                    id="availableRooms"
                    name="availableRooms"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={formData.availableRooms}
                    onChange={handleInputChange}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Price Range (₱ per month)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="priceMin"
                        type="number"
                        placeholder="Min"
                        className="pl-9"
                        value={formData.priceMin}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        name="priceMax"
                        type="number"
                        placeholder="Max"
                        className="pl-9"
                        value={formData.priceMax}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>
                  Select available amenities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map((amenity) => {
                    const Icon = amenity.icon;
                    const isSelected = selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {amenity.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Property
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href="/properties">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
