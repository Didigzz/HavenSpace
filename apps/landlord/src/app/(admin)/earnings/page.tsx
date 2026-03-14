"use client";

import * as React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Building2,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Receipt,
  Filter,
} from "lucide-react";
import { Button } from "@havenspace/ui";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@havenspace/ui";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "income" | "payout" | "refund" | "fee";
  description: string;
  amount: number;
  property: string;
  date: string;
  status: "completed" | "pending" | "failed";
  boarder?: string;
}

interface Payout {
  id: string;
  amount: number;
  method: string;
  accountNumber: string;
  status: "completed" | "pending" | "processing";
  requestDate: string;
  completedDate?: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  { id: "1", type: "income", description: "Monthly Rent - Maria Santos", amount: 5000, property: "Sunrise Residences", date: "2024-01-15", status: "completed", boarder: "Maria Santos" },
  { id: "2", type: "income", description: "Monthly Rent - Juan Dela Cruz", amount: 4500, property: "Sunrise Residences", date: "2024-01-15", status: "completed", boarder: "Juan Dela Cruz" },
  { id: "3", type: "fee", description: "Platform Service Fee", amount: -475, property: "Sunrise Residences", date: "2024-01-15", status: "completed" },
  { id: "4", type: "payout", description: "Withdrawal to Bank Account", amount: -8000, property: "All Properties", date: "2024-01-14", status: "completed" },
  { id: "5", type: "income", description: "Monthly Rent - Carlos Reyes", amount: 6000, property: "Metro Living Spaces", date: "2024-01-10", status: "completed", boarder: "Carlos Reyes" },
  { id: "6", type: "income", description: "Security Deposit - Ana Garcia", amount: 5500, property: "Green Valley BH", date: "2024-01-08", status: "completed", boarder: "Ana Garcia" },
  { id: "7", type: "refund", description: "Deposit Refund - Lisa Chen", amount: -5000, property: "Sunrise Residences", date: "2024-01-05", status: "completed", boarder: "Lisa Chen" },
  { id: "8", type: "income", description: "Monthly Rent - Lisa Chen (Dec)", amount: 5000, property: "Sunrise Residences", date: "2024-01-01", status: "completed", boarder: "Lisa Chen" },
];

const mockPayouts: Payout[] = [
  { id: "1", amount: 8000, method: "Bank Transfer", accountNumber: "****1234", status: "completed", requestDate: "2024-01-13", completedDate: "2024-01-14" },
  { id: "2", amount: 12000, method: "GCash", accountNumber: "****5678", status: "completed", requestDate: "2024-01-06", completedDate: "2024-01-07" },
  { id: "3", amount: 5000, method: "Bank Transfer", accountNumber: "****1234", status: "processing", requestDate: "2024-01-15" },
  { id: "4", amount: 15000, method: "Bank Transfer", accountNumber: "****1234", status: "completed", requestDate: "2023-12-28", completedDate: "2023-12-29" },
];

const earningsByProperty = [
  { property: "Sunrise Residences", revenue: 45000, occupancy: 85, rooms: 20 },
  { property: "Metro Living Spaces", revenue: 32000, occupancy: 78, rooms: 15 },
  { property: "Green Valley BH", revenue: 28000, occupancy: 90, rooms: 12 },
];

const transactionTypeConfig = {
  income: { icon: ArrowUpRight, color: "text-green-600", bgColor: "bg-green-100" },
  payout: { icon: ArrowDownRight, color: "text-blue-600", bgColor: "bg-blue-100" },
  refund: { icon: ArrowDownRight, color: "text-orange-600", bgColor: "bg-orange-100" },
  fee: { icon: Receipt, color: "text-red-600", bgColor: "bg-red-100" },
};

const payoutStatusConfig = {
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
};

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === "positive" && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
                {changeType === "negative" && (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    changeType === "positive" && "text-green-500",
                    changeType === "negative" && "text-red-500",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </span>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EarningsPage() {
  const [periodFilter, setPeriodFilter] = React.useState("this-month");
  const [propertyFilter, setPropertyFilter] = React.useState("all");

  const totalEarnings = mockTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayouts = mockTransactions
    .filter((t) => t.type === "payout")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const availableBalance = totalEarnings - totalPayouts - 
    Math.abs(mockTransactions.filter((t) => t.type === "fee").reduce((sum, t) => sum + t.amount, 0)) -
    Math.abs(mockTransactions.filter((t) => t.type === "refund").reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="text-muted-foreground">
            Track your revenue and manage payouts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Wallet className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Earnings"
          value={`₱${totalEarnings.toLocaleString()}`}
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Available Balance"
          value={`₱${availableBalance.toLocaleString()}`}
          subtitle="Ready for withdrawal"
          icon={Wallet}
        />
        <StatCard
          title="Pending Payouts"
          value={`₱${mockPayouts.filter(p => p.status === "processing").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`}
          subtitle="Being processed"
          icon={CreditCard}
        />
        <StatCard
          title="Total Withdrawn"
          value={`₱${totalPayouts.toLocaleString()}`}
          change="+8.2% from last month"
          changeType="positive"
          icon={PiggyBank}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="by-property">By Property</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    All income, payouts, refunds, and fees
                  </CardDescription>
                </div>
                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Properties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {earningsByProperty.map((p) => (
                      <SelectItem key={p.property} value={p.property}>
                        {p.property}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions
                  .filter((t) => propertyFilter === "all" || t.property === propertyFilter)
                  .map((transaction) => {
                    const config = transactionTypeConfig[transaction.type];
                    const Icon = config.icon;
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", config.bgColor)}>
                            <Icon className={cn("h-5 w-5", config.color)} />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              <span>{transaction.property}</span>
                              <span>•</span>
                              <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-semibold",
                            transaction.amount > 0 ? "text-green-600" : "text-foreground"
                          )}>
                            {transaction.amount > 0 ? "+" : ""}₱{Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              transaction.status === "completed" && "bg-green-100 text-green-800",
                              transaction.status === "pending" && "bg-yellow-100 text-yellow-800"
                            )}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Track your withdrawal requests and completed payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayouts.map((payout) => {
                  const statusConfig = payoutStatusConfig[payout.status];
                  return (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Withdrawal to {payout.method}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Account: {payout.accountNumber}</span>
                            <span>•</span>
                            <span>Requested: {new Date(payout.requestDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₱{payout.amount.toLocaleString()}</p>
                        <Badge className={cn("text-xs", statusConfig.color)}>
                          {statusConfig.label}
                        </Badge>
                        {payout.completedDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Completed: {new Date(payout.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Property Tab */}
        <TabsContent value="by-property" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {earningsByProperty.map((property) => (
              <Card key={property.property}>
                <CardHeader>
                  <CardTitle className="text-lg">{property.property}</CardTitle>
                  <CardDescription>{property.rooms} rooms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                    <span className="text-lg font-bold">₱{property.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                    <span className="text-lg font-semibold text-green-600">{property.occupancy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. per Room</span>
                    <span className="font-medium">₱{Math.round(property.revenue / (property.rooms * property.occupancy / 100)).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${property.occupancy}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(property.rooms * property.occupancy / 100)} of {property.rooms} rooms occupied
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
