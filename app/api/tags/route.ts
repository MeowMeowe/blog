import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, badRequestResponse, unauthorizedResponse } from '@/lib/api-response';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * 获取所有标签
 */
export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return successResponse(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        return errorResponse('Failed to fetch tags');
    }
}

/**
 * 创建新标签
 * 需要管理员权限
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return unauthorizedResponse('Please login first');
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email! }
        });

        if (!user || user.role !== 'ADMIN') {
            return errorResponse('Only administrators can create tags', 403, 403);
        }

        const body = await request.json();
        const { name, slug, color, icon, description } = body;

        if (!name || !slug) {
            return badRequestResponse('Name and slug are required');
        }

        // 检查标签是否已存在
        const existingTag = await prisma.tag.findFirst({
            where: {
                OR: [{ name }, { slug }]
            }
        });

        if (existingTag) {
            return badRequestResponse('Tag with this name or slug already exists');
        }

        const tag = await prisma.tag.create({
            data: {
                name,
                slug,
                color,
                icon,
                description
            }
        });

        return successResponse(tag, 'Tag created successfully');
    } catch (error) {
        console.error('Error creating tag:', error);
        return errorResponse('Failed to create tag');
    }
}
