'use client';

import AdminLayout from '@/layout/admin';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
