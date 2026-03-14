"use client";

import * as React from "react";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Wrench,
  Loader2,
  DoorOpen,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { Button } from "@havenspace/ui";
import { Input } from "@havenspace/ui";
import { Label } from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/ui";
import { useProperty } from "@/lib/property-context";
import { mockRooms, getRoomsByProperty } from "@/lib/mock-data";
import { useToast } from "@havenspace/ui";

const maintenanceSchema = z.object({
  roomId: z.string().min(1, "Please select a room"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  category: z.enum(["PLUMBING", "ELECTRICAL", "HVAC", "APPLIANCE", "STRUCTURAL", "OTHER"]),
  estimatedCost: z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), z.number().min(0).optional()),
  assignedTo: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

const categories = [
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "HVAC", label: "HVAC/Cooling" },
  { value: "APPLIANCE", label: "Appliance" },
  { value: "STRUCTURAL", label: "Structural" },
  { value: "OTHER", label: "Other" },
];

const priorityConfig = {
  LOW: { label: "Low", color: "text-green-600", description: "Can wait a few days" },
  MEDIUM: { label: "Medium", color: "text-yellow-600", description: "Should be addressed soon" },
  HIGH: { label: "High", color: "text-red-600", description: "Urgent - affects daily living" },
};

function NewMaintenanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currentProperty } = useProperty();

  const roomIdParam = searchParams.get("roomId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(roomIdParam || "");

  const rooms = currentProperty
    ? getRoomsByProperty(currentProperty.id)
    : mockRooms;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema) as unknown as Resolver<MaintenanceFormData>,
    defaultValues: {
      roomId: roomIdParam || "",
      title: "",
      description: "",
      priority: "MEDIUM" as const,
      category: "OTHER" as const,
      estimatedCost: 0,
      assignedTo: "",
    },
  });

  const priority = watch("priority");
  const category = watch("category");

  const onSubmit = async (data: MaintenanceFormData) => {
    setIsSubmitting(true);

    const room = rooms.find((r) => r.id === data.roomId);

    // In production, this would be an API call
    const newRequest = {
      id: `maint-${Date.now()}`,
      propertyId: currentProperty?.id || "prop-1",
      ...data,
      roomNumber: room?.roomNumber || "N/A",
      status: "PENDING",
      reportedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Creating maintenance request:", newRequest);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Request Created",
      description: "Maintenance request has been submitted successfully.",
    });

    setIsSubmitting(false);
    router.push("/maintenance");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" type="button" asChild>
            <Link href="/maintenance">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Maintenance Request</h1>
            <p className="text-muted-foreground">
              Report a maintenance issue or service request
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Submit Request
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Request Details
              </CardTitle>
              <CardDescription>
                Describe the maintenance issue in detail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roomId">Room *</Label>
                  <Select
                    value={selectedRoomId}
                    onValueChange={(value) => {
                      setSelectedRoomId(value);
                      setValue("roomId", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.roomNumber} (Floor {room.floor})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.roomId && (
                    <p className="text-sm text-destructive">{errors.roomId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={category}
                    onValueChange={(value: any) => {
                      setValue("category", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., Leaking faucet in bathroom"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Provide detailed information about the issue. Include when it started, how severe it is, and any relevant details..."
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Priority and Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Priority & Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Priority Level *</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((level) => {
                    const config = priorityConfig[level];
                    return (
                      <div
                        key={level}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                          priority === level
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setValue("priority", level)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              level === "LOW"
                                ? "bg-green-500"
                                : level === "MEDIUM"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className={`font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assign To (Optional)</Label>
                  <Input
                    id="assignedTo"
                    {...register("assignedTo")}
                    placeholder="Maintenance staff name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost (₱)</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("estimatedCost")}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Attachments (Optional)
              </CardTitle>
              <CardDescription>
                Add photos to help describe the issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-8">
                <div className="text-center">
                  <Camera className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop images here, or click to browse
                  </p>
                  <Button variant="outline" className="mt-4" type="button">
                    Upload Images
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Room Info */}
          {selectedRoom && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5" />
                  Room Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-medium">{selectedRoom.roomNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Floor</span>
                  <span>{selectedRoom.floor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline">{selectedRoom.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Occupants</span>
                  <span>{selectedRoom.currentTenants?.length || 0} / {selectedRoom.capacity}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">
                  {categories.find((c) => c.value === category)?.label || "Other"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Priority</span>
                <Badge
                  variant="outline"
                  className={
                    priority === "LOW"
                      ? "border-green-500 text-green-500"
                      : priority === "MEDIUM"
                      ? "border-yellow-500 text-yellow-500"
                      : "border-red-500 text-red-500"
                  }
                >
                  {priorityConfig[priority].label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Be as specific as possible about the issue</p>
              <p>• Include photos if available</p>
              <p>• Mention if the issue affects daily living</p>
              <p>• High priority issues are addressed first</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default function NewMaintenancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewMaintenanceContent />
    </Suspense>
  );
}
