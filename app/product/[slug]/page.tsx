import type { Metadata } from 'next';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types';
import ProductDetailPage from '@/components/ProductDetailPage';

import { extractIdFromSlug } from '@/utils/slugify';

type Props = {
    params: { slug: string };
};

// Data Fetching Function
async function getProduct(slug: string): Promise<Product | null> {
    const id = extractIdFromSlug(slug);
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
    }
    return null;
}

// Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Ürün Bulunamadı | MiraTekstil',
        };
    }

    return {
        title: `${product.name} | MiraTekstil`,
        description: product.description.substring(0, 160),
        openGraph: {
            images: [product.imageUrl],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-serif text-brand-primary mb-4">Ürün Bulunamadı</h1>
                <p className="text-gray-500">Aradığınız ürün mevcut değil veya kaldırılmış.</p>
            </div>
        );
    }

    return <ProductDetailPage product={product} />;
}
