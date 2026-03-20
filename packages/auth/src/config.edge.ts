import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no DB access)
 * Used by middleware for session validation only
 */
export const authConfigEdge: NextAuthConfig = {
  providers: [], // No providers - just for session validation
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = user as unknown as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.status = user as unknown as any;
      }

      // Allow updating CSRF secret (e.g., on session update)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (trigger === "update" && (session as any)?.csrfSecret) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.csrfSecret = (session as any).csrfSecret;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).status = token.status;
      }
      // Include CSRF secret in session for tRPC context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).csrfSecret = token.csrfSecret;
      return session;
    },
    authorized() {
      return true; // Let middleware handle authorization
    },
  },
  pages: {
    signIn: "/login",
  },
};
