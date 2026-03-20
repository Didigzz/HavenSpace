import { Payment } from '../../domain/entities/payment.entity';
import { PaymentStatus } from '../../domain/value-objects/payment-status.vo';
import { PaymentType } from '../../domain/value-objects/payment-type.vo';
import { IPaymentRepository, PaymentFilters, PaymentStats, MonthlyRevenue } from '../../domain/repositories/payment.repository.interface';
import type { PrismaClientType } from '@havenspace/database';
import { Prisma } from '@prisma/client';

interface PaymentData {
  id: string;
  boarderId: string;
  amount: Prisma.Decimal | number;
  type: string;
  status: string;
  dueDate: Date;
  paidDate: Date | null;
  receiptNumber: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaClientType) {}

  async findById(id: string): Promise<Payment | null> {
    const paymentData = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!paymentData) {
      return null;
    }

    return this.mapToDomain(paymentData);
  }

  async findAll(filters?: PaymentFilters): Promise<Payment[]> {
    const paymentsData = await this.prisma.payment.findMany({
      where: {
        status: filters?.status ? filters.status.value : undefined,
        type: filters?.type ? filters.type.value : undefined,
        boarderId: filters?.boarderId,
        dueDate: {
          gte: filters?.startDate,
          lte: filters?.endDate,
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
      orderBy: { dueDate: 'desc' },
    });

    return paymentsData.map((payment) => this.mapToDomain(payment));
  }

  async save(payment: Payment): Promise<Payment> {
    const paymentData = await this.prisma.payment.upsert({
      where: { id: payment.id },
      update: {
        boarderId: payment.boarderId,
        amount: payment.amount,
        type: payment.type.value,
        status: payment.status.value,
        dueDate: payment.dueDate,
        paidDate: payment.paidDate,
        receiptNumber: payment.receiptNumber,
        description: payment.description,
        updatedAt: payment.updatedAt,
      },
      create: {
        id: payment.id,
        boarderId: payment.boarderId,
        amount: payment.amount,
        type: payment.type.value,
        status: payment.status.value,
        dueDate: payment.dueDate,
        paidDate: payment.paidDate,
        receiptNumber: payment.receiptNumber,
        description: payment.description,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });

    return this.mapToDomain(paymentData);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payment.delete({
      where: { id },
    });
  }

  async getStats(): Promise<PaymentStats> {
    const [totalPending, totalPaid, totalOverdue] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: 'PENDING' },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: { status: 'OVERDUE' },
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
  }

  async getMonthlyRevenue(year: number): Promise<MonthlyRevenue[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: 'PAID',
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
      month: new Date(year, i).toLocaleString('default', { month: 'short' }),
      revenue: 0,
    }));

    payments.forEach((payment: { paidDate: Date | null; amount: { toNumber: () => number } }) => {
      if (payment.paidDate) {
        const month = payment.paidDate.getMonth();
        monthlyData[month]!.revenue += payment.amount.toNumber();
      }
    });

    return monthlyData;
  }

  private mapToDomain(data: PaymentData): Payment {
    return new Payment({
      id: data.id,
      boarderId: data.boarderId,
      amount: data.amount instanceof Prisma.Decimal ? data.amount.toNumber() : data.amount,
      type: PaymentType.fromString(data.type),
      status: PaymentStatus.fromString(data.status),
      dueDate: data.dueDate,
      paidDate: data.paidDate ?? undefined,
      receiptNumber: data.receiptNumber ?? undefined,
      description: data.description ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
