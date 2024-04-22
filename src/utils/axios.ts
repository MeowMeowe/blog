import qs from 'qs';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IResponse } from './globle-interface';
import './interceptors';

interface Options extends AxiosRequestConfig {
    methodType: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options'; // 添加其他 RESTful 请求方法
}

export const ajax = async <T>(options: Options): Promise<IResponse<T>> => {
    const defaultOptions: Options = {
        methodType: 'get',
        timeout: 6000,
        headers: {},
        url: ''
    };
    const mergedOptions = { ...defaultOptions, ...options };

    if (mergedOptions.headers && mergedOptions.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        mergedOptions.data = qs.stringify(mergedOptions.data);
    }

    try {
        const response: AxiosResponse = await axios({
            method: mergedOptions.methodType,
            timeout: mergedOptions.timeout,
            url: '/api' + mergedOptions.url,
            data: mergedOptions.data,
            headers: mergedOptions.headers
        });

        return response.data as IResponse<T>;
    } catch (error) {
        return { error } as IResponse<T>;
    }
};

export const get = <T>(url: string, params?: any, opts?: Options): Promise<IResponse<T>> => {
    return ajax<T>({
        methodType: 'get',
        url,
        params,
        ...opts
    });
};

export const post = <T>(url: string, data?: any, opts?: Options): Promise<IResponse<T>> => {
    return ajax<T>({
        methodType: 'post',
        url,
        data,
        ...opts
    });
};

export const put = <T>(url: string, data?: any, opts?: Options): Promise<IResponse<T>> => {
    return ajax<T>({
        methodType: 'put',
        url,
        data,
        ...opts
    });
};

export const del = <T>(url: string, opts?: Options): Promise<IResponse<T>> => {
    return ajax<T>({
        methodType: 'delete',
        url,
        ...opts
    });
};

export const patch = <T>(url: string, data?: any, opts?: Options): Promise<IResponse<T>> => {
    return ajax<T>({
        methodType: 'patch',
        url,
        data,
        ...opts
    });
};

export const head = <T>(url: string, opts?: Options): Promise<IResponse<T>> => {
    return ajax<T>({
        methodType: 'head',
        url,
        ...opts
    });
};

export const options = <T>(url: string, opts?: Options): Promise<IResponse<T>> => {
    return ajax<T>({
        methodType: 'options',
        url,
        ...opts
    });
};
