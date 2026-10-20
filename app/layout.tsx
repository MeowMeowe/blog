import type { Metadata } from 'next';
import '@/App.scss';
import NextProvider from '@/store/NextProvider';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
    metadataBase: siteUrl(),
    alternates: { types: { 'application/rss+xml': '/feed.xml' } },
    title: {
        default: "MeowGod's Blog",
        template: "%s | MeowGod's Blog"
    },
    description: 'MeowGod 的个人网站，记录技术学习、项目实践与生活。',
    icons: {
        icon: '/cat.ico'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-CN">
            <body>
                <NextProvider>{children}</NextProvider>
            </body>
        </html>
    );
}
