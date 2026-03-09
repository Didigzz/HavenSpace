import { TRPCError } from "@trpc/server";
import type { ProcedureMiddleware } from "@trpc/server";

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

interface RateLimitData {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitData>();

/**
 * Creates a rate limiting middleware for tRPC procedures
 * @param options - Rate limit configuration
 * @returns tRPC middleware
 */
export function createRateLimitMiddleware(options: RateLimitOptions): ProcedureMiddleware {
  const { windowMs, maxRequests, message = "Too many requests, please try again later." } = options;

  return t.middleware(async ({ next, ctx, path, type }) => {
    // Skip rate limiting in development
    if (process.env.NODE_ENV === "development") {
      return next();
    }

    // Create a unique key based on user/session and procedure
    const identifier = ctx.session?.user?.id || ctx.session?.user?.email || "anonymous";
    const key = `${identifier}:${path}`;

    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing rate limit data
    const existing = rateLimitStore.get(key);

    if (!existing || existing.resetAt < now) {
      // Create new window
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    // Check if within window
    if (existing.count >= maxRequests) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message,
        cause: {
          retryAfter,
          windowMs,
          maxRequests,
        },
      });
    }

    // Increment counter
    rateLimitStore.set(key, {
      count: existing.count + 1,
      resetAt: existing.resetAt,
    });

    return next();
  });
}

/**
 * Common rate limit configurations
 */
export const rateLimits = {
  // Strict limits for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
  
  // Standard limits for general API calls
  standard: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    message: "Too many requests. Please slow down.",
  },
  
  // Lenient limits for read-only operations
  read: {
    windowMs: 10 * 1000, // 10 seconds
    maxRequests: 20, // 20 requests per 10 seconds
    message: "Too many read requests. Please try again later.",
  },
  
  // Strict limits for write operations
  write: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 write operations per minute
    message: "Too many write operations. Please try again later.",
  },
  
  // Very strict limits for sensitive operations
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 operations per hour
    message: "Too many sensitive operations. Please contact support if you need assistance.",
  },
};

/**
 * Cleanup old entries from the rate limit store
 * Should be called periodically (e.g., every 5 minutes)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto-cleanup every 5 minutes
if (typeof global !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
