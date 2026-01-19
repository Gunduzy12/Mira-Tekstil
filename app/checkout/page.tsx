import type { Metadata } from 'next';
import CheckoutContent from '@/components/CheckoutContent';

export const metadata: Metadata = {
    title: 'Ödeme | MiraTekstil',
    description: 'Güvenli ödeme ile siparişinizi tamamlayın.',
};

export default function CheckoutPage() {
    return <CheckoutContent />;
}
