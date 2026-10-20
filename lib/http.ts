import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import type { ZodType } from 'zod';

export class RequestError extends Error {
    constructor(
        message: string,
        public status = 400
    ) {
        super(message);
    }
}

export async function readJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new RequestError('请使用 JSON 格式提交');
    const body = await readBody(request, 4_500_000);
    let data: unknown;
    try {
        data = JSON.parse(body.toString('utf8'));
    } catch {
        throw new RequestError('JSON 格式不正确');
    }
    const result = schema.safeParse(data);
    if (!result.success) throw new RequestError(result.error.issues[0]?.message || '请检查表单内容');
    return result.data;
}

export async function readBody(request: Request, maxBytes: number) {
    const reader = request.body?.getReader();
    if (!reader) throw new RequestError('请求内容不能为空');
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) {
            await reader.cancel();
            throw new RequestError('请求内容过大', 413);
        }
        chunks.push(value);
    }
    return Buffer.concat(chunks);
}

export function handleApiError(error: unknown) {
    let status = error instanceof RequestError ? error.status : 500;
    let message = error instanceof RequestError ? error.message : '操作失败，请稍后重试';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            status = 409;
            message = '名称或标识已存在';
        }
        if (error.code === 'P2003' || error.code === 'P2025') {
            status = 400;
            message = '关联内容不存在或已被修改，请刷新后重试';
        }
        if (error.code === 'P2034') {
            status = 409;
            message = '内容刚被其他操作更新，请重新加载';
        }
    }
    if (status === 500) console.error('API operation failed:', error);
    return NextResponse.json({ code: status, data: null, msg: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function articleIdFrom(value: string) {
    if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) throw new RequestError('文章 ID 无效');
    return Number(value);
}
