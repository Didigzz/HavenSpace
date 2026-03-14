"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/ui";
import { Badge } from "@havenspace/ui";
import { mockPayments } from "@/lib/mock-data";
import { formatCurrency, getStatusColor } from "@/lib/utils";

interface RecentPaymentsProps {
  propertyId?: string;
  limit?: number;
}

export function RecentPayments({ propertyId, limit = 5 }: RecentPaymentsProps) {
  const payments = propertyId
    ? mockPayments.filter((p) => p.propertyId === propertyId)
    : mockPayments;

  const recentPayments = payments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest payment transactions</CardDescription>
        </div>
        <Link
          href="/payments"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="font-medium">{payment.tenantName}</p>
                <p className="text-sm text-muted-foreground">
                  Room {payment.roomNumber} • {payment.type}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(payment.amount)}</p>
                <Badge variant="secondary" className={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
          {recentPayments.length === 0 && (
            <p className="text-center text-muted-foreground">No payments found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
