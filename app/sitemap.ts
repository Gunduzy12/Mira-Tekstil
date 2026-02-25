import { MetadataRoute } from 'next';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { seoCategories, seoParentCategories, getProductUrl } from '../data/seoCategories';
import { blogTopics } from '../data/seoBlogTopics';
import { Product } from '../types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.miratekstiltr.com';

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const parentCategoryRoutes: MetadataRoute.Sitemap = seoParentCategories.map(parent => ({
    url: `${baseUrl}/${parent.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = seoCategories.map(cat => ({
    url: `${baseUrl}/${cat.parentSlug}/${cat.categorySlug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogTopics.map(topic => ({
    url: `${baseUrl}/blog/${topic.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const snap = await getDocs(collection(db, 'products'));
    productRoutes = snap.docs.map(d => {
      const p = d.data() as Product;

      // ✅ sitemap için: slug + categorySlug + parentSlug kullan
      const path = getProductUrl(
        p.name,
        d.id,
        p.category,
        p.slug,
        p.categorySlug,
        p.parentSlug
      );

      return {
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });
  } catch (e) {
    console.error('Sitemap ürünleri çekerken hata:', e);
  }

  return [...staticRoutes, ...parentCategoryRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
