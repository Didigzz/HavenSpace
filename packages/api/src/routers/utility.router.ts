import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import {
  createUtilityReadingSchema,
  updateUtilityReadingSchema,
  UtilityTypeEnum,
} from "@havenspace/validation";
import type { ProtectedTRPCContext } from "../types/index";

type Procedure = ReturnType<typeof createTRPCRouter>;

// Type helpers
interface AuthenticatedCtx<TInput = unknown> {
  ctx: ProtectedTRPCContext;
  input: TInput;
}

type GetAllInput = z.infer<typeof getAllUtilityReadingsSchema>;
type GetByIdInput = z.infer<typeof getUtilityReadingByIdSchema>;
type CreateUtilityReadingInput = z.infer<typeof createUtilityReadingSchema>;
type UpdateUtilityReadingInput = z.infer<typeof updateUtilityReadingSchema>;
type DeleteUtilityReadingInput = z.infer<typeof deleteUtilityReadingSchema>;
type GetLatestByRoomInput = z.infer<typeof getLatestByRoomSchema>;
type GetConsumptionSummaryInput = z.infer<typeof getConsumptionSummarySchema>;

const getAllUtilityReadingsSchema = z.object({
  type: UtilityTypeEnum.optional(),
  roomId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const getUtilityReadingByIdSchema = z.object({
  id: z.string(),
});

const deleteUtilityReadingSchema = z.object({
  id: z.string(),
});

const getLatestByRoomSchema = z.object({
  roomId: z.string(),
  type: UtilityTypeEnum,
});

const getConsumptionSummarySchema = z.object({
  roomId: z.string().optional(),
  type: UtilityTypeEnum.optional(),
  months: z.number().default(6),
});

export const createUtilityRouter = (protectedProcedure: Procedure) => {
  return createTRPCRouter({
    getAll: protectedProcedure
      .input(getAllUtilityReadingsSchema.optional())
      .query(
        async ({ ctx, input }: AuthenticatedCtx<GetAllInput | undefined>) => {
          return ctx.db.utilityReading.findMany({
            where: {
              type: input?.type,
              roomId: input?.roomId,
              readingDate: {
                gte: input?.startDate,
                lte: input?.endDate,
              },
            },
            include: {
              room: {
                select: { id: true, roomNumber: true },
              },
            },
            orderBy: { readingDate: "desc" },
          });
        }
      ),

    getById: protectedProcedure
      .input(getUtilityReadingByIdSchema)
      .query(async ({ ctx, input }: AuthenticatedCtx<GetByIdInput>) => {
        return ctx.db.utilityReading.findUnique({
          where: { id: input.id },
          include: { room: true },
        });
      }),

    create: protectedProcedure
      .input(createUtilityReadingSchema)
      .mutation(
        async ({ ctx, input }: AuthenticatedCtx<CreateUtilityReadingInput>) => {
          return ctx.db.utilityReading.create({
            data: input,
          });
        }
      ),

    update: protectedProcedure
      .input(updateUtilityReadingSchema)
      .mutation(
        async ({ ctx, input }: AuthenticatedCtx<UpdateUtilityReadingInput>) => {
          const { id, ...data } = input;
          return ctx.db.utilityReading.update({
            where: { id },
            data,
          });
        }
      ),

    delete: protectedProcedure
      .input(deleteUtilityReadingSchema)
      .mutation(
        async ({ ctx, input }: AuthenticatedCtx<DeleteUtilityReadingInput>) => {
          return ctx.db.utilityReading.delete({
            where: { id: input.id },
          });
        }
      ),

    getLatestByRoom: protectedProcedure
      .input(getLatestByRoomSchema)
      .query(async ({ ctx, input }: AuthenticatedCtx<GetLatestByRoomInput>) => {
        return ctx.db.utilityReading.findFirst({
          where: {
            roomId: input.roomId,
            type: input.type,
          },
          orderBy: { readingDate: "desc" },
        });
      }),

    getConsumptionSummary: protectedProcedure
      .input(getConsumptionSummarySchema)
      .query(
        async ({
          ctx,
          input,
        }: AuthenticatedCtx<GetConsumptionSummaryInput>) => {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - input.months);

          const readings = await ctx.db.utilityReading.findMany({
            where: {
              roomId: input.roomId,
              type: input.type,
              readingDate: { gte: startDate },
            },
            include: { room: { select: { roomNumber: true } } },
            orderBy: { readingDate: "asc" },
          });

          return readings.map((reading: typeof readings[number]) => ({
            id: reading.id,
            room: reading.room.roomNumber,
            type: reading.type,
            consumption:
              reading.currentReading.toNumber() -
              reading.previousReading.toNumber(),
            cost:
              (reading.currentReading.toNumber() -
                reading.previousReading.toNumber()) *
              reading.ratePerUnit.toNumber(),
            date: reading.readingDate,
          }));
        }
      ),
  });
};
