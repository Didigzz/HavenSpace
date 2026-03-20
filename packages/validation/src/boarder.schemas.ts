import { z } from "zod";

export const createBoarderSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  moveInDate: z.date(),
  roomId: z.string().optional(),
});

export const updateBoarderSchema = createBoarderSchema.partial().extend({
  id: z.string(),
  moveOutDate: z.date().optional(),
  isActive: z.boolean().optional(),
});

export const boarderAccessSchema = z.object({
  accessCode: z.string().min(1, "Access code is required"),
});

export type CreateBoarderInput = z.infer<typeof createBoarderSchema>;
export type UpdateBoarderInput = z.infer<typeof updateBoarderSchema>;
export type BoarderAccessInput = z.infer<typeof boarderAccessSchema>;
