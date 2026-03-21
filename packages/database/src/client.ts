import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type {
  Prisma,
  Boarder,
  Room,
  Payment,
  UtilityReading,
  User,
  LandlordProfile,
  Property,
  Booking,
  SavedListing,
  Account,
  Session,
  Setting,
  UserRole,
  UserStatus,
  RoomStatus,
  PaymentStatus,
  PaymentType,
  UtilityType,
  BookingStatus,
} from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // For serverless environments using driver adapters
  if (process.env.DATABASE_URL) {
    try {
      // Try using pg adapter for PostgreSQL
      const { Pool } = require("pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    } catch {
      // Fallback to direct connection for non-serverless
      return new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Re-export Prisma types
export type {
  Prisma,
  PrismaClient as PrismaClientType,
  Boarder,
  Room,
  Payment,
  UtilityReading,
  User,
  LandlordProfile,
  Property,
  Booking,
  SavedListing,
  Account,
  Session,
  Setting,
  UserRole,
  UserStatus,
  RoomStatus,
  PaymentStatus,
  PaymentType,
  UtilityType,
  BookingStatus,
};
