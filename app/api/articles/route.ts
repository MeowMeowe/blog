import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api-response';
import { articleQuerySchema } from '@/lib/validation';
import { handleApiError, RequestError } from '@/lib/http';
import { listPublicArticles } from '@/lib/public-articles';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
    try {
        const query = articleQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
        if (!query.success) throw new RequestError('分页或搜索参数不正确');
        return successResponse(await listPublicArticles(query.data));
    } catch (error) {
        return handleApiError(error);
    }
}
