// Re-export centralized types from @havenspace/api
// This file is kept for backwards compatibility
export type {
  UserRole,
  UserStatus,
  HavenSession as Session,
} from "@havenspace/api";

// Extend NextAuth types
import type { HavenSession } from "@havenspace/api";

declare module "next-auth" {
  interface Session extends HavenSession {}
}
