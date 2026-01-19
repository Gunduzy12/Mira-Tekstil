import type { Metadata } from 'next';
import ReturnStatusContent from '../../../../components/ReturnStatusContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'İade Durumu | MiraTekstil',
    description: 'İade talebi durumunuz.',
};

export default function ReturnStatusPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <ReturnStatusPageContent params={params} />
        </Suspense>
    );
}

async function ReturnStatusPageContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ReturnStatusContent requestId={id} />;
}
