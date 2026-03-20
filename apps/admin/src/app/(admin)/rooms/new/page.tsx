"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, DoorOpen, Loader2, Plus, X } from "lucide-react";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Label } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/shared/ui";
import { useProperty } from "@/lib/property-context";
import { useToast } from "@havenspace/shared/ui";

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
  floor: z.preprocess(
    (val) => (val === "" || val === undefined ? 1 : Number(val)),
    z.number().min(1, "Floor must be at least 1")
  ),
  capacity: z.preprocess(
    (val) => (val === "" || val === undefined ? 1 : Number(val)),
    z.number().min(1, "Capacity must be at least 1")
  ),
  monthlyRate: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "Monthly rate must be a positive number")
  ),
  description: z.string().optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
});

type RoomFormData = z.infer<typeof roomSchema>;

export default function NewRoomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentProperty } = useProperty();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema) as unknown as Resolver<RoomFormData>,
    defaultValues: {
      roomNumber: "",
      floor: 1,
      capacity: 1,
      monthlyRate: 0,
      description: "",
      status: "AVAILABLE" as const,
    },
  });

  const status = watch("status");

  const onSubmit = async (data: RoomFormData) => {
    if (!currentProperty) {
      toast({
        title: "Error",
        description: "Please select a property first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // In production, this would be an API call
    const newRoom = {
      id: `room-${Date.now()}`,
      propertyId: currentProperty.id,
      ...data,
      amenities: selectedAmenities,
      currentTenants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Creating room:", newRoom);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Room Created",
      description: `Room ${data.roomNumber} has been successfully created.`,
    });

    setIsSubmitting(false);
    router.push("/rooms");
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    if (
      customAmenity.trim() &&
      !selectedAmenities.includes(customAmenity.trim())
    ) {
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
            <Link href="/rooms">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Room</h1>
            <p className="text-muted-foreground">
              {currentProperty
                ? `Creating room for ${currentProperty.name}`
                : "Select a property to create a room"}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting || !currentProperty}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Create Room
        </Button>
      </div>

      {!currentProperty && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700">
              No Property Selected
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Please select a property from the sidebar dropdown to create a
              room.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Room Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5" />
            Room Information
          </CardTitle>
          <CardDescription>Enter the details for the new room</CardDescription>
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
                <p className="text-destructive text-sm">
                  {errors.roomNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor *</Label>
              <Input id="floor" type="number" min="1" {...register("floor")} />
              {errors.floor && (
                <p className="text-destructive text-sm">
                  {errors.floor.message}
                </p>
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
                <p className="text-destructive text-sm">
                  {errors.capacity.message}
                </p>
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
                <p className="text-destructive text-sm">
                  {errors.monthlyRate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(
                  value: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
                ) => {
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
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {amenity}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/20 h-4 w-4"
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
                  variant={
                    selectedAmenities.includes(amenity) ? "default" : "outline"
                  }
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
              <Button
                type="button"
                variant="outline"
                onClick={addCustomAmenity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Room Preview</CardTitle>
          <CardDescription>
            Preview of how this room will appear in listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <DoorOpen className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    Room {watch("roomNumber") || "---"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Floor {watch("floor")} • Capacity: {watch("capacity")}{" "}
                    person(s)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ₱{(watch("monthlyRate") || 0).toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm">/month</p>
              </div>
            </div>
            {watch("description") && (
              <p className="text-muted-foreground mt-4 text-sm">
                {watch("description")}
              </p>
            )}
            {selectedAmenities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {selectedAmenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
