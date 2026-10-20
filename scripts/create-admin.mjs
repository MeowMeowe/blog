import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const username = process.env.ADMIN_USERNAME?.trim() || 'admin';
const displayName = process.env.ADMIN_DISPLAY_NAME?.trim() || 'Administrator';

if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
}

if (email.length > 100 || !email.includes('@')) {
    throw new Error('ADMIN_EMAIL is invalid');
}

if (password.length < 16 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('ADMIN_PASSWORD must contain at least 16 characters and at most 72 UTF-8 bytes');
}

const prisma = new PrismaClient();

try {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash,
            displayName,
            role: 'ADMIN',
            sessionVersion: { increment: 1 }
        },
        create: {
            username,
            email,
            passwordHash,
            displayName,
            role: 'ADMIN'
        }
    });
    console.log(`Administrator ${email} is ready.`);
} finally {
    await prisma.$disconnect();
}
