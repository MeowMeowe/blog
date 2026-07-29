import prisma from '@/lib/prisma';
import { successResponse, notFoundResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return errorResponse('Invalid article ID', 400, 400);
        }

        // 查询文章详情
        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true
                    }
                },
                tags: {
                    include: {
                        tag: true
                    }
                },
                techStack: {
                    include: {
                        tech: true
                    }
                },
                links: true
            }
        });

        if (!article) {
            return notFoundResponse('Article not found');
        }

        // 增加浏览次数
        await prisma.article.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });

        // 格式化返回数据
        const formattedArticle = {
            id: article.id,
            title: article.title,
            desc: article.description,
            content: article.content,
            cover: article.coverImage || article.tags[0]?.tag.icon || 'default',
            icon: article.tags[0]?.tag.icon || 'default',
            time: article.publishedAt?.toISOString().split('T')[0] || article.createdAt.toISOString().split('T')[0],
            createTime: article.createdAt.toISOString(),
            updateTime: article.updatedAt.toISOString(),
            author: article.author?.displayName || article.author?.username || 'Anonymous',
            view: article.viewCount + 1, // 返回增加后的浏览次数
            star: article.starCount,
            tags: article.tags.map((t: { tag: { name: any } }) => t.tag.name),
            techStack: article.techStack.map((ts: { tech: { icon: any; name: any; link: any } }) => ({
                icon: ts.tech.icon,
                name: ts.tech.name,
                link: ts.tech.link
            })),
            links: article.links.map((link: { title: any; url: any; icon: any; linkType: any }) => ({
                title: link.title,
                url: link.url,
                icon: link.icon,
                type: link.linkType
            }))
        };

        return successResponse(formattedArticle);
    } catch (error) {
        console.error('Error fetching article detail:', error);
        return errorResponse('Failed to fetch article detail');
    }
}
