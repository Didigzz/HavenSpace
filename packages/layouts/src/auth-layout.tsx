"use client";

import { AppProviders } from "@havenspace/providers";

export interface AuthLayoutProps {
  children: React.ReactNode;
  /** Theme mode: system, light, or dark */
  theme?: "system" | "light" | "dark";
}

/**
 * Simple authenticated layout for BHMS apps.
 * Wraps content with authentication providers without sidebar/header structure.
 */
export function AuthLayout({
  children,
  theme = "system",
}: AuthLayoutProps) {
  return (
    <AppProviders theme={theme} requireAuth>
      <div className="min-h-screen">{children}</div>
    </AppProviders>
  );
}
