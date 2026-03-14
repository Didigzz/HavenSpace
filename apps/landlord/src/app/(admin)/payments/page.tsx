"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Plus,
  Search,
  MoreHorizontal,
  Download,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@havenspace/ui";
import { Input } from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import {
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
import { Tabs, TabsList, TabsTrigger } from "@havenspace/ui";
import { useProperty } from "@/lib/property-context";
import { getPaymentsByProperty, mockPayments } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment, PaymentStatus } from "@/types";

const statusColors: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  OVERDUE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "receiptNumber",
    header: "Receipt #",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.original.receiptNumber || "—"}
      </span>
    ),
  },
  {
    accessorKey: "tenantName",
    header: "Tenant",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.tenantName}</p>
        <p className="text-sm text-muted-foreground">Room {row.original.roomNumber}</p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.type}</Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-medium">{formatCurrency(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => formatDate(row.original.dueDate),
  },
  {
    accessorKey: "paidDate",
    header: "Paid Date",
    cell: ({ row }) =>
      row.original.paidDate ? formatDate(row.original.paidDate) : "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary" className={statusColors[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
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
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {payment.status === "PENDING" && (
              <DropdownMenuItem className="text-green-600">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
            )}
            {payment.receiptNumber && (
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {payment.status !== "CANCELLED" && payment.status !== "PAID" && (
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Payment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function PaymentsContent() {
  const { currentProperty } = useProperty();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "dueDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [activeTab, setActiveTab] = React.useState(statusFilter || "all");

  const allPayments = currentProperty
    ? getPaymentsByProperty(currentProperty.id)
    : mockPayments;

  const filteredPayments = activeTab === "all"
    ? allPayments
    : allPayments.filter((p) => p.status.toLowerCase() === activeTab);

  const table = useReactTable({
    data: filteredPayments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Stats
  const stats = {
    total: allPayments.length,
    totalAmount: allPayments.reduce((sum, p) => sum + p.amount, 0),
    paid: allPayments.filter((p) => p.status === "PAID"),
    pending: allPayments.filter((p) => p.status === "PENDING"),
    overdue: allPayments.filter((p) => p.status === "OVERDUE"),
  };

  const paidAmount = stats.paid.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = stats.pending.reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = stats.overdue.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Track and manage all payment transactions
          </p>
        </div>
        <Button asChild>
          <Link href="/payments/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Collected</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {formatCurrency(paidAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.paid.length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {formatCurrency(pendingAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.pending.length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {formatCurrency(overdueAmount)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.overdue.length} payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Collection Rate</CardDescription>
            <CardTitle className="text-3xl">
              {stats.totalAmount > 0
                ? Math.round((paidAmount / stats.totalAmount) * 100)
                : 0}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(paidAmount)} of {formatCurrency(stats.totalAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({allPayments.length})</TabsTrigger>
                <TabsTrigger value="paid">Paid ({stats.paid.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending.length})</TabsTrigger>
                <TabsTrigger value="overdue">Overdue ({stats.overdue.length})</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={(table.getColumn("tenantName")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("tenantName")?.setFilterValue(event.target.value)
                }
                className="pl-10"
              />
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
                    <TableRow key={row.id}>
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
                      No payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {table.getRowModel().rows.length} of {filteredPayments.length} payments
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

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96">Loading...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}
