import { createTRPCRouter } from "../trpc";
import { createBoarderRouter } from "./boarder.router";
import { createPaymentRouter } from "./payment.router";
import { createRoomRouter } from "./room.router";
import { createUtilityRouter } from "./utility.router";
import { createUserRouter } from "./user.router";
import { createDashboardRouter } from "./dashboard.router";
import { createAdminRouter } from "./admin.router";
import { createPropertyRouter } from "./property.router";
import { createBookingRouter } from "./booking.router";
import { createAuditLogRouter } from "./audit-log.router";
import type { AnyRouter } from "@trpc/server";
import type { MiddlewareFn } from "../types/index";
// tRPC procedure type

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Procedure = any;

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
        auditLog: createAuditLogRouter(protectedProcedure, adminProcedure || protectedProcedure),
    }) as AnyRouter;
};

export { createBoarderRouter } from './boarder.router';
export { createPaymentRouter } from './payment.router';
export { createRoomRouter } from './room.router';
export { createUtilityRouter } from './utility.router';
export { createUserRouter } from './user.router';
export { createDashboardRouter } from './dashboard.router';
export { createAdminRouter } from './admin.router';
export { createPropertyRouter } from './property.router';
export { createBookingRouter } from './booking.router';
export { createAuditLogRouter } from './audit-log.router';