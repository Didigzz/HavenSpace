"use client";

import * as React from "react";
import {
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  FileCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@havenspace/ui";
import { cn, formatNumber, formatCurrency, getRelativeTime } from "@/lib/utils";
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
} from "recharts";

// Mock data for stats
const stats = [
  {
    name: "Total Users",
    value: "12,486",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active platform users",
  },
  {
    name: "Active Listings",
    value: "2,845",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Building2,
    description: "Published boarding houses",
  },
  {
    name: "Total Bookings",
    value: "18,392",
    change: "+23.1%",
    changeType: "positive" as const,
    icon: CalendarCheck,
    description: "All-time bookings",
  },
  {
    name: "Revenue",
    value: "₱2.4M",
    change: "+18.7%",
    changeType: "positive" as const,
    icon: CreditCard,
    description: "Total platform revenue",
  },
];

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 180000, bookings: 1200 },
  { month: "Feb", revenue: 220000, bookings: 1400 },
  { month: "Mar", revenue: 280000, bookings: 1800 },
  { month: "Apr", revenue: 260000, bookings: 1600 },
  { month: "May", revenue: 320000, bookings: 2100 },
  { month: "Jun", revenue: 380000, bookings: 2400 },
  { month: "Jul", revenue: 420000, bookings: 2800 },
];

const userDistribution = [
  { name: "Boarders", value: 9500, color: "#8b5cf6" },
  { name: "Landlords", value: 2800, color: "#06b6d4" },
  { name: "Admins", value: 186, color: "#f59e0b" },
];

const bookingsByStatus = [
  { status: "Confirmed", count: 8500 },
  { status: "Pending", count: 2100 },
  { status: "Cancelled", count: 850 },
  { status: "Completed", count: 6942 },
];

// Mock pending applications
const pendingApplications = [
  {
    id: "1",
    name: "Maria Santos",
    email: "maria@example.com",
    submittedAt: new Date(Date.now() - 1000 * 60 * 30),
    properties: 3,
  },
  {
    id: "2",
    name: "Juan Cruz",
    email: "juan@example.com",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    properties: 1,
  },
  {
    id: "3",
    name: "Ana Reyes",
    email: "ana@example.com",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    properties: 2,
  },
];

// Mock flagged items
const flaggedItems = [
  {
    id: "1",
    type: "Listing",
    title: "Suspicious Property Listing",
    reason: "Reported for misleading information",
    reportedAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "2",
    type: "User",
    title: "Account Flagged",
    reason: "Multiple payment disputes",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                <span
                  className={cn(
                    "flex items-center",
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue and booking trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
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

        {/* User Distribution */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Platform users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number | undefined) => [formatNumber(value ?? 0), "Users"] as [string, string]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Chart and Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Bookings by Status */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
            <CardDescription>Current booking distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="status"
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
                    formatter={(value: number | undefined) => [formatNumber(value ?? 0), "Bookings"] as [string, string]}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pending Applications */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Landlord Applications</p>
                    <p className="text-sm text-muted-foreground">
                      {pendingApplications.length} pending review
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/applications">
                    View
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Flagged Items */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">Flagged Items</p>
                    <p className="text-sm text-muted-foreground">
                      {flaggedItems.length} items to review
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/reports">
                    View
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Recent Activity Summary */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                    <CreditCard className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Disputes</p>
                    <p className="text-sm text-muted-foreground">
                      2 disputes awaiting resolution
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/payments">
                    View
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest landlord applications awaiting review
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/applications">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm">
                      {app.properties} {app.properties === 1 ? "property" : "properties"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(app.submittedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
