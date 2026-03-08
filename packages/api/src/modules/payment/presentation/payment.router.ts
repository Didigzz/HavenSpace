import { z } from 'zod';
import { PrismaPaymentRepository } from '../infrastructure/persistence/prisma-payment.repository';
import { PaymentService } from '../domain/services/payment.service';
import { CreatePaymentHandler } from '../application/handlers/create-payment.handler';
import { MarkPaymentPaidHandler } from '../application/handlers/mark-payment-paid.handler';
import { GetPaymentHandler } from '../application/handlers/get-payment.handler';
import { ListPaymentsHandler } from '../application/handlers/list-payments.handler';
import { GetPaymentStatsHandler } from '../application/handlers/get-payment-stats.handler';
import { GetMonthlyRevenueHandler } from '../application/handlers/get-monthly-revenue.handler';

type ProtectedProcedure = any;

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
      .handler(async ({ context, input }: { context: any; input?: any }) => {
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(context.db);
        const listPaymentsHandler = new ListPaymentsHandler(paymentRepository);

        // Execute query
        const payments = await listPaymentsHandler.handle(input);

        // Convert to DTO format
        return payments.map((payment: any) => ({
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
        }));
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ context, input }: { context: any; input: { id: string } }) => {
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(context.db);
        const getPaymentHandler = new GetPaymentHandler(paymentRepository);

        // Execute query
        const payment = await getPaymentHandler.handle(input);

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
      .handler(async ({ context, input }: { context: any; input: any }) => {
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(context.db);
        const paymentService = new PaymentService(paymentRepository);
        const createPaymentHandler = new CreatePaymentHandler(paymentRepository, paymentService);

        // Execute command
        const payment = await createPaymentHandler.handle(input);

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
      .handler(async ({ context, input }: { context: any; input: { id: string; paidDate?: Date } }) => {
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(context.db);
        const paymentService = new PaymentService(paymentRepository);
        const markPaymentPaidHandler = new MarkPaymentPaidHandler(paymentRepository, paymentService);

        // Execute command
        const payment = await markPaymentPaidHandler.handle({ ...input, paidDate: input.paidDate ?? new Date() });

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

    getStats: protectedProcedure.handler(async ({ context }: { context: any }) => {
      // Initialize dependencies
      const paymentRepository = new PrismaPaymentRepository(context.db);
      const getPaymentStatsHandler = new GetPaymentStatsHandler(paymentRepository);

      // Execute query
      const stats = await getPaymentStatsHandler.handle({});

      return stats;
    }),

    getMonthlyRevenue: protectedProcedure
      .input(z.object({ year: z.number().optional() }))
      .handler(async ({ context, input }: { context: any; input?: { year?: number } }) => {
        // Initialize dependencies
        const paymentRepository = new PrismaPaymentRepository(context.db);
        const getMonthlyRevenueHandler = new GetMonthlyRevenueHandler(paymentRepository);

        // Execute query
        const revenue = await getMonthlyRevenueHandler.handle(input || {});

        return revenue;
      }),
  };
};