import { z } from "zod";
import { publicProcedure } from "../../../orpc";
import {
  registerSchema,
  changePasswordSchema
} from "@havenspace/validation";
import { PrismaUserRepository } from "../infrastructure/persistence/prisma-user.repository";
import { UserService } from "../domain/services/user.service";
import { User } from "../domain/entities/user.entity";

type ProtectedProcedure = any;

export const createUserRouter = (protectedProcedure: ProtectedProcedure) => {
  return {
    register: publicProcedure
      .input(registerSchema)
      .handler(async ({ context, input }: { context: any; input: any }) => {
        const repository = new PrismaUserRepository(context.db);
        const service = new UserService(repository);

        await service.validateEmail(input.email);
        const hashedPassword = await service.hashPassword(input.password);

        const user = User.create({
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
        });

        const savedUser = await repository.save(user);

        return { id: savedUser.id, email: savedUser.email, name: savedUser.name };
      }),

    getProfile: protectedProcedure.handler(async ({ context }: { context: any }) => {
      return context.db.user.findUnique({
        where: { id: context.session.user.id },
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
      .handler(async ({ context, input }: { context: any; input: any }) => {
        return context.db.user.update({
          where: { id: context.session.user.id },
          data: input,
        });
      }),

    changePassword: protectedProcedure
      .input(changePasswordSchema)
      .handler(async ({ context, input }: { context: any; input: any }) => {
        const repository = new PrismaUserRepository(context.db);
        const service = new UserService(repository);

        await service.updatePassword(
          context.session.user.id,
          input.currentPassword,
          input.newPassword
        );

        return { success: true };
      }),
  };
};
