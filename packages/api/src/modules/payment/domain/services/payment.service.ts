import { IPaymentRepository } from '../repositories/payment.repository.interface';

/**
 * Payment Domain Service
 */
export class PaymentService {
  constructor(private paymentRepository: IPaymentRepository) {}

  /**
   * Validate payment data
   */
  validatePaymentData(data: {
    boarderId: string;
    amount: number;
    dueDate: Date;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.boarderId || data.boarderId.trim().length === 0) {
      errors.push('Boarder ID is required');
    }

    if (data.amount <= 0) {
      errors.push('Amount must be a positive number');
    }

    if (!data.dueDate || data.dueDate < new Date()) {
      errors.push('Due date cannot be in the past');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if payment can be marked as paid
   */
  async canMarkAsPaid(paymentId: string): Promise<boolean> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      return false;
    }
    return payment.status.isPending() || payment.status.isOverdue();
  }

  /**
   * Check if payment can be cancelled
   */
  async canCancel(paymentId: string): Promise<boolean> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      return false;
    }
    return !payment.status.isPaid();
  }

  /**
   * Generate receipt number
   */
  generateReceiptNumber(): string {
    return `RCP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
  }
}