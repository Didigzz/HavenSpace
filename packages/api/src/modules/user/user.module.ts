import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { UserService } from './domain/services/user.service';
import type { PrismaClientType } from '@havenspace/database';

export class UserModule {
  private static instance: UserModule;
  private repository: PrismaUserRepository;
  private service: UserService;

  private constructor(db: PrismaClientType) {
    this.repository = new PrismaUserRepository(db);
    this.service = new UserService(this.repository);
  }

  static initialize(db: PrismaClientType): UserModule {
    if (!UserModule.instance) {
      UserModule.instance = new UserModule(db);
    }
    return UserModule.instance;
  }

  static getInstance(): UserModule {
    if (!UserModule.instance) {
      throw new Error('UserModule not initialized. Call initialize() first.');
    }
    return UserModule.instance;
  }

  getRepository() {
    return this.repository;
  }

  getService() {
    return this.service;
  }

  async dispose(): Promise<void> {
    // Cleanup resources if needed
  }
}