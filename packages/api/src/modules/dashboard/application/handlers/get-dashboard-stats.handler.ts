import { GetDashboardStatsQuery } from "../queries/get-dashboard-stats.query";
import { AnalyticsService } from "../../domain/services/analytics.service";
import type { PrismaClientType } from "@havenspace/database";

export class GetDashboardStatsHandler {
  constructor(private readonly db: PrismaClientType, private readonly service: AnalyticsService) {}

  async handle(_query: GetDashboardStatsQuery) {
    const [
      totalRooms,
      availableRooms,
      occupiedRooms,
      totalBoarders,
      activeBoarders,
      pendingPayments,
      paidPaymentsThisMonth,
    ] = await Promise.all([
      this.db.room.count(),
      this.db.room.count({ where: { status: "AVAILABLE" } }),
      this.db.room.count({ where: { status: "OCCUPIED" } }),
      this.db.boarder.count(),
      this.db.boarder.count({ where: { isActive: true } }),
      this.db.payment.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
        _count: true,
      }),
      this.db.payment.aggregate({
        where: {
          status: "PAID",
          paidDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return this.service.aggregateStats({
      totalRooms,
      availableRooms,
      occupiedRooms,
      totalBoarders,
      activeBoarders,
      pendingPayments: {
        _count: pendingPayments._count,
        _sum: { amount: pendingPayments._sum.amount?.toNumber() ?? 0 },
      },
      paidPaymentsThisMonth: {
        _count: paidPaymentsThisMonth._count,
        _sum: { amount: paidPaymentsThisMonth._sum.amount?.toNumber() ?? 0 },
      },
    });
  }
}