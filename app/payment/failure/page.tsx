import type { Metadata } from 'next';
import PaymentFailureContent from '../../../components/PaymentFailureContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Ödeme Başarısız | MiraTekstil',
    description: 'Ödeme işlemi sırasında bir hata oluştu.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function PaymentFailurePage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <PaymentFailureContent />
        </Suspense>
    );
}
