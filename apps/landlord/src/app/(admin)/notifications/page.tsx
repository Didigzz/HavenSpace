"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Settings,
} from "lucide-react";
import { Button } from "@havenspace/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@havenspace/shared/ui";
import { Tabs, TabsList, TabsTrigger } from "@havenspace/shared/ui";
import { mockNotifications } from "@/lib/mock-data";
import { formatDateTime, cn } from "@/lib/utils";
import type { Notification } from "@/types";

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

const typeColors = {
  info: "text-blue-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  success: "text-green-500",
};

const typeBgColors = {
  info: "bg-blue-50 dark:bg-blue-950",
  warning: "bg-yellow-50 dark:bg-yellow-950",
  error: "bg-red-50 dark:bg-red-950",
  success: "bg-green-50 dark:bg-green-950",
};

function NotificationCard({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}) {
  const Icon = typeIcons[notification.type];

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg border p-4 transition-colors",
        !notification.isRead && typeBgColors[notification.type]
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          notification.isRead ? "bg-muted" : "bg-white dark:bg-gray-900"
        )}
      >
        <Icon className={cn("h-5 w-5", typeColors[notification.type])} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={cn(
                "font-medium",
                !notification.isRead && "text-foreground"
              )}
            >
              {notification.title}
            </p>
            <p className="text-muted-foreground text-sm">
              {notification.message}
            </p>
          </div>
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-xs">
            {formatDateTime(notification.createdAt)}
          </span>
          {notification.link && (
            <Link
              href={notification.link}
              className="text-primary text-xs hover:underline"
            >
              View details →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [activeTab, setActiveTab] = React.useState("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications.filter((n) => n.isRead);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important events and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/settings?tab=notifications">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Notifications</CardDescription>
            <CardTitle className="text-3xl">{notifications.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              Unread
            </CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {unreadCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Warnings
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">
              {notifications.filter((n) => n.type === "warning").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Errors
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {notifications.filter((n) => n.type === "error").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="read">
                  Read ({notifications.length - unreadCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Bell className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground">
                {activeTab === "unread"
                  ? "You've read all your notifications"
                  : "You don't have any notifications yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
