/**
 * In-memory redirect mapping for old URLs → new SEO URLs.
 * NO Firestore lookups in middleware. Everything from memory.
 */

import { seoCategories, getProductUrl } from './seoCategories';

// Old category parameter → new URL
const categoryRedirects: Record<string, string> = {};
seoCategories.forEach(cat => {
    categoryRedirects[cat.firebaseCategoryName] = `/${cat.parentSlug}/${cat.categorySlug}`;
    // Also add lowercase version
    categoryRedirects[cat.firebaseCategoryName.toLowerCase()] = `/${cat.parentSlug}/${cat.categorySlug}`;
});

/**
 * Given a /shop?category=X URL, return the new URL or null.
 */
export function getShopCategoryRedirect(categoryParam: string): string | null {
    return categoryRedirects[categoryParam] || categoryRedirects[categoryParam.toLowerCase()] || null;
}

/**
 * Old /product/[slug] paths are handled:
 * Since old slug = name-id, we extract the ID and look up product in Firestore.
 * But we can't do Firestore in middleware! So redirect to same path under the
 * /product/[slug] catch-all which will then render with proper canonical.
 * The old route will still work (kept for compatibility) but with canonical pointing
 * to the new URL.
 */
export function isOldProductUrl(pathname: string): boolean {
    return pathname.startsWith('/product/');
}
