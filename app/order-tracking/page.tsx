import type { Metadata } from 'next';
import OrderTrackingContent from '../../components/OrderTrackingContent';

export const metadata: Metadata = {
    title: 'Sipariş Takibi | MiraTekstil',
    description: 'Siparişinizin durumunu sorgulayın.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function OrderTrackingPage() {
    return <OrderTrackingContent />;
}
