import { Payment } from '../entities/payment.entity';
import { PaymentStatus } from '../value-objects/payment-status.vo';
import { PaymentType } from '../value-objects/payment-type.vo';

export interface PaymentFilters {
  status?: PaymentStatus;
  type?: PaymentType;
  boarderId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaymentStats {
  pending: { count: number; amount: number };
  paid: { count: number; amount: number };
  overdue: { count: number; amount: number };
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

/**
 * Payment Repository Interface
 */
export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findAll(filters?: PaymentFilters): Promise<Payment[]>;
  save(payment: Payment): Promise<Payment>;
  delete(id: string): Promise<void>;
  getStats(): Promise<PaymentStats>;
  getMonthlyRevenue(year: number): Promise<MonthlyRevenue[]>;
}