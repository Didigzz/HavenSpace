"use client";

import * as React from "react";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  DoorOpen,
  Loader2,
  Plus,
  X,
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
import { mockRooms, mockProperties } from "@/lib/mock-data";
import { useToast } from "@bhms/ui";

const commonAmenities = [
  "Air Conditioning",
  "WiFi",
  "Private Bathroom",
  "Hot Water",
  "Cable TV",
  "Study Desk",
  "Wardrobe",
  "Bed Frame",
  "Mattress",
  "Window",
  "Balcony",
  "Mini Fridge",
  "Electric Fan",
];

const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  floor: z.coerce.number().min(1, "Floor must be at least 1"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  monthlyRate: z.coerce.number().min(0, "Monthly rate must be a positive number"),
  description: z.string().optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function EditRoomPage({
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    room?.amenities || []
  );
  const [customAmenity, setCustomAmenity] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: room
      ? {
          roomNumber: room.roomNumber,
          floor: room.floor,
          capacity: room.capacity,
          monthlyRate: room.monthlyRate,
          description: room.description || "",
          status: room.status,
        }
      : undefined,
  });

  const status = watch("status");

  useEffect(() => {
    if (room) {
      setSelectedAmenities(room.amenities);
    }
  }, [room]);

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

  const onSubmit = async (data: RoomFormData) => {
    setIsSubmitting(true);

    // In production, this would be an API call
    const updatedRoom = {
      ...room,
      ...data,
      amenities: selectedAmenities,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updating room:", updatedRoom);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Room Updated",
      description: `Room ${data.roomNumber} has been successfully updated.`,
    });

    setIsSubmitting(false);
    router.push(`/rooms/${id}`);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities((prev) => [...prev, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" type="button" asChild>
            <Link href={`/rooms/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Room {room.roomNumber}
            </h1>
            <p className="text-muted-foreground">
              {property?.name || "Unknown Property"} • Floor {room.floor}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href={`/rooms/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Room Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5" />
            Room Information
          </CardTitle>
          <CardDescription>Update the details for this room</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number *</Label>
              <Input
                id="roomNumber"
                {...register("roomNumber")}
                placeholder="e.g., 101, A-1"
              />
              {errors.roomNumber && (
                <p className="text-sm text-destructive">{errors.roomNumber.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                {...register("floor")}
              />
              {errors.floor && (
                <p className="text-sm text-destructive">{errors.floor.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (persons) *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                {...register("capacity")}
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">{errors.capacity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyRate">Monthly Rate (₱) *</Label>
              <Input
                id="monthlyRate"
                type="number"
                min="0"
                step="0.01"
                {...register("monthlyRate")}
              />
              {errors.monthlyRate && (
                <p className="text-sm text-destructive">{errors.monthlyRate.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE") => {
                  setValue("status", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="OCCUPIED">Occupied</SelectItem>
                  <SelectItem value="MAINTENANCE">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register("description")}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter room description, special features, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Room Amenities</CardTitle>
          <CardDescription>
            Select or add amenities available in this room
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Amenities */}
          {selectedAmenities.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {selectedAmenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="gap-1 pr-1">
                    {amenity}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 hover:bg-destructive/20"
                      onClick={() => removeAmenity(amenity)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Common Amenities */}
          <div className="space-y-2">
            <Label>Common Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Custom Amenity */}
          <div className="space-y-2">
            <Label>Add Custom Amenity</Label>
            <div className="flex gap-2">
              <Input
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Enter custom amenity"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomAmenity();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addCustomAmenity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Occupancy Notice */}
      {room.currentTenants > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700">Active Tenants</CardTitle>
            <CardDescription className="text-blue-600">
              This room currently has {room.currentTenants} tenant(s). Changing the
              status to &quot;Maintenance&quot; may require tenant coordination.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </form>
  );
}
