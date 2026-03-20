import { z } from "zod";
import { paginationSchema, idSchema, emailSchema } from "./common.schemas";
import { UserRoleEnum, UserStatusEnum } from "./user.schemas";

/**
 * Admin-specific validation schemas
 * For managing users, platform settings, and landlord approvals
 */

// User management schemas
export const adminGetUsersSchema = paginationSchema.extend({
  role: UserRoleEnum.optional(),
  status: UserStatusEnum.optional(),
  search: z.string().optional(),
});

export const approveLandlordSchema = z.object({
  userId: idSchema,
  notes: z.string().optional(),
});

export const rejectLandlordSchema = z.object({
  userId: idSchema,
  reason: z.string().min(10, "Please provide a reason for rejection"),
});

export const suspendUserSchema = z.object({
  userId: idSchema,
  reason: z.string().min(10, "Reason for suspension is required"),
  duration: z.number().int().positive().optional(), // Duration in days, undefined = indefinite
});

export const reactivateUserSchema = z.object({
  userId: idSchema,
});

export const getUserByIdSchema = z.object({
  userId: idSchema,
});

export const updateUserRoleSchema = z.object({
  userId: idSchema,
  role: UserRoleEnum,
});

export const updateUserStatusSchema = z.object({
  userId: idSchema,
  status: UserStatusEnum,
});

// Platform settings schemas
export const updatePlatformSettingsSchema = z.object({
  platformName: z.string().min(2, "Platform name is required"),
  supportEmail: emailSchema,
  enableRegistration: z.boolean().optional(),
  enableLandlordApplication: z.boolean().optional(),
  enableBookingSystem: z.boolean().optional(),
  enablePaymentSystem: z.boolean().optional(),
  enableMessaging: z.boolean().optional(),
});

// Audit log schemas
export const getAuditLogsSchema = paginationSchema.extend({
  userId: idSchema.optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Dashboard stats schema
export const getDashboardStatsSchema = z.object({
  timeframe: z.enum(["today", "week", "month", "year"]).default("month"),
});

// Landlord application review
export const reviewLandlordApplicationSchema = z
  .object({
    applicationId: idSchema,
    approved: z.boolean(),
    notes: z.string().optional(),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.approved && !data.rejectionReason) {
        return false;
      }
      return true;
    },
    {
      message: "Rejection reason is required when rejecting an application",
      path: ["rejectionReason"],
    }
  );

// Property verification
export const verifyPropertySchema = z.object({
  propertyId: idSchema,
  verified: z.boolean(),
  notes: z.string().optional(),
});

// Bulk operations
export const bulkUserActionSchema = z.object({
  userIds: z.array(idSchema).min(1, "At least one user ID is required"),
  action: z.enum(["suspend", "reactivate", "delete"]),
  reason: z.string().optional(),
});

export const bulkPropertyActionSchema = z.object({
  propertyIds: z.array(idSchema).min(1, "At least one property ID is required"),
  action: z.enum(["verify", "unverify", "remove"]),
  reason: z.string().optional(),
});

// Type exports
export type AdminGetUsersInput = z.infer<typeof adminGetUsersSchema>;
export type ApproveLandlordInput = z.infer<typeof approveLandlordSchema>;
export type RejectLandlordInput = z.infer<typeof rejectLandlordSchema>;
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;
export type ReactivateUserInput = z.infer<typeof reactivateUserSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UpdatePlatformSettingsInput = z.infer<
  typeof updatePlatformSettingsSchema
>;
export type GetAuditLogsInput = z.infer<typeof getAuditLogsSchema>;
export type GetDashboardStatsInput = z.infer<typeof getDashboardStatsSchema>;
export type ReviewLandlordApplicationInput = z.infer<
  typeof reviewLandlordApplicationSchema
>;
export type VerifyPropertyInput = z.infer<typeof verifyPropertySchema>;
export type BulkUserActionInput = z.infer<typeof bulkUserActionSchema>;
export type BulkPropertyActionInput = z.infer<typeof bulkPropertyActionSchema>;
