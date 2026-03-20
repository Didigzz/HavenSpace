"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  Clock,
  Download,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Loader,
  FileText,
  Wallet,
  Building,
  Plus,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@havenspace/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@havenspace/shared/ui";
import { Label } from "@havenspace/shared/ui";
import { Separator } from "@havenspace/shared/ui";
import { Progress } from "@havenspace/shared/ui";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

// Mock payment data
const mockPayments = [
  {
    id: "PAY-001",
    propertyName: "Sunrise Dormitory",
    type: "monthly",
    amount: 5500,
    status: "completed",
    paidAt: "2025-01-15T10:30:00",
    method: "GCash",
    reference: "GC-2025011510301234",
    period: "January 2025",
  },
  {
    id: "PAY-002",
    propertyName: "Sunrise Dormitory",
    type: "deposit",
    amount: 11000,
    status: "completed",
    paidAt: "2025-01-10T14:20:00",
    method: "Bank Transfer",
    reference: "BT-2025011014201234",
    period: "Security Deposit",
  },
  {
    id: "PAY-003",
    propertyName: "Green Valley Boarding House",
    type: "deposit",
    amount: 6500,
    status: "pending",
    paidAt: null,
    method: null,
    reference: null,
    period: "Security Deposit",
    dueDate: "2025-01-25",
  },
  {
    id: "PAY-004",
    propertyName: "City Center Dorm",
    type: "monthly",
    amount: 7000,
    status: "completed",
    paidAt: "2024-11-01T09:15:00",
    method: "PayMaya",
    reference: "PM-2024110109151234",
    period: "November 2024",
  },
  {
    id: "PAY-005",
    propertyName: "City Center Dorm",
    type: "monthly",
    amount: 7000,
    status: "completed",
    paidAt: "2024-10-01T11:45:00",
    method: "GCash",
    reference: "GC-2024100111451234",
    period: "October 2024",
  },
];

const mockUpcomingPayments = [
  {
    id: "UP-001",
    propertyName: "Sunrise Dormitory",
    type: "monthly",
    amount: 5500,
    dueDate: "2025-02-01",
    period: "February 2025",
    status: "upcoming",
  },
  {
    id: "UP-002",
    propertyName: "Green Valley Boarding House",
    type: "deposit",
    amount: 6500,
    dueDate: "2025-01-25",
    period: "Security Deposit",
    status: "due",
  },
];

const paymentMethods = [
  { id: "gcash", name: "GCash", icon: "📱" },
  { id: "paymaya", name: "PayMaya", icon: "💳" },
  { id: "bank", name: "Bank Transfer", icon: "🏦" },
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  failed: { label: "Failed", color: "bg-red-100 text-red-800" },
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-800" },
  due: { label: "Due Soon", color: "bg-orange-100 text-orange-800" },
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentToPay, setPaymentToPay] = useState<
    (typeof mockUpcomingPayments)[0] | null
  >(null);

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = mockPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const selectedPaymentData = mockPayments.find(
    (p) => p.id === selectedPayment
  );

  const handlePay = (payment: (typeof mockUpcomingPayments)[0]) => {
    setPaymentToPay(payment);
    setShowPayDialog(true);
  };

  const handleConfirmPayment = () => {
    console.log(
      "Processing payment:",
      paymentToPay,
      "with method:",
      selectedMethod
    );
    setShowPayDialog(false);
    setSelectedMethod(null);
    setPaymentToPay(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Payments
          </h1>
          <p className="text-muted-foreground">
            Manage your rent payments and billing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Statements
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Paid
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-muted-foreground text-xs">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(5500)}</div>
            <p className="text-muted-foreground text-xs">January 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Next Due
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(6500)}</div>
            <p className="text-muted-foreground text-xs">Due Jan 25, 2025</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Payments */}
      {mockUpcomingPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Upcoming Payments
            </CardTitle>
            <CardDescription>
              Payments that are due or coming up soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-muted rounded-full p-2">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.propertyName}</p>
                      <p className="text-muted-foreground text-sm">
                        {payment.period}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-muted-foreground flex items-center justify-end gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        Due {formatDate(payment.dueDate)}
                      </p>
                    </div>
                    <Badge className={statusConfig[payment.status]?.color}>
                      {statusConfig[payment.status]?.label}
                    </Badge>
                    <Button onClick={() => handlePay(payment)}>Pay Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View all your past and pending payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Table */}
          <div className="overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium">
                      Transaction
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Property
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Amount
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-medium">Date</th>
                    <th className="p-4 text-left text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/30">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{payment.id}</p>
                          <p className="text-muted-foreground text-sm capitalize">
                            {payment.type} - {payment.period}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{payment.propertyName}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">
                          {formatCurrency(payment.amount)}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge className={statusConfig[payment.status]?.color}>
                          {statusConfig[payment.status]?.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {payment.paidAt
                            ? formatDateTime(payment.paidAt)
                            : "-"}
                        </p>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPayment(payment.id)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog
        open={!!selectedPayment}
        onOpenChange={() => setSelectedPayment(null)}
      >
        <DialogContent>
          {selectedPaymentData && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogDescription>
                  Transaction {selectedPaymentData.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={statusConfig[selectedPaymentData.status]?.color}
                  >
                    {statusConfig[selectedPaymentData.status]?.label}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property</span>
                    <span className="font-medium">
                      {selectedPaymentData.propertyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">
                      {selectedPaymentData.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Period</span>
                    <span className="font-medium">
                      {selectedPaymentData.period}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(selectedPaymentData.amount)}
                    </span>
                  </div>
                </div>
                {selectedPaymentData.status === "completed" && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid On</span>
                        <span className="font-medium">
                          {formatDateTime(selectedPaymentData.paidAt!)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span className="font-medium">
                          {selectedPaymentData.method}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference</span>
                        <span className="font-mono text-sm">
                          {selectedPaymentData.reference}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                {selectedPaymentData.status === "completed" && (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                )}
                <Button onClick={() => setSelectedPayment(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method
            </DialogDescription>
          </DialogHeader>
          {paymentToPay && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{paymentToPay.propertyName}</p>
                    <p className="text-muted-foreground text-sm">
                      {paymentToPay.period}
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(paymentToPay.amount)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`rounded-lg border p-4 text-left transition-colors ${
                        selectedMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <p className="mt-2 font-medium">{method.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment} disabled={!selectedMethod}>
              Pay {paymentToPay && formatCurrency(paymentToPay.amount)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
