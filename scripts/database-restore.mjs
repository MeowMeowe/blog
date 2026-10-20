import { PrismaClient } from '@prisma/client';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2).filter((value) => value !== '--');
const filename = args[0];
const database = decodeURIComponent(new URL(process.env.DATABASE_URL).pathname.slice(1));
const confirmation = args[args.indexOf('--confirm-db') + 1];
if (!filename || filename.startsWith('--') || confirmation !== database || !args.includes('--confirm-db')) {
    throw new Error('Usage: pnpm db:restore -- backup.json --confirm-db EXACT_DATABASE_NAME [--dry-run] [--replace]');
}
const source = path.resolve(filename);
if ((await stat(source)).size > 200 * 1024 * 1024) throw new Error('Backup exceeds 200 MB; use native database tooling.');
const backup = JSON.parse(await readFile(source, 'utf8'));
const models = ['user', 'tag', 'techStack', 'article', 'articleTag', 'articleTechStack', 'articleLink', 'articleRevision'];
if (backup.format !== 'meow-blog-db-v1' || !backup.tables || models.some((model) => !Array.isArray(backup.tables[model]))) {
    throw new Error('Unsupported or incomplete backup format.');
}
const prisma = new PrismaClient();
try {
    console.log('Target database:', database);
    console.log('Backup rows:', Object.fromEntries(models.map((model) => [model, backup.tables[model].length])));
    if (!args.includes('--dry-run')) {
        await prisma.$transaction(
            async (tx) => {
                const count = (await Promise.all(models.map((model) => tx[model].count()))).reduce((sum, value) => sum + value, 0);
                if (count && !args.includes('--replace')) throw new Error('Target is not empty. Back up first; --replace is required.');
                for (const model of [...models].reverse()) await tx[model].deleteMany();
                for (const model of models) {
                    const rows = backup.tables[model];
                    for (let offset = 0; offset < rows.length; offset += 100) await tx[model].createMany({ data: rows.slice(offset, offset + 100) });
                }
                // Old JWTs must not regain access after an older backup is restored.
                await tx.user.updateMany({ data: { sessionVersion: Math.floor(Date.now() / 1000) } });
            },
            { timeout: 120000 }
        );
        console.log('Database restored. Restart the app, log in again, and restore MEDIA_ROOT from its matching backup.');
    } else console.log('Dry run complete; no records changed. This validates the envelope, not every database constraint.');
} finally {
    await prisma.$disconnect();
}
