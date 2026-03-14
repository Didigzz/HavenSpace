import { LoginForm } from "@/components/auth/login-form";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div className="flex items-center gap-2 text-primary-foreground">
          <Building2 className="h-8 w-8" />
          <span className="text-2xl font-bold">Haven Space</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground">
            Welcome back
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Sign in to manage your boarding house, view bookings, and connect
            with tenants all in one place.
          </p>
        </div>
        <p className="text-primary-foreground/60 text-sm">
          © 2024 Haven Space. All rights reserved.
        </p>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Haven Space</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
