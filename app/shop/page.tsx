import React from 'react';
import type { Metadata } from 'next';
import ProductListPage from '@/components/ProductListPage';

export const metadata: Metadata = {
    title: 'Mağaza - Tüm Ürünler | MiraTekstil',
    description: 'MiraTekstil mağazasındaki tüm ürünleri inceleyin. Filtreleme seçenekleri ile aradığınız ürünü kolayca bulun.',
};

export default function ShopPage() {
    return (
        <ProductListPage />
    );
}
