import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth-options';
import { RequestError } from '@/lib/http';

type AllowedRole = 'ADMIN' | 'EDITOR';

export async function getAdminUser(allowedRoles: AllowedRole[] = ['ADMIN', 'EDITOR']) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !Number.isSafeInteger(Number(session.user.id))) return null;

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) }
    });

    if (!user || user.sessionVersion !== session.user.sessionVersion) return null;
    if (!allowedRoles.includes(user.role as AllowedRole)) throw new RequestError('当前账号没有此操作的权限', 403);
    return user;
}
