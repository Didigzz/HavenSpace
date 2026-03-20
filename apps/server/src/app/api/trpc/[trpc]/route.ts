import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "@havenspace/api";
import { appRouter } from "@/lib/trpc";
import { auth } from "@havenspace/auth/config";
import type { HavenSession } from "@havenspace/api";

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:3004",
  "http://localhost:3005",
];

/**
 * Validate CORS origin
 */
function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  return allowedOrigins.includes(origin);
}

/**
 * Handle preflight OPTIONS requests
 */
const handleOptions = (origin: string | undefined) => {
  if (!isAllowedOrigin(origin)) {
    return new Response("Origin not allowed", { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: new Headers({
      "Access-Control-Allow-Origin": origin || "",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
      "Access-Control-Max-Age": "86400",
    }),
  });
};

/**
 * Handle tRPC requests with proper CORS and CSRF protection
 */
const handler = async (req: Request) => {
  const origin = req.headers.get("origin") ?? undefined;

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return handleOptions(origin);
  }

  // Get session and CSRF secret from cookies
  const sessionResult = await auth();
  const session = sessionResult as HavenSession | null;

  // CSRF secret should be stored in the session/cookie
  // For NextAuth, this would be in the session data or a separate cookie
  const csrfSecret = session?.csrfSecret ?? undefined;

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        session,
        csrfSecret,
      }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          },
  });
};

export { handler as GET, handler as POST, handler as OPTIONS };
