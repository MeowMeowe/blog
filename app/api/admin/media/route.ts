import { getAdminUser } from '@/lib/admin-auth';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import { handleApiError, readBody, RequestError } from '@/lib/http';
import { listMedia, storeImage, maxImageBytes } from '@/lib/media';
import { consumeRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export async function GET() {
    try {
        if (!(await getAdminUser())) return unauthorizedResponse('请重新登录');
        return successResponse({ files: await listMedia() });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAdminUser();
        if (!user) return unauthorizedResponse('请重新登录');
        if (!consumeRateLimit(`upload:${user.id}`, 20, 60_000).allowed) throw new RequestError('上传太频繁，请稍后再试', 429);
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.startsWith('multipart/form-data;')) throw new RequestError('请使用图片上传表单');
        const bytes = await readBody(request, maxImageBytes + 64 * 1024);
        let form: FormData;
        try {
            form = await new Response(new Uint8Array(bytes), { headers: { 'Content-Type': contentType } }).formData();
        } catch {
            throw new RequestError('上传表单格式不正确');
        }
        const file = form.get('file');
        if (!(file instanceof File)) throw new RequestError('请选择图片文件');
        return successResponse(await storeImage(file), '图片已上传');
    } catch (error) {
        return handleApiError(error);
    }
}
