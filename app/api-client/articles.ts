const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T = any> {
    code: number;
    data: T;
    msg: string;
}

async function getJson<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
}

// 获取文章列表
export async function getArticles(params?: { page?: number; pageSize?: number; tag?: string; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params?.tag) searchParams.set('tag', params.tag);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.size ? `?${searchParams.toString()}` : '';
    return getJson<ApiResponse>(`/api/articles${query}`);
}

// 根据 ID 获取文章详情
export async function getArticleById(id: number) {
    const response = await getJson<ApiResponse>(`/api/article/detail/${id}`);
    return response.data;
}

// 获取标签列表
export async function getTags() {
    return getJson<ApiResponse>('/api/tags');
}
