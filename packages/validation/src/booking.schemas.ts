import { z } from 'zod';
import { paginationSchema, idSchema, dateSchema, currencySchema } from './common.schemas';

/**
 * Booking validation schemas
 * For managing property bookings and reservations
 */

// Create booking schema
export const createBookingSchema = z.object({
  propertyId: idSchema,
  checkInDate: dateSchema.refine(
    (date) => date > new Date(),
    "Check-in date must be in the future"
  ),
  checkOutDate: dateSchema.optional().refine(
    (date) => !date || date > new Date(),
    "Check-out date must be in the future"
  ),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
  specialRequests: z.string().max(1000, "Special requests cannot exceed 1000 characters").optional(),
}).refine(
  (data) => {
    if (data.checkOutDate && data.checkInDate) {
      return data.checkOutDate > data.checkInDate;
    }
    return true;
  },
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  }
);

// Update booking schema
export const updateBookingSchema = z.object({
  bookingId: idSchema,
  checkInDate: dateSchema.optional(),
  checkOutDate: dateSchema.optional(),
  message: z.string().max(500).optional(),
  specialRequests: z.string().max(1000).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
});

// Cancel booking schema
export const cancelBookingSchema = z.object({
  bookingId: idSchema,
  reason: z.string().min(10, "Please provide a reason for cancellation").optional(),
  refundRequested: z.boolean().default(false),
});

// Confirm booking schema (landlord)
export const confirmBookingSchema = z.object({
  bookingId: idSchema,
  notes: z.string().optional(),
  customTerms: z.string().max(1000, "Custom terms cannot exceed 1000 characters").optional(),
});

// Reject booking schema (landlord)
export const rejectBookingSchema = z.object({
  bookingId: idSchema,
  reason: z.string().min(10, "Please provide a reason for rejection"),
});

// Get bookings schema
export const getBookingsSchema = paginationSchema.extend({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  propertyId: idSchema.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Get booking by ID schema
export const getBookingByIdSchema = z.object({
  bookingId: idSchema,
});

// Extend booking schema
export const extendBookingSchema = z.object({
  bookingId: idSchema,
  newCheckOutDate: dateSchema.refine(
    (date) => date > new Date(),
    "New check-out date must be in the future"
  ),
  reason: z.string().optional(),
});

// Transfer booking schema
export const transferBookingSchema = z.object({
  bookingId: idSchema,
  newBoarderId: idSchema,
  reason: z.string().min(10, "Reason for transfer is required"),
});

// Booking payment schema
export const bookingPaymentSchema = z.object({
  bookingId: idSchema,
  amount: currencySchema.positive("Amount must be positive"),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'GCASH', 'PAYMAYA', 'CREDIT_CARD']),
  referenceNumber: z.string().optional(),
});

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type ConfirmBookingInput = z.infer<typeof confirmBookingSchema>;
export type RejectBookingInput = z.infer<typeof rejectBookingSchema>;
export type GetBookingsInput = z.infer<typeof getBookingsSchema>;
export type GetBookingByIdInput = z.infer<typeof getBookingByIdSchema>;
export type ExtendBookingInput = z.infer<typeof extendBookingSchema>;
export type TransferBookingInput = z.infer<typeof transferBookingSchema>;
export type BookingPaymentInput = z.infer<typeof bookingPaymentSchema>;
