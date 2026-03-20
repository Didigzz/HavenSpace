import { z } from "zod";
import {
  createUtilityReadingSchema,
  updateUtilityReadingSchema,
  UtilityTypeEnum
} from "@havenspace/validation";
import { PrismaUtilityRepository } from "../infrastructure/persistence/prisma-utility.repository";
import { UtilityService } from "../domain/services/utility.service";
import { CreateUtilityReadingHandler } from "../application/handlers/create-utility-reading.handler";
import { GetUtilityReadingHandler } from "../application/handlers/get-utility-reading.handler";
import { ListUtilityReadingsHandler } from "../application/handlers/list-utility-readings.handler";
import { GetLatestReadingHandler } from "../application/handlers/get-latest-reading.handler";
import { GetConsumptionSummaryHandler } from "../application/handlers/get-consumption-summary.handler";
import type { PrismaClientType } from "@havenspace/database";
import type { TRPCContext } from "../../../trpc";

type ProtectedProcedure = {
  input: (schema: z.ZodType) => {
    handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
  };
  handler: (fn: (opts: { ctx: TRPCContext; input: unknown }) => Promise<unknown>) => unknown;
};

export const createUtilityRouter = (protectedProcedure: ProtectedProcedure) => {
  return {
    getAll: protectedProcedure
      .input(
        z
          .object({
            type: UtilityTypeEnum.optional(),
            roomId: z.string().optional(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
          })
          .optional()
      )
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input?: unknown }) => {
        const repository = new PrismaUtilityRepository(ctx.db);
        const handler = new ListUtilityReadingsHandler(repository);
        return handler.handle(input as { type?: "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER"; roomId?: string; startDate?: Date; endDate?: Date } | undefined);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const inp = input as { id: string };
        const repository = new PrismaUtilityRepository(ctx.db);
        const handler = new GetUtilityReadingHandler(repository);
        return handler.handle(inp);
      }),

    create: protectedProcedure
      .input(createUtilityReadingSchema)
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const repository = new PrismaUtilityRepository(ctx.db);
        const service = new UtilityService(repository);
        const handler = new CreateUtilityReadingHandler(repository, service);
        return handler.handle(input as { roomId: string; type: "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER"; previousReading: number; currentReading: number; ratePerUnit: number; readingDate: Date; billingPeriodStart: Date; billingPeriodEnd: Date });
      }),

    update: protectedProcedure
      .input(updateUtilityReadingSchema)
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const { id, ...data } = input as { id: string } & Record<string, unknown>;
        return ctx.db.utilityReading.update({
          where: { id },
          data,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const inp = input as { id: string };
        return ctx.db.utilityReading.delete({
          where: { id: inp.id },
        });
      }),

    getLatestByRoom: protectedProcedure
      .input(z.object({ roomId: z.string(), type: UtilityTypeEnum }))
      .handler(async ({ ctx, input }: { ctx: { db: PrismaClientType }; input: unknown }) => {
        const repository = new PrismaUtilityRepository(ctx.db);
        const handler = new GetLatestReadingHandler(repository);
        return handler.handle(input as { roomId: string; type: "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER" });
      }),

    getConsumptionSummary: protectedProcedure
      .input(
        z.object({
          roomId: z.string().optional(),
          type: UtilityTypeEnum.optional(),
          months: z.number().default(6),
        })
      )
      .handler(async ({ ctx, input }: { ctx: TRPCContext; input: unknown }) => {
        const inp = input as { roomId?: string; type?: "ELECTRICITY" | "WATER" | "INTERNET" | "OTHER"; months: number };
        const repository = new PrismaUtilityRepository(ctx.db);
        const service = new UtilityService(repository);
        const handler = new GetConsumptionSummaryHandler(service);
        return handler.handle(inp);
      }),
  };
};
