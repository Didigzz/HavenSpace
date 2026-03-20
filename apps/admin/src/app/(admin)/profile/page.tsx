"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Key,
  Camera,
  Save,
  Loader2,
  Shield,
  Calendar,
  MapPin,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@havenspace/shared/ui";
import { Separator } from "@havenspace/shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@havenspace/shared/ui";
import { useToast } from "@havenspace/shared/ui";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// Mock user data
const currentUser = {
  id: "user-1",
  firstName: "John",
  lastName: "Admin",
  email: "john.admin@bhms.com",
  phone: "+63 917 123 4567",
  address: "123 Main Street, Metro Manila",
  bio: "System administrator for BHMS. Managing properties since 2020.",
  avatar:
    "https://ui-avatars.com/api/?name=John+Admin&background=0D8ABC&color=fff",
  role: "ADMIN",
  createdAt: "2023-01-15T00:00:00Z",
  lastLogin: "2024-01-15T14:30:00Z",
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      bio: currentUser.bio,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updated profile:", data);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsUpdatingProfile(false);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Password changed");
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
    resetPassword();
    setIsChangingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account information
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.firstName}
                    />
                    <AvatarFallback className="text-2xl">
                      {currentUser.firstName[0]}
                      {currentUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="mt-4 text-xl font-semibold">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {currentUser.email}
                </p>
                <Badge className="mt-2" variant="secondary">
                  {currentUser.role}
                </Badge>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {currentUser.phone || "Not set"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {currentUser.address || "Not set"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    Member since{" "}
                    {new Date(currentUser.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login</span>
                  <span>
                    {new Date(currentUser.lastLogin).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Profile Information */}
            <TabsContent value="profile">
              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details here
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          {...registerProfile("firstName")}
                        />
                        {profileErrors.firstName && (
                          <p className="text-destructive text-sm">
                            {profileErrors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" {...registerProfile("lastName")} />
                        {profileErrors.lastName && (
                          <p className="text-destructive text-sm">
                            {profileErrors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerProfile("email")}
                      />
                      {profileErrors.email && (
                        <p className="text-destructive text-sm">
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" {...registerProfile("phone")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" {...registerProfile("address")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        {...registerProfile("bio")}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <div className="space-y-6">
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Change Password
                      </CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password *
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...registerPassword("currentPassword")}
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-destructive text-sm">
                            {passwordErrors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password *</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...registerPassword("newPassword")}
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-destructive text-sm">
                            {passwordErrors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password *
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...registerPassword("confirmPassword")}
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-destructive text-sm">
                            {passwordErrors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isChangingPassword}>
                          {isChangingPassword ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Key className="mr-2 h-4 w-4" />
                          )}
                          Change Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </form>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-muted-foreground text-sm">
                          Use an authenticator app to generate verification
                          codes
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-muted-foreground text-sm">
                          Permanently delete your account and all associated
                          data
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and login history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Logged in",
                        device: "Chrome on Windows",
                        location: "Metro Manila, Philippines",
                        time: "2 hours ago",
                      },
                      {
                        action: "Updated profile",
                        device: "Chrome on Windows",
                        location: "Metro Manila, Philippines",
                        time: "1 day ago",
                      },
                      {
                        action: "Created new tenant",
                        device: "Chrome on Windows",
                        location: "Metro Manila, Philippines",
                        time: "2 days ago",
                      },
                      {
                        action: "Logged in",
                        device: "Safari on iPhone",
                        location: "Quezon City, Philippines",
                        time: "3 days ago",
                      },
                      {
                        action: "Changed password",
                        device: "Chrome on Windows",
                        location: "Metro Manila, Philippines",
                        time: "1 week ago",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-muted-foreground text-sm">
                            {activity.device} • {activity.location}
                          </p>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
