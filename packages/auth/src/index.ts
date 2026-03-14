// @havenspace/auth - Authentication and authorization utilities

// Client-safe exports
export {
    isLandlord,
    isBoarder,
    isAdmin,
    hasRole,
    isPending,
    isApproved,
    isSuspended,
    canAccessLandlordDashboard,
    canAccessBoarderDashboard,
    canAccessAdminDashboard,
    getRedirectUrl,
} from './guards';
export type { UserRole, UserStatus } from './types';

// Edge-compatible (for middleware)
export * from './config.edge';
export * from './middleware';

// Server-only exports (do NOT import in client components)
// import from './config' directly when on the server
