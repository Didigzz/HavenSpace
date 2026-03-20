/**
 * Environment variable validation for BHMS applications
 *
 * Validates required environment variables at startup to catch
 * misconfigurations early in the development/deployment process.
 */

import { z } from "zod";

// Type-safe environment variable access
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
};

const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),

  // Database
  DATABASE_URL: z
    .string()
    .startsWith(
      "postgresql://",
      "DATABASE_URL must be a valid PostgreSQL connection string"
    ),

  // Authentication
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters for security"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),

  // API
  API_URL: z.string().url("API_URL must be a valid URL"),
});

const optionalEnvSchema = z.object({
  // App URLs (have defaults in development)
  NEXT_PUBLIC_URL: z.string().url().optional(),
  ADMIN_URL: z.string().url().optional(),
  AUTH_URL: z.string().url().optional(),
  BOARDER_URL: z.string().url().optional(),
  LANDLORD_URL: z.string().url().optional(),

  // Redis (optional caching)
  REDIS_URL: z.string().url().optional(),

  // Cloud storage (optional)
  GCP_PROJECT_ID: z.string().optional(),
  GCP_BUCKET_NAME: z.string().optional(),
  GCP_SERVICE_ACCOUNT_KEY: z.string().optional(),
});

const envSchema = baseEnvSchema.and(optionalEnvSchema);

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * @throws {Error} If validation fails
 */
export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse({
    NODE_ENV: getEnvVar("NODE_ENV"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    NEXTAUTH_SECRET: getEnvVar("NEXTAUTH_SECRET"),
    NEXTAUTH_URL: getEnvVar("NEXTAUTH_URL"),
    API_URL: getEnvVar("API_URL"),
    NEXT_PUBLIC_URL: getEnvVar("NEXT_PUBLIC_URL"),
    ADMIN_URL: getEnvVar("ADMIN_URL"),
    AUTH_URL: getEnvVar("AUTH_URL"),
    BOARDER_URL: getEnvVar("BOARDER_URL"),
    LANDLORD_URL: getEnvVar("LANDLORD_URL"),
    REDIS_URL: getEnvVar("REDIS_URL"),
    GCP_PROJECT_ID: getEnvVar("GCP_PROJECT_ID"),
    GCP_BUCKET_NAME: getEnvVar("GCP_BUCKET_NAME"),
    GCP_SERVICE_ACCOUNT_KEY: getEnvVar("GCP_SERVICE_ACCOUNT_KEY"),
  });

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error("");

    const errors = result.error.format();
    const errorsObj = errors as unknown as Record<
      string,
      { _errors?: string[] }
    >;

    Object.keys(errorsObj).forEach((key) => {
      if (key !== "_errors") {
        const errorEntry = errorsObj[key];
        if (errorEntry?._errors) {
          errorEntry._errors.forEach((msg) => {
            console.error(`  • ${key}: ${msg}`);
          });
        }
      }
    });

    console.error("");
    console.error(
      "Please check your .env file and ensure all required variables are set."
    );
    console.error("See .env.example for reference.");

    if (typeof process !== "undefined" && process.exit) {
      process.exit(1);
    }

    throw new Error("Environment validation failed");
  }

  return result.data;
}

/**
 * Get validated environment config (safe to use after validateEnv() has been called)
 */
export function getEnv(): EnvConfig {
  const result = envSchema.safeParse({
    NODE_ENV: getEnvVar("NODE_ENV"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    NEXTAUTH_SECRET: getEnvVar("NEXTAUTH_SECRET"),
    NEXTAUTH_URL: getEnvVar("NEXTAUTH_URL"),
    API_URL: getEnvVar("API_URL"),
    NEXT_PUBLIC_URL: getEnvVar("NEXT_PUBLIC_URL"),
    ADMIN_URL: getEnvVar("ADMIN_URL"),
    AUTH_URL: getEnvVar("AUTH_URL"),
    BOARDER_URL: getEnvVar("BOARDER_URL"),
    LANDLORD_URL: getEnvVar("LANDLORD_URL"),
    REDIS_URL: getEnvVar("REDIS_URL"),
    GCP_PROJECT_ID: getEnvVar("GCP_PROJECT_ID"),
    GCP_BUCKET_NAME: getEnvVar("GCP_BUCKET_NAME"),
    GCP_SERVICE_ACCOUNT_KEY: getEnvVar("GCP_SERVICE_ACCOUNT_KEY"),
  });

  if (!result.success) {
    // Return defaults for development
    return {
      NODE_ENV: "development",
      DATABASE_URL:
        "postgresql://postgres:password@localhost:5432/boarding_house_db?schema=public",
      NEXTAUTH_SECRET: "dev-secret-key-change-in-production-min-32-chars",
      NEXTAUTH_URL: "http://localhost:3000",
      API_URL: "http://localhost:3001",
    };
  }

  return result.data;
}
