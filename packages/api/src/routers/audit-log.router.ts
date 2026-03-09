import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@bhms/database";

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
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          userId: z.string().optional(),
          action: z.string().optional(),
          entity: z.string().optional(),
          entityId: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .query(async ({ input, ctx }) => {
        const { page, limit, userId, action, entity, entityId, startDate, endDate } = input;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (userId) where.userId = userId;
        if (action) where.action = action;
        if (entity) where.entity = entity;
        if (entityId) where.entityId = entityId;
        
        if (startDate || endDate) {
          where.timestamp = {};
          if (startDate) (where.timestamp as Record<string, unknown>).gte = startDate;
          if (endDate) (where.timestamp as Record<string, unknown>).lte = endDate;
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
      .input(
        z.object({
          entity: z.string(),
          entityId: z.string(),
          limit: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input, ctx }) => {
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
      .input(
        z.object({
          userId: z.string(),
          limit: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input, ctx }) => {
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
      .input(
        z.object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .query(async ({ input, ctx }) => {
        const { startDate, endDate } = input;

        const where: Record<string, unknown> = {};
        if (startDate || endDate) {
          where.timestamp = {};
          if (startDate) (where.timestamp as Record<string, unknown>).gte = startDate;
          if (endDate) (where.timestamp as Record<string, unknown>).lte = endDate;
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
      .input(
        z.object({
          hours: z.number().min(1).max(720).default(24),
          limit: z.number().min(1).max(100).default(50),
        })
      )
      .query(async ({ input, ctx }) => {
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
