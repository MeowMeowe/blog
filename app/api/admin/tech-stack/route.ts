import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { techStackSchema } from '@/lib/validation';
import { handleApiError, readJson } from '@/lib/http';

export async function GET() {
    try {
        if (!(await getAdminUser())) return unauthorizedResponse('请重新登录');
        return successResponse(await prisma.techStack.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { articles: true } } } }));
    } catch (error) {
        return handleApiError(error);
    }
}
export async function POST(request: Request) {
    try {
        if (!(await getAdminUser(['ADMIN']))) return unauthorizedResponse('需要管理员登录');
        return successResponse(await prisma.techStack.create({ data: await readJson(request, techStackSchema) }));
    } catch (error) {
        return handleApiError(error);
    }
}
