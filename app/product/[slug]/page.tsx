import { notFound, permanentRedirect } from 'next/navigation';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types';
import { extractIdFromSlug } from '@/utils/slugify';
import { getProductUrl } from '@/data/seoCategories';

type Props = {
    params: Promise<{ slug: string }>;
};

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

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const productUrl = getProductUrl(product.name, product.id, product.category, product.slug, product.categorySlug, product.parentSlug);
    permanentRedirect(productUrl);
}
