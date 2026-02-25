"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Car,
  Plus,
  Trash2,
  Loader2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bhms/ui";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { LocationPicker } from "@/components/map";
import { ImageUpload } from "@/components/property/image-upload";
import { useToast } from "@bhms/ui";
import { mockProperties, propertyAmenities } from "@/lib/mock-data";
import type { GeoLocation, PropertyImage, PropertyAmenity, PropertyRule } from "@/types";

const propertySchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "maintenance"]),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  managerName: z.string().optional(),
  parkingSpaces: z.coerce.number().min(0).optional(),
  parkingType: z.enum(["free", "paid", "none"]).optional(),
  parkingRate: z.coerce.number().min(0).optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const propertyId = params.id as string;

  const property = mockProperties.find((p) => p.id === propertyId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<GeoLocation | undefined>(property?.location);
  const [images, setImages] = useState<PropertyImage[]>(property?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities?.map((a) => a.id) || []
  );
  const [rules, setRules] = useState<PropertyRule[]>(property?.rules || []);
  const [nearbyLandmarks, setNearbyLandmarks] = useState<string[]>(
    property?.nearbyLandmarks || []
  );
  const [publicTransport, setPublicTransport] = useState<string[]>(
    property?.publicTransport || []
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: property?.name || "",
      address: property?.address || "",
      city: property?.city || "",
      description: property?.description || "",
      status: property?.status || "active",
      contactEmail: property?.contactEmail || "",
      contactPhone: property?.contactPhone || "",
      managerName: property?.managerName || "",
      parkingSpaces: property?.parkingSpaces || 0,
      parkingType: property?.parkingType || "none",
      parkingRate: property?.parkingRate || 0,
    },
  });

  const parkingType = watch("parkingType");

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    // In production, this would be an API call
    const updatedProperty = {
      ...property,
      ...data,
      location,
      images,
      amenities: propertyAmenities.filter((a) => selectedAmenities.includes(a.id)),
      rules,
      nearbyLandmarks,
      publicTransport,
      updatedAt: new Date().toISOString(),
    };

    console.log("Saving property:", updatedProperty);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Property Updated",
      description: "The property has been successfully updated.",
    });

    setIsSubmitting(false);
    router.push(`/properties/${propertyId}`);
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: `rule-${Date.now()}`,
        title: "",
        description: "",
        category: "general",
      },
    ]);
  };

  const updateRule = (index: number, field: keyof PropertyRule, value: string) => {
    setRules((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const addLandmark = () => {
    setNearbyLandmarks((prev) => [...prev, ""]);
  };

  const updateLandmark = (index: number, value: string) => {
    setNearbyLandmarks((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeLandmark = (index: number) => {
    setNearbyLandmarks((prev) => prev.filter((_, i) => i !== index));
  };

  const addTransport = () => {
    setPublicTransport((prev) => [...prev, ""]);
  };

  const updateTransport = (index: number, value: string) => {
    setPublicTransport((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeTransport = (index: number) => {
    setPublicTransport((prev) => prev.filter((_, i) => i !== index));
  };

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Property Not Found</h1>
        <p className="text-muted-foreground">The property you&apos;re trying to edit doesn&apos;t exist.</p>
        <Button asChild className="mt-4">
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" type="button" asChild>
            <Link href={`/properties/${propertyId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
            <p className="text-muted-foreground">{property.name}</p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g., Sunrise Boarding House"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    defaultValue={property.status}
                    onValueChange={(value) => {
                      const event = { target: { name: "status", value } };
                      register("status").onChange(event);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Street address"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder="e.g., Metro Manila"
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe your property..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Property Manager</Label>
                  <Input
                    id="managerName"
                    {...register("managerName")}
                    placeholder="Manager name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    {...register("contactPhone")}
                    placeholder="+63 xxx xxx xxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail")}
                    placeholder="email@example.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Parking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="parkingType">Parking Type</Label>
                  <Select
                    defaultValue={property.parkingType || "none"}
                    onValueChange={(value) => {
                      const event = { target: { name: "parkingType", value } };
                      register("parkingType").onChange(event);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parking</SelectItem>
                      <SelectItem value="free">Free Parking</SelectItem>
                      <SelectItem value="paid">Paid Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parkingSpaces">Number of Spaces</Label>
                  <Input
                    id="parkingSpaces"
                    type="number"
                    min="0"
                    {...register("parkingSpaces")}
                  />
                </div>
                {parkingType === "paid" && (
                  <div className="space-y-2">
                    <Label htmlFor="parkingRate">Monthly Rate (₱)</Label>
                    <Input
                      id="parkingRate"
                      type="number"
                      min="0"
                      {...register("parkingRate")}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Nearby Landmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Landmarks
              </CardTitle>
              <CardDescription>
                Add landmarks and points of interest near your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nearbyLandmarks.map((landmark, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={landmark}
                    onChange={(e) => updateLandmark(index, e.target.value)}
                    placeholder="e.g., University of Santo Tomas"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeLandmark(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addLandmark}>
                <Plus className="mr-2 h-4 w-4" />
                Add Landmark
              </Button>
            </CardContent>
          </Card>

          {/* Public Transport */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Public Transportation
              </CardTitle>
              <CardDescription>
                Add nearby public transport options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {publicTransport.map((transport, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={transport}
                    onChange={(e) => updateTransport(index, e.target.value)}
                    placeholder="e.g., LRT-1 Legarda Station"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTransport(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addTransport}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transport Option
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images */}
        <TabsContent value="images">
          <ImageUpload value={images} onChange={setImages} maxImages={10} />
        </TabsContent>

        {/* Location */}
        <TabsContent value="location">
          <LocationPicker value={location} onChange={setLocation} height="500px" />
        </TabsContent>

        {/* Amenities */}
        <TabsContent value="amenities">
          <Card>
            <CardHeader>
              <CardTitle>Property Amenities</CardTitle>
              <CardDescription>
                Select the amenities and facilities available at your property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {propertyAmenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selectedAmenities.includes(amenity.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <Switch
                      checked={selectedAmenities.includes(amenity.id)}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                    <span className="text-sm font-medium">{amenity.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {amenity.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>House Rules & Restrictions</CardTitle>
              <CardDescription>
                Define the rules and policies for your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rules.map((rule, index) => (
                <div key={rule.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Rule Title</Label>
                          <Input
                            value={rule.title}
                            onChange={(e) => updateRule(index, "title", e.target.value)}
                            placeholder="e.g., No Smoking"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={rule.category}
                            onValueChange={(value) =>
                              updateRule(index, "category", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="payment">Payment</SelectItem>
                              <SelectItem value="visitor">Visitor</SelectItem>
                              <SelectItem value="noise">Noise</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <textarea
                          value={rule.description}
                          onChange={(e) => updateRule(index, "description", e.target.value)}
                          className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Describe this rule..."
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => removeRule(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addRule}>
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
