import { createTRPCRouter, defaultAuthMiddleware } from './trpc';
import type { AnyRouter } from '@trpc/server';
import {
  createBoarderRouter,
  createPaymentRouter,
  createRoomRouter,
  createUtilityRouter,
  createUserRouter,
  createDashboardRouter,
  createAdminRouter,
  createPropertyRouter,
  createBookingRouter,
} from './routers/index';
import type { MiddlewareFn } from './types/index';

// tRPC procedure type - using any due to complex generic requirements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Procedure = any;

/**
 * Factory function to create the app router with platform-specific procedures
 *
 * @param protectedProcedure - Base protected procedure requiring authentication
 * @param adminProcedure - Admin-only procedure (optional, defaults to protectedProcedure)
 * @param landlordProcedure - Landlord-only procedure (optional, defaults to protectedProcedure)
 * @param boarderProcedure - Boarder-only procedure (optional, defaults to protectedProcedure)
 * @param authMiddleware - Auth middleware for user router (optional, defaults to defaultAuthMiddleware)
 */
export const createAppRouter = (
  protectedProcedure: Procedure,
  adminProcedure?: Procedure,
  landlordProcedure?: Procedure,
  boarderProcedure?: Procedure,
  _authMiddleware?: MiddlewareFn
): AnyRouter => {
  return createTRPCRouter({
    boarder: createBoarderRouter(protectedProcedure),
    payment: createPaymentRouter(protectedProcedure),
    room: createRoomRouter(protectedProcedure),
    utility: createUtilityRouter(protectedProcedure),
    user: createUserRouter(protectedProcedure),
    dashboard: createDashboardRouter(protectedProcedure),
    admin: createAdminRouter(protectedProcedure, adminProcedure || protectedProcedure),
    property: createPropertyRouter(protectedProcedure, landlordProcedure),
    booking: createBookingRouter(protectedProcedure, boarderProcedure, landlordProcedure),
  }) as AnyRouter;
};

// Note: AppRouter type is now exported from types.ts to avoid circular dependencies
