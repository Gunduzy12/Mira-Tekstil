import type { Metadata } from 'next';
import ReturnRequestContent from '../../../../../components/ReturnRequestContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'İade Talebi | MiraTekstil',
    description: 'İade talebi oluşturun.',
};

export default function ReturnRequestPage({ params }: { params: Promise<{ id: string }> }) {
    // Directly access params via React.use() equivalent in async component (Next.js 15)
    // But wait, in Next 15 `params` is a Promise.
    // We can unwrap it.

    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <ReturnRequestPageContent params={params} />
        </Suspense>
    );
}

// Wrapper to handle async params if needed, or just do it inline
async function ReturnRequestPageContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ReturnRequestContent orderId={id} />;
}
