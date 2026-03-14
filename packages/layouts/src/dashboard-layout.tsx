"use client";

import { useTheme } from "next-themes";
import { AppProviders } from "@havenspace/providers";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Sidebar content (app-specific) */
  sidebar?: React.ReactNode;
  /** Header content (app-specific) */
  header?: React.ReactNode;
  /** Theme mode: system, light, or dark */
  theme?: "system" | "light" | "dark";
}

/**
 * Shared dashboard layout for authenticated BHMS apps.
 * Provides consistent structure with optional sidebar and header slots.
 */
export function DashboardLayout({
  children,
  sidebar,
  header,
  theme = "system",
}: DashboardLayoutProps) {
  return (
    <AppProviders theme={theme} requireAuth>
      <div className="flex min-h-screen">
        {sidebar && (
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
            {sidebar}
          </aside>
        )}
        <div
          className={`flex flex-1 flex-col ${sidebar ? "ml-64" : ""}`}
        >
          {header && (
            <header className="sticky top-0 z-30 border-b bg-background">
              {header}
            </header>
          )}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AppProviders>
  );
}
