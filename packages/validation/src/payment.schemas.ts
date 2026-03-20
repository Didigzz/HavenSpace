import { z } from "zod";

export const PaymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);
export const PaymentTypeEnum = z.enum(["RENT", "UTILITY", "DEPOSIT", "OTHER"]);

export const createPaymentSchema = z.object({
  boarderId: z.string().min(1, "Boarder is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: PaymentTypeEnum.default("RENT"),
  dueDate: z.date(),
  description: z.string().optional(),
});

export const updatePaymentSchema = createPaymentSchema.partial().extend({
  id: z.string(),
  status: PaymentStatusEnum.optional(),
  paidDate: z.date().optional(),
});

export const markPaymentPaidSchema = z.object({
  id: z.string(),
  paidDate: z.date().optional().default(new Date()),
  receiptNumber: z.string().optional(),
});

export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export type PaymentType = z.infer<typeof PaymentTypeEnum>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type MarkPaymentPaidInput = z.infer<typeof markPaymentPaidSchema>;
