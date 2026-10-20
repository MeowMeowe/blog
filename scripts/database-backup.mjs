import { PrismaClient } from '@prisma/client';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const prisma = new PrismaClient();
const models = ['user', 'tag', 'techStack', 'article', 'articleTag', 'articleTechStack', 'articleLink', 'articleRevision'];
try {
    const rows = await prisma.$transaction(
        models.map((model) => prisma[model].findMany()),
        { isolationLevel: 'RepeatableRead' }
    );
    const database = decodeURIComponent(new URL(process.env.DATABASE_URL).pathname.slice(1));
    const backup = { format: 'meow-blog-db-v1', database, createdAt: new Date().toISOString(), tables: Object.fromEntries(models.map((name, index) => [name, rows[index]])) };
    const stamp = backup.createdAt.replace(/[:.]/g, '-');
    const destination = path.resolve('.backups', 'blog-' + stamp + '.json');
    await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
    await writeFile(destination, JSON.stringify(backup, null, 2), { flag: 'wx', mode: 0o600 });
    console.log('Database backup saved:', destination);
    console.log('Includes accounts/password hashes. Keep private; back up MEDIA_ROOT separately.');
} finally {
    await prisma.$disconnect();
}
