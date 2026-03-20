import { z } from "zod";

export const UtilityTypeEnum = z.enum([
  "ELECTRICITY",
  "WATER",
  "INTERNET",
  "OTHER",
]);

export const createUtilityReadingSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  type: UtilityTypeEnum,
  previousReading: z.coerce
    .number()
    .min(0, "Previous reading must be positive"),
  currentReading: z.coerce.number().min(0, "Current reading must be positive"),
  ratePerUnit: z.coerce.number().positive("Rate must be positive"),
  readingDate: z.date(),
  billingPeriodStart: z.date(),
  billingPeriodEnd: z.date(),
});

export const updateUtilityReadingSchema = createUtilityReadingSchema
  .partial()
  .extend({
    id: z.string(),
  });

export const utilityCalculationSchema = z.object({
  roomId: z.string(),
  type: UtilityTypeEnum,
  billingPeriodStart: z.date(),
  billingPeriodEnd: z.date(),
});

export type UtilityType = z.infer<typeof UtilityTypeEnum>;
export type CreateUtilityReadingInput = z.infer<
  typeof createUtilityReadingSchema
>;
export type UpdateUtilityReadingInput = z.infer<
  typeof updateUtilityReadingSchema
>;
export type UtilityCalculationInput = z.infer<typeof utilityCalculationSchema>;
