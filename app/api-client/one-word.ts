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
        const response = await fetch('https://v1.hitokoto.cn/?c=d&c=i', {
            signal: AbortSignal.timeout(5000),
            cache: 'no-store'
        });
        if (!response.ok) throw new Error(`Hitokoto returned ${response.status}`);
        const data = (await response.json()) as { hitokoto?: string };

        return {
            code: 200,
            data: {
                text: data.hitokoto || '今天也要开心呀。'
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
