// Role-based guards for authorization
import { APP_URLS, getFullDashboardUrl } from '@havenspace/config';

export type UserRole = 'LANDLORD' | 'BOARDER' | 'ADMIN';
export type UserStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED';

export function isLandlord(role?: string): boolean {
    return role === 'LANDLORD';
}

export function isBoarder(role?: string): boolean {
    return role === 'BOARDER';
}

export function isAdmin(role?: string): boolean {
    return role === 'ADMIN';
}

export function hasRole(userRole: string | undefined, allowedRoles: UserRole[]): boolean {
    if (!userRole) return false;
    return allowedRoles.includes(userRole as UserRole);
}

export function isPending(status?: string): boolean {
    return status === 'PENDING';
}

export function isApproved(status?: string): boolean {
    return status === 'APPROVED';
}

export function isSuspended(status?: string): boolean {
    return status === 'SUSPENDED';
}

export function canAccessLandlordDashboard(role?: string, status?: string): boolean {
    return isLandlord(role) && isApproved(status);
}

export function canAccessBoarderDashboard(role?: string, status?: string): boolean {
    return isBoarder(role) && isApproved(status);
}

export function canAccessAdminDashboard(role?: string): boolean {
    return isAdmin(role);
}

/**
 * Get the redirect URL based on user role and status
 * Uses centralized URL configuration from @havenspace/config
 */
export function getRedirectUrl(role?: string, status?: string): string {
    if (!role) return '/login';

    if (isAdmin(role)) {
        return getFullDashboardUrl('ADMIN');
    }

    if (isLandlord(role)) {
        if (isPending(status)) {
            return '/pending-approval';
        }
        if (isSuspended(status)) {
            return '/account-suspended';
        }
        return getFullDashboardUrl('LANDLORD');
    }

    if (isBoarder(role)) {
        if (isSuspended(status)) {
            return '/account-suspended';
        }
        return getFullDashboardUrl('BOARDER');
    }

    return APP_URLS.public;
}
