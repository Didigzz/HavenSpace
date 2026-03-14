/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import type { Mock } from 'vitest';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock @havenspace/config
vi.mock('@havenspace/config', async () => {
  const actual = await vi.importActual('@havenspace/config');
  return {
    ...actual,
    APP_URLS: {
      public: 'http://localhost:3000',
      api: 'http://localhost:3001',
      admin: 'http://localhost:3002',
      auth: 'http://localhost:3003',
      boarder: 'http://localhost:3004',
      landlord: 'http://localhost:3005',
    },
    getDashboardUrl: (role: string) => {
      const urls: Record<string, string> = {
        ADMIN: 'http://localhost:3002',
        LANDLORD: 'http://localhost:3005',
        BOARDER: 'http://localhost:3004',
      };
      return urls[role] || 'http://localhost:3000';
    },
    getFullDashboardUrl: (role: string, path = '/dashboard') => {
      const urls: Record<string, string> = {
        ADMIN: 'http://localhost:3002',
        LANDLORD: 'http://localhost:3005',
        BOARDER: 'http://localhost:3004',
      };
      return `${urls[role] || 'http://localhost:3000'}${path}`;
    },
    isExternalUrl: () => false,
    getAllAppUrls: () => ({
      public: 'http://localhost:3000',
      api: 'http://localhost:3001',
      admin: 'http://localhost:3002',
      auth: 'http://localhost:3003',
      boarder: 'http://localhost:3004',
      landlord: 'http://localhost:3005',
    }),
  };
});
