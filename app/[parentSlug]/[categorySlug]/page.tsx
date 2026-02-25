import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from '@/types';
import { findSEOCategory, findSEOParent, seoCategories, getProductUrl, filterProductsBySubcategory } from '@/data/seoCategories';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategorySEOContent from '@/components/CategorySEOContent';
import JsonLd, {
    generateCollectionPageSchema,
    generateFAQSchema,
} from '@/components/JsonLd';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600;

type Props = {
    params: Promise<{ parentSlug: string; categorySlug: string }>;
};

async function getCategoryProducts(categorySlug: string): Promise<Product[]> {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        return filterProductsBySubcategory(allProducts, categorySlug) as Product[];
    } catch (error) {
        console.error('Error fetching category products:', error);
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { parentSlug, categorySlug } = await params;
    const category = findSEOCategory(parentSlug, categorySlug);

    if (!category) {
        return { title: 'Kategori Bulunamadı | MiraTekstil' };
    }

    return {
        title: category.title,
        description: category.metaDescription,
        alternates: {
            canonical: `/${category.parentSlug}/${category.categorySlug}`,
        },
        openGraph: {
            title: category.title,
            description: category.metaDescription,
            url: `https://miratekstiltr.com/${category.parentSlug}/${category.categorySlug}`,
            siteName: 'MiraTekstil',
            locale: 'tr_TR',
            type: 'website',
        },
    };
}

export function generateStaticParams() {
    return seoCategories.map(c => ({
        parentSlug: c.parentSlug,
        categorySlug: c.categorySlug,
    }));
}

export default async function CategoryPage({ params }: Props) {
    const { parentSlug, categorySlug } = await params;
    const category = findSEOCategory(parentSlug, categorySlug);
    const parent = findSEOParent(parentSlug);

    if (!category || !parent) {
        notFound();
    }

    const products = await getCategoryProducts(categorySlug);

    return (
        <div className="bg-brand-bg min-h-screen">
            <JsonLd
                data={generateCollectionPageSchema(
                    category.h1,
                    category.metaDescription,
                    `/${category.parentSlug}/${category.categorySlug}`,
                    products.length
                )}
            />

            {category.faq.length > 0 && (
                <JsonLd data={generateFAQSchema(category.faq)} />
            )}

            <div className="container mx-auto px-6 py-8">
                <Breadcrumbs
                    items={[
                        { name: parent.name, href: `/${parent.slug}` },
                        { name: category.h1, href: `/${category.parentSlug}/${category.categorySlug}` },
                    ]}
                />

                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-2">
                        {category.h1}
                    </h1>
                    <p className="text-gray-500">
                        {products.length} ürün listeleniyor
                    </p>
                </header>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                        {products.map((product, index) => (
                            <Link
                                key={product.id}
                                href={getProductUrl(product.name, product.id, product.category, product.slug, product.categorySlug, product.parentSlug)}
                                className="group block bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        priority={index < 4}
                                    />
                                    {product.originalPrice && product.originalPrice > product.priceFrom && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            %{Math.round(((product.originalPrice - product.priceFrom) / product.originalPrice) * 100)}
                                        </div>
                                    )}
                                </div>
                                <div className="p-2.5 md:p-3">
                                    <div className="text-[10px] md:text-xs text-gray-400 mb-0.5">{product.brand}</div>
                                    <h2 className="font-serif text-xs md:text-sm font-medium text-brand-primary mb-1.5 line-clamp-2 group-hover:text-brand-secondary transition-colors">
                                        {product.name}
                                    </h2>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="font-semibold text-sm md:text-base text-brand-primary">
                                            {product.priceFrom.toFixed(2)} TL
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.priceFrom && (
                                            <span className="text-[10px] md:text-xs text-gray-400 line-through">
                                                {product.originalPrice.toFixed(2)} TL
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500 font-serif">Bu kategoride henüz ürün bulunmuyor.</p>
                    </div>
                )}

                <CategorySEOContent seoBlocks={category.seoBlocks} faq={category.faq} />
            </div>
        </div>
    );
}
