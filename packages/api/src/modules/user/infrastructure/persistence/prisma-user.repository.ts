import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { User } from "../../domain/entities/user.entity";
import type { PrismaClientType } from "@havenspace/database";
import type { UserRole as PrismaUserRole } from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClientType) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.db.user.findUnique({
      where: { id },
    });

    return data ? User.fromPrisma(data) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.db.user.findUnique({
      where: { email },
    });

    return data ? User.fromPrisma(data) : null;
  }

  async save(user: User): Promise<User> {
    const prismaData = user.toPrisma();
    const data = await this.db.user.create({
      data: {
        ...prismaData,
        role: prismaData.role as PrismaUserRole,
      },
    });

    return User.fromPrisma(data);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const prismaData = data.toPrisma ? data.toPrisma() : data;
    const updated = await this.db.user.update({
      where: { id },
      data: {
        ...prismaData,
        role: prismaData.role ? (prismaData.role as PrismaUserRole) : undefined,
      } as {
        email?: string;
        name?: string;
        password?: string;
        role?: PrismaUserRole;
        image?: string | null;
      },
    });

    return User.fromPrisma(updated);
  }

  async delete(id: string): Promise<void> {
    await this.db.user.delete({
      where: { id },
    });
  }
}