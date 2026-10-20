import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { clearRateLimit, consumeRateLimit, getClientIp } from '@/lib/rate-limit';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const DUMMY_PASSWORD_HASH = '$2b$10$fU5QkZyjH50rdJcw7Olc6eqUcPwAIs0PrTfDf92UvUbRqU65bjzIa';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, request) {
                const email = credentials?.email?.trim().toLowerCase();
                const password = credentials?.password;
                if (!email || !password || email.length > 100 || password.length > 200) {
                    return null;
                }

                const clientIp = getClientIp(request.headers || {});
                const clientKey = `login:ip:${clientIp}`;
                const accountKey = `login:account:${email}`;
                const clientAccountKey = `login:account-client:${clientIp}:${email}`;
                const clientLimit = consumeRateLimit(clientKey, 20, LOGIN_WINDOW_MS);
                const accountLimit = consumeRateLimit(accountKey, 10, LOGIN_WINDOW_MS);
                const clientAccountLimit = consumeRateLimit(clientAccountKey, 6, LOGIN_WINDOW_MS);

                if (!clientLimit.allowed || !accountLimit.allowed || !clientAccountLimit.allowed) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                const isValid = await verifyPassword(password, user?.passwordHash || DUMMY_PASSWORD_HASH);
                if (!user || !isValid) {
                    return null;
                }

                clearRateLimit(clientKey);
                clearRateLimit(accountKey);
                clearRateLimit(clientAccountKey);

                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() }
                });

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.displayName || user.username,
                    role: user.role,
                    sessionVersion: user.sessionVersion
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.sessionVersion = user.sessionVersion;
            }
            const current = token.id ? await prisma.user.findUnique({ where: { id: Number(token.id) }, select: { role: true, displayName: true, username: true, sessionVersion: true } }) : null;
            if (!current || current.sessionVersion !== token.sessionVersion || !['ADMIN', 'EDITOR'].includes(current.role)) throw new Error('Session revoked');
            token.role = current.role;
            token.name = current.displayName || current.username;
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.sessionVersion = token.sessionVersion as number;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 12 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};
