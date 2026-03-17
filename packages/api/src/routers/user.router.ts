import { z } from "zod";
import { createTRPCRouter, publicProcedure, createSensitiveProcedure } from "../trpc";
import {
  loginSchema,
  registerSchema,
  changePasswordSchema
} from "@havenspace/validation";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { generateToken } from "../lib/jwt";
import { createAuthError } from "../lib/errors";

// Type helpers
type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;
type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const createUserRouter = (protectedProcedure: any, authMiddleware: any) => {
  // Sensitive procedure for password changes with strict rate limiting
  const sensitiveProcedure = createSensitiveProcedure(authMiddleware);
  
  return createTRPCRouter({
    login: publicProcedure
      .input(loginSchema)
      .mutation(async ({ ctx, input }: { ctx: any; input: LoginInput }) => {
        const user = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (!user) {
          throw createAuthError();
        }

        const isValid = await bcrypt.compare(input.password, user.password);

        if (!isValid) {
          throw createAuthError();
        }

        // Return user data without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        // Generate secure JWT token
        const token = generateToken({
          userId: user.id,
          email: user.email,
          role: user.role
        });

        return {
          user: userWithoutPassword,
          token,
        };
      }),

    register: publicProcedure
      .input(registerSchema)
      .mutation(async ({ ctx, input }: { ctx: any; input: RegisterInput }) => {
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

        // Generate secure JWT token for newly registered user
        const token = generateToken({
          userId: user.id,
          email: user.email,
          role: user.role
        });

        return {
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
          token,
        };
      }),

    getProfile: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
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
      .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
        return ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: input,
        });
      }),

    changePassword: sensitiveProcedure
      .input(changePasswordSchema)
      .mutation(async ({ ctx, input }: { ctx: any; input: ChangePasswordInput }) => {
        const user = await ctx.db.user.findUnique({
          where: { id: ctx.session.user.id },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        const isValid = await bcrypt.compare(input.currentPassword, user.password);

        if (!isValid) {
          throw createAuthError();
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
