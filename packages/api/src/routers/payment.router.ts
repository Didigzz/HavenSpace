import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import {
  createPaymentSchema,
  updatePaymentSchema,
  markPaymentPaidSchema,
  PaymentStatusEnum,
  PaymentTypeEnum
} from "@havenspace/validation";
import type { ProtectedTRPCContext } from "../types/index";

// Type helpers
interface AuthenticatedCtx<TInput = unknown> {
  ctx: ProtectedTRPCContext;
  input: TInput;
}

type Procedure = ReturnType<typeof createTRPCRouter>;

type GetAllInput = z.infer<typeof getAllPaymentsSchema>;
type GetByIdInput = z.infer<typeof getPaymentByIdSchema>;
type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
type MarkAsPaidInput = z.infer<typeof markPaymentPaidSchema>;
type DeletePaymentInput = z.infer<typeof deletePaymentSchema>;
type GetMonthlyRevenueInput = z.infer<typeof getMonthlyRevenueSchema>;

const getAllPaymentsSchema = z.object({
  status: PaymentStatusEnum.optional(),
  type: PaymentTypeEnum.optional(),
  boarderId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const getPaymentByIdSchema = z.object({
  id: z.string(),
});

const deletePaymentSchema = z.object({
  id: z.string(),
});

const getMonthlyRevenueSchema = z.object({
  year: z.number().optional(),
});

export const createPaymentRouter = (protectedProcedure: Procedure) => {
  return createTRPCRouter({
    getAll: protectedProcedure
      .input(getAllPaymentsSchema.optional())
      .query(async ({ ctx, input }: AuthenticatedCtx<GetAllInput | undefined>) => {
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
      .input(getPaymentByIdSchema)
      .query(async ({ ctx, input }: AuthenticatedCtx<GetByIdInput>) => {
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
      .mutation(async ({ ctx, input }: AuthenticatedCtx<CreatePaymentInput>) => {
        return ctx.db.payment.create({
          data: input,
        });
      }),

    update: protectedProcedure
      .input(updatePaymentSchema)
      .mutation(async ({ ctx, input }: AuthenticatedCtx<UpdatePaymentInput>) => {
        const { id, ...data } = input;
        return ctx.db.payment.update({
          where: { id },
          data,
        });
      }),

    markAsPaid: protectedProcedure
      .input(markPaymentPaidSchema)
      .mutation(async ({ ctx, input }: AuthenticatedCtx<MarkAsPaidInput>) => {
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
      .input(deletePaymentSchema)
      .mutation(async ({ ctx, input }: AuthenticatedCtx<DeletePaymentInput>) => {
        return ctx.db.payment.delete({
          where: { id: input.id },
        });
      }),

    getStats: protectedProcedure.query(async ({ ctx }: AuthenticatedCtx<void>) => {
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
      .input(getMonthlyRevenueSchema)
      .query(async ({ ctx, input }: AuthenticatedCtx<GetMonthlyRevenueInput | undefined>) => {
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
        })) as Array<{ month: string; revenue: number }>;

        payments.forEach((payment) => {
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
