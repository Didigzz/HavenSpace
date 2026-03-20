"use client";

import * as React from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Lock,
  Save,
  Settings as SettingsIcon,
  Percent,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@havenspace/shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session } = useSession() || { data: null };
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin account and platform settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="platform">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your admin account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getInitials(session?.user?.name || "Admin")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-muted-foreground mt-1 text-xs">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={session?.user?.name || "Admin User"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={session?.user?.email || "admin@bhms.com"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+63 921 567 8901" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value="Platform Administrator" disabled />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">2FA Status</p>
                    <p className="text-muted-foreground text-sm">
                      Two-factor authentication is currently disabled
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active login sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-muted-foreground text-sm">
                        Windows • Chrome • Manila, Philippines
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Last active: Just now
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Active
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Sign out of all other sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="mb-4 flex items-center gap-2 font-medium">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      id: "new-applications",
                      label: "New landlord applications",
                      description: "Get notified when a new landlord applies",
                    },
                    {
                      id: "flagged-content",
                      label: "Flagged content",
                      description: "Alerts about reported listings or users",
                    },
                    {
                      id: "payment-disputes",
                      label: "Payment disputes",
                      description: "Notifications about payment disputes",
                    },
                    {
                      id: "system-alerts",
                      label: "System alerts",
                      description: "Important system updates and alerts",
                    },
                    {
                      id: "weekly-reports",
                      label: "Weekly reports",
                      description: "Receive weekly platform analytics",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        defaultChecked
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div>
                <h4 className="mb-4 flex items-center gap-2 font-medium">
                  <Bell className="h-4 w-4" />
                  Push Notifications
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      id: "urgent-alerts",
                      label: "Urgent alerts",
                      description:
                        "Critical issues requiring immediate attention",
                    },
                    {
                      id: "desktop-notifications",
                      label: "Desktop notifications",
                      description: "Show notifications on your desktop",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        defaultChecked
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Tab */}
        <TabsContent value="platform">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure global platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="Haven Space" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      defaultValue="support@bhms.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="php">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="php">
                          PHP - Philippine Peso
                        </SelectItem>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="asia-manila">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia-manila">
                          Asia/Manila (UTC+8)
                        </SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-medium">
                    <Percent className="h-4 w-4" />
                    Fee Configuration
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                      <Input
                        id="platform-fee"
                        type="number"
                        defaultValue="3"
                        min="0"
                        max="100"
                      />
                      <p className="text-muted-foreground text-xs">
                        Fee charged per transaction
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-booking">
                        Minimum Booking Amount (₱)
                      </Label>
                      <Input
                        id="min-booking"
                        type="number"
                        defaultValue="1000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>
                  Temporarily disable the platform for maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-50 p-4 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-muted-foreground text-sm">
                        When enabled, only admins can access the platform
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Revenue</CardTitle>
                <CardDescription>
                  Overview of platform fees collected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      This Month&apos;s Fees
                    </p>
                    <p className="text-2xl font-bold">₱125,400</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      Last Month&apos;s Fees
                    </p>
                    <p className="text-2xl font-bold">₱98,200</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-muted-foreground text-sm">
                      Total Fees Collected
                    </p>
                    <p className="text-2xl font-bold">₱2,450,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway</CardTitle>
                <CardDescription>
                  Configure payment gateway settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <span className="font-bold text-blue-600">G</span>
                      </div>
                      <div>
                        <p className="font-medium">GCash</p>
                        <p className="text-muted-foreground text-sm">
                          Connected
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <span className="font-bold text-green-600">P</span>
                      </div>
                      <div>
                        <p className="font-medium">PayMaya</p>
                        <p className="text-muted-foreground text-sm">
                          Connected
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      Active
                    </span>
                  </div>
                </div>
                <Button variant="outline">Manage Payment Gateways</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
