import { z } from 'zod';
import { PrismaRoomRepository } from '../infrastructure/persistence/prisma-room.repository';
import { RoomService } from '../domain/services/room.service';
import { CreateRoomHandler } from '../application/handlers/create-room.handler';
import { UpdateRoomHandler } from '../application/handlers/update-room.handler';
import { DeleteRoomHandler } from '../application/handlers/delete-room.handler';
import { GetRoomHandler } from '../application/handlers/get-room.handler';
import { ListRoomsHandler } from '../application/handlers/list-rooms.handler';
import { GetRoomStatsHandler } from '../application/handlers/get-room-stats.handler';
import type { PrismaClientType } from '@havenspace/database';
import type { TRPCContext } from '../../../trpc';

type ProtectedProcedure = {
  input: (schema: z.ZodType) => {
    handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
  };
  handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
};

interface RoomDTO {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  monthlyRate: number;
  description: string | null;
  amenities: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const createRoomRouter = (protectedProcedure: ProtectedProcedure) => {
  return {
    getAll: protectedProcedure
      .input(
        z
          .object({
            status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
            search: z.string().optional(),
            floor: z.number().optional(),
          })
          .optional()
      )
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input?: unknown }) => {
        // Initialize dependencies
        const roomRepository = new PrismaRoomRepository(ctx.db);
        const listRoomsHandler = new ListRoomsHandler(roomRepository);

        // Execute query
        const rooms = await listRoomsHandler.handle(input as { status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"; search?: string; floor?: number } | undefined);

        // Convert to DTO format for response
        return rooms.map((room): RoomDTO => ({
          id: room.id,
          roomNumber: room.roomNumber,
          floor: room.floor,
          capacity: room.capacity,
          monthlyRate: room.monthlyRate,
          description: room.description ?? null,
          amenities: room.amenities,
          status: room.status.toString(),
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        }));
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const inp = input as { id: string };
        // Initialize dependencies
        const roomRepository = new PrismaRoomRepository(ctx.db);
        const getRoomHandler = new GetRoomHandler(roomRepository);

        // Execute query
        const room = await getRoomHandler.handle(inp);

        if (!room) {
          return null;
        }

        // Convert to DTO format for response
        return {
          id: room.id,
          roomNumber: room.roomNumber,
          floor: room.floor,
          capacity: room.capacity,
          monthlyRate: room.monthlyRate,
          description: room.description,
          amenities: room.amenities,
          status: room.status.toString(),
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        };
      }),

    create: protectedProcedure
      .input(
        z.object({
          roomNumber: z.string().min(1, "Room number is required"),
          floor: z.coerce.number().int().positive("Floor must be positive"),
          capacity: z.coerce.number().int().positive("Capacity must be positive"),
          monthlyRate: z.coerce.number().positive("Rate must be positive"),
          description: z.string().optional(),
          amenities: z.array(z.string()).default([]),
        })
      )
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        // Initialize dependencies
        const roomRepository = new PrismaRoomRepository(ctx.db);
        const roomService = new RoomService(roomRepository);
        const createRoomHandler = new CreateRoomHandler(roomRepository, roomService);

        // Execute command
        const room = await createRoomHandler.handle(input as { roomNumber: string; floor: number; capacity: number; monthlyRate: number; amenities: string[]; description?: string });

        // Convert to DTO format for response
        return {
          id: room.id,
          roomNumber: room.roomNumber,
          floor: room.floor,
          capacity: room.capacity,
          monthlyRate: room.monthlyRate,
          description: room.description,
          amenities: room.amenities,
          status: room.status.toString(),
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          roomNumber: z.string().min(1).optional(),
          floor: z.coerce.number().int().positive().optional(),
          capacity: z.coerce.number().int().positive().optional(),
          monthlyRate: z.coerce.number().positive().optional(),
          description: z.string().optional(),
          amenities: z.array(z.string()).optional(),
          status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).optional(),
        })
      )
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        // Initialize dependencies
        const roomRepository = new PrismaRoomRepository(ctx.db);
        const roomService = new RoomService(roomRepository);
        const updateRoomHandler = new UpdateRoomHandler(roomRepository, roomService);

        // Execute command
        const room = await updateRoomHandler.handle(input as { id: string; roomNumber?: string; floor?: number; capacity?: number; monthlyRate?: number; description?: string; amenities?: string[]; status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" });

        // Convert to DTO format for response
        return {
          id: room.id,
          roomNumber: room.roomNumber,
          floor: room.floor,
          capacity: room.capacity,
          monthlyRate: room.monthlyRate,
          description: room.description,
          amenities: room.amenities,
          status: room.status.toString(),
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const inp = input as { id: string };
        // Initialize dependencies
        const roomRepository = new PrismaRoomRepository(ctx.db);
        const deleteRoomHandler = new DeleteRoomHandler(roomRepository);

        // Execute command
        await deleteRoomHandler.handle(inp);

        return { success: true };
      }),

    getStats: protectedProcedure.handler(async ({ ctx }: { ctx: { db: PrismaClientType } }) => {
      // Initialize dependencies
      const roomRepository = new PrismaRoomRepository(ctx.db);
      const getRoomStatsHandler = new GetRoomStatsHandler(roomRepository);

      // Execute query
      const stats = await getRoomStatsHandler.handle({});

      return stats;
    }),
  };
};