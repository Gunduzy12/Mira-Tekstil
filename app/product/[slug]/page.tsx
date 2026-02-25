import type { Metadata } from 'next';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types';
import ProductDetailPage from '@/components/ProductDetailPage';
import { extractIdFromSlug } from '@/utils/slugify';
import { getProductUrl } from '@/data/seoCategories';
import JsonLd, { generateProductSchema } from '@/components/JsonLd';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Ürün Bulunamadı | MiraTekstil',
        };
    }

    // CANONICAL: Her zaman yeni SEO URL'ye point et
    const canonicalPath = getProductUrl(product.name, product.id, product.category, product.slug, product.categorySlug, product.parentSlug);

    return {
        title: `${product.name} | MiraTekstil`,
        description: product.description.substring(0, 160),
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            images: [product.imageUrl],
            url: `https://miratekstiltr.com${canonicalPath}`,
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

    const productUrl = getProductUrl(product.name, product.id, product.category, product.slug, product.categorySlug, product.parentSlug);
    const isInStock = product.variants?.some(v => v.stock > 0) ?? false;

    return (
        <>
            <JsonLd
                data={generateProductSchema({
                    name: product.name,
                    description: product.description,
                    imageUrl: product.imageUrl,
                    price: product.priceFrom,
                    originalPrice: product.originalPrice,
                    brand: product.brand,
                    url: productUrl,
                    inStock: isInStock,
                    rating: product.averageRating,
                    reviewCount: product.reviewCount,
                })}
            />
            <ProductDetailPage product={product} />
        </>
    );
}
