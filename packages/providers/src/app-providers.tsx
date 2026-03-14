"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@havenspace/ui";

export interface AppProvidersProps {
  children: React.ReactNode;
  /** Theme mode: system, light, or dark */
  theme?: "system" | "light" | "dark";
  /** Whether to wrap with SessionProvider (for authenticated apps) */
  requireAuth?: boolean;
}

/**
 * Centralized application providers for BHMS authenticated apps.
 * Combines QueryClient, ThemeProvider, SessionProvider, and Toaster.
 */
export function AppProviders({
  children,
  theme = "system",
  requireAuth = true,
}: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const content = (
    <>
      {children}
      <Toaster />
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme={theme}
        enableSystem={theme === "system"}
        disableTransitionOnChange
      >
        {requireAuth ? (
          <SessionProvider>{content}</SessionProvider>
        ) : (
          content
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
