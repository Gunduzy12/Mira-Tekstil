import { MetadataRoute } from 'next';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { seoCategories, seoParentCategories, getProductUrl } from '../data/seoCategories';
import { blogTopics } from '../data/seoBlogTopics';
import { Product } from '../types';

export const revalidate = 3600;

function isIndexableProduct(product: Product): boolean {
    const searchableName = `${product.name || ''} ${product.slug || ''}`;

    return Boolean(
        product.name?.trim() &&
        product.imageUrl?.trim() &&
        !/\btest\b/i.test(searchableName)
    );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.miratekstiltr.com';

    // Statik sayfalar
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/iade-ve-geri-odeme`,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: baseUrl,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // Üst Kategori Sayfaları
    const parentCategoryRoutes: MetadataRoute.Sitemap = seoParentCategories.map(parent => ({
        url: `${baseUrl}/${parent.slug}`,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Alt Kategori Sayfaları
    const categoryRoutes: MetadataRoute.Sitemap = seoCategories.map(cat => ({
        url: `${baseUrl}/${cat.parentSlug}/${cat.categorySlug}`,
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // Blog Sayfaları
    const blogRoutes: MetadataRoute.Sitemap = blogTopics.map(topic => ({
        url: `${baseUrl}/blog/${topic.slug}`,
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // Ürün Sayfaları (Firebase'den)
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        productRoutes = productsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Product))
            .filter(isIndexableProduct)
            .map(product => {
                const productUrl = getProductUrl(
                    product.name,
                    product.id,
                    product.category,
                    product.slug,
                    product.categorySlug,
                    product.parentSlug
                );
                return {
                    url: `${baseUrl}${productUrl}`,
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                };
            });
    } catch (error) {
        console.error("Sitemap ürünleri çekerken hata:", error);
    }

    return [
        ...staticRoutes,
        ...parentCategoryRoutes,
        ...categoryRoutes,
        ...productRoutes,
        ...blogRoutes,
    ];
}
