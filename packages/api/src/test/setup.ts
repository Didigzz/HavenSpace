// Test setup file for API package
import { vi, beforeEach, afterEach } from 'vitest';

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.NODE_ENV = 'test';

// Mock console.error in tests to reduce noise
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  // Only log actual errors, not warnings
  if (args[0]?.toString()?.includes('[Redis]')) {
    return; // Suppress Redis connection warnings in tests
  }
  originalConsoleError.apply(console, args);
};

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  vi.restoreAllMocks();
});

// Global test utilities
export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'BOARDER' as const,
  },
  expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

export const mockAdminSession = {
  user: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN' as const,
  },
  expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

export const mockLandlordSession = {
  user: {
    id: 'landlord-user-id',
    email: 'landlord@example.com',
    name: 'Landlord User',
    role: 'LANDLORD' as const,
  },
  expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};
