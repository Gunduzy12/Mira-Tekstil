import { MetadataRoute } from 'next';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { seoCategories, seoParentCategories, getProductUrl } from '../data/seoCategories';
import { blogTopics } from '../data/seoBlogTopics';
import { Product } from '../types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://miratekstiltr.com';

    // Statik sayfalar
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // Üst Kategori Sayfaları
    const parentCategoryRoutes: MetadataRoute.Sitemap = seoParentCategories.map(parent => ({
        url: `${baseUrl}/${parent.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Alt Kategori Sayfaları
    const categoryRoutes: MetadataRoute.Sitemap = seoCategories.map(cat => ({
        url: `${baseUrl}/${cat.parentSlug}/${cat.categorySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    // Blog Sayfaları
    const blogRoutes: MetadataRoute.Sitemap = blogTopics.map(topic => ({
        url: `${baseUrl}/blog/${topic.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // Ürün Sayfaları (Firebase'den)
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        productRoutes = productsSnapshot.docs.map(doc => {
            const product = doc.data() as Product;
            const productUrl = getProductUrl(
                product.name,
                doc.id,
                product.category,
                (product as Product).slug,
                (product as Product).categorySlug,
                (product as Product).parentSlug
            );
            return {
                url: `${baseUrl}${productUrl}`,
                lastModified: new Date(),
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
