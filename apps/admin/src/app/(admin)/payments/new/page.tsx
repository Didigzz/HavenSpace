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
  CreditCard,
  Loader2,
  User,
  DoorOpen,
  Calendar,
  Receipt,
} from "lucide-react";
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
import {
  mockTenants,
  mockRooms,
  getTenantsByProperty,
  getRoomsByProperty,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@havenspace/shared/ui";

const paymentSchema = z.object({
  tenantId: z.string().min(1, "Please select a tenant"),
  amount: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(1, "Amount must be greater than 0")
  ),
  type: z.enum(["RENT", "UTILITY", "DEPOSIT", "OTHER"]),
  dueDate: z.string().min(1, "Due date is required"),
  description: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "GCASH", "OTHER"]).optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

function NewPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currentProperty } = useProperty();

  const tenantIdParam = searchParams.get("tenantId");
  const roomIdParam = searchParams.get("roomId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(tenantIdParam || "");
  const [markAsPaid, setMarkAsPaid] = useState(false);

  const tenants = currentProperty
    ? getTenantsByProperty(currentProperty.id).filter((t) => t.isActive)
    : mockTenants.filter((t) => t.isActive);

  const rooms = currentProperty
    ? getRoomsByProperty(currentProperty.id)
    : mockRooms;

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
  const tenantRoom = selectedTenant
    ? rooms.find((r) => r.id === selectedTenant.roomId)
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(
      paymentSchema
    ) as unknown as Resolver<PaymentFormData>,
    defaultValues: {
      tenantId: tenantIdParam || "",
      amount: 0,
      type: "RENT" as const,
      dueDate: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  const paymentType = watch("type");

  // Auto-fill amount based on payment type and tenant
  React.useEffect(() => {
    if (selectedTenant && paymentType === "RENT") {
      setValue("amount", selectedTenant.monthlyRent ?? 0);
    } else if (selectedTenant && paymentType === "DEPOSIT") {
      setValue("amount", selectedTenant.depositAmount ?? 0);
    }
  }, [selectedTenant, paymentType, setValue]);

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);

    const tenant = tenants.find((t) => t.id === data.tenantId);
    const room = tenant ? rooms.find((r) => r.id === tenant.roomId) : null;

    // In production, this would be an API call
    const newPayment = {
      id: `pay-${Date.now()}`,
      propertyId: currentProperty?.id || "prop-1",
      ...data,
      tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unknown",
      roomNumber: room?.roomNumber || "N/A",
      status: markAsPaid ? "PAID" : "PENDING",
      paidDate: markAsPaid ? new Date().toISOString() : undefined,
      receiptNumber: markAsPaid
        ? `RCP-${Date.now().toString().slice(-8)}`
        : undefined,
      createdAt: new Date().toISOString(),
    };

    console.log("Creating payment:", newPayment);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: markAsPaid ? "Payment Recorded" : "Payment Created",
      description: markAsPaid
        ? `Payment of ${formatCurrency(data.amount)} has been recorded.`
        : `Payment request for ${formatCurrency(data.amount)} has been created.`,
    });

    setIsSubmitting(false);
    router.push("/payments");
  };

  const generateReceiptPreview = () => {
    const tenant = tenants.find((t) => t.id === selectedTenantId);
    const amount = watch("amount") || 0;
    const type = watch("type") || "RENT";

    return {
      tenant: tenant
        ? `${tenant.firstName} ${tenant.lastName}`
        : "Select a tenant",
      room: tenantRoom?.roomNumber || "N/A",
      amount: formatCurrency(Number(amount)),
      type,
      date: new Date().toLocaleDateString(),
    };
  };

  const preview = generateReceiptPreview();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" type="button" asChild>
            <Link href="/payments">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Payment</h1>
            <p className="text-muted-foreground">
              Create a new payment record or request
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {markAsPaid ? "Record Payment" : "Create Payment"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
              <CardDescription>Enter the payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant *</Label>
                  <Select
                    value={selectedTenantId}
                    onValueChange={(value) => {
                      setSelectedTenantId(value);
                      setValue("tenantId", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => {
                        const room = rooms.find((r) => r.id === tenant.roomId);
                        return (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.firstName} {tenant.lastName}
                            {room && ` (Room ${room.roomNumber})`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.tenantId && (
                    <p className="text-destructive text-sm">
                      {errors.tenantId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Payment Type *</Label>
                  <Select
                    value={paymentType}
                    onValueChange={(
                      value: "RENT" | "UTILITY" | "DEPOSIT" | "OTHER"
                    ) => {
                      setValue("type", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RENT">Rent</SelectItem>
                      <SelectItem value="UTILITY">Utility</SelectItem>
                      <SelectItem value="DEPOSIT">Deposit</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₱) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("amount")}
                  />
                  {errors.amount && (
                    <p className="text-destructive text-sm">
                      {errors.amount.message}
                    </p>
                  )}
                  {selectedTenant && paymentType === "RENT" && (
                    <p className="text-muted-foreground text-xs">
                      Suggested:{" "}
                      {formatCurrency(selectedTenant.monthlyRent ?? 0)} (monthly
                      rent)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input id="dueDate" type="date" {...register("dueDate")} />
                  {errors.dueDate && (
                    <p className="text-destructive text-sm">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  className="border-input bg-background min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Additional notes about this payment..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Mark as Paid</p>
                  <p className="text-muted-foreground text-sm">
                    Record this as a completed payment with a receipt
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={markAsPaid}
                    onChange={(e) => setMarkAsPaid(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer peer-checked:bg-primary peer-focus:ring-primary/20 h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>

              {markAsPaid && (
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    onValueChange={(
                      value: "CASH" | "BANK_TRANSFER" | "GCASH" | "OTHER"
                    ) => {
                      setValue("paymentMethod", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="BANK_TRANSFER">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="GCASH">GCash</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Receipt Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Receipt Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
                <div className="border-b pb-3 text-center">
                  <h3 className="font-semibold">Haven Space Payment Receipt</h3>
                  <p className="text-muted-foreground text-xs">
                    {preview.date}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenant:</span>
                    <span className="font-medium">{preview.tenant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span>{preview.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{preview.type}</Badge>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="text-xl font-bold">{preview.amount}</span>
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <Badge variant={markAsPaid ? "default" : "secondary"}>
                    {markAsPaid ? "PAID" : "PENDING"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Info */}
          {selectedTenant && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Tenant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <User className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedTenant.firstName} {selectedTenant.lastName}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {selectedTenant.email}
                    </p>
                  </div>
                </div>
                {tenantRoom && (
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                      <DoorOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Room {tenantRoom.roomNumber}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Floor {tenantRoom.floor}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-2 pt-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span>
                      {formatCurrency(selectedTenant.monthlyRent ?? 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span
                      className={
                        selectedTenant.balance && selectedTenant.balance > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {formatCurrency(selectedTenant.balance ?? 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/tenants">
                  <User className="mr-2 h-4 w-4" />
                  View All Tenants
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/payments">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Payments
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPaymentContent />
    </Suspense>
  );
}
