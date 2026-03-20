import { z } from 'zod';
import { PrismaPaymentRepository } from '../infrastructure/persistence/prisma-payment.repository';
import { PaymentService } from '../domain/services/payment.service';
import { CreatePaymentHandler } from '../application/handlers/create-payment.handler';
import { MarkPaymentPaidHandler } from '../application/handlers/mark-payment-paid.handler';
import { GetPaymentHandler } from '../application/handlers/get-payment.handler';
import { ListPaymentsHandler } from '../application/handlers/list-payments.handler';
import { GetPaymentStatsHandler } from '../application/handlers/get-payment-stats.handler';
import { GetMonthlyRevenueHandler } from '../application/handlers/get-monthly-revenue.handler';
import type { PrismaClientType } from '@havenspace/database';
import type { TRPCContext } from '../../../trpc';

type ProtectedProcedure = {
  input: (schema: z.ZodType) => {
    handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
  };
  handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
};

interface PaymentDTO {
  id: string;
  boarderId: string;
  amount: number;
  type: string;
  status: string;
  dueDate: Date;
  paidDate: Date | null;
  receiptNumber: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const createPaymentRouter = (protectedProcedure: ProtectedProcedure) => {
  return {
    getAll: protectedProcedure
      .input(
        z
          .object({
            status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
            type: z.enum(['RENT', 'UTILITY', 'DEPOSIT', 'OTHER']).optional(),
            boarderId: z.string().optional(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
          })
          .optional()
      )
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input?: unknown }) => {
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(ctx.db);
        const listPaymentsHandler = new ListPaymentsHandler(paymentRepository);

        // Execute query
        const payments = await listPaymentsHandler.handle(input as { status?: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED"; type?: "RENT" | "UTILITY" | "DEPOSIT" | "OTHER"; boarderId?: string; startDate?: Date; endDate?: Date } | undefined);

        // Convert to DTO format
        return payments.map((payment): PaymentDTO => ({
          id: payment.id,
          boarderId: payment.boarderId,
          amount: payment.amount,
          type: payment.type.toString(),
          status: payment.status.toString(),
          dueDate: payment.dueDate,
          paidDate: payment.paidDate ?? null,
          receiptNumber: payment.receiptNumber ?? null,
          description: payment.description ?? null,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        }));
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const inp = input as { id: string };
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(ctx.db);
        const getPaymentHandler = new GetPaymentHandler(paymentRepository);

        // Execute query
        const payment = await getPaymentHandler.handle(inp);

        if (!payment) {
          return null;
        }

        // Convert to DTO format
        return {
          id: payment.id,
          boarderId: payment.boarderId,
          amount: payment.amount,
          type: payment.type.toString(),
          status: payment.status.toString(),
          dueDate: payment.dueDate,
          paidDate: payment.paidDate,
          receiptNumber: payment.receiptNumber,
          description: payment.description,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        };
      }),

    create: protectedProcedure
      .input(
        z.object({
          boarderId: z.string().min(1, "Boarder is required"),
          amount: z.coerce.number().positive("Amount must be positive"),
          type: z.enum(['RENT', 'UTILITY', 'DEPOSIT', 'OTHER']).default("RENT"),
          dueDate: z.date(),
          description: z.string().optional(),
        })
      )
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(ctx.db);
        const paymentService = new PaymentService(paymentRepository);
        const createPaymentHandler = new CreatePaymentHandler(paymentRepository, paymentService);

        // Execute command
        const payment = await createPaymentHandler.handle(input as { boarderId: string; amount: number; type: "RENT" | "UTILITY" | "DEPOSIT" | "OTHER"; dueDate: Date; description?: string });

        // Convert to DTO format
        return {
          id: payment.id,
          boarderId: payment.boarderId,
          amount: payment.amount,
          type: payment.type.toString(),
          status: payment.status.toString(),
          dueDate: payment.dueDate,
          paidDate: payment.paidDate,
          receiptNumber: payment.receiptNumber,
          description: payment.description,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        };
      }),

    markAsPaid: protectedProcedure
      .input(z.object({ id: z.string(), paidDate: z.date().optional() }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const inp = input as { id: string; paidDate?: Date };
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(ctx.db);
        const paymentService = new PaymentService(paymentRepository);
        const markPaymentPaidHandler = new MarkPaymentPaidHandler(paymentRepository, paymentService);

        // Execute command
        const payment = await markPaymentPaidHandler.handle({ ...inp, paidDate: inp.paidDate ?? new Date() });

        // Convert to DTO format
        return {
          id: payment.id,
          boarderId: payment.boarderId,
          amount: payment.amount,
          type: payment.type.toString(),
          status: payment.status.toString(),
          dueDate: payment.dueDate,
          paidDate: payment.paidDate,
          receiptNumber: payment.receiptNumber,
          description: payment.description,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        };
      }),

    getStats: protectedProcedure.handler(async ({ ctx }: { ctx: { db: PrismaClientType } }) => {
      // Initialize dependencies
      const paymentRepository = new PrismaPaymentRepository(ctx.db);
      const getPaymentStatsHandler = new GetPaymentStatsHandler(paymentRepository);

      // Execute query
      const stats = await getPaymentStatsHandler.handle({});

      return stats;
    }),

    getMonthlyRevenue: protectedProcedure
      .input(z.object({ year: z.number().optional() }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const inp = input as { year?: number } | undefined;
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(ctx.db);
        const getMonthlyRevenueHandler = new GetMonthlyRevenueHandler(paymentRepository);

        // Execute query
        const revenue = await getMonthlyRevenueHandler.handle(inp || {});

        return revenue;
      }),
  };
};