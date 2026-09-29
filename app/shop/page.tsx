import React from 'react';
import type { Metadata } from 'next';
import ProductListPage from '@/components/ProductListPage';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Product, Category } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Perde ve Ev Tekstili Ürünleri | MiraTekstil',
    description: 'Blackout, tül, saten, özel ölçü perde ve ev tekstili ürünlerini güncel fiyatlarla inceleyin. Renk, ölçü ve fiyat seçeneklerini karşılaştırın.',
    alternates: {
        canonical: '/shop',
    },
    openGraph: {
        title: 'Perde ve Ev Tekstili Ürünleri | MiraTekstil',
        description: 'Blackout, tül, saten, özel ölçü perde ve ev tekstili ürünlerini güncel fiyatlarla inceleyin.',
        url: 'https://www.miratekstiltr.com/shop',
    },
    robots: {
        index: true,
        follow: true,
    },
};

async function getProducts(): Promise<Product[]> {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

async function getCategories(): Promise<Category[]> {
    try {
        const snapshot = await getDocs(collection(db, 'categories'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export default async function ShopPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    return (
        <ProductListPage initialProducts={products} initialCategories={categories} />
    );
}
