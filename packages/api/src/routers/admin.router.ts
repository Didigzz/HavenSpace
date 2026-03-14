import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { TRPCContext, HavenSession, AdminTRPCContext } from "../types/index";

// Type helpers
interface AdminCtx<TInput = unknown> {
  ctx: AdminTRPCContext;
  input: TInput;
}

type GetUsersInput = z.infer<typeof getUsersSchema>;
type ApproveLandlordInput = z.infer<typeof approveLandlordSchema>;
type RejectLandlordInput = z.infer<typeof rejectLandlordSchema>;
type SuspendUserInput = z.infer<typeof suspendUserSchema>;
type ReactivateUserInput = z.infer<typeof reactivateUserSchema>;
type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;

const getUsersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  role: z.enum(["LANDLORD", "BOARDER", "ADMIN"]).optional(),
  status: z.enum(["PENDING", "APPROVED", "SUSPENDED"]).optional(),
  search: z.string().optional(),
});

const approveLandlordSchema = z.object({
  userId: z.string(),
});

const rejectLandlordSchema = z.object({
  userId: z.string(),
  reason: z.string().min(10, "Please provide a reason"),
});

const suspendUserSchema = z.object({
  userId: z.string(),
  reason: z.string().min(10, "Please provide a reason"),
});

const reactivateUserSchema = z.object({
  userId: z.string(),
});

const getUserByIdSchema = z.object({
  userId: z.string(),
});

/**
 * Admin router for managing users and platform operations
 */
export const createAdminRouter = (
  protectedProcedure: any,
  adminProcedure: any
) => {
  return createTRPCRouter({
    // Get all users with pagination and filtering
    getUsers: adminProcedure
      .input(getUsersSchema)
      .query(async ({ ctx, input }: AdminCtx<GetUsersInput>) => {
        const { page, limit, role, status, search } = input;
        const skip = (page - 1) * limit;

        const where: {
          role?: "LANDLORD" | "BOARDER" | "ADMIN";
          status?: "PENDING" | "APPROVED" | "SUSPENDED";
          OR?: Array<{
            name?: { contains: string; mode: "insensitive" };
            email?: { contains: string; mode: "insensitive" };
          }>;
        } = {};
        if (role) where.role = role;
        if (status) where.status = status;
        if (search) {
          where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ];
        }

        const [users, total] = await Promise.all([
          ctx.db.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              phone: true,
              image: true,
              createdAt: true,
              updatedAt: true,
              landlordProfile: {
                select: {
                  businessName: true,
                  isVerified: true,
                },
              },
            },
          }),
          ctx.db.user.count({ where }),
        ]);

        return {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      }),

    // Get pending landlord approvals
    getPendingLandlords: adminProcedure.query(async ({ ctx }: AdminCtx<void>) => {
      return ctx.db.user.findMany({
        where: {
          role: "LANDLORD",
          status: "PENDING",
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
          landlordProfile: {
            select: {
              businessName: true,
              businessAddress: true,
              businessPhone: true,
              identificationDocument: true,
              businessPermit: true,
            },
          },
        },
      });
    }),

    // Approve a landlord
    approveLandlord: adminProcedure
      .input(approveLandlordSchema)
      .mutation(async ({ ctx, input }: AdminCtx<ApproveLandlordInput>) => {
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        if (user.role !== "LANDLORD") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User is not a landlord",
          });
        }

        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            status: "APPROVED",
            landlordProfile: {
              update: {
                isVerified: true,
                reviewedAt: new Date(),
                reviewedBy: ctx.session.user.id,
              },
            },
          },
        });

        // TODO: Send approval email notification

        return { success: true, user: updatedUser };
      }),

    // Reject a landlord application
    rejectLandlord: adminProcedure
      .input(rejectLandlordSchema)
      .mutation(async ({ ctx, input }: AdminCtx<RejectLandlordInput>) => {
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        if (user.role !== "LANDLORD") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User is not a landlord",
          });
        }

        // Update user status and add rejection note
        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            status: "SUSPENDED", // Use SUSPENDED for rejected
            landlordProfile: {
              update: {
                isVerified: false,
                reviewedAt: new Date(),
                reviewedBy: ctx.session.user.id,
                notes: input.reason,
              },
            },
          },
        });

        // TODO: Send rejection email notification with reason

        return { success: true, user: updatedUser };
      }),

    // Suspend a user
    suspendUser: adminProcedure
      .input(suspendUserSchema)
      .mutation(async ({ ctx, input }: AdminCtx<SuspendUserInput>) => {
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        if (user.role === "ADMIN") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Cannot suspend admin users",
          });
        }

        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: { status: "SUSPENDED" },
        });

        // TODO: Send suspension notification email

        return { success: true, user: updatedUser };
      }),

    // Reactivate a suspended user
    reactivateUser: adminProcedure
      .input(reactivateUserSchema)
      .mutation(async ({ ctx, input }: AdminCtx<ReactivateUserInput>) => {
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        if (user.status !== "SUSPENDED") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User is not suspended",
          });
        }

        const updatedUser = await ctx.db.user.update({
          where: { id: input.userId },
          data: { status: "APPROVED" },
        });

        // TODO: Send reactivation notification email

        return { success: true, user: updatedUser };
      }),

    // Get dashboard stats
    getDashboardStats: adminProcedure.query(async ({ ctx }: AdminCtx<void>) => {
      const [
        totalUsers,
        totalLandlords,
        totalBoarders,
        pendingApprovals,
        totalProperties,
        activeBookings,
      ] = await Promise.all([
        ctx.db.user.count(),
        ctx.db.user.count({ where: { role: "LANDLORD" } }),
        ctx.db.user.count({ where: { role: "BOARDER" } }),
        ctx.db.user.count({ where: { role: "LANDLORD", status: "PENDING" } }),
        ctx.db.property.count(),
        ctx.db.booking.count({
          where: { status: { in: ["CONFIRMED", "ACTIVE"] } },
        }),
      ]);

      return {
        totalUsers,
        totalLandlords,
        totalBoarders,
        pendingApprovals,
        totalProperties,
        activeBookings,
      };
    }),

    // Get user details by ID
    getUserById: adminProcedure
      .input(getUserByIdSchema)
      .query(async ({ ctx, input }: AdminCtx<GetUserByIdInput>) => {
        const user = await ctx.db.user.findUnique({
          where: { id: input.userId },
          include: {
            landlordProfile: true,
            boarder: {
              include: {
                bookings: {
                  take: 5,
                  orderBy: { createdAt: "desc" },
                },
              },
            },
          },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        return user;
      }),
  });
};
