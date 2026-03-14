"use client";

import * as React from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Separator,
} from "@havenspace/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatDate, formatCurrency, getInitials, getRelativeTime, formatDateTime } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PaymentStatus = "completed" | "pending" | "failed" | "refunded" | "disputed";
type PaymentMethod = "gcash" | "paymaya" | "bank_transfer" | "cash";

interface PaymentData {
  id: string;
  bookingId: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  payer: {
    id: string;
    name: string;
    email: string;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
  };
  listing: string;
  description: string;
  createdAt: Date;
  completedAt: Date | null;
  disputeReason?: string;
}

// Mock payments data
const mockPayments: PaymentData[] = [
  {
    id: "PAY001",
    bookingId: "BK001",
    amount: 5000,
    fee: 150,
    netAmount: 4850,
    status: "completed",
    method: "gcash",
    payer: { id: "b1", name: "Juan Cruz", email: "juan@example.com" },
    recipient: { id: "l1", name: "Maria Santos", email: "maria@example.com" },
    listing: "Sunny View Boarding House",
    description: "Monthly rent - January 2025",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "PAY002",
    bookingId: "BK002",
    amount: 4500,
    fee: 135,
    netAmount: 4365,
    status: "pending",
    method: "paymaya",
    payer: { id: "b2", name: "Sofia Mendoza", email: "sofia@example.com" },
    recipient: { id: "l2", name: "Carlos Tan", email: "carlos@example.com" },
    listing: "Green Residence Dormitory",
    description: "Security deposit",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    completedAt: null,
  },
  {
    id: "PAY003",
    bookingId: "BK003",
    amount: 5000,
    fee: 150,
    netAmount: 4850,
    status: "disputed",
    method: "bank_transfer",
    payer: { id: "b3", name: "Pedro Garcia", email: "pedro@example.com" },
    recipient: { id: "l1", name: "Maria Santos", email: "maria@example.com" },
    listing: "Sunny View Boarding House",
    description: "Monthly rent - December 2024",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    disputeReason: "Services not as described - Room conditions differ from listing",
  },
  {
    id: "PAY004",
    bookingId: "BK004",
    amount: 8000,
    fee: 240,
    netAmount: 7760,
    status: "completed",
    method: "gcash",
    payer: { id: "b4", name: "Lisa Tan", email: "lisa@example.com" },
    recipient: { id: "l3", name: "Ana Reyes", email: "ana@example.com" },
    listing: "Premium Suites Manila",
    description: "Monthly rent - January 2025",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "PAY005",
    bookingId: "BK005",
    amount: 4000,
    fee: 120,
    netAmount: 3880,
    status: "failed",
    method: "bank_transfer",
    payer: { id: "b5", name: "Mark Santos", email: "mark@example.com" },
    recipient: { id: "l2", name: "Carlos Tan", email: "carlos@example.com" },
    listing: "Student Housing Complex",
    description: "Monthly rent - January 2025",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    completedAt: null,
  },
  {
    id: "PAY006",
    bookingId: "BK006",
    amount: 4500,
    fee: 135,
    netAmount: 4365,
    status: "refunded",
    method: "gcash",
    payer: { id: "b6", name: "Anna Lee", email: "anna@example.com" },
    recipient: { id: "l2", name: "Carlos Tan", email: "carlos@example.com" },
    listing: "Green Residence Dormitory",
    description: "Monthly rent - November 2024 (Refunded due to early termination)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
  },
];

// Revenue chart data
const revenueChartData = [
  { date: "Jan 1", revenue: 125000 },
  { date: "Jan 5", revenue: 180000 },
  { date: "Jan 10", revenue: 220000 },
  { date: "Jan 15", revenue: 310000 },
  { date: "Jan 20", revenue: 380000 },
  { date: "Jan 25", revenue: 450000 },
  { date: "Jan 30", revenue: 520000 },
];

const statusColors: Record<PaymentStatus, string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  refunded: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  disputed: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
};

const methodLabels: Record<PaymentMethod, string> = {
  gcash: "GCash",
  paymaya: "PayMaya",
  bank_transfer: "Bank Transfer",
  cash: "Cash",
};

const statusIcons: Record<PaymentStatus, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
  refunded: ArrowDownRight,
  disputed: AlertTriangle,
};

export default function PaymentsPage() {
  const [filter, setFilter] = React.useState<"all" | PaymentStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPayment, setSelectedPayment] = React.useState<PaymentData | null>(null);
  const [disputeDialog, setDisputeDialog] = React.useState<{
    open: boolean;
    payment: PaymentData | null;
    action: "resolve" | "refund" | null;
  }>({ open: false, payment: null, action: null });

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesFilter = filter === "all" || payment.status === filter;
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.payer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.listing.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFees = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.fee, 0);

  const paymentCounts = {
    all: mockPayments.length,
    completed: mockPayments.filter((p) => p.status === "completed").length,
    pending: mockPayments.filter((p) => p.status === "pending").length,
    disputed: mockPayments.filter((p) => p.status === "disputed").length,
    failed: mockPayments.filter((p) => p.status === "failed").length,
    refunded: mockPayments.filter((p) => p.status === "refunded").length,
  };

  const handleDisputeAction = (action: "resolve" | "refund") => {
    console.log(`${action} dispute for payment ${disputeDialog.payment?.id}`);
    setDisputeDialog({ open: false, payment: null, action: null });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments Monitoring</h1>
          <p className="text-muted-foreground">
            Track and manage all platform payments
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFees)}</div>
            <p className="text-xs text-muted-foreground">3% transaction fee</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disputes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentCounts.disputed}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Daily revenue for the current month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `₱${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "Revenue"] as [string, string]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="disputed">Disputed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
                <TabsTrigger value="refunded">Refunded</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                className="w-full pl-9 md:w-72"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => {
                  const StatusIcon = statusIcons[payment.status];
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                              {getInitials(payment.payer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{payment.payer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                              {getInitials(payment.recipient.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{payment.recipient.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatCurrency(payment.fee)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {methodLabels[payment.method]}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", statusColors[payment.status])}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getRelativeTime(payment.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {payment.status === "disputed" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    setDisputeDialog({ open: true, payment, action: "resolve" })
                                  }
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Resolve Dispute
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setDisputeDialog({ open: true, payment, action: "refund" })
                                  }
                                  className="text-orange-600"
                                >
                                  <ArrowDownRight className="mr-2 h-4 w-4" />
                                  Issue Refund
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog
        open={!!selectedPayment}
        onOpenChange={(open) => !open && setSelectedPayment(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogDescription>
                  Payment ID: {selectedPayment.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <Badge className={cn(statusColors[selectedPayment.status])}>
                    {selectedPayment.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    via {methodLabels[selectedPayment.method]}
                  </span>
                </div>

                {/* Amount Details */}
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (3%)</span>
                    <span className="text-muted-foreground">-{formatCurrency(selectedPayment.fee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Net Amount</span>
                    <span className="font-medium">{formatCurrency(selectedPayment.netAmount)}</span>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground mb-2">From (Payer)</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {getInitials(selectedPayment.payer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedPayment.payer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPayment.payer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground mb-2">To (Recipient)</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          {getInitials(selectedPayment.recipient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedPayment.recipient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPayment.recipient.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedPayment.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Listing: {selectedPayment.listing}
                  </p>
                </div>

                {/* Dispute Info */}
                {selectedPayment.status === "disputed" && selectedPayment.disputeReason && (
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-950 p-4">
                    <p className="font-medium text-orange-800 dark:text-orange-200">
                      Dispute Reason
                    </p>
                    <p className="text-orange-700 dark:text-orange-300">
                      {selectedPayment.disputeReason}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="text-sm text-muted-foreground">
                  <p>Created: {formatDateTime(selectedPayment.createdAt)}</p>
                  {selectedPayment.completedAt && (
                    <p>Completed: {formatDateTime(selectedPayment.completedAt)}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                  Close
                </Button>
                {selectedPayment.status === "disputed" && (
                  <Button
                    onClick={() => {
                      setSelectedPayment(null);
                      setDisputeDialog({ open: true, payment: selectedPayment, action: "resolve" });
                    }}
                  >
                    Handle Dispute
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispute Action Dialog */}
      <Dialog
        open={disputeDialog.open}
        onOpenChange={(open) =>
          !open && setDisputeDialog({ open: false, payment: null, action: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {disputeDialog.action === "resolve" ? "Resolve Dispute" : "Issue Refund"}
            </DialogTitle>
            <DialogDescription>
              {disputeDialog.action === "resolve"
                ? "This will mark the dispute as resolved in favor of the landlord. The payment will be released."
                : "This will refund the full amount to the boarder. The landlord will not receive the payment."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Resolution Notes</label>
            <textarea
              className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={4}
              placeholder="Add notes about this decision..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisputeDialog({ open: false, payment: null, action: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDisputeAction(disputeDialog.action!)}
              className={cn(
                disputeDialog.action === "resolve" && "bg-green-600 hover:bg-green-700",
                disputeDialog.action === "refund" && "bg-orange-600 hover:bg-orange-700"
              )}
            >
              {disputeDialog.action === "resolve" ? "Resolve & Release" : "Issue Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
