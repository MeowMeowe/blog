import { PrismaClient } from '@prisma/client';
import { articles, tags, techStack } from '../database/content.mjs';

const prisma = new PrismaClient();

try {
    if ((await prisma.article.count()) > 0 && !process.argv.includes('--replace')) {
        throw new Error('Database contains articles. Refusing to overwrite admin edits. Back up first; explicit --replace is required.');
    }
    await prisma.$transaction(
        async (tx) => {
            const author = await tx.user.upsert({
                where: { username: 'content-owner' },
                update: {
                    displayName: 'Content Owner',
                    role: 'VIEWER'
                },
                create: {
                    username: 'content-owner',
                    email: 'content-owner@localhost.invalid',
                    passwordHash: '$2b$12$3zMvMknpMR2YvnG1H9Tpy.ImcqawKAmssEOOnAJsFIAXA6d293eKC',
                    displayName: 'Content Owner',
                    role: 'VIEWER'
                }
            });

            for (const tag of tags) {
                await tx.tag.upsert({
                    where: { name: tag.name },
                    update: tag,
                    create: tag
                });
            }

            for (const tech of techStack) {
                await tx.techStack.upsert({
                    where: { name: tech.name },
                    update: tech,
                    create: tech
                });
            }

            const storedTags = new Map((await tx.tag.findMany()).map((tag) => [tag.name, tag.id]));
            const storedTech = new Map((await tx.techStack.findMany()).map((tech) => [tech.name, tech.id]));

            await tx.article.deleteMany();

            for (const article of articles) {
                const tagIds = article.tags.map((name) => storedTags.get(name));
                const techIds = article.tech.map((name) => storedTech.get(name));

                if (tagIds.some((id) => id === undefined) || techIds.some((id) => id === undefined)) {
                    throw new Error(`Missing relation data for article ${article.id}`);
                }

                await tx.article.create({
                    data: {
                        id: article.id,
                        title: article.title,
                        description: article.description,
                        content: article.content,
                        coverImage: article.icon,
                        authorId: author.id,
                        status: 'PUBLISHED',
                        createdAt: new Date(`${article.createdAt.replace(' ', 'T')}+08:00`),
                        updatedAt: new Date(`${article.updatedAt.replace(' ', 'T')}+08:00`),
                        publishedAt: new Date(`${article.publishedAt.replace(' ', 'T')}+08:00`),
                        tags: {
                            create: tagIds.map((tagId) => ({ tagId }))
                        },
                        techStack: {
                            create: techIds.map((techId) => ({ techId }))
                        }
                    }
                });
            }
        },
        { timeout: 60_000 }
    );

    console.log(`Replaced public article content with ${articles.length} curated articles.`);
} finally {
    await prisma.$disconnect();
}
