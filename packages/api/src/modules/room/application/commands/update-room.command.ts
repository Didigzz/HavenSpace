import { z } from 'zod';

export const UpdateRoomCommandSchema = z.object({
  id: z.string(),
  roomNumber: z.string().min(1).optional(),
  floor: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
});

export type UpdateRoomCommand = z.infer<typeof UpdateRoomCommandSchema>;