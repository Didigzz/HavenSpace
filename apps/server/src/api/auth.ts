/**
 * Serverless function entry point for NextAuth authentication
 * This file exports a handler that can be deployed to serverless platforms
 */

import { handlers } from "@havenspace/auth/config";

/**
 * Export handlers for serverless platforms
 * @param req - Request object
 * @returns Response object
 */
export const GET = handlers.GET;

export const POST = handlers.POST;

/**
 * Default export for platforms that require it
 */
export default GET;