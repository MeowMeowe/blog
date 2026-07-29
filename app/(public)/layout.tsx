'use client';

import PublicLayout from '@/layout/public';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <PublicLayout>{children}</PublicLayout>;
}
