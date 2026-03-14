import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@havenspace/database";
import { auth } from "@havenspace/auth/config";
import { createAppRouter } from "@havenspace/api";

/**
 * Create tRPC context with authentication
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  
  return {
    db,
    session,
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

export const createTRPCRouter = t.router;

/**
 * Timing middleware for development
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (process.env.NODE_ENV === "development") {
    const waitMs = Math.floor(Math.random() * 100) + 50;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public procedure - accessible without authentication
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Auth middleware - ensures user is authenticated
 */
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
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
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(authMiddleware);

/**
 * Admin-only procedure
 */
export const adminProcedure = t.procedure
  .use(timingMiddleware)
  .use(
    t.middleware(async ({ ctx, next }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
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
    })
  );

/**
 * Landlord procedure (requires approved status)
 */
export const landlordProcedure = t.procedure
  .use(timingMiddleware)
  .use(
    t.middleware(async ({ ctx, next }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
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
          message: "Your landlord account is pending approval",
        });
      }

      return next({
        ctx: {
          ...ctx,
          session: ctx.session,
        },
      });
    })
  );

/**
 * Boarder procedure (requires non-suspended status)
 */
export const boarderProcedure = t.procedure
  .use(timingMiddleware)
  .use(
    t.middleware(async ({ ctx, next }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
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
    })
  );

/**
 * Create the app router with role-specific procedures
 */
export const appRouter = createAppRouter(
  protectedProcedure,
  adminProcedure,
  landlordProcedure,
  boarderProcedure
);

export type AppRouter = typeof appRouter;
