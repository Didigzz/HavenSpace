"use client";

import * as React from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  User,
  Edit,
  Trash2,
  Key,
} from "lucide-react";
import { Button } from "@havenspace/shared/ui";
import { Input } from "@havenspace/shared/ui";
import { Badge } from "@havenspace/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@havenspace/shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";

// Mock user data
const mockUsers = [
  {
    id: "user-1",
    name: "Admin User",
    email: "admin@bhms.com",
    role: "ADMIN",
    status: "active",
    lastLogin: "2026-01-30T10:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    name: "Manager User",
    email: "manager@bhms.com",
    role: "MANAGER",
    status: "active",
    lastLogin: "2026-01-30T08:45:00Z",
    createdAt: "2024-03-15T00:00:00Z",
  },
  {
    id: "user-3",
    name: "Staff Member",
    email: "staff@bhms.com",
    role: "STAFF",
    status: "active",
    lastLogin: "2026-01-29T16:20:00Z",
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "user-4",
    name: "John Doe",
    email: "john@bhms.com",
    role: "STAFF",
    status: "inactive",
    lastLogin: "2025-12-15T09:00:00Z",
    createdAt: "2025-01-10T00:00:00Z",
  },
];

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  MANAGER: "bg-blue-100 text-blue-800",
  STAFF: "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800",
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage administrator and staff accounts
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{mockUsers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Administrators</CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {mockUsers.filter((u) => u.role === "ADMIN").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Managers</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {mockUsers.filter((u) => u.role === "MANAGER").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {mockUsers.filter((u) => u.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              All Users
            </CardTitle>
            <div className="relative w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`/avatars/${user.id}.png`} />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={roleColors[user.role]}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[user.status]}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <User className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-medium">No users found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Overview of permissions for each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Manager</TableHead>
                  <TableHead className="text-center">Staff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "View Dashboard",
                    admin: true,
                    manager: true,
                    staff: true,
                  },
                  {
                    name: "Manage Tenants",
                    admin: true,
                    manager: true,
                    staff: true,
                  },
                  {
                    name: "Manage Rooms",
                    admin: true,
                    manager: true,
                    staff: false,
                  },
                  {
                    name: "Manage Payments",
                    admin: true,
                    manager: true,
                    staff: true,
                  },
                  {
                    name: "View Financial Reports",
                    admin: true,
                    manager: true,
                    staff: false,
                  },
                  {
                    name: "Manage Properties",
                    admin: true,
                    manager: false,
                    staff: false,
                  },
                  {
                    name: "Manage Users",
                    admin: true,
                    manager: false,
                    staff: false,
                  },
                  {
                    name: "View Audit Logs",
                    admin: true,
                    manager: true,
                    staff: false,
                  },
                  {
                    name: "System Settings",
                    admin: true,
                    manager: false,
                    staff: false,
                  },
                ].map((permission) => (
                  <TableRow key={permission.name}>
                    <TableCell className="font-medium">
                      {permission.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {permission.admin ? "✓" : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {permission.manager ? "✓" : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {permission.staff ? "✓" : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
