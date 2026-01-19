import type { Metadata } from 'next';
import AdminDashboard from '../../components/admin/AdminDashboard';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Yönetim Paneli | MiraTekstil',
    description: 'MiraTekstil Yönetim Paneli',
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <AdminDashboard />
        </Suspense>
    );
}
