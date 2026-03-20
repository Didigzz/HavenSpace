import { z } from "zod";

export const UserRoleEnum = z.enum(["LANDLORD", "BOARDER", "ADMIN"]);
export const UserStatusEnum = z.enum(["PENDING", "APPROVED", "SUSPENDED"]);

/**
 * Password strength validation
 * Requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordStrengthSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordStrengthSchema,
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: passwordStrengthSchema,
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  role: z.enum(["LANDLORD", "BOARDER"]).default("BOARDER"), // Only boarder and landlord can register
});

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().url().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(12, "Current password is required"),
    newPassword: passwordStrengthSchema,
    confirmPassword: z.string().min(12, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserRole = z.infer<typeof UserRoleEnum>;
export type UserStatus = z.infer<typeof UserStatusEnum>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
