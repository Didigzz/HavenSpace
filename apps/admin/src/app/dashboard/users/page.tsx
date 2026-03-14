"use client";

import * as React from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Mail,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  Users,
  Building2,
  User,
  Download,
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
} from "@havenspace/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, getInitials, getRelativeTime } from "@/lib/utils";

type UserRole = "boarder" | "landlord" | "admin";
type UserStatus = "active" | "suspended" | "pending";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar: string | null;
  createdAt: Date;
  lastActive: Date;
  properties?: number;
  bookings?: number;
}

// Mock users data
const mockUsers: UserData[] = [
  {
    id: "1",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    phone: "+63 917 123 4567",
    role: "landlord",
    status: "active",
    avatar: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    lastActive: new Date(Date.now() - 1000 * 60 * 30),
    properties: 3,
  },
  {
    id: "2",
    name: "Juan Cruz",
    email: "juan.cruz@example.com",
    phone: "+63 918 234 5678",
    role: "boarder",
    status: "active",
    avatar: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    bookings: 2,
  },
  {
    id: "3",
    name: "Ana Reyes",
    email: "ana.reyes@example.com",
    phone: "+63 919 345 6789",
    role: "landlord",
    status: "suspended",
    avatar: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    properties: 2,
  },
  {
    id: "4",
    name: "Pedro Garcia",
    email: "pedro.garcia@example.com",
    phone: "+63 920 456 7890",
    role: "boarder",
    status: "active",
    avatar: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
    bookings: 1,
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@bhms.com",
    phone: "+63 921 567 8901",
    role: "admin",
    status: "active",
    avatar: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    lastActive: new Date(),
  },
  {
    id: "6",
    name: "Sofia Mendoza",
    email: "sofia.mendoza@example.com",
    phone: "+63 922 678 9012",
    role: "boarder",
    status: "pending",
    avatar: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    lastActive: new Date(Date.now() - 1000 * 60 * 60),
    bookings: 0,
  },
  {
    id: "7",
    name: "Carlos Tan",
    email: "carlos.tan@example.com",
    phone: "+63 923 789 0123",
    role: "landlord",
    status: "active",
    avatar: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 4),
    properties: 5,
  },
];

const roleColors: Record<UserRole, string> = {
  boarder: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  landlord: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  admin: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
};

const statusColors: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  boarder: User,
  landlord: Building2,
  admin: Shield,
};

export default function UsersPage() {
  const [filter, setFilter] = React.useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | UserStatus>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<UserData | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
  const [actionDialog, setActionDialog] = React.useState<{
    type: "suspend" | "activate" | "delete" | "changeRole" | null;
    user: UserData | null;
  }>({ type: null, user: null });

  const filteredUsers = mockUsers.filter((user) => {
    const matchesRole = filter === "all" || user.role === filter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const userCounts = {
    all: mockUsers.length,
    boarder: mockUsers.filter((u) => u.role === "boarder").length,
    landlord: mockUsers.filter((u) => u.role === "landlord").length,
    admin: mockUsers.filter((u) => u.role === "admin").length,
  };

  const handleAction = (type: typeof actionDialog.type, user: UserData) => {
    setActionDialog({ type, user });
  };

  const confirmAction = () => {
    // In a real app, this would call an API
    console.log(`${actionDialog.type} user ${actionDialog.user?.id}`);
    setActionDialog({ type: null, user: null });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all platform users, roles, and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Boarders</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.boarder}</div>
            <p className="text-xs text-muted-foreground">
              Active tenants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Landlords</CardTitle>
            <Building2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.landlord}</div>
            <p className="text-xs text-muted-foreground">
              Property owners
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCounts.admin}</div>
            <p className="text-xs text-muted-foreground">
              Platform administrators
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                <TabsTrigger value="all">All ({userCounts.all})</TabsTrigger>
                <TabsTrigger value="boarder">Boarders ({userCounts.boarder})</TabsTrigger>
                <TabsTrigger value="landlord">Landlords ({userCounts.landlord})</TabsTrigger>
                <TabsTrigger value="admin">Admins ({userCounts.admin})</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="w-full pl-9 md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const RoleIcon = roleIcons[user.role];
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", roleColors[user.role])}>
                          <RoleIcon className="mr-1 h-3 w-3" />
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", statusColors[user.status])}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getRelativeTime(user.lastActive)}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setIsUserDialogOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("changeRole", user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem
                                onClick={() => handleAction("suspend", user)}
                                className="text-yellow-600"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleAction("activate", user)}
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleAction("delete", user)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
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

      {/* User Details Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete user profile information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn(roleColors[selectedUser.role])}>
                        {selectedUser.role}
                      </Badge>
                      <Badge className={cn(statusColors[selectedUser.status])}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Last Active</p>
                    <p className="font-medium">{getRelativeTime(selectedUser.lastActive)}</p>
                  </div>
                  {selectedUser.role === "landlord" && selectedUser.properties !== undefined && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Properties</p>
                      <p className="font-medium">{selectedUser.properties} properties</p>
                    </div>
                  )}
                  {selectedUser.role === "boarder" && selectedUser.bookings !== undefined && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Bookings</p>
                      <p className="font-medium">{selectedUser.bookings} bookings</p>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  Close
                </Button>
                <Button>Edit User</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.type !== null}
        onOpenChange={() => setActionDialog({ type: null, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "suspend" && "Suspend User"}
              {actionDialog.type === "activate" && "Activate User"}
              {actionDialog.type === "delete" && "Delete User"}
              {actionDialog.type === "changeRole" && "Change User Role"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "suspend" &&
                "This will prevent the user from accessing the platform."}
              {actionDialog.type === "activate" &&
                "This will restore the user's access to the platform."}
              {actionDialog.type === "delete" &&
                "This action cannot be undone. This will permanently delete the user account."}
              {actionDialog.type === "changeRole" &&
                "Select a new role for this user."}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.type === "changeRole" && (
            <div className="py-4">
              <Select defaultValue={actionDialog.user?.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boarder">Boarder</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ type: null, user: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              variant={actionDialog.type === "delete" ? "destructive" : "default"}
              className={cn(
                actionDialog.type === "suspend" && "bg-yellow-600 hover:bg-yellow-700",
                actionDialog.type === "activate" && "bg-green-600 hover:bg-green-700"
              )}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
