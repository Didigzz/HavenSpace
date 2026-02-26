import { useMemo } from 'react';
import { calculateTotalPayment, calculateDaysOverdue } from './calculator';
import type { Payment, PaymentStats } from '@/entities/payment';

/**
 * Hook to calculate payment summary statistics
 */
export function usePaymentSummary(payments: Payment[]): PaymentStats {
  return useMemo(() => {
    const pending = payments.filter(p => p.status === 'PENDING');
    const paid = payments.filter(p => p.status === 'PAID');
    const overdue = payments.filter(p => 
      p.status === 'PENDING' && calculateDaysOverdue(p.dueDate) > 0
    );

    return {
      pending: {
        count: pending.length,
        amount: pending.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : p.amount.toNumber()), 0),
      },
      paid: {
        count: paid.length,
        amount: paid.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : p.amount.toNumber()), 0),
      },
      overdue: {
        count: overdue.length,
        amount: overdue.reduce((sum, p) => sum + (typeof p.amount === 'number' ? p.amount : p.amount.toNumber()), 0),
      },
    };
  }, [payments]);
}

/**
 * Hook to calculate payment totals for a specific period
 */
export function usePaymentTotals(
  payments: Payment[],
  startDate?: Date,
  endDate?: Date
) {
  return useMemo(() => {
    const filteredPayments = payments.filter(payment => {
      if (startDate && payment.dueDate < startDate) return false;
      if (endDate && payment.dueDate > endDate) return false;
      return true;
    });

    const totalAmount = filteredPayments.reduce((sum, payment) => {
      return sum + (typeof payment.amount === 'number' ? payment.amount : payment.amount.toNumber());
    }, 0);

    const paidAmount = filteredPayments
      .filter(p => p.status === 'PAID')
      .reduce((sum, payment) => {
        return sum + (typeof payment.amount === 'number' ? payment.amount : payment.amount.toNumber());
      }, 0);

    const pendingAmount = filteredPayments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, payment) => {
        return sum + (typeof payment.amount === 'number' ? payment.amount : payment.amount.toNumber());
      }, 0);

    return {
      total: totalAmount,
      paid: paidAmount,
      pending: pendingAmount,
      collectionRate: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0,
    };
  }, [payments, startDate, endDate]);
}

/**
 * Hook to get upcoming payments (due within specified days)
 */
export function useUpcomingPayments(payments: Payment[], daysAhead: number = 7) {
  return useMemo(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return payments
      .filter(payment => 
        payment.status === 'PENDING' && 
        payment.dueDate <= targetDate &&
        payment.dueDate >= new Date()
      )
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [payments, daysAhead]);
}

/**
 * Hook to get overdue payments
 */
export function useOverduePayments(payments: Payment[]) {
  return useMemo(() => {
    const today = new Date();
    return payments
      .filter(payment => 
        payment.status === 'PENDING' && 
        payment.dueDate < today
      )
      .map(payment => ({
        ...payment,
        daysOverdue: calculateDaysOverdue(payment.dueDate),
      }))
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [payments]);
}