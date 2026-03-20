import { z } from "zod";
import { publicProcedure } from "../../../orpc";
import {
  registerSchema,
} from "@havenspace/validation";
import { PrismaUserRepository } from "../infrastructure/persistence/prisma-user.repository";
import { UserService } from "../domain/services/user.service";
import { User } from "../domain/entities/user.entity";
import type { PrismaClientType } from "@havenspace/database";

export const createUserRouter = () => {
  return {
    register: publicProcedure
      .input(registerSchema)
      .handler(async (opts) => {
        const inp = opts.input as { email: string; password: string; name: string; role: string };
        const ctx = opts as unknown as { db: PrismaClientType };
        const repository = new PrismaUserRepository(ctx.db);
        const service = new UserService(repository);

        await service.validateEmail(inp.email);
        const hashedPassword = await service.hashPassword(inp.password);

        const user = User.create({
          email: inp.email,
          password: hashedPassword,
          name: inp.name,
          role: inp.role,
        });

        const savedUser = await repository.save(user);

        return { id: savedUser.id, email: savedUser.email, name: savedUser.name };
      }),
  };
};
