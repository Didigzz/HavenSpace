"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Label } from "@havenspace/shared/ui";
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
import { useToast } from "@havenspace/shared/ui";
import { useProperty } from "@/lib/property-context";
import { getRoomsByProperty, mockRooms } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const tenantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  roomId: z.string().optional(),
  moveInDate: z.string().min(1, "Move-in date is required"),
  leaseStartDate: z.string().min(1, "Lease start date is required"),
  leaseEndDate: z.string().optional(),
  monthlyRent: z.number().min(0, "Monthly rent must be positive"),
  depositAmount: z.number().min(0, "Deposit must be positive"),
});

type TenantFormData = z.infer<typeof tenantSchema>;

export default function NewTenantPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentProperty } = useProperty();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const rooms = currentProperty
    ? getRoomsByProperty(currentProperty.id).filter(
        (r) => r.status === "AVAILABLE"
      )
    : mockRooms.filter((r) => r.status === "AVAILABLE");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      monthlyRent: 0,
      depositAmount: 0,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRoomId = watch("roomId");
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Update monthly rent when room is selected
  React.useEffect(() => {
    if (selectedRoom) {
      setValue("monthlyRent", selectedRoom.monthlyRate);
      setValue("depositAmount", selectedRoom.monthlyRate * 2);
    }
  }, [selectedRoom, setValue]);

  const onSubmit = async (data: TenantFormData) => {
    setIsSubmitting(true);

    // Convert string values to numbers if needed
    const formattedData = {
      ...data,
      monthlyRent: Number(data.monthlyRent),
      depositAmount: Number(data.depositAmount),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Creating tenant:", formattedData);

    toast({
      title: "Tenant created",
      description: `${data.firstName} ${data.lastName} has been added successfully.`,
    });

    setIsSubmitting(false);
    router.push("/tenants");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tenants">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Tenant</h1>
          <p className="text-muted-foreground">
            Create a new tenant profile and assign them to a room
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Basic tenant details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Juan"
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Dela Cruz"
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="juan.delacruz@email.com"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+63 912 345 6789"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    {...register("emergencyContact")}
                    placeholder="Maria Dela Cruz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    {...register("emergencyPhone")}
                    placeholder="+63 912 345 6780"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Room Assignment</CardTitle>
              <CardDescription>
                Assign the tenant to an available room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Room</Label>
                <Select
                  value={selectedRoomId}
                  onValueChange={(value) => setValue("roomId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Room {room.roomNumber} - Floor {room.floor} (
                        {formatCurrency(room.monthlyRate)}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {rooms.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No available rooms. Please add a room first.
                  </p>
                )}
              </div>
              {selectedRoom && (
                <div className="bg-muted/50 rounded-lg border p-4">
                  <h4 className="font-medium">Room Details</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Capacity:</p>
                    <p>{selectedRoom.capacity} person(s)</p>
                    <p className="text-muted-foreground">Amenities:</p>
                    <p>{selectedRoom.amenities.join(", ") || "None"}</p>
                    <p className="text-muted-foreground">Monthly Rate:</p>
                    <p className="font-medium">
                      {formatCurrency(selectedRoom.monthlyRate)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lease Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lease Information</CardTitle>
              <CardDescription>Lease dates and rental terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="moveInDate">Move-in Date *</Label>
                  <Input
                    id="moveInDate"
                    type="date"
                    {...register("moveInDate")}
                  />
                  {errors.moveInDate && (
                    <p className="text-destructive text-sm">
                      {errors.moveInDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaseStartDate">Lease Start Date *</Label>
                  <Input
                    id="leaseStartDate"
                    type="date"
                    {...register("leaseStartDate")}
                  />
                  {errors.leaseStartDate && (
                    <p className="text-destructive text-sm">
                      {errors.leaseStartDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaseEndDate">Lease End Date</Label>
                <Input
                  id="leaseEndDate"
                  type="date"
                  {...register("leaseEndDate")}
                />
                <p className="text-muted-foreground text-xs">
                  Leave empty for month-to-month lease
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Monthly rent and deposit amounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent (₱) *</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  {...register("monthlyRent", { valueAsNumber: true })}
                  min={0}
                />
                {errors.monthlyRent && (
                  <p className="text-destructive text-sm">
                    {errors.monthlyRent.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Security Deposit (₱) *</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  {...register("depositAmount", { valueAsNumber: true })}
                  min={0}
                />
                {errors.depositAmount && (
                  <p className="text-destructive text-sm">
                    {errors.depositAmount.message}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  Typically 2 months of rent
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/tenants">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Tenant
          </Button>
        </div>
      </form>
    </div>
  );
}
