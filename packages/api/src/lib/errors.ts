/**
 * Error handling utilities for tRPC procedures
 * 
 * Provides standardized error handling and recovery mechanisms
 */

import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "../types";

/**
 * Standard error codes for Haven Space API
 */
export enum ErrorCode {
  // Authentication errors (401)
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  
  // Authorization errors (403)
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  ACCOUNT_PENDING_APPROVAL = "ACCOUNT_PENDING_APPROVAL",
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",
  
  // Resource errors (404)
  NOT_FOUND = "NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  PROPERTY_NOT_FOUND = "PROPERTY_NOT_FOUND",
  ROOM_NOT_FOUND = "ROOM_NOT_FOUND",
  BOOKING_NOT_FOUND = "BOOKING_NOT_FOUND",
  
  // Validation errors (400)
  BAD_REQUEST = "BAD_REQUEST",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  
  // Conflict errors (409)
  CONFLICT = "CONFLICT",
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",
  RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
  
  // Server errors (500)
  INTERNAL_ERROR = "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
}

/**
 * Error metadata for additional context
 */
export interface ErrorMetadata {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  userMessage?: string;
  timestamp?: string;
}

/**
 * Create a standardized TRPC error
 */
export function createTRPCError(options: {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  userMessage?: string;
}): TRPCError {
  const trpcCode = mapErrorCodeToTRPC(options.code);
  
  return new TRPCError({
    code: trpcCode,
    message: options.message,
    cause: options.details ? new Error(JSON.stringify(options.details)) : undefined,
  });
}

/**
 * Map internal error codes to TRPC error codes
 */
function mapErrorCodeToTRPC(code: ErrorCode): string {
  const mapping: Record<ErrorCode, string> = {
    [ErrorCode.UNAUTHORIZED]: "UNAUTHORIZED",
    [ErrorCode.INVALID_CREDENTIALS]: "UNAUTHORIZED",
    [ErrorCode.SESSION_EXPIRED]: "UNAUTHORIZED",
    [ErrorCode.FORBIDDEN]: "FORBIDDEN",
    [ErrorCode.INSUFFICIENT_PERMISSIONS]: "FORBIDDEN",
    [ErrorCode.ACCOUNT_PENDING_APPROVAL]: "FORBIDDEN",
    [ErrorCode.ACCOUNT_SUSPENDED]: "FORBIDDEN",
    [ErrorCode.NOT_FOUND]: "NOT_FOUND",
    [ErrorCode.USER_NOT_FOUND]: "NOT_FOUND",
    [ErrorCode.PROPERTY_NOT_FOUND]: "NOT_FOUND",
    [ErrorCode.ROOM_NOT_FOUND]: "NOT_FOUND",
    [ErrorCode.BOOKING_NOT_FOUND]: "NOT_FOUND",
    [ErrorCode.BAD_REQUEST]: "BAD_REQUEST",
    [ErrorCode.VALIDATION_ERROR]: "BAD_REQUEST",
    [ErrorCode.INVALID_INPUT]: "BAD_REQUEST",
    [ErrorCode.CONFLICT]: "CONFLICT",
    [ErrorCode.DUPLICATE_EMAIL]: "CONFLICT",
    [ErrorCode.RESOURCE_ALREADY_EXISTS]: "CONFLICT",
    [ErrorCode.INTERNAL_ERROR]: "INTERNAL_SERVER_ERROR",
    [ErrorCode.DATABASE_ERROR]: "INTERNAL_SERVER_ERROR",
    [ErrorCode.EXTERNAL_SERVICE_ERROR]: "INTERNAL_SERVER_ERROR",
  };
  
  return mapping[code] || "INTERNAL_SERVER_ERROR";
}

/**
 * Handle database errors with proper error mapping
 */
export function handleDatabaseError(error: unknown, operation: string): never {
  console.error(`[Database Error] ${operation}:`, error);
  
  if (error instanceof TRPCError) {
    throw error;
  }
  
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Database operation failed: ${operation}`,
  });
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: unknown): never {
  if (error instanceof TRPCError) {
    throw error;
  }
  
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "Authentication failed",
  });
}

/**
 * Handle validation errors
 */
export function handleValidationError(error: unknown, customMessage?: string): never {
  if (error instanceof TRPCError) {
    throw error;
  }
  
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: customMessage || "Validation failed",
  });
}

/**
 * Assert that a value exists, otherwise throw an error
 */
export function assertExists<T>(
  value: T | null | undefined,
  errorCode: ErrorCode,
  message: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw createTRPCError({
      code: errorCode,
      message,
    });
  }
}

/**
 * Assert that a user is authenticated
 */
export function assertAuthenticated(session: TRPCContext["session"]): asserts session is NonNullable<TRPCContext["session"]> {
  if (!session || !session.user) {
    throw createTRPCError({
      code: ErrorCode.UNAUTHORIZED,
      message: "Authentication required",
    });
  }
}

/**
 * Assert that a user has the required role
 */
export function assertRole(
  session: NonNullable<TRPCContext["session"]>,
  requiredRole: "LANDLORD" | "BOARDER" | "ADMIN"
): void {
  if (session.user.role !== requiredRole) {
    throw createTRPCError({
      code: ErrorCode.FORBIDDEN,
      message: `This action requires ${requiredRole.toLowerCase()} role`,
      userMessage: "You don't have permission to perform this action",
    });
  }
}

/**
 * Safe wrapper for async operations with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorCode: ErrorCode,
  errorMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    
    console.error(`[SafeAsync Error] ${errorMessage}:`, error);
    throw createTRPCError({
      code: errorCode,
      message: errorMessage,
    });
  }
}

/**
 * Log error with context for debugging
 */
export function logError(
  error: unknown,
  context: {
    operation: string;
    userId?: string;
    details?: Record<string, unknown>;
  }
): void {
  console.error("[API Error]", {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
}
