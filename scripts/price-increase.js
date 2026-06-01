/**
 * Fiyat Güncelleme Scripti - Firebase Admin SDK
 * Tüm ürünlerin fiyatlarına %7.5 zam yapar.
 * 
 * Güncellenecek alanlar:
 *   - variants[].price
 *   - variants[].originalPrice (varsa)
 *   - priceFrom
 *   - pricePerSqM (özel ölçülü ürünler için m² fiyatı)
 * 
 * Kullanım: node scripts/price-increase.js
 */

const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const ZAM_ORANI = 1.075; // %7.5

admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

function zamUygula(fiyat) {
    if (typeof fiyat !== 'number' || isNaN(fiyat) || fiyat <= 0) return fiyat;
    // En yakın tam sayıya yuvarla (tercihe göre değiştirebilirsiniz)
    return Math.round(fiyat * ZAM_ORANI);
}

async function fiyatGuncelle() {
    console.log('========================================');
    console.log(`   MiraTekstil Fiyat Güncelleme Aracı`);
    console.log(`   Zam Oranı: %7.5`);
    console.log('========================================\n');

    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    console.log(`Toplam ${products.length} ürün bulundu.\n`);

    let guncellenenUrunSayisi = 0;
    let hataVar = false;

    // Firestore 500 dokümanlık batch sınırı var, parçalara bölüyoruz
    const BATCH_BOYUTU = 400;
    let batch = db.batch();
    let batchSayaci = 0;

    for (const product of products) {
        try {
            const guncellemeler = {};

            // 1. priceFrom alanını güncelle
            if (typeof product.priceFrom === 'number') {
                const eskiFiyat = product.priceFrom;
                guncellemeler.priceFrom = zamUygula(product.priceFrom);
                console.log(`  [${product.name?.substring(0, 45)}]`);
                console.log(`    priceFrom: ${eskiFiyat} TL → ${guncellemeler.priceFrom} TL`);
            }

            // 2. pricePerSqM alanını güncelle (özel ölçülü ürünler)
            if (typeof product.pricePerSqM === 'number') {
                const eskiM2 = product.pricePerSqM;
                guncellemeler.pricePerSqM = zamUygula(product.pricePerSqM);
                console.log(`    pricePerSqM: ${eskiM2} TL/m² → ${guncellemeler.pricePerSqM} TL/m²`);
            }

            // 3. Tüm variant fiyatlarını güncelle
            if (Array.isArray(product.variants) && product.variants.length > 0) {
                const guncelVariants = product.variants.map((v, index) => {
                    const yeniVariant = { ...v };

                    if (typeof v.price === 'number') {
                        const eskiVarFiyat = v.price;
                        yeniVariant.price = zamUygula(v.price);
                        console.log(`    variant[${index}] price: ${eskiVarFiyat} TL → ${yeniVariant.price} TL${v.size ? ` (${v.size})` : ''}${v.color ? ` / ${v.color}` : ''}`);
                    }

                    if (typeof v.originalPrice === 'number') {
                        const eskiOrijinal = v.originalPrice;
                        yeniVariant.originalPrice = zamUygula(v.originalPrice);
                        console.log(`    variant[${index}] originalPrice: ${eskiOrijinal} TL → ${yeniVariant.originalPrice} TL`);
                    }

                    return yeniVariant;
                });

                guncellemeler.variants = guncelVariants;
            }

            // Güncelleme varsa batch'e ekle
            if (Object.keys(guncellemeler).length > 0) {
                const docRef = db.collection('products').doc(product.id);
                batch.update(docRef, guncellemeler);
                batchSayaci++;
                guncellenenUrunSayisi++;
                console.log('');
            }

            // Batch dolunca gönder
            if (batchSayaci >= BATCH_BOYUTU) {
                await batch.commit();
                console.log(`\n[Batch gönderildi: ${batchSayaci} ürün]\n`);
                batch = db.batch();
                batchSayaci = 0;
            }

        } catch (err) {
            console.error(`\n❌ HATA - Ürün ID: ${product.id}`, err.message);
            hataVar = true;
        }
    }

    // Kalan batch'i gönder
    if (batchSayaci > 0) {
        await batch.commit();
        console.log(`[Son batch gönderildi: ${batchSayaci} ürün]\n`);
    }

    console.log('========================================');
    if (hataVar) {
        console.log(`⚠️  Tamamlandı AMA bazı hatalar oluştu! Yukarıyı kontrol edin.`);
    } else {
        console.log(`✅ Başarıyla tamamlandı!`);
    }
    console.log(`   Güncellenen ürün sayısı: ${guncellenenUrunSayisi}`);
    console.log(`   Zam oranı: %7.5`);
    console.log('========================================');

    process.exit(0);
}

fiyatGuncelle().catch(err => {
    console.error('\n❌ Kritik hata:', err.message || err);
    process.exit(1);
});
