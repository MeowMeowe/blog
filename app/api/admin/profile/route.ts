import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { profileSchema } from '@/lib/validation';
import { handleApiError, readJson } from '@/lib/http';

export async function GET() {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        return successResponse({ email: user.email, username: user.username, displayName: user.displayName || '', avatarUrl: user.avatarUrl || '', role: user.role, lastLoginAt: user.lastLoginAt });
    } catch (error) {
        return handleApiError(error);
    }
}
export async function PUT(request: Request) {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        const data = await readJson(request, profileSchema);
        const updated = await prisma.user.update({ where: { id: user.id }, data, select: { email: true, username: true, displayName: true, avatarUrl: true, role: true } });
        return successResponse(updated, '资料已保存');
    } catch (error) {
        return handleApiError(error);
    }
}
