/**
 * Fiyat Güncelleme Scripti - Firebase Client SDK (Node.js)
 * Tüm ürünlerin fiyatlarına %10 zam yapar.
 * 
 * Güncellenecek alanlar:
 *   - priceFrom
 *   - originalPrice (varsa)
 *   - pricePerSqM (varsa)
 *   - variants[].price
 *   - variants[].originalPrice (varsa)
 * 
 * Kullanım: node scripts/price-increase-client.js
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, writeBatch, doc } = require('firebase/firestore');

// 1. .env.local dosyasını absolute path ile oku ve yükle
const envPath = path.resolve(__dirname, '../.env.local');
require('dotenv').config({ path: envPath });

const ZAM_ORANI = 1.10; // %10
const DRY_RUN = false; // Gerçekten güncellemek için false yapın, test için true kalsın.

// Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log("Initializing Firebase with project:", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function zamUygula(fiyat) {
    if (typeof fiyat !== 'number' || isNaN(fiyat) || fiyat <= 0) return fiyat;
    // En yakın tam sayıya yuvarla
    return Math.round(fiyat * ZAM_ORANI);
}

async function fiyatGuncelle() {
    console.log('========================================');
    console.log(`   MiraTekstil Fiyat Güncelleme Aracı`);
    console.log(`   Zam Oranı: %10`);
    console.log(`   Mod: ${DRY_RUN ? 'DRY-RUN (Simülasyon)' : 'CANLI (Firestore Güncellenecek)'}`);
    console.log('========================================\n');

    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    console.log(`Toplam ${products.length} ürün bulundu.\n`);

    let guncellenenUrunSayisi = 0;
    let hataVar = false;

    // Batch boyutunu 400 yapıyoruz (Firestore limiti 500'dür)
    let batch = writeBatch(db);
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

            // 2. originalPrice (top-level) alanını güncelle
            if (typeof product.originalPrice === 'number') {
                const eskiOrijinal = product.originalPrice;
                guncellemeler.originalPrice = zamUygula(product.originalPrice);
                console.log(`    originalPrice (top): ${eskiOrijinal} TL → ${guncellemeler.originalPrice} TL`);
            }

            // 3. pricePerSqM alanını güncelle (özel ölçülü ürünler)
            if (typeof product.pricePerSqM === 'number') {
                const eskiM2 = product.pricePerSqM;
                guncellemeler.pricePerSqM = zamUygula(product.pricePerSqM);
                console.log(`    pricePerSqM: ${eskiM2} TL/m² → ${guncellemeler.pricePerSqM} TL/m²`);
            }

            // 4. Tüm variant fiyatlarını güncelle
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
                if (!DRY_RUN) {
                    const docRef = doc(db, 'products', product.id);
                    batch.update(docRef, guncellemeler);
                    batchSayaci++;
                }
                guncellenenUrunSayisi++;
                console.log('');
            }

            // Batch dolunca gönder
            if (batchSayaci >= 400 && !DRY_RUN) {
                await batch.commit();
                console.log(`\n[Batch gönderildi: ${batchSayaci} ürün]\n`);
                batch = writeBatch(db);
                batchSayaci = 0;
            }

        } catch (err) {
            console.error(`\n❌ HATA - Ürün ID: ${product.id}`, err.message);
            hataVar = true;
        }
    }

    // Kalan batch'i gönder
    if (batchSayaci > 0 && !DRY_RUN) {
        await batch.commit();
        console.log(`[Son batch gönderildi: ${batchSayaci} ürün]\n`);
    }

    console.log('========================================');
    if (hataVar) {
        console.log(`⚠️  Tamamlandı AMA bazı hatalar oluştu! Yukarıyı kontrol edin.`);
    } else {
        console.log(`✅ Başarıyla tamamlandı!`);
    }
    console.log(`   Etkilenen/Güncellenen ürün sayısı: ${guncellenenUrunSayisi}`);
    console.log(`   Zam oranı: %10`);
    console.log(`   Mod: ${DRY_RUN ? 'DRY-RUN (Simülasyon - Veritabanına yazılmadı)' : 'CANLI (Firestore Güncellendi)'}`);
    console.log('========================================');

    process.exit(0);
}

fiyatGuncelle().catch(err => {
    console.error('\n❌ Kritik hata:', err.message || err);
    process.exit(1);
});
