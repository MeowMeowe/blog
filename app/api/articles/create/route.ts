import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, unauthorizedResponse, badRequestResponse } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * 创建新文章
 * 需要管理员或编辑者权限
 */
export async function POST(request: NextRequest) {
    try {
        // 检查用户认证
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return unauthorizedResponse('Please login first');
        }

        // 检查权限（只有 admin 和 editor 可以创建文章）
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
            return errorResponse('Insufficient permissions', 403, 403);
        }

        const body = await request.json();
        const { title, description, content, coverImage, tagIds, techStackIds, links, status } = body;

        // 验证必填字段
        if (!title || !content) {
            return badRequestResponse('Title and content are required');
        }

        // 创建文章
        const article = await prisma.article.create({
            data: {
                title,
                description,
                content,
                coverImage,
                authorId: user.id,
                status: status || 'DRAFT',
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                tags: tagIds
                    ? {
                          create: tagIds.map((tagId: number) => ({
                              tag: {
                                  connect: { id: tagId }
                              }
                          }))
                      }
                    : undefined,
                techStack: techStackIds
                    ? {
                          create: techStackIds.map((techId: number) => ({
                              tech: {
                                  connect: { id: techId }
                              }
                          }))
                      }
                    : undefined,
                links: links
                    ? {
                          create: links.map((link: any) => ({
                              title: link.title,
                              url: link.url,
                              icon: link.icon,
                              linkType: link.type || 'OTHER'
                          }))
                      }
                    : undefined
            },
            include: {
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

        return successResponse(article, 'Article created successfully');
    } catch (error) {
        console.error('Error creating article:', error);
        return errorResponse('Failed to create article');
    }
}
