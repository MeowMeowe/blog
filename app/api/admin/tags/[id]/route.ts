import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { updateTagSchema } from '@/lib/validation';
import { articleIdFrom, handleApiError, readJson, RequestError } from '@/lib/http';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await getAdminUser(['ADMIN']))) return unauthorizedResponse('需要管理员登录');
        const id = articleIdFrom((await params).id);
        return successResponse(await prisma.tag.update({ where: { id }, data: await readJson(request, updateTagSchema) }));
    } catch (error) {
        return handleApiError(error);
    }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await getAdminUser(['ADMIN']))) return unauthorizedResponse('需要管理员登录');
        const id = articleIdFrom((await params).id);
        const result = await prisma.tag.deleteMany({ where: { id, articles: { none: {} } } });
        if (!result.count) throw new RequestError('分类仍被文章使用，或已经删除；请先移除文章关联', 409);
        return successResponse(null, '已删除');
    } catch (error) {
        return handleApiError(error);
    }
}
