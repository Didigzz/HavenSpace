"use client";

import { useState } from "react";
import {
  Bell,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Globe,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
  CreditCard,
  Trash2,
  LogOut,
  ChevronRight,
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
import { Label } from "@havenspace/shared/ui";
import { Separator } from "@havenspace/shared/ui";
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
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    bookingUpdates: true,
    paymentReminders: true,
    messages: true,
    promotions: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-muted-foreground text-sm">
                  Select your preferred theme
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Language</Label>
                <p className="text-muted-foreground text-sm">
                  Select your preferred language
                </p>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <Globe className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fil">Filipino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose how you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-muted-foreground text-xs">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={notifications.email ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("email")}
                  >
                    {notifications.email ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="text-muted-foreground h-4 w-4" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-muted-foreground text-xs">
                        Receive push notifications
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={notifications.push ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("push")}
                  >
                    {notifications.push ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-muted-foreground h-4 w-4" />
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-muted-foreground text-xs">
                        Receive SMS for important updates
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={notifications.sms ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("sms")}
                  >
                    {notifications.sms ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notification Types</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Booking Updates</Label>
                  <Button
                    variant={
                      notifications.bookingUpdates ? "secondary" : "outline"
                    }
                    size="sm"
                    onClick={() => handleNotificationChange("bookingUpdates")}
                  >
                    {notifications.bookingUpdates ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Payment Reminders</Label>
                  <Button
                    variant={
                      notifications.paymentReminders ? "secondary" : "outline"
                    }
                    size="sm"
                    onClick={() => handleNotificationChange("paymentReminders")}
                  >
                    {notifications.paymentReminders ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>New Messages</Label>
                  <Button
                    variant={notifications.messages ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("messages")}
                  >
                    {notifications.messages ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Promotions & Offers</Label>
                  <Button
                    variant={notifications.promotions ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleNotificationChange("promotions")}
                  >
                    {notifications.promotions ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your password and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Change Password</h4>
              <div className="grid max-w-md gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button className="w-fit">Update Password</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">
                    Add an extra layer of security to your account
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Status: <span className="text-yellow-600">Not enabled</span>
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Active Sessions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Current Device</p>
                      <p className="text-muted-foreground text-xs">
                        Windows • Chrome • Manila, PH
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out all other devices
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Manage your saved payment methods.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-medium">GCash</p>
                    <p className="text-muted-foreground text-sm">091*****567</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Default</Badge>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏦</span>
                  <div>
                    <p className="font-medium">BDO Savings</p>
                    <p className="text-muted-foreground text-sm">****1234</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot
              be undone. All your data including bookings, payments, and
              messages will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="confirm-delete">
              Type &quot;DELETE&quot; to confirm
            </Label>
            <Input id="confirm-delete" className="mt-2" placeholder="DELETE" />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive">Delete Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add Badge component inline since it might not be in @havenspace/shared/ui
function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "destructive";
}) {
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background",
    destructive: "bg-destructive text-destructive-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
