import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock ioredis
vi.mock('ioredis', () => {
  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
    quit: vi.fn(),
    on: vi.fn(),
  };
  return {
    Redis: vi.fn(() => mockRedis),
  };
});

import { Redis } from 'ioredis';
import {
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeletePattern,
  cacheGetOrSet,
  withCache,
  withCacheInvalidate,
  closeRedisConnection,
  CacheNamespaces,
  CacheTTL,
} from './cache';

describe('Cache Utilities', () => {
  const mockRedisInstance = {
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
    quit: vi.fn(),
    on: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    
    // Set up environment
    process.env.REDIS_URL = 'redis://localhost:6379';
    
    // Mock Redis constructor
    (Redis as unknown as vi.Mock).mockImplementation(() => mockRedisInstance);
  });

  afterEach(async () => {
    await closeRedisConnection();
  });

  describe('getRedisClient', () => {
    it('should return null when REDIS_URL is not set', () => {
      delete process.env.REDIS_URL;
      const client = getRedisClient();
      expect(client).toBeNull();
    });

    it('should create Redis client when REDIS_URL is set', () => {
      const client = getRedisClient();
      expect(Redis).toHaveBeenCalledWith('redis://localhost:6379', expect.any(Object));
      expect(client).not.toBeNull();
    });

    it('should return same instance on subsequent calls', () => {
      const client1 = getRedisClient();
      const client2 = getRedisClient();
      expect(client1).toBe(client2);
    });
  });

  describe('cacheGet', () => {
    it('should return null when Redis is not available', async () => {
      delete process.env.REDIS_URL;
      await closeRedisConnection();
      
      const result = await cacheGet('test-key');
      expect(result).toBeNull();
    });

    it('should get value from cache', async () => {
      const testData = { id: 1, name: 'Test' };
      mockRedisInstance.get.mockResolvedValue(JSON.stringify(testData));

      const result = await cacheGet('test-key');
      
      expect(mockRedisInstance.get).toHaveBeenCalledWith('cache:test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for missing key', async () => {
      mockRedisInstance.get.mockResolvedValue(null);

      const result = await cacheGet('non-existent');
      
      expect(result).toBeNull();
    });

    it('should use custom namespace', async () => {
      mockRedisInstance.get.mockResolvedValue(null);

      await cacheGet('test-key', { namespace: 'properties' });
      
      expect(mockRedisInstance.get).toHaveBeenCalledWith('properties:test-key');
    });

    it('should handle parse errors gracefully', async () => {
      mockRedisInstance.get.mockResolvedValue('invalid json');

      await expect(cacheGet('test-key')).resolves.toBeNull();
    });
  });

  describe('cacheSet', () => {
    it('should do nothing when Redis is not available', async () => {
      delete process.env.REDIS_URL;
      await closeRedisConnection();
      
      await cacheSet('test-key', { data: 'value' });
      expect(mockRedisInstance.set).not.toHaveBeenCalled();
    });

    it('should set value with TTL', async () => {
      await cacheSet('test-key', { id: 1 }, { ttl: 3600 });
      
      expect(mockRedisInstance.setex).toHaveBeenCalledWith(
        'cache:test-key',
        3600,
        JSON.stringify({ id: 1 })
      );
    });

    it('should set value without TTL', async () => {
      await cacheSet('test-key', { id: 1 }, { ttl: 0 });
      
      expect(mockRedisInstance.set).toHaveBeenCalledWith(
        'cache:test-key',
        JSON.stringify({ id: 1 })
      );
    });

    it('should use custom namespace', async () => {
      await cacheSet('test-key', 'value', { namespace: 'users' });
      
      expect(mockRedisInstance.setex).toHaveBeenCalledWith(
        'users:test-key',
        3600,
        JSON.stringify('value')
      );
    });
  });

  describe('cacheDelete', () => {
    it('should delete key from cache', async () => {
      await cacheDelete('test-key');
      
      expect(mockRedisInstance.del).toHaveBeenCalledWith('cache:test-key');
    });

    it('should use custom namespace', async () => {
      await cacheDelete('test-key', { namespace: 'bookings' });
      
      expect(mockRedisInstance.del).toHaveBeenCalledWith('bookings:test-key');
    });
  });

  describe('cacheDeletePattern', () => {
    it('should delete keys matching pattern', async () => {
      mockRedisInstance.keys.mockResolvedValue(['cache:property:1', 'cache:property:2']);
      
      await cacheDeletePattern('property:*');
      
      expect(mockRedisInstance.keys).toHaveBeenCalledWith('cache:property:*');
      expect(mockRedisInstance.del).toHaveBeenCalledWith('cache:property:1', 'cache:property:2');
    });

    it('should handle no matching keys', async () => {
      mockRedisInstance.keys.mockResolvedValue([]);
      
      await cacheDeletePattern('nonexistent:*');
      
      expect(mockRedisInstance.del).not.toHaveBeenCalled();
    });
  });

  describe('cacheGetOrSet', () => {
    it('should return cached value if available', async () => {
      const cachedData = { id: 1, cached: true };
      mockRedisInstance.get.mockResolvedValue(JSON.stringify(cachedData));
      
      const fallback = vi.fn().mockResolvedValue({ id: 1, cached: false });
      
      const result = await cacheGetOrSet('test-key', fallback);
      
      expect(result).toEqual(cachedData);
      expect(fallback).not.toHaveBeenCalled();
    });

    it('should call fallback and cache result if not cached', async () => {
      mockRedisInstance.get.mockResolvedValue(null);
      
      const fallbackData = { id: 1, fresh: true };
      const fallback = vi.fn().mockResolvedValue(fallbackData);
      
      const result = await cacheGetOrSet('test-key', fallback);
      
      expect(result).toEqual(fallbackData);
      expect(fallback).toHaveBeenCalledTimes(1);
      expect(mockRedisInstance.setex).toHaveBeenCalled();
    });
  });

  describe('withCache', () => {
    it('should wrap function with caching', async () => {
      mockRedisInstance.get.mockResolvedValue(null);
      
      const fn = vi.fn().mockResolvedValue({ result: 'data' });
      const keyFn = (id: number) => `item:${id}`;
      
      const cachedFn = withCache(fn, keyFn);
      
      await cachedFn(123);
      await cachedFn(123);
      
      expect(fn).toHaveBeenCalledTimes(1);
      expect(mockRedisInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('withCacheInvalidate', () => {
    it('should invalidate cache after mutation', async () => {
      mockRedisInstance.keys.mockResolvedValue(['cache:items:1']);
      
      const mutation = vi.fn().mockResolvedValue({ success: true });
      const wrappedMutation = withCacheInvalidate(mutation, ['items:*']);
      
      await wrappedMutation(123);
      
      expect(mutation).toHaveBeenCalledWith(123);
      expect(mockRedisInstance.keys).toHaveBeenCalledWith('cache:items:*');
      expect(mockRedisInstance.del).toHaveBeenCalled();
    });
  });

  describe('CacheNamespaces', () => {
    it('should have predefined namespaces', () => {
      expect(CacheNamespaces.PROPERTIES).toBe('properties');
      expect(CacheNamespaces.BOOKINGS).toBe('bookings');
      expect(CacheNamespaces.USERS).toBe('users');
      expect(CacheNamespaces.LANDLORDS).toBe('landlords');
      expect(CacheNamespaces.BOARDERS).toBe('boarders');
      expect(CacheNamespaces.PAYMENTS).toBe('payments');
      expect(CacheNamespaces.STATS).toBe('stats');
      expect(CacheNamespaces.LISTINGS).toBe('listings');
    });
  });

  describe('CacheTTL', () => {
    it('should have predefined TTL values', () => {
      expect(CacheTTL.SHORT).toBe(300); // 5 minutes
      expect(CacheTTL.MEDIUM).toBe(1800); // 30 minutes
      expect(CacheTTL.LONG).toBe(3600); // 1 hour
      expect(CacheTTL.VERY_LONG).toBe(86400); // 24 hours
    });
  });

  describe('closeRedisConnection', () => {
    it('should close Redis connection', async () => {
      getRedisClient();
      await closeRedisConnection();
      
      expect(mockRedisInstance.quit).toHaveBeenCalled();
    });

    it('should do nothing if no connection exists', async () => {
      await closeRedisConnection();
      expect(mockRedisInstance.quit).not.toHaveBeenCalled();
    });
  });
});
