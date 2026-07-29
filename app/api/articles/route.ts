import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const status = searchParams.get('status') || 'published';
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');

        // 构建查询条件
        const where: any = {
            status: status.toUpperCase()
        };

        // 搜索标题或描述
        if (search) {
            where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
        }

        // 按标签筛选
        if (tag) {
            where.tags = {
                some: {
                    tag: {
                        slug: tag
                    }
                }
            };
        }

        // 查询总数
        const total = await prisma.article.count({ where });

        // 查询文章列表
        const articles = await prisma.article.findMany({
            where,
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
                }
            },
            orderBy: {
                publishedAt: 'desc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        // 格式化返回数据
        const formattedArticles = articles.map((article) => ({
            id: article.id,
            title: article.title,
            desc: article.description,
            time: article.publishedAt?.toISOString().split('T')[0] || article.createdAt.toISOString().split('T')[0],
            icon: article.tags[0]?.tag.icon || 'default',
            cover: article.coverImage || article.tags[0]?.tag.icon || 'default',
            view: article.viewCount,
            star: article.starCount,
            tags: article.tags.map((t: { tag: { name: any } }) => t.tag.name),
            techStack: article.techStack.map((ts: { tech: { icon: any; link: any } }) => ({
                icon: ts.tech.icon,
                link: ts.tech.link
            }))
        }));

        return successResponse({
            articles: formattedArticles,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return errorResponse('Failed to fetch articles');
    }
}
