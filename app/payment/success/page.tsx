import type { Metadata } from 'next';
import PaymentSuccessContent from '../../../components/PaymentSuccessContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Ödeme Başarılı | MiraTekstil',
    description: 'Siparişiniz başarıyla alındı.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
