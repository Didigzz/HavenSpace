import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@havenspace/database";
import type { TRPCContext, HavenSession, AdminTRPCContext } from "../types/index";

// Type helpers
interface AdminCtx<TInput = unknown> {
  ctx: AdminTRPCContext;
  input: TInput;
}

type ListAuditLogsInput = z.infer<typeof listAuditLogsSchema>;
type GetByEntityInput = z.infer<typeof getByEntitySchema>;
type GetByUserInput = z.infer<typeof getByUserSchema>;
type GetStatsInput = z.infer<typeof getStatsSchema>;
type GetRecentInput = z.infer<typeof getRecentSchema>;

const listAuditLogsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  userId: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  entityId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const getByEntitySchema = z.object({
  entity: z.string(),
  entityId: z.string(),
  limit: z.number().min(1).max(100).default(50),
});

const getByUserSchema = z.object({
  userId: z.string(),
  limit: z.number().min(1).max(100).default(50),
});

const getStatsSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const getRecentSchema = z.object({
  hours: z.number().min(1).max(720).default(24),
  limit: z.number().min(1).max(100).default(50),
});

// Type definitions for audit log types
interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  oldValue: unknown | null;
  newValue: unknown | null;
  timestamp: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

interface AuditLogStats {
  total: number;
  byAction: Array<{ action: string; count: number }>;
  byEntity: Array<{ entity: string; count: number }>;
  byUser: Array<{ userId: string; count: number }>;
}

/**
 * Audit log router - Admin only access
 * Provides endpoints for viewing and querying audit logs
 */
export const createAuditLogRouter = (
  protectedProcedure: any,
  adminProcedure: any
) => {
  return createTRPCRouter({
    /**
     * Get audit logs with pagination and filtering
     */
    list: adminProcedure
      .input(listAuditLogsSchema)
      .query(async ({ input, ctx }: AdminCtx<ListAuditLogsInput>) => {
        const { page, limit, userId, action, entity, entityId, startDate, endDate } = input;
        const skip = (page - 1) * limit;

        const where: {
          userId?: string;
          action?: string;
          entity?: string;
          entityId?: string;
          timestamp?: {
            gte?: Date;
            lte?: Date;
          };
        } = {};

        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (entity) where.entity = entity;
        if (entityId) where.entityId = entityId;

        if (startDate || endDate) {
          where.timestamp = {};
          if (startDate) where.timestamp.gte = startDate;
          if (endDate) where.timestamp.lte = endDate;
        }

        const [logs, total] = await Promise.all([
          db.auditLog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { timestamp: "desc" },
          }),
          db.auditLog.count({ where }),
        ]);

        return {
          logs,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      }),

    /**
     * Get audit logs for a specific entity
     */
    getByEntity: adminProcedure
      .input(getByEntitySchema)
      .query(async ({ input, ctx }: AdminCtx<GetByEntityInput>) => {
        const { entity, entityId, limit } = input;

        const logs = await db.auditLog.findMany({
          where: {
            entity,
            entityId,
          },
          take: limit,
          orderBy: { timestamp: "desc" },
        });

        return logs;
      }),

    /**
     * Get audit logs for a specific user
     */
    getByUser: adminProcedure
      .input(getByUserSchema)
      .query(async ({ input, ctx }: AdminCtx<GetByUserInput>) => {
        const { userId, limit } = input;

        const logs = await db.auditLog.findMany({
          where: { userId },
          take: limit,
          orderBy: { timestamp: "desc" },
        });

        return logs;
      }),

    /**
     * Get audit statistics
     */
    getStats: adminProcedure
      .input(getStatsSchema)
      .query(async ({ input, ctx }: AdminCtx<GetStatsInput>): Promise<AuditLogStats> => {
        const { startDate, endDate } = input;

        const where: {
          timestamp?: {
            gte?: Date;
            lte?: Date;
          };
        } = {};
        if (startDate || endDate) {
          where.timestamp = {};
          if (startDate) where.timestamp.gte = startDate;
          if (endDate) where.timestamp.lte = endDate;
        }

        const [total, byAction, byEntity, byUser] = await Promise.all([
          db.auditLog.count({ where }),
          db.auditLog.groupBy({
            by: ["action"],
            where,
            _count: true,
          }),
          db.auditLog.groupBy({
            by: ["entity"],
            where,
            _count: true,
          }),
          db.auditLog.groupBy({
            by: ["userId"],
            where,
            _count: true,
          }),
        ]);

        return {
          total,
          byAction: byAction.map((item) => ({
            action: item.action,
            count: item._count,
          })),
          byEntity: byEntity.map((item) => ({
            entity: item.entity,
            count: item._count,
          })),
          byUser: byUser.map((item) => ({
            userId: item.userId,
            count: item._count,
          })),
        };
      }),

    /**
     * Get recent audit logs (last 24 hours by default)
     */
    getRecent: adminProcedure
      .input(getRecentSchema)
      .query(async ({ input, ctx }: AdminCtx<GetRecentInput>) => {
        const { hours, limit } = input;
        const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

        const logs = await db.auditLog.findMany({
          where: {
            timestamp: {
              gte: startDate,
            },
          },
          take: limit,
          orderBy: { timestamp: "desc" },
        });

        return logs;
      }),
  });
};
