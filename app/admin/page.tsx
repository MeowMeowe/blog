import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import AdminShell from './_components/admin-shell';
import Dashboard from './_components/dashboard';
import './admin.scss';

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    return (
        <AdminShell
            user={{
                name: session?.user?.name || '管理员',
                email: session?.user?.email || '',
                role: session?.user?.role || 'EDITOR'
            }}
        >
            <Dashboard />
        </AdminShell>
    );
}
