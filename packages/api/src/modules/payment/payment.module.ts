import { PrismaPaymentRepository } from './infrastructure/persistence/prisma-payment.repository';
import { PaymentService } from './domain/services/payment.service';
import { CreatePaymentHandler } from './application/handlers/create-payment.handler';
import { MarkPaymentPaidHandler } from './application/handlers/mark-payment-paid.handler';
import { GetPaymentHandler } from './application/handlers/get-payment.handler';
import { ListPaymentsHandler } from './application/handlers/list-payments.handler';
import { GetPaymentStatsHandler } from './application/handlers/get-payment-stats.handler';
import { GetMonthlyRevenueHandler } from './application/handlers/get-monthly-revenue.handler';
import type { PrismaClientType } from '@havenspace/database';

export class PaymentModule {
  private static instance: PaymentModule;
  private repository: PrismaPaymentRepository;
  private service: PaymentService;
  private handlers: {
    createPayment: CreatePaymentHandler;
    markPaymentPaid: MarkPaymentPaidHandler;
    getPayment: GetPaymentHandler;
    listPayments: ListPaymentsHandler;
    getPaymentStats: GetPaymentStatsHandler;
    getMonthlyRevenue: GetMonthlyRevenueHandler;
  };

  private constructor(db: PrismaClientType) {
    this.repository = new PrismaPaymentRepository(db);
    this.service = new PaymentService(this.repository);
    this.handlers = {
      createPayment: new CreatePaymentHandler(this.repository, this.service),
      markPaymentPaid: new MarkPaymentPaidHandler(this.repository, this.service),
      getPayment: new GetPaymentHandler(this.repository),
      listPayments: new ListPaymentsHandler(this.repository),
      getPaymentStats: new GetPaymentStatsHandler(this.repository),
      getMonthlyRevenue: new GetMonthlyRevenueHandler(this.repository),
    };
  }

  static initialize(db: PrismaClientType): PaymentModule {
    if (!PaymentModule.instance) {
      PaymentModule.instance = new PaymentModule(db);
    }
    return PaymentModule.instance;
  }

  static getInstance(): PaymentModule {
    if (!PaymentModule.instance) {
      throw new Error('PaymentModule not initialized. Call initialize() first.');
    }
    return PaymentModule.instance;
  }

  getHandlers() {
    return this.handlers;
  }

  getRepository() {
    return this.repository;
  }

  getService() {
    return this.service;
  }

  async dispose(): Promise<void> {
    // Cleanup resources if needed
  }
}