import type { Metadata } from 'next';
import WishlistContent from '@/components/WishlistContent';

export const metadata: Metadata = {
    title: 'İstek Listem | MiraTekstil',
    description: 'Favori ürünlerinizi inceleyin ve yönetin.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function WishlistPage() {
    return <WishlistContent />;
}
