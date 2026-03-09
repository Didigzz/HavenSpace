import { NextResponse } from 'next/server';
import { db } from '@bhms/database';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint for the API server
 * Includes database connectivity check
 */
export async function GET() {
  const healthStatus: {
    status: string;
    timestamp: string;
    app: { name: string; version: string; environment: string };
    urls: { api: string };
    database: { status: string; error: string | null };
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    app: {
      name: '@bhms/api-server',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
    urls: {
      api: process.env.API_URL || 'http://localhost:3001',
    },
    database: {
      status: 'unknown',
      error: null,
    },
  };

  // Check database connectivity
  try {
    await db.$queryRaw`SELECT 1`;
    healthStatus.database.status = 'connected';
  } catch (error) {
    healthStatus.status = 'unhealthy';
    healthStatus.database.status = 'disconnected';
    healthStatus.database.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(healthStatus);
}
