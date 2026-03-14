import { z } from "zod";
import { createTRPCRouter, publicProcedure, createProtectedProcedure } from "../trpc";
import {
  createBoarderSchema,
  updateBoarderSchema,
  searchSchema
} from "@havenspace/validation";
import { TRPCError } from "@trpc/server";
import type { TRPCContext, HavenSession, ProtectedTRPCContext } from "../types/index";

// Type helpers
type GetAllInput = z.infer<typeof getAllBoardersSchema>;
type GetByIdInput = z.infer<typeof getBoarderByIdSchema>;
type CreateBoarderInput = z.infer<typeof createBoarderSchema>;
type UpdateBoarderInput = z.infer<typeof updateBoarderSchema>;
type DeleteBoarderInput = z.infer<typeof deleteBoarderSchema>;
type AssignRoomInput = z.infer<typeof assignRoomSchema>;

const getAllBoardersSchema = z.object({
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  roomId: z.string().optional(),
});

const getBoarderByIdSchema = z.object({
  id: z.string(),
});

const deleteBoarderSchema = z.object({
  id: z.string(),
});

const assignRoomSchema = z.object({
  boarderId: z.string(),
  roomId: z.string().nullable(),
});

// This will be provided by the platform-specific implementation
// For Next.js, this will include NextAuth session middleware
export const createBoarderRouter = (protectedProcedure: any) => {
  return createTRPCRouter({
    getCurrent: protectedProcedure.query(async ({ ctx }: { ctx: ProtectedTRPCContext }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const boarder = await ctx.db.boarder.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          room: {
            select: {
              id: true,
              roomNumber: true,
              monthlyRate: true,
              floor: true,
              amenities: true,
              status: true,
            },
          },
          payments: {
            orderBy: { dueDate: "desc" },
            take: 1,
          },
        },
      });

      if (!boarder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Boarder profile not found",
        });
      }

      return boarder;
    }),

    getAll: protectedProcedure
      .input(getAllBoardersSchema.optional())
      .query(async ({ ctx, input }: { ctx: ProtectedTRPCContext; input?: GetAllInput }) => {
        return ctx.db.boarder.findMany({
          where: {
            isActive: input?.isActive,
            roomId: input?.roomId,
            OR: input?.search
              ? [
                  { firstName: { contains: input.search, mode: "insensitive" } },
                  { lastName: { contains: input.search, mode: "insensitive" } },
                  { email: { contains: input.search, mode: "insensitive" } },
                ]
              : undefined,
          },
          include: {
            room: {
              select: { id: true, roomNumber: true, monthlyRate: true },
            },
            _count: {
              select: { payments: true },
            },
          },
          orderBy: { lastName: "asc" },
        });
      }),

    getById: protectedProcedure
      .input(getBoarderByIdSchema)
      .query(async ({ ctx, input }: { ctx: ProtectedTRPCContext; input: GetByIdInput }) => {
        return ctx.db.boarder.findUnique({
          where: { id: input.id },
          include: {
            room: true,
            payments: {
              orderBy: { dueDate: "desc" },
              take: 10,
            },
          },
        });
      }),

    create: protectedProcedure
      .input(createBoarderSchema)
      .mutation(async ({ ctx, input }: { ctx: ProtectedTRPCContext; input: CreateBoarderInput }) => {
        const accessCode = `${input.firstName.charAt(0)}${input.lastName.charAt(0)}${Date.now().toString(36)}`.toUpperCase();

        const boarder = await ctx.db.boarder.create({
          data: {
            ...input,
            accessCode,
          },
        });

        // Update room status if assigned
        if (input.roomId) {
          const room = await ctx.db.room.findUnique({
            where: { id: input.roomId },
            include: { _count: { select: { boarders: { where: { isActive: true } } } } },
          });

          if (room && room._count.boarders >= room.capacity) {
            await ctx.db.room.update({
              where: { id: input.roomId },
              data: { status: "OCCUPIED" },
            });
          }
        }

        return boarder;
      }),

    update: protectedProcedure
      .input(updateBoarderSchema)
      .mutation(async ({ ctx, input }: { ctx: ProtectedTRPCContext; input: UpdateBoarderInput }) => {
        const { id, ...data } = input;
        return ctx.db.boarder.update({
          where: { id },
          data,
        });
      }),

    delete: protectedProcedure
      .input(deleteBoarderSchema)
      .mutation(async ({ ctx, input }: { ctx: ProtectedTRPCContext; input: DeleteBoarderInput }) => {
        return ctx.db.boarder.delete({
          where: { id: input.id },
        });
      }),

    assignRoom: protectedProcedure
      .input(assignRoomSchema)
      .mutation(async ({ ctx, input }: { ctx: ProtectedTRPCContext; input: AssignRoomInput }) => {
        const boarder = await ctx.db.boarder.update({
          where: { id: input.boarderId },
          data: { roomId: input.roomId },
        });

        // Update room statuses
        if (input.roomId) {
          const room = await ctx.db.room.findUnique({
            where: { id: input.roomId },
            include: { _count: { select: { boarders: { where: { isActive: true } } } } },
          });

          if (room && room._count.boarders >= room.capacity) {
            await ctx.db.room.update({
              where: { id: input.roomId },
              data: { status: "OCCUPIED" },
            });
          }
        }

        return boarder;
      }),

    getStats: protectedProcedure.query(async ({ ctx }: { ctx: ProtectedTRPCContext }) => {
      const [total, active, inactive] = await Promise.all([
        ctx.db.boarder.count(),
        ctx.db.boarder.count({ where: { isActive: true } }),
        ctx.db.boarder.count({ where: { isActive: false } }),
      ]);

      return { total, active, inactive };
    }),
  });
};
