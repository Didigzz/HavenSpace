import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import { 
  createPaymentSchema, 
  updatePaymentSchema,
  markPaymentPaidSchema,
  PaymentStatusEnum,
  PaymentTypeEnum
} from "@bhms/validation";

export const createPaymentRouter = (protectedProcedure: any) => {
  return createTRPCRouter({
    getAll: protectedProcedure
      .input(
        z
          .object({
            status: PaymentStatusEnum.optional(),
            type: PaymentTypeEnum.optional(),
            boarderId: z.string().optional(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }: any) => {
        return ctx.db.payment.findMany({
          where: {
            status: input?.status,
            type: input?.type,
            boarderId: input?.boarderId,
            dueDate: {
              gte: input?.startDate,
              lte: input?.endDate,
            },
          },
          include: {
            boarder: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                room: { select: { roomNumber: true } },
              },
            },
          },
          orderBy: { dueDate: "desc" },
        });
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }: any) => {
        return ctx.db.payment.findUnique({
          where: { id: input.id },
          include: {
            boarder: {
              include: { room: true },
            },
          },
        });
      }),

    create: protectedProcedure
      .input(createPaymentSchema)
      .mutation(async ({ ctx, input }: any) => {
        return ctx.db.payment.create({
          data: input,
        });
      }),

    update: protectedProcedure
      .input(updatePaymentSchema)
      .mutation(async ({ ctx, input }: any) => {
        const { id, ...data } = input;
        return ctx.db.payment.update({
          where: { id },
          data,
        });
      }),

    markAsPaid: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }: any) => {
        const receiptNumber = `RCP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
        
        return ctx.db.payment.update({
          where: { id: input.id },
          data: {
            status: "PAID",
            paidDate: new Date(),
            receiptNumber,
          },
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }: any) => {
        return ctx.db.payment.delete({
          where: { id: input.id },
        });
      }),

    getStats: protectedProcedure.query(async ({ ctx }: any) => {
      const [totalPending, totalPaid, totalOverdue] = await Promise.all([
        ctx.db.payment.aggregate({
          where: { status: "PENDING" },
          _sum: { amount: true },
          _count: true,
        }),
        ctx.db.payment.aggregate({
          where: { status: "PAID" },
          _sum: { amount: true },
          _count: true,
        }),
        ctx.db.payment.aggregate({
          where: { status: "OVERDUE" },
          _sum: { amount: true },
          _count: true,
        }),
      ]);

      return {
        pending: {
          count: totalPending._count,
          amount: totalPending._sum.amount?.toNumber() ?? 0,
        },
        paid: {
          count: totalPaid._count,
          amount: totalPaid._sum.amount?.toNumber() ?? 0,
        },
        overdue: {
          count: totalOverdue._count,
          amount: totalOverdue._sum.amount?.toNumber() ?? 0,
        },
      };
    }),

    getMonthlyRevenue: protectedProcedure
      .input(z.object({ year: z.number().optional() }))
      .query(async ({ ctx, input }: any) => {
        const year = input?.year ?? new Date().getFullYear();
        const payments = await ctx.db.payment.findMany({
          where: {
            status: "PAID",
            paidDate: {
              gte: new Date(year, 0, 1),
              lte: new Date(year, 11, 31),
            },
          },
          select: {
            amount: true,
            paidDate: true,
          },
        });

        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(year, i).toLocaleString("default", { month: "short" }),
          revenue: 0,
        }));

        payments.forEach((payment: any) => {
          if (payment.paidDate) {
            const month = payment.paidDate.getMonth();
            const monthData = monthlyData[month];
            if (monthData) {
              monthData.revenue += payment.amount.toNumber();
            }
          }
        });

        return monthlyData;
      }),
  });
};