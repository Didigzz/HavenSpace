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
import { AlertTriangle, Clock } from "lucide-react";
import { mockTenants } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

interface UpcomingLeasesProps {
  propertyId?: string;
  daysThreshold?: number;
}

export function UpcomingLeases({ propertyId, daysThreshold = 30 }: UpcomingLeasesProps) {
  const tenants = propertyId
    ? mockTenants.filter((t) => t.propertyId === propertyId)
    : mockTenants;

  const today = new Date();
  const expiringLeases = tenants
    .filter((t) => {
      if (!t.leaseEndDate || !t.isActive) return false;
      const leaseEnd = new Date(t.leaseEndDate);
      const daysUntilExpiry = Math.ceil(
        (leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry > 0 && daysUntilExpiry <= daysThreshold;
    })
    .sort((a, b) => {
      return new Date(a.leaseEndDate!).getTime() - new Date(b.leaseEndDate!).getTime();
    });

  const getDaysRemaining = (leaseEndDate: string) => {
    const end = new Date(leaseEndDate);
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Expiring Leases
          </CardTitle>
          <CardDescription>Leases expiring within {daysThreshold} days</CardDescription>
        </div>
        <Link
          href="/tenants?filter=expiring"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringLeases.map((tenant) => {
            const daysRemaining = getDaysRemaining(tenant.leaseEndDate!);
            const isUrgent = daysRemaining <= 7;

            return (
              <div
                key={tenant.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {tenant.firstName} {tenant.lastName}
                    </p>
                    {isUrgent && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires: {formatDate(tenant.leaseEndDate!)}
                  </p>
                </div>
                <Badge
                  variant={isUrgent ? "destructive" : "secondary"}
                  className="whitespace-nowrap"
                >
                  {daysRemaining} days left
                </Badge>
              </div>
            );
          })}
          {expiringLeases.length === 0 && (
            <p className="text-center text-muted-foreground">
              No leases expiring soon
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
