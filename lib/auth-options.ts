import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide email and password');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isValid = await verifyPassword(credentials.password, user.passwordHash);
                if (!isValid) {
                    throw new Error('Invalid password');
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() }
                });

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.displayName || user.username,
                    role: user.role
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/admin/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
};
