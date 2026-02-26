// Payment entity types

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentType = 'RENT' | 'UTILITY' | 'DEPOSIT' | 'OTHER';

export interface Boarder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}

export interface Payment {
  id: string;
  amount: number | { toNumber(): number };
  type: PaymentType;
  status: PaymentStatus;
  dueDate: Date;
  paidDate?: Date | null;
  description?: string | null;
  receiptNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
  boarderId: string;
  boarder?: Boarder;
}

export type PaymentWithBoarder = Payment & {
  boarder: {
    id: string;
    firstName: string;
    lastName: string;
    room?: { roomNumber: string } | null;
  };
};

export interface PaymentFilters {
  status?: PaymentStatus;
  type?: PaymentType;
  boarderId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaymentStats {
  pending: {
    count: number;
    amount: number;
  };
  paid: {
    count: number;
    amount: number;
  };
  overdue: {
    count: number;
    amount: number;
  };
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}