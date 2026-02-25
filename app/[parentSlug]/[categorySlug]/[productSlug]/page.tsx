import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types';
import { findSEOCategory, findSEOParent, getProductUrl } from '@/data/seoCategories';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedProducts from '@/components/RelatedProducts';
import JsonLd, { generateProductSchema } from '@/components/JsonLd';
import ProductDetailPage from '@/components/ProductDetailPage';

export const revalidate = 3600;

type Props = {
    params: Promise<{ parentSlug: string; categorySlug: string; productSlug: string }>;
};

/**
 * Ürünü slug ile getir. Eğer slug bulamazsa ID ile dene (fallback).
 */
async function getProductBySlug(productSlug: string): Promise<Product | null> {
    try {
        // 1) slug alanıyla ara
        const q = query(
            collection(db, 'products'),
            where('slug', '==', productSlug)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }

        // 2) Fallback: eski URL'ler slug-ID formatında olabilir → ID ile dene
        const possibleId = productSlug.split('-').pop();
        if (possibleId) {
            const docRef = doc(db, 'products', possibleId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Product;
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        return snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => p.id !== product.id)
            .slice(0, 4);
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { parentSlug, categorySlug, productSlug } = await params;
    const product = await getProductBySlug(productSlug);

    if (!product) {
        return { title: 'Ürün Bulunamadı | MiraTekstil' };
    }

    const canonicalSlug = product.slug || productSlug;
    const canonicalCatSlug = product.categorySlug || categorySlug;
    const canonicalParentSlug = product.parentSlug || parentSlug;
    const canonicalUrl = `/${canonicalParentSlug}/${canonicalCatSlug}/${canonicalSlug}`;

    const displayTitle = product.seoTitle || product.name;

    return {
        title: `${displayTitle} | MiraTekstil`,
        description: product.description?.substring(0, 160) || '',
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: displayTitle,
            description: product.description?.substring(0, 160) || '',
            images: [product.imageUrl],
            url: `https://miratekstiltr.com${canonicalUrl}`,
            siteName: 'MiraTekstil',
            locale: 'tr_TR',
            type: 'website',
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { parentSlug, categorySlug, productSlug } = await params;
    const product = await getProductBySlug(productSlug);

    if (!product) {
        notFound();
    }

    const related = await getRelatedProducts(product);
    const parent = findSEOParent(parentSlug);
    const category = findSEOCategory(parentSlug, categorySlug);

    const productUrl = getProductUrl(
        product.name,
        product.id,
        product.category,
        product.slug,
        product.categorySlug,
        product.parentSlug
    );

    const isInStock = product.variants?.some(v => v.stock > 0) ?? false;

    return (
        <div className="bg-brand-bg">
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
                    category: product.subcategory || product.category,
                })}
            />

            <div className="container mx-auto px-6 pt-6">
                <Breadcrumbs
                    items={[
                        ...(parent ? [{ name: parent.name, href: `/${parent.slug}` }] : []),
                        ...(category ? [{ name: category.h1, href: `/${parentSlug}/${categorySlug}` }] : []),
                        { name: product.name, href: productUrl },
                    ]}
                />
            </div>

            <ProductDetailPage product={product} />

            {related.length > 0 && (
                <RelatedProducts products={related} />
            )}
        </div>
    );
}
