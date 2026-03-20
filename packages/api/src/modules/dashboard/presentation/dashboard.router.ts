import { AnalyticsService } from "../domain/services/analytics.service";
import { GetDashboardStatsHandler } from "../application/handlers/get-dashboard-stats.handler";
import { GetRecentActivityHandler } from "../application/handlers/get-recent-activity.handler";
import { GetUpcomingPaymentsHandler } from "../application/handlers/get-upcoming-payments.handler";
import type { PrismaClientType } from "@havenspace/database";
import type { TRPCContext } from "../../../trpc";

type ProtectedProcedure = {
  handler: (fn: (opts: { ctx: TRPCContext }) => Promise<unknown>) => unknown;
};

export const createDashboardRouter = (protectedProcedure: ProtectedProcedure) => {
  const analyticsService = new AnalyticsService();

  return {
    getStats: protectedProcedure.handler(async ({ ctx }: { ctx: TRPCContext }) => {
      const handler = new GetDashboardStatsHandler(ctx.db, analyticsService);
      return handler.handle({});
    }),

    getRecentActivity: protectedProcedure.handler(async ({ ctx }: { ctx: TRPCContext }) => {
      const handler = new GetRecentActivityHandler(ctx.db, analyticsService);
      return handler.handle({});
    }),

    getUpcomingPayments: protectedProcedure.handler(async ({ ctx }: { ctx: TRPCContext }) => {
      const handler = new GetUpcomingPaymentsHandler(ctx.db);
      return handler.handle({});
    }),
  };
};