import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@bhms/database';
import { authConfigEdge } from './config.edge';
import type { DefaultSession } from 'next-auth';

/**
 * Full auth config with providers (requires Node.js runtime)
 * Used for actual authentication
 */
export const authConfig: NextAuthConfig = {
    ...authConfigEdge,
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    image: user.image,
                };
            },
        }),
    ],
};

/**
 * NextAuth instance with handlers and utilities
 */
const authResult = NextAuth(authConfig);

export const { handlers, signIn, signOut } = authResult;

// Explicit type annotation to avoid type inference issues with Next.js
export const auth: () => Promise<DefaultSession | null> = authResult.auth;
