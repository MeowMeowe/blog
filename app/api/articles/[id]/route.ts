import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, notFoundResponse, unauthorizedResponse, badRequestResponse } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * 更新文章
 * 需要管理员或编辑者权限
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return unauthorizedResponse('Please login first');
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
            return errorResponse('Insufficient permissions', 403, 403);
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
            return badRequestResponse('Invalid article ID');
        }

        const body = await request.json();
        const { title, description, content, coverImage, tagIds, techStackIds, links, status } = body;

        // 检查文章是否存在
        const existingArticle = await prisma.article.findUnique({
            where: { id }
        });

        if (!existingArticle) {
            return notFoundResponse('Article not found');
        }

        // 更新文章
        const article = await prisma.article.update({
            where: { id },
            data: {
                title: title || existingArticle.title,
                description: description !== undefined ? description : existingArticle.description,
                content: content || existingArticle.content,
                coverImage: coverImage !== undefined ? coverImage : existingArticle.coverImage,
                status: status || existingArticle.status,
                publishedAt: status === 'PUBLISHED' && !existingArticle.publishedAt ? new Date() : existingArticle.publishedAt,
                tags: tagIds
                    ? {
                          deleteMany: {},
                          create: tagIds.map((tagId: number) => ({
                              tag: {
                                  connect: { id: tagId }
                              }
                          }))
                      }
                    : undefined,
                techStack: techStackIds
                    ? {
                          deleteMany: {},
                          create: techStackIds.map((techId: number) => ({
                              tech: {
                                  connect: { id: techId }
                              }
                          }))
                      }
                    : undefined,
                links: links
                    ? {
                          deleteMany: {},
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

        return successResponse(article, 'Article updated successfully');
    } catch (error) {
        console.error('Error updating article:', error);
        return errorResponse('Failed to update article');
    }
}

/**
 * 删除文章
 * 需要管理员权限
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return unauthorizedResponse('Please login first');
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user || user.role !== 'ADMIN') {
            return errorResponse('Only administrators can delete articles', 403, 403);
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
            return badRequestResponse('Invalid article ID');
        }

        // 检查文章是否存在
        const existingArticle = await prisma.article.findUnique({
            where: { id }
        });

        if (!existingArticle) {
            return notFoundResponse('Article not found');
        }

        // 删除文章（关联数据会自动级联删除）
        await prisma.article.delete({
            where: { id }
        });

        return successResponse(null, 'Article deleted successfully');
    } catch (error) {
        console.error('Error deleting article:', error);
        return errorResponse('Failed to delete article');
    }
}
