import { ListPaymentsQuery } from '../queries/list-payments.query';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentStatus } from '../../domain/value-objects/payment-status.vo';
import { PaymentType } from '../../domain/value-objects/payment-type.vo';
import { IPaymentRepository, PaymentFilters } from '../../domain/repositories/payment.repository.interface';

export class ListPaymentsHandler {
  constructor(private paymentRepository: IPaymentRepository) {}

  async handle(query?: ListPaymentsQuery): Promise<Payment[]> {
    const filters: PaymentFilters = {};

    if (query?.status) {
      filters.status = PaymentStatus.fromString(query.status);
    }

    if (query?.type) {
      filters.type = PaymentType.fromString(query.type);
    }

    if (query?.boarderId) {
      filters.boarderId = query.boarderId;
    }

    if (query?.startDate) {
      filters.startDate = query.startDate;
    }

    if (query?.endDate) {
      filters.endDate = query.endDate;
    }

    return await this.paymentRepository.findAll(filters);
  }
}