import bcrypt from "bcryptjs";
import { IUserRepository } from "../repositories/user.repository.interface";

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateEmail(email: string): Promise<void> {
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await this.verifyPassword(currentPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await this.hashPassword(newPassword);
    user.updatePassword(hashedPassword);
    await this.repository.update(userId, user);
  }
}