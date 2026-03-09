import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
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
} from "@prisma/client";
