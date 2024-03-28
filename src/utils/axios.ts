import qs from 'qs';
import axios from 'axios';
import { IResponse } from './globle-interface';

interface options {
    methodType: 'get' | 'post';
    timeout?: number;
    url: string;
    param?: any;
    headers?: any;
}

export const Ajax = (opt: options) => {
    return new Promise(async (resolve: (value: any) => void) => {
        let param = opt.param;
        const defaultOption = {
            methodType: 'get',
            upload: false,
            timeout: 6000,
            headers: {},
            url: ''
        };
        opt = Object.assign({}, defaultOption, opt);

        if (opt.headers) {
            if (opt.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
                param = qs.stringify(opt.param);
            }
        }

        try {
            const res = await axios({
                method: opt.methodType,
                timeout: opt.timeout ? opt.timeout : 10000,
                url: '/api' + opt.url,
                data: param,
                headers: opt.headers
            });

            resolve({ ...res.data, ...res.headers } || res);
        } catch (err) {
            resolve(err);
        }
    });
};

export const get = <T>(url: string, params: any, opts?: any): Promise<IResponse<T>> => {
    return Ajax({
        url: url,
        methodType: 'get',
        param: { ...params },
        ...opts
    });
};

export const post = <T>(url: string, params: any, opts?: any): Promise<IResponse<T>> => {
    return Ajax({
        url: url,
        methodType: 'post',
        param: { ...params },
        ...opts
    });
};
