import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
    code: number;
    data: T | null;
    msg: string;
}

/**
 * 成功响应
 */
export function successResponse<T>(data: T, msg = 'success'): NextResponse<ApiResponse<T>> {
    return NextResponse.json({
        code: 200,
        data,
        msg
    });
}

/**
 * 错误响应
 */
export function errorResponse(msg: string, code = 500, status = 500): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            code,
            data: null,
            msg
        },
        { status }
    );
}

/**
 * 未找到响应
 */
export function notFoundResponse(msg = 'Not found'): NextResponse<ApiResponse> {
    return errorResponse(msg, 404, 404);
}

/**
 * 未授权响应
 */
export function unauthorizedResponse(msg = 'Unauthorized'): NextResponse<ApiResponse> {
    return errorResponse(msg, 401, 401);
}

/**
 * 禁止访问响应
 */
export function forbiddenResponse(msg = 'Forbidden'): NextResponse<ApiResponse> {
    return errorResponse(msg, 403, 403);
}

/**
 * 参数错误响应
 */
export function badRequestResponse(msg = 'Bad request'): NextResponse<ApiResponse> {
    return errorResponse(msg, 400, 400);
}
