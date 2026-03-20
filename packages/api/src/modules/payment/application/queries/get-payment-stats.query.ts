// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type GetPaymentStatsQuery = object;

export type PaymentStats = {
  pending: { count: number; amount: number };
  paid: { count: number; amount: number };
  overdue: { count: number; amount: number };
};
