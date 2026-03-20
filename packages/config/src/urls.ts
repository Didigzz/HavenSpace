/**
 * Centralized URL configuration for all BHMS applications
 *
 * Environment variables should be set in .env files:
 * - NEXT_PUBLIC_URL: Public marketplace URL
 * - API_URL: API server URL
 * - ADMIN_URL: Admin dashboard URL
 * - AUTH_URL: Authentication app URL
 * - BOARDER_URL: Boarder dashboard URL
 * - LANDLORD_URL: Landlord portal URL
 */

// Type-safe environment variable access
const getEnvVar = (key: string, fallback: string): string => {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
};

export const APP_URLS = {
  /** Public marketplace - property discovery */
  public: getEnvVar("NEXT_PUBLIC_URL", "http://localhost:3000"),

  /** API server - tRPC backend */
  api: getEnvVar("API_URL", "http://localhost:3001"),

  /** Admin dashboard - platform management */
  admin: getEnvVar("ADMIN_URL", "http://localhost:3002"),

  /** Authentication app - login/register */
  auth: getEnvVar("AUTH_URL", "http://localhost:3003"),

  /** Boarder dashboard - renter interface */
  boarder: getEnvVar("BOARDER_URL", "http://localhost:3004"),

  /** Landlord portal - property management */
  landlord: getEnvVar("LANDLORD_URL", "http://localhost:3005"),
} as const;

/**
 * Get the dashboard URL based on user role
 */
export function getDashboardUrl(role: string): string {
  switch (role) {
    case "ADMIN":
      return APP_URLS.admin;
    case "LANDLORD":
      return APP_URLS.landlord;
    case "BOARDER":
      return APP_URLS.boarder;
    default:
      return APP_URLS.public;
  }
}

/**
 * Get the full dashboard URL with path
 */
export function getFullDashboardUrl(role: string, path = "/dashboard"): string {
  const baseUrl = getDashboardUrl(role);
  return `${baseUrl}${path}`;
}

/**
 * Check if a URL is an external app URL (different port/domain)
 */
export function isExternalUrl(
  url: string,
  currentApp: keyof typeof APP_URLS
): boolean {
  const currentUrl = APP_URLS[currentApp];
  return !url.startsWith(currentUrl);
}

/**
 * Available app keys for type safety
 */
export type AppKey = keyof typeof APP_URLS;

/**
 * Get all app URLs (useful for health checks, deployment verification)
 */
export function getAllAppUrls(): Record<AppKey, string> {
  return { ...APP_URLS };
}
