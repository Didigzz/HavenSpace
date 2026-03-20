"use client";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MoreHorizontal,
  Plus,
  Search,
  User,
  Edit,
  Trash2,
  Eye,
  FileText,
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
import { useProperty } from "@/lib/property-context";
import { getTenantsByProperty, mockTenants } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import type { Tenant } from "@/types";

const columns: ColumnDef<Tenant>[] = [
  {
    accessorKey: "name",
    header: "Tenant",
    cell: ({ row }) => {
      const tenant = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">
              {tenant.firstName} {tenant.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{tenant.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "roomId",
    header: "Room",
    cell: ({ row }) => {
      const tenant = row.original;
      return tenant.roomId ? (
        <Badge variant="outline">Room assigned</Badge>
      ) : (
        <Badge variant="secondary">No room</Badge>
      );
    },
  },
  {
    accessorKey: "moveInDate",
    header: "Move-in Date",
    cell: ({ row }) => formatDate(row.original.moveInDate),
  },
  {
    accessorKey: "leaseEndDate",
    header: "Lease Ends",
    cell: ({ row }) => {
      const tenant = row.original;
      if (!tenant.leaseEndDate) return <span className="text-muted-foreground">—</span>;
      
      const daysUntil = Math.ceil(
        (new Date(tenant.leaseEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      const isExpiringSoon = daysUntil > 0 && daysUntil <= 30;
      const isExpired = daysUntil <= 0;
      
      return (
        <div className="flex items-center gap-2">
          <span className={cn(isExpired && "text-destructive", isExpiringSoon && "text-orange-600")}>
            {formatDate(tenant.leaseEndDate)}
          </span>
          {isExpiringSoon && !isExpired && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {daysUntil}d
            </Badge>
          )}
          {isExpired && (
            <Badge variant="destructive">Expired</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "monthlyRent",
    header: "Monthly Rent",
    cell: ({ row }) => formatCurrency(row.original.monthlyRent),
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.original.balance;
      return (
        <span className={cn(balance > 0 && "text-destructive font-medium")}>
          {formatCurrency(balance)}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={row.original.isActive ? getStatusColor("active") : getStatusColor("inactive")}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tenant = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/tenants/${tenant.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/tenants/${tenant.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              View Payments
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Tenant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TenantsPage() {
  const { currentProperty } = useProperty();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const data = currentProperty
    ? getTenantsByProperty(currentProperty.id)
    : mockTenants;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    onSortingChange: ( updater ) => setSorting(updater),
    onColumnFiltersChange: ( updater ) => setColumnFilters(updater),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: ( updater ) => setColumnVisibility(updater),
    onRowSelectionChange: ( updater ) => setRowSelection(updater),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Stats
  const activeTenants = data.filter((t) => t.isActive).length;
  const tenantsWithBalance = data.filter((t) => t.balance > 0).length;
  const totalBalance = data.reduce((sum, t) => sum + t.balance, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">
            Manage tenant profiles, leases, and payment histories
          </p>
        </div>
        <Button asChild>
          <Link href="/tenants/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tenants</CardDescription>
            <CardTitle className="text-3xl">{data.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Tenants</CardDescription>
            <CardTitle className="text-3xl">{activeTenants}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>With Outstanding Balance</CardDescription>
            <CardTitle className="text-3xl">{tenantsWithBalance}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Outstanding</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {formatCurrency(totalBalance)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Tenants</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tenants..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="w-64 pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No tenants found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {table.getRowModel().rows.length} of {data.length} tenants
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
