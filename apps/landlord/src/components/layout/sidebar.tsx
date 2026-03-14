"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Home,
  LayoutDashboard,
  DoorOpen,
  Bell,
  Settings,
  CalendarCheck,
  MessageSquare,
  Wallet,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@havenspace/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: { title: string; href: string }[];
  badge?: number;
}

// Landlord-specific navigation based on PLAN.md Phase 3
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Properties",
    icon: Building2,
    items: [
      { title: "All Listings", href: "/properties" },
      { title: "Add New Property", href: "/properties/new" },
      { title: "Map View", href: "/properties/map" },
    ],
  },
  {
    title: "Rooms",
    icon: DoorOpen,
    items: [
      { title: "All Rooms", href: "/rooms" },
      { title: "Availability", href: "/rooms/availability" },
      { title: "Pricing", href: "/rooms/pricing" },
    ],
  },
  {
    title: "Bookings",
    icon: CalendarCheck,
    badge: 5,
    items: [
      { title: "All Bookings", href: "/bookings" },
      { title: "Pending Requests", href: "/bookings/pending" },
      { title: "Active Tenants", href: "/bookings/active" },
      { title: "History", href: "/bookings/history" },
    ],
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    badge: 3,
  },
  {
    title: "Earnings",
    icon: Wallet,
    items: [
      { title: "Overview", href: "/earnings" },
      { title: "Payouts", href: "/earnings/payouts" },
      { title: "Payment History", href: "/earnings/history" },
    ],
  },
];

const settingsItems: NavItem[] = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: 2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold">Landlord Portal</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {/* Main Navigation */}
          <div className="mb-4">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Management
              </p>
            )}
            {navItems.map((item) => (
              <NavItemComponent
                key={item.title}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
              />
            ))}
          </div>

          {/* Settings Navigation */}
          <div>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Account
              </p>
            )}
            {settingsItems.map((item) => (
              <NavItemComponent
                key={item.title}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
              />
            ))}
          </div>
        </nav>
      </ScrollArea>

      {/* Collapse Toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={onToggle}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              !isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
    </div>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  isCollapsed: boolean;
  pathname: string;
}

function NavItemComponent({ item, isCollapsed, pathname }: NavItemComponentProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const Icon = item.icon;
  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + "/")
    : item.items?.some((subItem) => pathname === subItem.href || pathname.startsWith(subItem.href.split("?")[0]));

  // Check if any sub-item is active
  React.useEffect(() => {
    if (item.items) {
      const hasActiveChild = item.items.some(
        (subItem) => pathname === subItem.href || pathname.startsWith(subItem.href.split("?")[0])
      );
      if (hasActiveChild) {
        setIsOpen(true);
      }
    }
  }, [pathname, item.items]);

  if (item.items && !isCollapsed) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-9 pt-1">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                pathname === subItem.href && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              {subItem.title}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  if (item.href) {
    return (
      <Link href={item.href}>
        <Button
          variant="ghost"
          className={cn(
            "w-full",
            isCollapsed ? "justify-center px-2" : "justify-start gap-3",
            isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
          title={isCollapsed ? item.title : undefined}
        >
          <Icon className="h-4 w-4" />
          {!isCollapsed && <span>{item.title}</span>}
          {!isCollapsed && item.badge && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {item.badge}
            </span>
          )}
        </Button>
      </Link>
    );
  }

  // Collapsed state with sub-items - just show icon
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-center px-2",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
      title={item.title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
