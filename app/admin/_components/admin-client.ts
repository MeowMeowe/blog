export class AdminRequestError extends Error {
    constructor(
        message: string,
        public status: number
    ) {
        super(message);
    }
}

function adminLoginUrl() {
    const base = `/${window.location.pathname.split('/').filter(Boolean)[0] || 'backstage'}`;
    return `${base}/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
}

export async function adminRequest<T>(url: string, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
        response = await fetch(url, { ...init, credentials: 'same-origin', cache: 'no-store' });
    } catch (reason) {
        if (reason instanceof DOMException && reason.name === 'AbortError') throw reason;
        throw new AdminRequestError('网络连接失败，请检查网络后重试；本地草稿不会丢失。', 0);
    }
    if (response.status === 401) {
        window.location.assign(adminLoginUrl());
        throw new AdminRequestError('登录已过期，正在前往登录页。', 401);
    }
    const body = await response.json().catch(() => null);
    if (!response.ok) {
        const fallbacks: Record<number, string> = {
            400: '填写内容不符合要求，请检查后重试。',
            403: '当前账号没有此操作的权限。',
            404: '内容不存在或已经被删除。',
            409: '文章已在其他窗口更新，请保留本地草稿并重新加载。',
            413: '上传文件过大，图片请控制在 5 MB 以内。',
            429: '操作过于频繁，请稍后再试。'
        };
        const message = typeof body?.msg === 'string' && /[\u3400-\u9fff]/.test(body.msg) ? body.msg : fallbacks[response.status] || '服务器暂时无法完成操作，请稍后重试。';
        throw new AdminRequestError(message, response.status);
    }
    if (!body) throw new AdminRequestError('服务器返回了异常内容，请稍后重试。', response.status);
    return body.data ?? body;
}

export function errorMessage(reason: unknown) {
    return reason instanceof Error ? reason.message : '操作失败，请稍后重试。';
}
