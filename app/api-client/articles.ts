import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T = any> {
    code: number;
    data: T;
    msg: string;
}

// 获取文章列表
export async function getArticles(params?: { page?: number; pageSize?: number; status?: string; tag?: string; search?: string }) {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/articles`, { params });
    return response.data;
}

// 根据 ID 获取文章详情
export async function getArticleById(id: number) {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/article/detail/${id}`);
    return response.data.data;
}

// 获取标签列表
export async function getTags() {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/tags`);
    return response.data;
}
