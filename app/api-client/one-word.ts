import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface OneWordResponse {
    code: number;
    data: {
        text: string;
    };
    msg: string;
}

// 获取一言
export async function getWord(): Promise<OneWordResponse> {
    try {
        // 使用第三方一言 API
        const response = await axios.get('https://v1.hitokoto.cn/?c=d&c=i');
        return {
            code: 200,
            data: {
                text: response.data.hitokoto
            },
            msg: 'success'
        };
    } catch (error) {
        console.error('Error fetching word:', error);
        return {
            code: 500,
            data: {
                text: '今天小脑瓜里没有情话啦，但还是比昨天多爱你一点。'
            },
            msg: 'error'
        };
    }
}
