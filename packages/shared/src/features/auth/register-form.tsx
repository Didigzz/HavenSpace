"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Label } from "../../ui";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
  Building,
} from "lucide-react";
import { getRedirectUrl } from "@havenspace/auth";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["BOARDER", "LANDLORD"], {
      message: "Please select an account type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: undefined,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the register API on the server
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006"}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            password: data.password,
            role: data.role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Auto sign-in after successful registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but sign-in failed
        router.push("/login?registered=true");
        return;
      }

      // Fetch session to get user role and status
      const sessionRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006"}/api/auth/session`
      );
      const session = await sessionRes.json();

      if (session?.user) {
        const redirectUrl = getRedirectUrl(
          session.user.role,
          session.user.status
        );

        // Check if redirect is to an external URL (different port)
        if (redirectUrl.startsWith("http")) {
          window.location.href = redirectUrl;
        } else {
          router.push(redirectUrl);
        }
      } else {
        router.push("/");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="text-destructive bg-destructive/10 flex items-center gap-2 rounded-lg p-3 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Selection */}
      <div className="space-y-3">
        <Label>I want to</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue("role", "BOARDER")}
            className={`rounded-lg border-2 p-4 transition-all ${
              selectedRole === "BOARDER"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <User
              className={`mx-auto mb-2 h-6 w-6 ${
                selectedRole === "BOARDER"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                selectedRole === "BOARDER" ? "text-primary" : "text-foreground"
              }`}
            >
              Find a place
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Browse & book rooms
            </p>
          </button>
          <button
            type="button"
            onClick={() => setValue("role", "LANDLORD")}
            className={`rounded-lg border-2 p-4 transition-all ${
              selectedRole === "LANDLORD"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Building
              className={`mx-auto mb-2 h-6 w-6 ${
                selectedRole === "LANDLORD"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                selectedRole === "LANDLORD" ? "text-primary" : "text-foreground"
              }`}
            >
              List property
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Manage your listings
            </p>
          </button>
        </div>
        {errors.role && (
          <p className="text-destructive text-sm">{errors.role.message}</p>
        )}
        {selectedRole === "LANDLORD" && (
          <p className="rounded bg-amber-50 p-2 text-xs text-amber-600">
            Note: Landlord accounts require admin approval before you can manage
            listings.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={isLoading}
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          autoComplete="tel"
          disabled={isLoading}
          {...register("phone")}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && (
          <p className="text-destructive text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("password")}
            className={errors.password ? "border-destructive pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={isLoading}
            {...register("confirmPassword")}
            className={
              errors.confirmPassword ? "border-destructive pr-10" : "pr-10"
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        By creating an account, you agree to our{" "}
        <a href="#" className="hover:text-foreground underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-foreground underline">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
