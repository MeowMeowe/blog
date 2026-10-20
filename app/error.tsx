'use client';
import Link from 'next/link';

export default function ErrorPage({ retry }: { retry: () => void }) {
    return (
        <main className="route-feedback" role="alert">
            <h1>页面暂时没能加载出来</h1>
            <p>可能是网络或数据服务暂时不可用。请稍后重试；后台已保存的本地草稿不会被清除。</p>
            <button type="button" onClick={() => retry()}>
                重新加载
            </button>
            <Link href="/">返回首页</Link>
        </main>
    );
}
