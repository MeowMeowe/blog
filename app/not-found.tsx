import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="not-found">
            <h1>页面走丢了</h1>
            <p>你访问的页面不存在或已经被移动。</p>
            <Link href="/">返回首页</Link>
        </main>
    );
}
