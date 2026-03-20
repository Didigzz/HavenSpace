import { db } from "@havenspace/database";

export interface AuditLogData {
  userId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  changes?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Log an audit event to the database
 * This should be called for all sensitive operations
 */
export async function logAudit(data: AuditLogData): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId ?? null,
        changes: data.changes ? JSON.parse(JSON.stringify(data.changes)) : null,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
  } catch (error) {
    // Don't fail the operation if audit logging fails
    // But log the error for debugging
    console.error("[AuditLog] Failed to log audit event:", error);
  }
}

/**
 * Common audit actions
 */
export const AuditActions = {
  // User management
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  USER_SUSPENDED: "USER_SUSPENDED",
  USER_APPROVED: "USER_APPROVED",
  
  // Landlord management
  LANDLORD_APPLICATION_SUBMITTED: "LANDLORD_APPLICATION_SUBMITTED",
  LANDLORD_APPLICATION_APPROVED: "LANDLORD_APPLICATION_APPROVED",
  LANDLORD_APPLICATION_REJECTED: "LANDLORD_APPLICATION_REJECTED",
  LANDLORD_SUSPENDED: "LANDLORD_SUSPENDED",
  
  // Property management
  PROPERTY_CREATED: "PROPERTY_CREATED",
  PROPERTY_UPDATED: "PROPERTY_UPDATED",
  PROPERTY_DELETED: "PROPERTY_DELETED",
  PROPERTY_PUBLISHED: "PROPERTY_PUBLISHED",
  PROPERTY_UNPUBLISHED: "PROPERTY_UNPUBLISHED",
  
  // Booking management
  BOOKING_CREATED: "BOOKING_CREATED",
  BOOKING_UPDATED: "BOOKING_UPDATED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",
  BOOKING_APPROVED: "BOOKING_APPROVED",
  BOOKING_REJECTED: "BOOKING_REJECTED",
  
  // Payment management
  PAYMENT_CREATED: "PAYMENT_CREATED",
  PAYMENT_UPDATED: "PAYMENT_UPDATED",
  PAYMENT_DELETED: "PAYMENT_DELETED",
  PAYMENT_PROCESSED: "PAYMENT_PROCESSED",
  PAYMENT_REFUNDED: "PAYMENT_REFUNDED",
  
  // Admin actions
  ADMIN_LOGIN: "ADMIN_LOGIN",
  ADMIN_LOGOUT: "ADMIN_LOGOUT",
  SETTINGS_UPDATED: "SETTINGS_UPDATED",
  DATA_EXPORTED: "DATA_EXPORTED",
  
  // Security
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  PASSWORD_RESET_REQUESTED: "PASSWORD_RESET_REQUESTED",
  SESSION_REVOKED: "SESSION_REVOKED",
} as const;

/**
 * Entities that can be audited
 */
export const AuditEntities = {
  USER: "User",
  LANDLORD: "Landlord",
  PROPERTY: "Property",
  BOOKING: "Booking",
  PAYMENT: "Payment",
  ROOM: "Room",
  BOARDER: "Boarder",
  SETTING: "Setting",
  SESSION: "Session",
} as const;

/**
 * Create a helper to log property changes
 */
export function createChangeLog<T extends Record<string, unknown>>(
  oldData: T | null,
  newData: T,
  sensitiveFields: string[] = ["password", "access_token", "refresh_token"]
): Record<string, unknown> {
  const changes: Record<string, unknown> = {};
  
  if (!oldData) {
    changes.created = newData;
    return changes;
  }
  
  const updated: Record<string, unknown> = {};

  for (const key in newData) {
    if ((sensitiveFields as string[]).indexOf(key as string) !== -1) {
      continue; // Skip sensitive fields
    }

    if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
      updated[key] = {
        from: oldData[key],
        to: newData[key],
      };
    }
  }
  
  if (Object.keys(updated).length > 0) {
    changes.updated = updated;
  }
  
  return changes;
}
