import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
  changePasswordSchema
} from "@havenspace/validation";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import type { TRPCContext, HavenSession } from "../types";

// Type helpers
type UserCreateInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

interface AuthenticatedCtx {
  ctx: TRPCContext & { session: HavenSession };
}

export const createUserRouter = (protectedProcedure: any) => {
  return createTRPCRouter({
    login: publicProcedure
      .input(loginSchema)
      .mutation(async ({ ctx, input }: { ctx: TRPCContext; input: LoginInput }) => {
        const user = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        const isValid = await bcrypt.compare(input.password, user.password);

        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Return user data without password
        const { password, ...userWithoutPassword } = user;

        // Generate a simple token (in production, use JWT)
        const token = Buffer.from(JSON.stringify({
          userId: user.id,
          email: user.email
        })).toString('base64');

        return {
          user: userWithoutPassword,
          token,
        };
      }),

    register: publicProcedure
      .input(registerSchema)
      .mutation(async ({ ctx, input }: { ctx: TRPCContext; input: UserCreateInput }) => {
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User with this email already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(input.password, 12);

        const user = await ctx.db.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            name: input.name,
            role: input.role,
          },
        });

        // Generate token for newly registered user
        const token = Buffer.from(JSON.stringify({
          userId: user.id,
          email: user.email
        })).toString('base64');

        return {
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
          token,
        };
      }),

    getProfile: protectedProcedure.query(async ({ ctx }: AuthenticatedCtx) => {
      return ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
          createdAt: true,
        },
      });
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).optional(),
          image: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }: AuthenticatedCtx) => {
        return ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: input,
        });
      }),

    changePassword: protectedProcedure
      .input(changePasswordSchema)
      .mutation(async ({ ctx, input }: { ctx: TRPCContext & { session: HavenSession }; input: ChangePasswordInput }) => {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        const isValid = await bcrypt.compare(input.currentPassword, user.password);

        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Current password is incorrect",
          });
        }

        const hashedPassword = await bcrypt.hash(input.newPassword, 12);

        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { password: hashedPassword },
        });

        return { success: true };
      }),
  });
};
