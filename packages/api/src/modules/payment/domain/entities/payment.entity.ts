import { AggregateRoot } from '../../../../shared/kernel/domain/aggregate-root';
import { PaymentStatus } from '../value-objects/payment-status.vo';
import { PaymentType } from '../value-objects/payment-type.vo';

export interface PaymentProps {
  id: string;
  boarderId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
  receiptNumber?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment Aggregate Root
 * Represents a payment in the boarding house system
 */
export class Payment extends AggregateRoot<PaymentProps> {
  constructor(props: PaymentProps) {
    super(props.id, props);
  }

  get boarderId(): string {
    return this.props.boarderId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get type(): PaymentType {
    return this.props.type;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get paidDate(): Date | undefined {
    return this.props.paidDate;
  }

  get receiptNumber(): string | undefined {
    return this.props.receiptNumber;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Mark payment as paid
   */
  markAsPaid(paidDate: Date = new Date()): void {
    if (this.props.status.isPaid()) {
      return;
    }
    this.props.status = PaymentStatus.Paid;
    this.props.paidDate = paidDate;
    this.props.receiptNumber = `RCP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
    this.props.updatedAt = new Date();
    // TODO: Emit PaymentPaidEvent
  }

  /**
   * Mark payment as overdue
   */
  markAsOverdue(): void {
    if (this.props.status.isOverdue() || this.props.status.isPaid()) {
      return;
    }
    this.props.status = PaymentStatus.Overdue;
    this.props.updatedAt = new Date();
    // TODO: Emit PaymentOverdueEvent
  }

  /**
   * Cancel payment
   */
  cancel(): void {
    if (this.props.status.isPaid()) {
      throw new Error('Cannot cancel a paid payment');
    }
    this.props.status = PaymentStatus.Cancelled;
    this.props.updatedAt = new Date();
    // TODO: Emit PaymentCancelledEvent
  }

  /**
   * Update payment details
   */
  updateDetails(details: Partial<Omit<PaymentProps, 'id' | 'status' | 'paidDate' | 'receiptNumber' | 'createdAt'>>): void {
    this.props = {
      ...this.props,
      ...details,
      updatedAt: new Date(),
    };
  }

  /**
   * Check if payment is overdue
   */
  isOverdue(): boolean {
    return this.props.status.isOverdue() || (this.props.status.isPending() && this.props.dueDate < new Date());
  }

  /**
   * Get days until due date
   */
  getDaysUntilDue(): number {
    const today = new Date();
    const dueDate = new Date(this.props.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static create(props: Omit<PaymentProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Payment {
    return new Payment({
      ...props,
      id: crypto.randomUUID(),
      status: PaymentStatus.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}