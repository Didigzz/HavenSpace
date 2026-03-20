/**
 * Centralized TypeScript types for tRPC and authentication
 *
 * This file provides type-safe definitions for:
 * - TRPC context
 * - Session types
 * - Procedure options
 * - Middleware types
 */

import { TRPCError } from "@trpc/server";
import type { PrismaClientType } from "@havenspace/database";

/**
 * User role and status types
 */
export type UserRole = "LANDLORD" | "BOARDER" | "ADMIN";
export type UserStatus = "PENDING" | "APPROVED" | "SUSPENDED";

/**
 * Extended session interface with Haven Space specific fields
 */
export interface HavenSession {
  user: {
    id: string;
    role: UserRole;
    status: UserStatus;
    email?: string;
    name?: string;
    image?: string;
  };
  csrfSecret?: string;
}

/**
 * TRPC context type - available in all procedures
 */
export interface TRPCContext {
  db: PrismaClientType;
  session: HavenSession | null;
  headers: Headers;
  csrfSecret?: string | null; // CSRF secret from server-side session
}

/**
 * Base procedure options type
 */
export interface ProcedureOpts<TInput = unknown> {
  ctx: TRPCContext;
  input: TInput;
  next: () => Promise<unknown>;
  path: string;
  type: "query" | "mutation" | "subscription";
}

/**
 * Middleware function type - compatible with tRPC middleware system
 * Takes middleware options and returns a promise resolving to context object
 */
export type MiddlewareFn = (opts: {
  ctx: TRPCContext;
  input: unknown;
  next: () => Promise<unknown>;
  path: string;
  type: "query" | "mutation" | "subscription";
}) => Promise<{ ctx: TRPCContext }>;

/**
 * Auth middleware factory type
 */
export type AuthMiddlewareFactory = (getSession: (ctx: TRPCContext) => Promise<HavenSession | null>) => MiddlewareFn;

/**
 * Role-based middleware type
 */
export type RoleMiddlewareFactory = (requiredRole: UserRole) => MiddlewareFn;

/**
 * Status-based middleware type
 */
export type StatusMiddlewareFactory = (requiredStatus: UserStatus | UserStatus[]) => MiddlewareFn;

/**
 * Protected procedure context (with authenticated session)
 */
export interface ProtectedTRPCContext extends TRPCContext {
  session: HavenSession;
}

/**
 * Admin procedure context (requires ADMIN role)
 */
export interface AdminTRPCContext extends ProtectedTRPCContext {
  session: HavenSession & {
    user: {
      role: "ADMIN";
    };
  };
}

/**
 * Landlord procedure context (requires LANDLORD role + APPROVED status)
 */
export interface LandlordTRPCContext extends ProtectedTRPCContext {
  session: HavenSession & {
    user: {
      role: "LANDLORD";
      status: "APPROVED";
    };
  };
}

/**
 * Boarder procedure context (requires BOARDER role + non-SUSPENDED status)
 */
export interface BoarderTRPCContext extends ProtectedTRPCContext {
  session: HavenSession & {
    user: {
      role: "BOARDER";
      status: Exclude<UserStatus, "SUSPENDED">;
    };
  };
}

/**
 * Helper type to extract Zod schema input type
 */
export type InferInput<T> = T extends import("zod").ZodType<infer U> ? U : never;

/**
 * Error handler for TRPC procedures
 */
export function handleTRPCError(error: unknown): never {
  if (error instanceof TRPCError) {
    throw error;
  }

  console.error("[TRPC Error]:", error);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
}

/**
 * Type-safe procedure context builder
 */
export function createProcedureContext(opts: {
  db: PrismaClientType;
  session: HavenSession | null;
  headers: Headers;
}): TRPCContext {
  return {
    db: opts.db,
    session: opts.session,
    headers: opts.headers,
  };
}

/**
 * Assert session is authenticated
 */
export function assertAuthenticated(
  session: HavenSession | null
): asserts session is HavenSession {
  if (!session || !session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
}

/**
 * Assert user has required role
 */
export function assertRole(
  session: HavenSession,
  requiredRole: UserRole
): asserts session is HavenSession & { user: { role: typeof requiredRole } } {
  if (session.user.role !== requiredRole) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `This action requires ${requiredRole.toLowerCase()} role`,
    });
  }
}

/**
 * Assert user has required status
 */
export function assertStatus(
  session: HavenSession,
  requiredStatus: UserStatus | UserStatus[]
): asserts session is HavenSession {
  const allowedStatuses = Array.isArray(requiredStatus)
    ? requiredStatus
    : [requiredStatus];

  if ((allowedStatuses as string[]).indexOf(session.user.status) === -1) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `This action requires one of these statuses: ${allowedStatuses.join(", ")}`,
    });
  }
}
