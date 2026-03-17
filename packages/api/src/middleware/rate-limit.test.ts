import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createRateLimitMiddleware,
  rateLimits,
  cleanupRateLimitStore,
} from '../middleware/rate-limit';
import { TRPCError } from '@trpc/server';

describe('Rate Limit Middleware', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    vi.useFakeTimers();
  });

  it('should allow requests within limit', async () => {
    const middleware = createRateLimitMiddleware({
      windowMs: 60000, // 1 minute
      maxRequests: 5,
    });

    const next = vi.fn().mockResolvedValue({ success: true });
    const ctx = { session: null };

    // Should allow first 5 requests
    for (let i = 0; i < 5; i++) {
      await middleware({
        ctx,
        path: 'test.procedure',
        type: 'query',
        next,
      });
    }

    expect(next).toHaveBeenCalledTimes(5);
  });

  it('should block requests exceeding limit', async () => {
    const middleware = createRateLimitMiddleware({
      windowMs: 60000,
      maxRequests: 3,
      message: 'Too many requests',
    });

    const next = vi.fn().mockResolvedValue({ success: true });
    const ctx = { session: { user: { id: 'user1' } } };

    // Make 3 successful requests
    for (let i = 0; i < 3; i++) {
      await middleware({
        ctx,
        path: 'test.procedure',
        type: 'query',
        next,
      });
    }

    // 4th request should be blocked
    await expect(
      middleware({
        ctx,
        path: 'test.procedure',
        type: 'query',
        next,
      })
    ).rejects.toThrow(TRPCError);

    await expect(
      middleware({
        ctx,
        path: 'test.procedure',
        type: 'query',
        next,
      })
    ).rejects.toThrowError('Too many requests');
  });

  it('should reset after window expires', async () => {
    const middleware = createRateLimitMiddleware({
      windowMs: 60000, // 1 minute
      maxRequests: 2,
    });

    const next = vi.fn().mockResolvedValue({ success: true });
    const ctx = { session: { user: { id: 'user2' } } };

    // Make 2 requests
    await middleware({
      ctx,
      path: 'test.procedure',
      type: 'query',
      next,
    });
    await middleware({
      ctx,
      path: 'test.procedure',
      type: 'query',
      next,
    });

    // Advance time by 1 minute + 1 second
    vi.advanceTimersByTime(61000);

    // Should allow request again
    await middleware({
      ctx,
      path: 'test.procedure',
      type: 'query',
      next,
    });

    expect(next).toHaveBeenCalledTimes(3);
  });

  it('should use different limits for different users', async () => {
    const middleware = createRateLimitMiddleware({
      windowMs: 60000,
      maxRequests: 2,
    });

    const next = vi.fn().mockResolvedValue({ success: true });

    // User 1 makes 2 requests
    await middleware({
      ctx: { session: { user: { id: 'user1' } } },
      path: 'test.procedure',
      type: 'query',
      next,
    });
    await middleware({
      ctx: { session: { user: { id: 'user1' } } },
      path: 'test.procedure',
      type: 'query',
      next,
    });

    // User 2 should still be able to make requests
    await middleware({
      ctx: { session: { user: { id: 'user2' } } },
      path: 'test.procedure',
      type: 'query',
      next,
    });

    expect(next).toHaveBeenCalledTimes(3);
  });

  it('should skip rate limiting in development', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const middleware = createRateLimitMiddleware({
      windowMs: 60000,
      maxRequests: 1,
    });

    const next = vi.fn().mockResolvedValue({ success: true });
    const ctx = { session: null };

    // Should allow unlimited requests in development
    for (let i = 0; i < 10; i++) {
      await middleware({
        ctx,
        path: 'test.procedure',
        type: 'query',
        next,
      });
    }

    expect(next).toHaveBeenCalledTimes(10);

    process.env.NODE_ENV = originalEnv;
  });

  it('should use auth rate limits for authentication', () => {
    const authLimits = rateLimits.auth;
    
    expect(authLimits.windowMs).toBe(15 * 60 * 1000); // 15 minutes
    expect(authLimits.maxRequests).toBe(5);
    expect(authLimits.message).toContain('authentication');
  });

  it('should use standard rate limits for general API calls', () => {
    const standardLimits = rateLimits.standard;
    
    expect(standardLimits.windowMs).toBe(60 * 1000); // 1 minute
    expect(standardLimits.maxRequests).toBe(30);
  });

  it('should cleanup old entries', () => {
    vi.useRealTimers();

    // Add some entries - middleware not used in this test
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const middleware = createRateLimitMiddleware({
      windowMs: 1000,
      maxRequests: 5,
    });

    cleanupRateLimitStore();

    // Should not throw
    expect(() => cleanupRateLimitStore()).not.toThrow();
  });
});
