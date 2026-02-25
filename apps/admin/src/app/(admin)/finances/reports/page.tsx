"use client";

import * as React from "react";
import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Building2,
  Users,
  DoorOpen,
  DollarSign,
} from "lucide-react";
import { Button } from "@bhms/ui";
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
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useProperty } from "@/lib/property-context";
import {
  mockPayments,
  mockExpenses,
  mockRooms,
  mockTenants,
  mockProperties,
  getRevenueData,
  getRoomsByProperty,
  getTenantsByProperty,
  getPaymentsByProperty,
  getExpensesByProperty,
} from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";
import { useToast } from "@bhms/ui";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ReportsPage() {
  const { currentProperty } = useProperty();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedReportType, setSelectedReportType] = useState("financial");

  // Get data based on current property
  const payments = currentProperty
    ? getPaymentsByProperty(currentProperty.id)
    : mockPayments;
  const expenses = currentProperty
    ? getExpensesByProperty(currentProperty.id)
    : mockExpenses;
  const rooms = currentProperty
    ? getRoomsByProperty(currentProperty.id)
    : mockRooms;
  const tenants = currentProperty
    ? getTenantsByProperty(currentProperty.id)
    : mockTenants;
  const revenueData = getRevenueData(currentProperty?.id);

  // Calculate metrics
  const totalRevenue = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const activeTenants = tenants.filter((t) => t.isActive).length;

  // Occupancy trend data
  const occupancyTrendData = [
    { month: "Aug", rate: 75, tenants: 12 },
    { month: "Sep", rate: 80, tenants: 14 },
    { month: "Oct", rate: 85, tenants: 15 },
    { month: "Nov", rate: 82, tenants: 14 },
    { month: "Dec", rate: 88, tenants: 16 },
    { month: "Jan", rate: occupancyRate, tenants: activeTenants },
  ];

  // Room status distribution
  const roomStatusData = [
    { name: "Occupied", value: rooms.filter((r) => r.status === "OCCUPIED").length },
    { name: "Available", value: rooms.filter((r) => r.status === "AVAILABLE").length },
    { name: "Maintenance", value: rooms.filter((r) => r.status === "MAINTENANCE").length },
  ].filter((d) => d.value > 0);

  // Payment status distribution
  const paymentStatusData = [
    { name: "Paid", value: payments.filter((p) => p.status === "PAID").length },
    { name: "Pending", value: payments.filter((p) => p.status === "PENDING").length },
    { name: "Overdue", value: payments.filter((p) => p.status === "OVERDUE").length },
  ].filter((d) => d.value > 0);

  // Collection efficiency - use deterministic values for rendering
  const collectionData = revenueData.map((d, i) => ({
    ...d,
    collected: d.revenue * (0.85 + (i * 0.02)),
    target: d.revenue * 1.1,
  }));

  const handleExport = (type: string) => {
    toast({
      title: "Exporting Report",
      description: `Your ${type} report is being generated...`,
    });
    // In production, this would generate and download a PDF/Excel file
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your report has been downloaded.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and analyze property performance reports
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExport(selectedReportType)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", netIncome >= 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((netIncome / totalRevenue) * 100) || 0}% margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {occupiedRooms} of {totalRooms} rooms occupied
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTenants}</div>
            <p className="text-xs text-muted-foreground">
              Across {currentProperty ? "1" : mockProperties.length} properties
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (payments.filter((p) => p.status === "PAID").length /
                  payments.length) *
                  100
              ) || 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "PAID").length} of {payments.length} collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={selectedReportType} onValueChange={setSelectedReportType} className="space-y-6">
        <TabsList>
          <TabsTrigger value="financial">
            <DollarSign className="mr-2 h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="occupancy">
            <Building2 className="mr-2 h-4 w-4" />
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="collection">
            <BarChart3 className="mr-2 h-4 w-4" />
            Collection
          </TabsTrigger>
        </TabsList>

        {/* Financial Report */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses Trend</CardTitle>
                <CardDescription>Monthly financial comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenueReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpensesReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-3 shadow-md">
                                <p className="font-medium">{label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: {formatCurrency(entry.value as number)}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="hsl(var(--chart-1))"
                        fillOpacity={1}
                        fill="url(#colorRevenueReport)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses"
                        stroke="hsl(var(--chart-2))"
                        fillOpacity={1}
                        fill="url(#colorExpensesReport)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Distribution of payment statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {paymentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  {paymentStatusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Detailed breakdown of income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border">
                  <div className="grid grid-cols-3 gap-4 border-b bg-muted/50 p-4 font-medium">
                    <span>Category</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">% of Total</span>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <span className="font-medium text-green-600">Revenue</span>
                      <span className="text-right text-green-600">{formatCurrency(totalRevenue)}</span>
                      <span className="text-right">100%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4 pl-8">
                      <span className="text-muted-foreground">Rent Payments</span>
                      <span className="text-right">
                        {formatCurrency(
                          payments
                            .filter((p) => p.type === "RENT" && p.status === "PAID")
                            .reduce((sum, p) => sum + p.amount, 0)
                        )}
                      </span>
                      <span className="text-right text-muted-foreground">
                        {Math.round(
                          (payments
                            .filter((p) => p.type === "RENT" && p.status === "PAID")
                            .reduce((sum, p) => sum + p.amount, 0) /
                            totalRevenue) *
                            100
                        ) || 0}
                        %
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4 pl-8">
                      <span className="text-muted-foreground">Utilities</span>
                      <span className="text-right">
                        {formatCurrency(
                          payments
                            .filter((p) => p.type === "UTILITY" && p.status === "PAID")
                            .reduce((sum, p) => sum + p.amount, 0)
                        )}
                      </span>
                      <span className="text-right text-muted-foreground">
                        {Math.round(
                          (payments
                            .filter((p) => p.type === "UTILITY" && p.status === "PAID")
                            .reduce((sum, p) => sum + p.amount, 0) /
                            totalRevenue) *
                            100
                        ) || 0}
                        %
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      <span className="font-medium text-red-600">Expenses</span>
                      <span className="text-right text-red-600">{formatCurrency(totalExpenses)}</span>
                      <span className="text-right">
                        {Math.round((totalExpenses / totalRevenue) * 100) || 0}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t-2 bg-muted/30 p-4">
                      <span className="font-semibold">Net Income</span>
                      <span
                        className={cn(
                          "text-right font-semibold",
                          netIncome >= 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {formatCurrency(netIncome)}
                      </span>
                      <span className="text-right font-semibold">
                        {Math.round((netIncome / totalRevenue) * 100) || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Occupancy Report */}
        <TabsContent value="occupancy" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Trend</CardTitle>
                <CardDescription>Monthly occupancy rate and tenant count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={occupancyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-3 shadow-md">
                                <p className="font-medium">{label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.name}: {entry.value}
                                    {entry.name === "Occupancy Rate" ? "%" : ""}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="rate"
                        name="Occupancy Rate"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-1))" }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="tenants"
                        name="Active Tenants"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--chart-2))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Status Distribution</CardTitle>
                <CardDescription>Current status of all rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roomStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {roomStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Occupied"
                                ? "hsl(var(--chart-1))"
                                : entry.name === "Available"
                                ? "hsl(var(--chart-3))"
                                : "hsl(var(--chart-4))"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  {roomStatusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          entry.name === "Occupied"
                            ? "bg-[hsl(var(--chart-1))]"
                            : entry.name === "Available"
                            ? "bg-[hsl(var(--chart-3))]"
                            : "bg-[hsl(var(--chart-4))]"
                        )}
                      />
                      <span className="text-sm">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Collection Report */}
        <TabsContent value="collection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Performance</CardTitle>
              <CardDescription>Target vs Actual collection comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-3 shadow-md">
                              <p className="font-medium">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-sm" style={{ color: entry.color }}>
                                  {entry.name}: {formatCurrency(entry.value as number)}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="target" name="Target" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="collected" name="Collected" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Collection Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Billed</CardDescription>
                <CardTitle className="text-2xl">
                  {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Collected</CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {formatCurrency(
                    payments
                      .filter((p) => p.status === "PAID")
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Outstanding</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {formatCurrency(
                    payments
                      .filter((p) => p.status !== "PAID")
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
          <CardDescription>Generate common reports with one click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Monthly Financial Statement",
                description: "Complete income and expense summary",
                icon: FileText,
              },
              {
                name: "Occupancy Report",
                description: "Room utilization and vacancy analysis",
                icon: Building2,
              },
              {
                name: "Tenant Roster",
                description: "List of all active tenants",
                icon: Users,
              },
              {
                name: "Payment Collection",
                description: "Outstanding and collected payments",
                icon: DollarSign,
              },
            ].map((report) => (
              <Card
                key={report.name}
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleExport(report.name)}
              >
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <report.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
