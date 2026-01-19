import { MetadataRoute } from 'next';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { createSlug } from '../utils/slugify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://miratekstil.com'; // Domain adresi

    // Statik sayfalar
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
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
    ];

    // Dinamik Ürün Sayfaları
    let productRoutes: MetadataRoute.Sitemap = [];
    try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        productRoutes = productsSnapshot.docs.map(doc => {
            const product = doc.data();
            const slug = createSlug(product.name, doc.id);
            return {
                url: `${baseUrl}/product/${slug}`,
                lastModified: new Date(), // İdealde product.updatedAt kullanılabilir
                changeFrequency: 'weekly',
                priority: 0.9,
            };
        });
    } catch (error) {
        console.error("Sitemap ürünleri çekerken hata:", error);
    }

    // Dinamik Kategori Sayfaları
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        categoryRoutes = categoriesSnapshot.docs.map(doc => {
            const category = doc.data();
            return {
                url: `${baseUrl}/shop?category=${encodeURIComponent(category.name)}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            };
        });
    } catch (error) {
        console.error("Sitemap kategorileri çekerken hata:", error);
    }

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
