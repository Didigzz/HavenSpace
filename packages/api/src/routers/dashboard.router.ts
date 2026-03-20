import { createTRPCRouter } from "../trpc";
import type { ProtectedTRPCContext } from "../types/index";

// Type helpers
interface AuthenticatedCtx<TInput = unknown> {
  ctx: ProtectedTRPCContext;
  input: TInput;
}

type Procedure = ReturnType<typeof createTRPCRouter>;

// Type definitions for response types
interface DashboardStats {
  rooms: {
    total: number;
    available: number;
    occupied: number;
  };
  boarders: {
    total: number;
    active: number;
  };
  payments: {
    pendingCount: number;
    pendingAmount: number;
    paidThisMonth: number;
  };
  occupancyRate: number;
}

interface Activity {
  id: string;
  type: "payment" | "boarder";
  title: string;
  description: string;
  date: Date;
}

export const createDashboardRouter = (protectedProcedure: Procedure) => {
  return createTRPCRouter({
    getStats: protectedProcedure.query(async ({ ctx }: AuthenticatedCtx): Promise<DashboardStats> => {
      const [
        totalRooms,
        availableRooms,
        occupiedRooms,
        totalBoarders,
        activeBoarders,
        pendingPayments,
        paidPaymentsThisMonth,
      ] = await Promise.all([
        ctx.db.room.count(),
        ctx.db.room.count({ where: { status: "AVAILABLE" } }),
        ctx.db.room.count({ where: { status: "OCCUPIED" } }),
        ctx.db.boarder.count(),
        ctx.db.boarder.count({ where: { isActive: true } }),
        ctx.db.payment.aggregate({
          where: { status: "PENDING" },
          _sum: { amount: true },
          _count: true,
        }),
        ctx.db.payment.aggregate({
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

      const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

      return {
        rooms: {
          total: totalRooms,
          available: availableRooms,
          occupied: occupiedRooms,
        },
        boarders: {
          total: totalBoarders,
          active: activeBoarders,
        },
        payments: {
          pendingCount: pendingPayments._count,
          pendingAmount: pendingPayments._sum.amount?.toNumber() ?? 0,
          paidThisMonth: paidPaymentsThisMonth._sum.amount?.toNumber() ?? 0,
        },
        occupancyRate: Math.round(occupancyRate),
      };
    }),

    getRecentActivity: protectedProcedure.query(async ({ ctx }: AuthenticatedCtx): Promise<Activity[]> => {
      const [recentPayments, recentBoarders] = await Promise.all([
        ctx.db.payment.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            boarder: { select: { firstName: true, lastName: true } },
          },
        }),
        ctx.db.boarder.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            moveInDate: true,
            createdAt: true,
          },
        }),
      ]);

      const activities: Activity[] = [
        ...recentPayments.map((p) => ({
          id: p.id,
          type: "payment" as const,
          title: `Payment ${p.status.toLowerCase()}`,
          description: `${p.boarder.firstName} ${p.boarder.lastName} - ₱${p.amount.toNumber().toLocaleString()}`,
          date: p.createdAt,
        })),
        ...recentBoarders.map((b) => ({
          id: b.id,
          type: "boarder" as const,
          title: "New boarder",
          description: `${b.firstName} ${b.lastName} moved in`,
          date: b.createdAt,
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      return activities.slice(0, 10);
    }),

    getUpcomingPayments: protectedProcedure.query(async ({ ctx }: AuthenticatedCtx) => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      return ctx.db.payment.findMany({
        where: {
          status: "PENDING",
          dueDate: { lte: nextWeek },
        },
        include: {
          boarder: {
            select: {
              firstName: true,
              lastName: true,
              room: { select: { roomNumber: true } },
            },
          },
        },
        orderBy: { dueDate: "asc" },
        take: 10,
      });
    }),
  });
};
