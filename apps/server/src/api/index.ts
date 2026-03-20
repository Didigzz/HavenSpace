/**
 * Serverless function entry point for tRPC API
 * This file exports a handler that can be deployed to serverless platforms
 * such as Vercel, AWS Lambda, Cloudflare Workers, etc.
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@havenspace/api";
import { appRouter } from "../lib/trpc";

/**
 * Main handler for tRPC requests in serverless environment
 * @param req - Request object
 * @returns Response object
 */
const createHandler = () => {
  return async (req: Request): Promise<Response> => {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () =>
        createTRPCContext({
          headers: req.headers,
        }),
      onError:
        process.env.NODE_ENV === "development"
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
              );
            }
          : undefined,
    });
  };
};

export const handler = createHandler();

/**
 * Export for Vercel serverless functions
 */
export default handler;

/**
 * Export for AWS Lambda with @vercel/lambda adapter
 */
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
