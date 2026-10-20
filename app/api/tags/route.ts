import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { createTagSchema } from '@/lib/validation';
import { handleApiError, readJson } from '@/lib/http';

export async function GET() {
    try {
        return successResponse(await prisma.tag.findMany({ orderBy: { name: 'asc' } }));
    } catch (error) {
        return handleApiError(error);
    }
}
export async function POST(request: Request) {
    try {
        if (!(await getAdminUser(['ADMIN']))) return unauthorizedResponse('需要管理员登录');
        return successResponse(await prisma.tag.create({ data: await readJson(request, createTagSchema) }));
    } catch (error) {
        return handleApiError(error);
    }
}
