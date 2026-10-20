import { PrismaClient } from '@prisma/client';
import { articles } from '../database/content.mjs';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const articleId = Number(args.find((arg) => !arg.startsWith('--')));
const article = articles.find((item) => item.id === articleId);

if (!Number.isInteger(articleId) || !article) {
    throw new Error('Pass a valid article id, for example: pnpm content:sync-one -- 1');
}

const prisma = new PrismaClient();

try {
    if (args.includes('--content-only')) {
        const expectedVersionArg = args.find((arg) => arg.startsWith('--expected-version='));
        const expectedVersion = expectedVersionArg ? Number(expectedVersionArg.split('=')[1]) : NaN;
        if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
            throw new Error('Content-only updates require --expected-version=N. Back up first.');
        }
        await prisma.$transaction(async (tx) => {
            const current = await tx.article.findUnique({
                where: { id: articleId },
                include: { tags: true, techStack: true, links: true }
            });
            if (!current || current.deletedAt || current.version !== expectedVersion) {
                throw new Error('Article missing, deleted, or changed since review; refusing to overwrite.');
            }
            if (current.title === article.title && current.description === article.description && current.content === article.content) {
                console.log(`Article ${articleId} already matches; no revision needed.`);
                return;
            }
            const coverImage = current.coverImage && /^[a-z0-9_-]+$/i.test(current.coverImage) ? `/icon/${current.coverImage}.webp` : current.coverImage;
            await tx.articleRevision.create({
                data: {
                    articleId,
                    editorId: null,
                    title: current.title,
                    snapshot: {
                        title: current.title,
                        description: current.description,
                        content: current.content,
                        coverImage,
                        status: current.status,
                        publishedAt: current.publishedAt?.toISOString() || null,
                        tagIds: current.tags.map((item) => item.tagId),
                        techStackIds: current.techStack.map((item) => item.techId),
                        links: current.links.map((item) => ({
                            title: item.title,
                            url: item.url,
                            icon: item.icon,
                            type: item.linkType
                        }))
                    }
                }
            });
            const result = await tx.article.updateMany({
                where: { id: articleId, version: expectedVersion, deletedAt: null },
                data: {
                    title: article.title,
                    description: article.description,
                    content: article.content,
                    version: { increment: 1 }
                }
            });
            if (result.count !== 1) throw new Error('Concurrent edit detected; content update rolled back.');
        });
    } else {
        if (!args.includes('--overwrite')) throw new Error('Use --content-only --expected-version=N, or explicit --overwrite for full seed replacement.');
        const storedTags = new Map((await prisma.tag.findMany()).map((tag) => [tag.name, tag.id]));
        const storedTech = new Map((await prisma.techStack.findMany()).map((tech) => [tech.name, tech.id]));
        const tagIds = article.tags.map((name) => storedTags.get(name));
        const techIds = article.tech.map((name) => storedTech.get(name));

        if (tagIds.some((id) => id === undefined) || techIds.some((id) => id === undefined)) {
            throw new Error(`Missing relation data for article ${article.id}`);
        }

        await prisma.$transaction(async (tx) => {
            await tx.articleTag.deleteMany({ where: { articleId } });
            await tx.articleTechStack.deleteMany({ where: { articleId } });
            await tx.article.update({
                where: { id: articleId },
                data: {
                    title: article.title,
                    version: { increment: 1 },
                    description: article.description,
                    content: article.content,
                    coverImage: article.icon,
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
        });
    }

    console.log(`Updated article ${article.id}: ${article.title}`);
} finally {
    await prisma.$disconnect();
}
