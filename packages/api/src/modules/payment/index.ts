// Domain Layer
export { Payment } from './domain/entities/payment.entity';
export { PaymentStatus } from './domain/value-objects/payment-status.vo';
export { PaymentType } from './domain/value-objects/payment-type.vo';
export type { IPaymentRepository, PaymentFilters, PaymentStats, MonthlyRevenue } from './domain/repositories/payment.repository.interface';
export { PaymentService } from './domain/services/payment.service';

// Application Layer
export type { CreatePaymentCommand } from './application/commands/create-payment.command';
export { CreatePaymentCommandSchema } from './application/commands/create-payment.command';
export type { UpdatePaymentCommand } from './application/commands/update-payment.command';
export { UpdatePaymentCommandSchema } from './application/commands/update-payment.command';
export type { MarkPaymentPaidCommand } from './application/commands/mark-payment-paid.command';
export { MarkPaymentPaidCommandSchema } from './application/commands/mark-payment-paid.command';
export type { GetPaymentQuery } from './application/queries/get-payment.query';
export { GetPaymentQuerySchema } from './application/queries/get-payment.query';
export type { ListPaymentsQuery } from './application/queries/list-payments.query';
export { ListPaymentsQuerySchema } from './application/queries/list-payments.query';
export type { GetPaymentStatsQuery } from './application/queries/get-payment-stats.query';
export type { GetMonthlyRevenueQuery } from './application/queries/get-monthly-revenue.query';
export { GetMonthlyRevenueQuerySchema } from './application/queries/get-monthly-revenue.query';
export { CreatePaymentHandler } from './application/handlers/create-payment.handler';
export { MarkPaymentPaidHandler } from './application/handlers/mark-payment-paid.handler';
export { GetPaymentHandler } from './application/handlers/get-payment.handler';
export { ListPaymentsHandler } from './application/handlers/list-payments.handler';
export { GetPaymentStatsHandler } from './application/handlers/get-payment-stats.handler';
export { GetMonthlyRevenueHandler } from './application/handlers/get-monthly-revenue.handler';

// Infrastructure Layer
export { PrismaPaymentRepository } from './infrastructure/persistence/prisma-payment.repository';

// Presentation Layer
export { createPaymentRouter } from './presentation/payment.router';
export { PaymentModule } from './payment.module';
export * from './domain/events';
export * from './integration-events';