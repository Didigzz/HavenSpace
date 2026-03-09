import { os, ORPCError } from "@orpc/server";
import { ZodError } from "zod";
import { db } from "@bhms/database";

export const createORPCContext = async (opts: { headers: Headers }) => {
  // This will be provided by the platform-specific adapter
  // For Next.js, this will include session from NextAuth
  // For mobile, this might include different auth context
  return {
    db,
    session: null, // Will be set by auth middleware
    ...opts,
  };
};

export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>;

const o = os.$context<ORPCContext>();

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (process.env.NODE_ENV === "development") {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[oRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const publicProcedure = o.use(timingMiddleware);

// Base protected procedure - platforms can extend this with their auth
export const createProtectedProcedure = (authMiddleware: any) => {
  return o.use(timingMiddleware).use(authMiddleware) as ReturnType<typeof o.use>;
};