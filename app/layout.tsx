import React from 'react';
import '@/App.scss';
import NextProvider from '@/store/NextProvider';

export const metadata = {
    title: 'MeowGod`s Blog',
    description: 'MeowGod的个人网站'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <NextProvider>{children}</NextProvider>
            </body>
        </html>
    );
}
