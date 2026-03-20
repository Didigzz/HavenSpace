import { DashboardStats } from "../entities/dashboard-stats.entity";

export interface PaymentActivity {
  id: string;
  type: "payment";
  title: string;
  description: string;
  date: Date;
}

export interface BoarderActivity {
  id: string;
  type: "boarder";
  title: string;
  description: string;
  date: Date;
}

export type Activity = PaymentActivity | BoarderActivity;

interface PaymentRecord {
  id: string;
  status: string;
  amount: number;
  boarder: { firstName: string; lastName: string };
  createdAt: Date;
}

interface BoarderRecord {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export class AnalyticsService {
  calculateOccupancyRate(totalRooms: number, occupiedRooms: number): number {
    return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  }

  aggregateStats(data: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    totalBoarders: number;
    activeBoarders: number;
    pendingPayments: { _count: number; _sum: { amount?: number } };
    paidPaymentsThisMonth: { _count: number; _sum: { amount?: number } };
  }): DashboardStats {
    const occupancyRate = this.calculateOccupancyRate(
      data.totalRooms,
      data.occupiedRooms
    );

    return DashboardStats.create({
      rooms: {
        total: data.totalRooms,
        available: data.availableRooms,
        occupied: data.occupiedRooms,
      },
      boarders: {
        total: data.totalBoarders,
        active: data.activeBoarders,
      },
      payments: {
        pendingCount: data.pendingPayments._count,
        pendingAmount: Number(data.pendingPayments._sum.amount) ?? 0,
        paidThisMonth: Number(data.paidPaymentsThisMonth._sum.amount) ?? 0,
      },
      occupancyRate,
    });
  }

  mergeActivities(payments: PaymentRecord[], boarders: BoarderRecord[]): Activity[] {
    const activities = [
      ...payments.map((p) => ({
        id: p.id,
        type: "payment" as const,
        title: `Payment ${p.status.toLowerCase()}`,
        description: `${p.boarder.firstName} ${p.boarder.lastName} - ₱${Number(p.amount).toLocaleString()}`,
        date: p.createdAt,
      })),
      ...boarders.map((b) => ({
        id: b.id,
        type: "boarder" as const,
        title: "New boarder",
        description: `${b.firstName} ${b.lastName} moved in`,
        date: b.createdAt,
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return activities.slice(0, 10);
  }
}