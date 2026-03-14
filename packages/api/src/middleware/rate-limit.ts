import { TRPCError } from "@trpc/server";
import { Redis } from "ioredis";

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

interface RateLimitData {
  count: number;
  resetAt: number;
}

/**
 * Redis client for rate limiting (lazy initialization)
 * Uses environment variable REDIS_URL or falls back to localhost
 */
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;
    
    // Only initialize Redis if URL is provided
    if (redisUrl) {
      try {
        redisClient = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            if (times > 3) {
              console.warn("[Rate Limit] Redis connection failed, falling back to memory");
              return null; // Fall back to memory
            }
            return Math.min(times * 200, 2000);
          },
        });

        redisClient.on("error", (err) => {
          console.error("[Rate Limit] Redis error:", err.message);
        });

        redisClient.on("connect", () => {
          console.log("[Rate Limit] Connected to Redis");
        });
      } catch (error) {
        console.error("[Rate Limit] Failed to initialize Redis:", error);
      }
    }
  }
  
  return redisClient;
}

// In-memory store for rate limiting (fallback when Redis is unavailable)
const rateLimitStore = new Map<string, RateLimitData>();

/**
 * Creates a rate limiting middleware for tRPC procedures
 * Uses Redis in production, falls back to memory in development
 * @param options - Rate limit configuration
 * @returns tRPC-compatible middleware function
 */
export function createRateLimitMiddleware(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = "Too many requests, please try again later." } = options;

  return async (opts: { next: () => Promise<any>; ctx: any; path: string; type: string }) => {
    const { next, ctx, path } = opts;
    
    // Skip rate limiting in development
    if (process.env.NODE_ENV === "development") {
      return next();
    }

    // Create a unique key based on user/session and procedure
    const identifier = ctx.session?.user?.id || ctx.session?.user?.email || "anonymous";
    const key = `ratelimit:${identifier}:${path}`;

    const now = Date.now();
    const redis = getRedisClient();

    // Use Redis if available
    if (redis) {
      try {
        const currentCount = await redis.incr(key);
        
        if (currentCount === 1) {
          // First request in window, set expiration
          await redis.pexpire(key, windowMs);
          return next();
        }

        if (currentCount > maxRequests) {
          const ttl = await redis.pttl(key);
          const retryAfter = Math.ceil(ttl / 1000);
          
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

        return next();
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        // Redis error, fall back to memory
        console.warn("[Rate Limit] Redis failed, falling back to memory:", error);
      }
    }

    // Fallback to in-memory rate limiting
    const memKey = `${identifier}:${path}`;
    const existing = rateLimitStore.get(memKey);

    if (!existing || existing.resetAt < now) {
      // Create new window
      rateLimitStore.set(memKey, {
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
    rateLimitStore.set(memKey, {
      count: existing.count + 1,
      resetAt: existing.resetAt,
    });

    return next();
  };
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
 * Cleanup old entries from the in-memory rate limit store
 * Should be called periodically (e.g., every 5 minutes)
 * Note: Redis handles its own cleanup via TTL
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto-cleanup every 5 minutes (only for in-memory store)
if (typeof global !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

/**
 * Gracefully shutdown Redis connection
 * Call this on application shutdown
 */
export async function shutdownRateLimit(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
