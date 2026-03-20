import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@havenspace/database";
import { createRateLimitMiddleware, rateLimits } from "./middleware/rate-limit";
import { verifyCSRFToken } from "./lib/csrf";
import type { TRPCContext, HavenSession } from "./types/index";

// Re-export types for convenience
export type { TRPCContext, HavenSession } from "./types/index";

export const createTRPCContext = async (opts: {
  headers: Headers;
  session?: HavenSession | null;
  csrfSecret?: string;
}): Promise<TRPCContext> => {
  // This will be provided by the platform-specific adapter
  // For Next.js, this will include session from NextAuth
  return {
    db,
    session: opts.session ?? null, // Will be set by auth middleware
    csrfSecret: opts.csrfSecret, // CSRF secret from server-side session
    headers: opts.headers,
  };
};

// Initialize tRPC
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
const sensitiveRateLimitMiddleware = createRateLimitMiddleware(rateLimits.sensitive);

const timingMiddleware = t.middleware(async ({ next }) => {
  if (process.env.NODE_ENV === "development") {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  return next();
});

/**
 * CSRF protection middleware using double-submit cookie pattern
 * Validates CSRF token against server-side session secret
 */
const csrfMiddleware = t.middleware(async ({ next, ctx, type }) => {
  // Skip CSRF check for queries (GET requests)
  if (type === 'query') {
    return next();
  }

  const headers = ctx.headers as Headers;
  const csrfToken = headers.get('x-csrf-token');
  const csrfSecret = ctx.csrfSecret; // Get secret from server-side session

  if (!csrfToken) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Missing CSRF token'
    });
  }

  if (!csrfSecret) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'CSRF secret not found in session. Please refresh the page.'
    });
  }

  const isValid = verifyCSRFToken(csrfSecret, csrfToken);
  if (!isValid) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Invalid CSRF token'
    });
  }

  return next();
});

/**
 * Default authentication middleware
 * Validates that user has a valid session
 */
export const defaultAuthMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required. Please log in to access this resource.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

/**
 * Role-based authorization middleware factory
 */
export const createRoleMiddleware = (requiredRole: HavenSession["user"]["role"]) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    if (ctx.session.user.role !== requiredRole) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This action requires ${requiredRole.toLowerCase()} role`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });
};

/**
 * Status-based authorization middleware factory
 */
export const createStatusMiddleware = (
  requiredStatus: HavenSession["user"]["status"] | HavenSession["user"]["status"][]
) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required",
      });
    }

    const allowedStatuses = Array.isArray(requiredStatus)
      ? requiredStatus
      : [requiredStatus];

    if ((allowedStatuses as string[]).indexOf(ctx.session.user.status) === -1) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This action requires one of these statuses: ${allowedStatuses.join(", ")}`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });
};

/**
 * Admin-only middleware
 */
export const adminMiddleware = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only administrators can access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

/**
 * Landlord middleware (requires LANDLORD role + APPROVED status)
 */
export const landlordMiddleware = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  if (ctx.session.user.role !== "LANDLORD") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only landlords can access this resource",
    });
  }

  if (ctx.session.user.status !== "APPROVED") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your landlord account must be approved to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

/**
 * Boarder middleware (requires BOARDER role + non-SUSPENDED status)
 */
export const boarderMiddleware = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  if (ctx.session.user.role !== "BOARDER") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only boarders can access this resource",
    });
  }

  if (ctx.session.user.status === "SUSPENDED") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your account has been suspended",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

// Public procedure with rate limiting and CSRF protection
export const publicProcedure = t.procedure
  .use(rateLimitMiddleware as never)
  .use(timingMiddleware)
  .use(csrfMiddleware);

// Protected procedure with default auth middleware
export const protectedProcedure = t.procedure
  .use(rateLimitMiddleware as never)
  .use(writeRateLimitMiddleware as never)
  .use(timingMiddleware)
  .use(csrfMiddleware)
  .use(defaultAuthMiddleware);

// Admin procedure with admin middleware
export const adminProcedure = t.procedure
  .use(rateLimitMiddleware as never)
  .use(writeRateLimitMiddleware as never)
  .use(timingMiddleware)
  .use(csrfMiddleware)
  .use(adminMiddleware);

// Landlord procedure with landlord middleware
export const landlordProcedure = t.procedure
  .use(rateLimitMiddleware as never)
  .use(writeRateLimitMiddleware as never)
  .use(timingMiddleware)
  .use(csrfMiddleware)
  .use(landlordMiddleware);

// Boarder procedure with boarder middleware
export const boarderProcedure = t.procedure
  .use(rateLimitMiddleware as never)
  .use(writeRateLimitMiddleware as never)
  .use(timingMiddleware)
  .use(csrfMiddleware)
  .use(boarderMiddleware);

// Auth-specific procedure with strict rate limiting
export const authProcedure = t.procedure
  .use(authRateLimitMiddleware as never)
  .use(timingMiddleware)
  .use(csrfMiddleware)
  .use(defaultAuthMiddleware);

// Sensitive operations (password changes, account deletion) with very strict rate limiting
export const sensitiveProcedure = t.procedure
  .use(sensitiveRateLimitMiddleware as never)
  .use(writeRateLimitMiddleware as never)
  .use(timingMiddleware)
  .use(csrfMiddleware)
  .use(defaultAuthMiddleware);

// Legacy exports for backward compatibility
export const createProtectedProcedure = (authMiddleware?: typeof defaultAuthMiddleware) => {
  return t.procedure
    .use(rateLimitMiddleware as never)
    .use(writeRateLimitMiddleware as never)
    .use(timingMiddleware)
    .use(csrfMiddleware)
    .use(authMiddleware || defaultAuthMiddleware);
};

export const createAuthProcedure = (authMiddleware?: typeof defaultAuthMiddleware) => {
  return t.procedure
    .use(authRateLimitMiddleware as never)
    .use(timingMiddleware)
    .use(csrfMiddleware)
    .use(authMiddleware || defaultAuthMiddleware);
};

export const createSensitiveProcedure = (authMiddleware?: typeof defaultAuthMiddleware) => {
  return t.procedure
    .use(sensitiveRateLimitMiddleware as never)
    .use(writeRateLimitMiddleware as never)
    .use(timingMiddleware)
    .use(csrfMiddleware)
    .use(authMiddleware || defaultAuthMiddleware);
};
