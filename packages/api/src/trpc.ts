import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@bhms/database";
import { createRateLimitMiddleware, rateLimits } from "./middleware/rate-limit";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  // This will be provided by the platform-specific adapter
  // For Next.js, this will include session from NextAuth
  // For mobile, this might include different auth context
  return {
    db,
    session: null, // Will be set by auth middleware
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

// Rate limiting middleware
const rateLimitMiddleware = createRateLimitMiddleware(rateLimits.standard);
const authRateLimitMiddleware = createRateLimitMiddleware(rateLimits.auth);
const writeRateLimitMiddleware = createRateLimitMiddleware(rateLimits.write);

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (process.env.NODE_ENV === "development") {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

// Public procedure with rate limiting
export const publicProcedure = t.procedure.use(rateLimitMiddleware).use(timingMiddleware);

// Protected procedure with rate limiting (platforms should add auth middleware)
export const createProtectedProcedure = (authMiddleware: any) => {
  return t.procedure
    .use(rateLimitMiddleware)
    .use(writeRateLimitMiddleware)
    .use(timingMiddleware)
    .use(authMiddleware);
};

// Auth-specific procedure with strict rate limiting
export const createAuthProcedure = (authMiddleware: any) => {
  return t.procedure
    .use(authRateLimitMiddleware)
    .use(timingMiddleware)
    .use(authMiddleware);
};
