import { Redis } from "ioredis";

// Singleton Redis client
let redisClient: Redis | null = null;

/**
 * Get or create Redis client instance
 * Uses lazy initialization to avoid connection errors when Redis is not available
 */
export function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.warn("[Redis] REDIS_URL not configured, caching disabled");
    return null;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn("[Redis] Max retries reached, disabling cache");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    redisClient.on("error", (error) => {
      console.error("[Redis] Connection error:", error);
    });

    redisClient.on("connect", () => {
      // eslint-disable-next-line no-console
      console.log("[Redis] Connected successfully");
    });

    return redisClient;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[Redis] Failed to create client:", error);
    return null;
  }
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix
  namespace?: string; // Namespace for grouping caches
}

/**
 * Default cache options
 */
const defaultOptions: CacheOptions = {
  ttl: 3600, // 1 hour
  prefix: "havenspace",
  namespace: "cache",
};

/**
 * Generate cache key from namespace and key
 */
function generateKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}

/**
 * Get value from cache
 * @param key - Cache key
 * @param options - Cache options
 * @returns Cached value or null
 */
export async function cacheGet<T>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  const opts = { ...defaultOptions, ...options };
  const fullKey = generateKey(opts.namespace || "cache", key);

  try {
    const data = await redis.get(fullKey);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error("[Redis] Cache get error:", error);
    return null;
  }
}

/**
 * Set value in cache
 * @param key - Cache key
 * @param value - Value to cache
 * @param options - Cache options
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const opts = { ...defaultOptions, ...options };
  const fullKey = generateKey(opts.namespace || "cache", key);

  try {
    const serialized = JSON.stringify(value);
    if (opts.ttl) {
      await redis.setex(fullKey, opts.ttl, serialized);
    } else {
      await redis.set(fullKey, serialized);
    }
  } catch (error) {
    console.error("[Redis] Cache set error:", error);
  }
}

/**
 * Delete value from cache
 * @param key - Cache key
 * @param options - Cache options
 */
export async function cacheDelete(
  key: string,
  options: CacheOptions = {}
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const opts = { ...defaultOptions, ...options };
  const fullKey = generateKey(opts.namespace || "cache", key);

  try {
    await redis.del(fullKey);
  } catch (error) {
    console.error("[Redis] Cache delete error:", error);
  }
}

/**
 * Delete multiple keys matching a pattern
 * @param pattern - Key pattern (e.g., "property:*")
 * @param options - Cache options
 */
export async function cacheDeletePattern(
  pattern: string,
  options: CacheOptions = {}
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  const opts = { ...defaultOptions, ...options };
  const fullPattern = generateKey(opts.namespace || "cache", pattern);

  try {
    const keys = await redis.keys(fullPattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("[Redis] Cache delete pattern error:", error);
  }
}

/**
 * Get or set value in cache with fallback function
 * @param key - Cache key
 * @param fallback - Function to fetch value if not cached
 * @param options - Cache options
 * @returns Cached or fetched value
 */
export async function cacheGetOrSet<T>(
  key: string,
  fallback: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheGet<T>(key, options);
  if (cached !== null) {
    return cached;
  }

  // Fetch from source
  const value = await fallback();

  // Store in cache
  await cacheSet(key, value, options);

  return value;
}

/**
 * Cache wrapper for functions with automatic cache management
 * @param fn - Function to wrap
 * @param keyFn - Function to generate cache key from arguments
 * @param options - Cache options
 * @returns Wrapped function with caching
 */
export function withCache<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyFn: (...args: Args) => string,
  options: CacheOptions = {}
): (...args: Args) => Promise<Result> {
  return async (...args: Args) => {
    const key = keyFn(...args);
    return cacheGetOrSet(key, () => fn(...args), options);
  };
}

/**
 * Invalidate cache after mutation
 * @param fn - Mutation function
 * @param invalidatePatterns - Patterns to invalidate after mutation
 * @param options - Cache options
 * @returns Wrapped mutation function with cache invalidation
 */
export function withCacheInvalidate<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  invalidatePatterns: string[],
  options: CacheOptions = {}
): (...args: Args) => Promise<Result> {
  return async (...args: Args) => {
    const result = await fn(...args);
    
    // Invalidate all patterns after successful mutation
    for (const pattern of invalidatePatterns) {
      await cacheDeletePattern(pattern, options);
    }
    
    return result;
  };
}

/**
 * Common cache namespaces
 */
export const CacheNamespaces = {
  PROPERTIES: "properties",
  BOOKINGS: "bookings",
  USERS: "users",
  LANDLORDS: "landlords",
  BOARDERS: "boarders",
  PAYMENTS: "payments",
  STATS: "stats",
  LISTINGS: "listings",
} as const;

/**
 * Common cache TTL configurations
 */
export const CacheTTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

/**
 * Close Redis connection gracefully
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

// Handle graceful shutdown
if (typeof process !== "undefined") {
  process.on("SIGTERM", closeRedisConnection);
  process.on("SIGINT", closeRedisConnection);
}
