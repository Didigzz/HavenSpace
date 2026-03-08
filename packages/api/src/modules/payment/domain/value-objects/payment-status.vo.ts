import { ValueObject } from '../../../../shared/kernel/domain/value-object';

/**
 * Payment Status Value Object
 */
export class PaymentStatus extends ValueObject<'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'> {
  public static readonly PENDING = 'PENDING' as const;
  public static readonly PAID = 'PAID' as const;
  public static readonly OVERDUE = 'OVERDUE' as const;
  public static readonly CANCELLED = 'CANCELLED' as const;

  private constructor(value: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED') {
    super(value);
  }

  public static get Pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatus.PENDING);
  }

  public static get Paid(): PaymentStatus {
    return new PaymentStatus(PaymentStatus.PAID);
  }

  public static get Overdue(): PaymentStatus {
    return new PaymentStatus(PaymentStatus.OVERDUE);
  }

  public static get Cancelled(): PaymentStatus {
    return new PaymentStatus(PaymentStatus.CANCELLED);
  }

  public static fromString(value: string): PaymentStatus {
    switch (value) {
      case PaymentStatus.PENDING:
        return PaymentStatus.Pending;
      case PaymentStatus.PAID:
        return PaymentStatus.Paid;
      case PaymentStatus.OVERDUE:
        return PaymentStatus.Overdue;
      case PaymentStatus.CANCELLED:
        return PaymentStatus.Cancelled;
      default:
        throw new Error(`Invalid payment status: ${value}`);
    }
  }

  public isPending(): boolean {
    return this.value === PaymentStatus.PENDING;
  }

  public isPaid(): boolean {
    return this.value === PaymentStatus.PAID;
  }

  public isOverdue(): boolean {
    return this.value === PaymentStatus.OVERDUE;
  }

  public isCancelled(): boolean {
    return this.value === PaymentStatus.CANCELLED;
  }

  public toString(): string {
    return this.value;
  }
}