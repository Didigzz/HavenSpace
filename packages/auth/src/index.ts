// @bhms/auth - Authentication and authorization utilities

export * from './config';
export * from './config.edge';
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
export * from './middleware';
