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
import { mockMaintenanceRequests } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

interface MaintenanceOverviewProps {
  propertyId?: string;
  limit?: number;
}

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  URGENT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function MaintenanceOverview({ propertyId, limit = 5 }: MaintenanceOverviewProps) {
  const requests = propertyId
    ? mockMaintenanceRequests.filter((m) => m.propertyId === propertyId)
    : mockMaintenanceRequests;

  const pendingRequests = requests
    .filter((m) => m.status !== "COMPLETED" && m.status !== "CANCELLED")
    .sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Maintenance Requests</CardTitle>
          <CardDescription>Pending and in-progress requests</CardDescription>
        </div>
        <Link
          href="/maintenance"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="font-medium">{request.title}</p>
                <p className="text-sm text-muted-foreground">
                  Room {request.roomNumber}
                  {request.tenantName && ` • ${request.tenantName}`}
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={priorityColors[request.priority]}>
                    {request.priority}
                  </Badge>
                  <Badge variant="secondary" className={statusColors[request.status]}>
                    {request.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(request.createdAt)}
              </p>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <p className="text-center text-muted-foreground">
              No pending maintenance requests
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
