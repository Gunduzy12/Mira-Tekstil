import type { Metadata } from 'next';
import WishlistContent from '@/components/WishlistContent';

export const metadata: Metadata = {
    title: 'İstek Listem | MiraTekstil',
    description: 'Favori ürünlerinizi inceleyin ve yönetin.',
};

export default function WishlistPage() {
    return <WishlistContent />;
}
