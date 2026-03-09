'use client';

/// <reference types="next" />

import * as React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, Home, Building, Shield, ExternalLink } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@bhms/ui/dropdown-menu';
import { Button } from '@bhms/ui/button';
import { APP_URLS, type AppKey } from '@bhms/config';

/**
 * AppSwitcher - Cross-application navigation component
 * 
 * Provides a dropdown menu to navigate between different BHMS applications
 * based on the user's role and permissions.
 * 
 * @example
 * ```tsx
 * <AppSwitcher />
 * ```
 */
export function AppSwitcher() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;

  const apps = React.useMemo(() => {
    const availableApps: Array<{
      key: AppKey;
      label: string;
      url: string;
      icon: React.ComponentType<{ className?: string }>;
      description: string;
    }> = [
      {
        key: 'public',
        label: 'Public Marketplace',
        url: APP_URLS.public,
        icon: Home,
        description: 'Browse properties',
      },
    ];

    // Add role-specific apps
    if (role === 'ADMIN') {
      availableApps.push({
        key: 'admin',
        label: 'Admin Dashboard',
        url: APP_URLS.admin,
        icon: Shield,
        description: 'Platform management',
      });
    }

    if (role === 'LANDLORD') {
      availableApps.push({
        key: 'landlord',
        label: 'Landlord Portal',
        url: APP_URLS.landlord,
        icon: Building,
        description: 'Manage properties',
      });
    }

    if (role === 'BOARDER') {
      availableApps.push({
        key: 'boarder',
        label: 'Boarder Dashboard',
        url: APP_URLS.boarder,
        icon: LayoutDashboard,
        description: 'Manage bookings',
      });
    }

    return availableApps;
  }, [role]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Switch App</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Navigate to</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {apps.map((app) => {
          const Icon = app.icon;
          const isCurrentApp = typeof window !== 'undefined' && 
            window.location.origin === new URL(app.url).origin;
          
          return (
            <DropdownMenuItem key={app.key} asChild>
              <Link 
                href={app.url} 
                className="flex items-start gap-3 p-2"
                target={isCurrentApp ? undefined : '_blank'}
                rel={isCurrentApp ? undefined : 'noopener noreferrer'}
              >
                <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">{app.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {app.description}
                  </div>
                </div>
                {!isCurrentApp && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground mt-1" />
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * AppLink - Helper component for linking to specific apps
 * 
 * @param app - The app key to link to
 * @param path - Optional path within the app (default: '/dashboard')
 */
interface AppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  app: AppKey;
  path?: string;
  children: React.ReactNode;
}

export function AppLink({ app, path = '/dashboard', children, ...props }: AppLinkProps) {
  const url = `${APP_URLS[app]}${path}`;
  const isExternal = typeof window !== 'undefined' && 
    window.location.origin !== new URL(url).origin;

  return (
    <Link
      href={url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Get app URL by key - useful for server-side redirects
 */
export function getAppUrl(app: AppKey, path = ''): string {
  return `${APP_URLS[app]}${path}`;
}
