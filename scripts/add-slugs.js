/**
 * Firestore Migration Script (Firebase Admin SDK)
 * Her ürüne slug, categorySlug, parentSlug alanları ekler.
 * 
 * Kullanım: node scripts/add-slugs.js
 */

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Admin SDK'yı proje ID ile başlat (bypass security rules)
admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

// Türkçe → ASCII slug
function turkishSlugify(text) {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Ürün adından SEO alt kategorisini tespit et
function detectCategory(productName) {
    const nameLower = productName.toLowerCase();
    const nameNorm = turkishSlugify(productName);

    const rules = [
        { keywords: ['blackout', 'karartma', 'fon perde', 'ışık geçirmez', 'isik gecirmez'], parentSlug: 'perde', categorySlug: 'blackout-perde' },
        { keywords: ['saten'], parentSlug: 'perde', categorySlug: 'saten-perde' },
        { keywords: ['tül', 'tul'], parentSlug: 'perde', categorySlug: 'tul-perde' },
        { keywords: ['yastık', 'yastik', 'kılıf', 'kilif', 'yorgan'], parentSlug: 'ev-tekstili', categorySlug: 'yastik-kilifi' },
    ];

    for (const rule of rules) {
        for (const keyword of rule.keywords) {
            if (nameLower.includes(keyword) || nameNorm.includes(keyword)) {
                return { parentSlug: rule.parentSlug, categorySlug: rule.categorySlug };
            }
        }
    }

    return { parentSlug: 'perde', categorySlug: 'blackout-perde' };
}

function shortenSlug(slug, maxLen = 60) {
    if (slug.length <= maxLen) return slug;
    return slug.substring(0, maxLen).replace(/-[^-]*$/, '');
}

async function migrate() {
    console.log('Migration baslatiliyor...\n');

    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    console.log(`${products.length} urun bulundu.\n`);

    const slugMap = new Map();
    const updates = [];

    for (const product of products) {
        const { parentSlug, categorySlug } = detectCategory(product.name);

        let baseSlug = shortenSlug(turkishSlugify(product.name));
        let finalSlug = baseSlug;

        if (slugMap.has(baseSlug)) {
            const count = slugMap.get(baseSlug) + 1;
            slugMap.set(baseSlug, count);
            finalSlug = `${baseSlug}-${count}`;
        } else {
            slugMap.set(baseSlug, 1);
        }

        updates.push({ id: product.id, name: product.name, slug: finalSlug, categorySlug, parentSlug });
        console.log(`  ${product.name.substring(0, 50)}`);
        console.log(`     -> /${parentSlug}/${categorySlug}/${finalSlug}\n`);
    }

    // Batch write
    console.log('\nFirestore yaziliyor...\n');

    const batch = db.batch();
    for (const update of updates) {
        const docRef = db.collection('products').doc(update.id);
        batch.update(docRef, {
            slug: update.slug,
            categorySlug: update.categorySlug,
            parentSlug: update.parentSlug,
        });
    }

    await batch.commit();

    console.log(`\nMigration tamamlandi! ${updates.length} urun guncellendi.`);
    console.log('Eklenen alanlar: slug, categorySlug, parentSlug');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration hatasi:', err.message || err);
    process.exit(1);
});
