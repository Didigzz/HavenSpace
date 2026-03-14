import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import {
  createRoomSchema,
  updateRoomSchema,
  RoomStatusEnum
} from "@havenspace/validation";
import type { TRPCContext, HavenSession, ProtectedTRPCContext } from "../types/index";

// Type helpers
interface AuthenticatedCtx<TInput = unknown> {
  ctx: ProtectedTRPCContext;
  input: TInput;
}

type GetAllInput = z.infer<typeof getAllRoomsSchema>;
type GetByIdInput = z.infer<typeof getRoomByIdSchema>;
type CreateRoomInput = z.infer<typeof createRoomSchema>;
type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
type DeleteRoomInput = z.infer<typeof deleteRoomSchema>;

const getAllRoomsSchema = z.object({
  status: RoomStatusEnum.optional(),
  search: z.string().optional(),
});

const getRoomByIdSchema = z.object({
  id: z.string(),
});

const deleteRoomSchema = z.object({
  id: z.string(),
});

export const createRoomRouter = (protectedProcedure: any) => {
  return createTRPCRouter({
    getAll: protectedProcedure
      .input(getAllRoomsSchema.optional())
      .query(async ({ ctx, input }: AuthenticatedCtx) => {
        return ctx.db.room.findMany({
          where: {
            status: input?.status,
            roomNumber: input?.search
              ? { contains: input.search, mode: "insensitive" }
              : undefined,
          },
          include: {
            boarders: {
              where: { isActive: true },
              select: { id: true, firstName: true, lastName: true },
            },
            _count: {
              select: { boarders: { where: { isActive: true } } },
            },
          },
          orderBy: { roomNumber: "asc" },
        });
      }),

    getById: protectedProcedure
      .input(getRoomByIdSchema)
      .query(async ({ ctx, input }: AuthenticatedCtx) => {
        return ctx.db.room.findUnique({
          where: { id: input.id },
          include: {
            boarders: { where: { isActive: true } },
            utilityReadings: {
              orderBy: { readingDate: "desc" },
              take: 10,
            },
          },
        });
      }),

    create: protectedProcedure
      .input(createRoomSchema)
      .mutation(async ({ ctx, input }: AuthenticatedCtx) => {
        return ctx.db.room.create({
          data: input,
        });
      }),

    update: protectedProcedure
      .input(updateRoomSchema)
      .mutation(async ({ ctx, input }: AuthenticatedCtx) => {
        const { id, ...data } = input;
        return ctx.db.room.update({
          where: { id },
          data,
        });
      }),

    delete: protectedProcedure
      .input(deleteRoomSchema)
      .mutation(async ({ ctx, input }: AuthenticatedCtx) => {
        return ctx.db.room.delete({
          where: { id: input.id },
        });
      }),

    getStats: protectedProcedure.query(async ({ ctx }: AuthenticatedCtx) => {
      const [total, available, occupied, maintenance] = await Promise.all([
        ctx.db.room.count(),
        ctx.db.room.count({ where: { status: "AVAILABLE" } }),
        ctx.db.room.count({ where: { status: "OCCUPIED" } }),
        ctx.db.room.count({ where: { status: "MAINTENANCE" } }),
      ]);

      return { total, available, occupied, maintenance };
    }),
  });
};
