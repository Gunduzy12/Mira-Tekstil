import type { Metadata } from 'next';
import OrderTrackingContent from '../../components/OrderTrackingContent';

export const metadata: Metadata = {
    title: 'Sipariş Takibi | MiraTekstil',
    description: 'Siparişinizin durumunu sorgulayın.',
};

export default function OrderTrackingPage() {
    return <OrderTrackingContent />;
}
