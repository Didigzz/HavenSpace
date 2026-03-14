"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  Download,
  Calendar,
  MapPin,
  BarChart3,
  PieChartIcon,
  Activity,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@havenspace/ui";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Mock data for charts
const monthlyRevenueData = [
  { month: "Jul", revenue: 850000, bookings: 420 },
  { month: "Aug", revenue: 920000, bookings: 480 },
  { month: "Sep", revenue: 1050000, bookings: 520 },
  { month: "Oct", revenue: 1180000, bookings: 580 },
  { month: "Nov", revenue: 1350000, bookings: 650 },
  { month: "Dec", revenue: 1520000, bookings: 720 },
  { month: "Jan", revenue: 1680000, bookings: 780 },
];

const userGrowthData = [
  { month: "Jul", boarders: 5200, landlords: 420 },
  { month: "Aug", boarders: 5800, landlords: 480 },
  { month: "Sep", boarders: 6500, landlords: 530 },
  { month: "Oct", boarders: 7200, landlords: 590 },
  { month: "Nov", boarders: 8100, landlords: 650 },
  { month: "Dec", boarders: 9200, landlords: 720 },
  { month: "Jan", revenue: 10500, landlords: 800 },
];

const bookingStatusData = [
  { name: "Active", value: 3200, color: "#22c55e" },
  { name: "Completed", value: 8500, color: "#6366f1" },
  { name: "Pending", value: 850, color: "#eab308" },
  { name: "Cancelled", value: 450, color: "#ef4444" },
];

const topCitiesData = [
  { city: "Manila", bookings: 4500, revenue: 22500000 },
  { city: "Quezon City", bookings: 3800, revenue: 17100000 },
  { city: "Makati", bookings: 2900, revenue: 23200000 },
  { city: "Pasig", bookings: 2100, revenue: 10500000 },
  { city: "Taguig", bookings: 1800, revenue: 12600000 },
];

const paymentMethodsData = [
  { name: "GCash", value: 45, color: "#0891b2" },
  { name: "PayMaya", value: 25, color: "#7c3aed" },
  { name: "Bank Transfer", value: 20, color: "#059669" },
  { name: "Cash", value: 10, color: "#d97706" },
];

const dailyBookingsData = [
  { day: "Mon", bookings: 45 },
  { day: "Tue", bookings: 52 },
  { day: "Wed", bookings: 48 },
  { day: "Thu", bookings: 61 },
  { day: "Fri", bookings: 58 },
  { day: "Sat", bookings: 72 },
  { day: "Sun", bookings: 65 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

function StatCard({ title, value, change, changeType, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs">
          <span
            className={cn(
              "flex items-center",
              changeType === "positive" ? "text-green-600" : "text-red-600"
            )}
          >
            {changeType === "positive" ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {change}
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = React.useState("7d");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Platform performance insights and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₱8.55M"
          change="+18.2%"
          changeType="positive"
          icon={CreditCard}
          description="All-time platform revenue"
        />
        <StatCard
          title="Active Users"
          value="12,486"
          change="+12.5%"
          changeType="positive"
          icon={Users}
          description="Monthly active users"
        />
        <StatCard
          title="Active Listings"
          value="2,845"
          change="+8.2%"
          changeType="positive"
          icon={Building2}
          description="Published boarding houses"
        />
        <StatCard
          title="Monthly Bookings"
          value="780"
          change="+23.1%"
          changeType="positive"
          icon={CalendarCheck}
          description="New bookings this month"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">
            <CreditCard className="mr-2 h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="geography">
            <MapPin className="mr-2 h-4 w-4" />
            Geography
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-5">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and booking volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="month"
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => `₱${value / 1000000}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number | undefined, name: string | undefined) => [
                          name === "revenue" ? formatCurrency(value ?? 0) : value ?? 0,
                          name === "revenue" ? "Revenue" : "Bookings",
                        ] as [string | number, string]}
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by payment type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number | undefined) => [`${value ?? 0}%`, "Share"] as [string, string]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {paymentMethodsData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                Monthly growth of boarders and landlords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="boarders"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="landlords"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>All-time bookings by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {bookingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number | undefined) => [formatNumber(value ?? 0), "Bookings"] as [string, string]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Booking Pattern</CardTitle>
                <CardDescription>Average bookings by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyBookingsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="day"
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis
                        className="text-xs"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Cities by Performance</CardTitle>
              <CardDescription>
                Cities with highest bookings and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCitiesData.map((city, index) => (
                  <div
                    key={city.city}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{city.city}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(city.bookings)} bookings
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(city.revenue)}</p>
                      <p className="text-sm text-muted-foreground">Total revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Download detailed reports for specific metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium">Revenue Report</span>
              <span className="text-xs text-muted-foreground">
                Detailed financial breakdown
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <span className="font-medium">User Report</span>
              <span className="text-xs text-muted-foreground">
                User demographics & activity
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Building2 className="h-6 w-6 text-green-500" />
              </div>
              <span className="font-medium">Listings Report</span>
              <span className="text-xs text-muted-foreground">
                Property performance metrics
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <span className="font-medium">Activity Report</span>
              <span className="text-xs text-muted-foreground">
                Platform activity logs
              </span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
