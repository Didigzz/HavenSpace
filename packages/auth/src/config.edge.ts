import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-compatible auth config (no DB access)
 * Used by middleware for session validation only
 */
export const authConfigEdge: NextAuthConfig = {
    providers: [], // No providers - just for session validation
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user as unknown as string;
                token.status = user as unknown as string;
            }

            // Allow updating CSRF secret (e.g., on session update)
            if (trigger === 'update' && session?.csrfSecret) {
                token.csrfSecret = session.csrfSecret;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).status = token.status;
            }
            // Include CSRF secret in session for tRPC context
            (session as any).csrfSecret = token.csrfSecret;
            return session;
        },
        authorized() {
            return true; // Let middleware handle authorization
        },
    },
    pages: {
        signIn: '/login',
    },
};
