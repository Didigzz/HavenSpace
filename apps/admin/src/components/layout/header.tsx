"use client";

import * as React from "react";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, Input } from "@havenspace/shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b px-6 backdrop-blur transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search users, listings, bookings..."
            className="w-80 pl-9"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium">
                5
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <h4 className="mb-2 font-semibold">Notifications</h4>
              <div className="space-y-3">
                <div className="hover:bg-muted flex gap-3 rounded-lg p-2">
                  <div className="bg-primary mt-2 h-2 w-2 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">New landlord application</p>
                    <p className="text-muted-foreground text-xs">
                      John Doe submitted an application
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      2 min ago
                    </p>
                  </div>
                </div>
                <div className="hover:bg-muted flex gap-3 rounded-lg p-2">
                  <div className="bg-destructive mt-2 h-2 w-2 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">Dispute reported</p>
                    <p className="text-muted-foreground text-xs">
                      Payment dispute on booking #1234
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      15 min ago
                    </p>
                  </div>
                </div>
                <div className="hover:bg-muted flex gap-3 rounded-lg p-2">
                  <div className="mt-2 h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm">Listing flagged</p>
                    <p className="text-muted-foreground text-xs">
                      &quot;Sunny Room&quot; has been flagged for review
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      1 hour ago
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="mt-3 w-full">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
