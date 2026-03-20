import { AnalyticsService } from './domain/services/analytics.service';
import { GetDashboardStatsHandler } from './application/handlers/get-dashboard-stats.handler';
import { GetRecentActivityHandler } from './application/handlers/get-recent-activity.handler';
import { GetUpcomingPaymentsHandler } from './application/handlers/get-upcoming-payments.handler';
import type { PrismaClientType } from '@havenspace/database';

export class DashboardModule {
  private static instance: DashboardModule;
  private service: AnalyticsService;
  private handlers: {
    getDashboardStats: GetDashboardStatsHandler;
    getRecentActivity: GetRecentActivityHandler;
    getUpcomingPayments: GetUpcomingPaymentsHandler;
  };

  private constructor(db: PrismaClientType) {
    this.service = new AnalyticsService();
    this.handlers = {
      getDashboardStats: new GetDashboardStatsHandler(db, this.service),
      getRecentActivity: new GetRecentActivityHandler(db, this.service),
      getUpcomingPayments: new GetUpcomingPaymentsHandler(db),
    };
  }

  static initialize(db: PrismaClientType): DashboardModule {
    if (!DashboardModule.instance) {
      DashboardModule.instance = new DashboardModule(db);
    }
    return DashboardModule.instance;
  }

  static getInstance(): DashboardModule {
    if (!DashboardModule.instance) {
      throw new Error('DashboardModule not initialized. Call initialize() first.');
    }
    return DashboardModule.instance;
  }

  getHandlers() {
    return this.handlers;
  }

  getService() {
    return this.service;
  }

  async dispose(): Promise<void> {
    // Cleanup resources if needed
  }
}