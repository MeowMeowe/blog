import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { passwordSchema } from '@/lib/validation';
import { handleApiError, readJson, RequestError } from '@/lib/http';
import { consumeRateLimit } from '@/lib/rate-limit';

export async function PUT(request: Request) {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        if (!consumeRateLimit(`password:${user.id}`, 5, 15 * 60_000).allowed) throw new RequestError('尝试次数过多，请稍后再试', 429);
        const data = await readJson(request, passwordSchema);
        if (!(await verifyPassword(data.currentPassword, user.passwordHash))) throw new RequestError('当前密码不正确');
        const result = await prisma.user.updateMany({
            where: { id: user.id, sessionVersion: user.sessionVersion },
            data: { passwordHash: await hashPassword(data.newPassword), sessionVersion: { increment: 1 } }
        });
        if (!result.count) return unauthorizedResponse('账号已更新，请重新登录');
        return successResponse(null, '密码已修改，所有旧登录已失效，请重新登录');
    } catch (error) {
        return handleApiError(error);
    }
}
