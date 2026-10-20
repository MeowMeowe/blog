import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin-auth';
import { unauthorizedResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/http';

export async function GET() {
    try {
        if (!(await getAdminUser(['ADMIN']))) return unauthorizedResponse('需要管理员登录');
        const [articles, tags, techStack, revisions] = await prisma.$transaction([
            prisma.article.findMany({ include: { tags: true, techStack: true, links: true } }),
            prisma.tag.findMany(),
            prisma.techStack.findMany(),
            prisma.articleRevision.findMany()
        ]);
        return new Response(JSON.stringify({ format: 'meow-blog-content-v1', exportedAt: new Date().toISOString(), articles, tags, techStack, revisions }, null, 2), {
            headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Disposition': 'attachment; filename="blog-content.json"' }
        });
    } catch (error) {
        return handleApiError(error);
    }
}
