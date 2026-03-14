"use client";

import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@havenspace/ui";

export interface PublicProvidersProps {
  children: React.ReactNode;
  /** Theme mode: system, light, or dark */
  theme?: "system" | "light" | "dark";
}

/**
 * Centralized application providers for BHMS public app (no authentication).
 * Combines QueryClient, ThemeProvider, and Toaster.
 */
export function PublicProviders({
  children,
  theme = "light",
}: PublicProvidersProps) {
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

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme={theme}
        enableSystem={theme === "system"}
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
