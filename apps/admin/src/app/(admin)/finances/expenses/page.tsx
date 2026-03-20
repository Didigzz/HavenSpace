"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Receipt,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Filter,
  Download,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogTrigger,
} from "@havenspace/shared/ui";
import { Label } from "@havenspace/shared/ui";
import { useProperty } from "@/lib/property-context";
import {
  getExpensesByProperty,
  mockExpenses,
  type MockExpense,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { useToast } from "@havenspace/shared/ui";

const categoryColors: Record<string, string> = {
  UTILITIES: "bg-blue-100 text-blue-800",
  MAINTENANCE: "bg-yellow-100 text-yellow-800",
  SUPPLIES: "bg-green-100 text-green-800",
  SALARY: "bg-purple-100 text-purple-800",
  TAXES: "bg-red-100 text-red-800",
  INSURANCE: "bg-orange-100 text-orange-800",
  OTHER: "bg-gray-100 text-gray-800",
};

const categories = [
  "UTILITIES",
  "MAINTENANCE",
  "SUPPLIES",
  "SALARY",
  "TAXES",
  "INSURANCE",
  "OTHER",
];

export default function ExpensesPage() {
  const { currentProperty } = useProperty();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const expenses = currentProperty
    ? getExpensesByProperty(currentProperty.id)
    : mockExpenses;

  const filteredExpenses = expenses.filter((expense: MockExpense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum: number, e: MockExpense) => sum + e.amount,
    0
  );

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Adding expense:", Object.fromEntries(formData));
    toast({
      title: "Expense Added",
      description: "The expense has been recorded successfully.",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage property expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddExpense}>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>
                    Record a new expense for the property
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="What was this expense for?"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₱)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="OTHER">
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor">Vendor (Optional)</Label>
                      <Input
                        id="vendor"
                        name="vendor"
                        placeholder="Vendor name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      className="border-input bg-background min-h-[60px] w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Expense</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {formatCurrency(totalExpenses)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(
                expenses
                  .filter((e: MockExpense) => {
                    const date = new Date(e.date);
                    const now = new Date();
                    return (
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                    );
                  })
                  .reduce((sum: number, e: MockExpense) => sum + e.amount, 0)
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Largest Expense</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(
                Math.max(...expenses.map((e: MockExpense) => e.amount), 0)
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-2xl">{expenses.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expenses List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredExpenses.map((expense: MockExpense) => (
              <div
                key={expense.id}
                className="hover:bg-muted/50 flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <Receipt className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {formatDate(expense.date)}
                      {expense.vendor && <span>• {expense.vendor}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className={cn(categoryColors[expense.category])}
                  >
                    {expense.category}
                  </Badge>
                  <span className="w-24 text-right font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredExpenses.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Receipt className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium">No expenses found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first expense"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
