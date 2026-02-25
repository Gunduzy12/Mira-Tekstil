'use client';

import { useState } from 'react';
import { db, auth } from '@/firebaseConfig';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

/**
 * SEO-optimized slug oluşturur.
 * Gereksiz kelimeleri temizler, tekrarları kaldırır.
 * Hedef: "bej-blackout-perde" gibi kısa, temiz URL'ler.
 */
function createCleanSlug(productName: string): string {
    let name = productName.toLowerCase();

    // Türkçe karakterleri dönüştür
    name = name
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');

    // Gereksiz kelimeleri kaldır
    const removeWords = [
        'ozel dikim', 'ozel olcu',
        '1 sinif', '1sinif', 'birinci sinif', '1.sinif',
        'luks', 'lux',
        'isik gecirmez',
        'ekstraforlu', 'ekstra',
        'karartma',
        'fon perde',
        'ozel', 'dikim',
        'en boy', 'enxboy',
        'bagcikli',
        '1kalite', '1 kalite', 'birinci kalite',
        'mira tekstil', 'miratekstil',
        'zerdal tekstil', 'zerdaltekstil', 'zerdaltekstl',
    ];

    for (const word of removeWords) {
        name = name.replace(new RegExp(word, 'gi'), ' ');
    }

    // Sayıları temizle
    name = name.replace(/\b\d+\b/g, ' ');

    // Özel karakterleri kaldır, slug oluştur
    name = name
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    // ✅ Ardışık tekrar eden kelimeleri kaldır (blackout-blackout → blackout)
    const parts = name.split('-');
    const deduped: string[] = [];
    for (const part of parts) {
        if (part && part !== deduped[deduped.length - 1]) {
            deduped.push(part);
        }
    }
    name = deduped.join('-');

    // ✅ Perde ürünleri "perde" ile bitsin
    if (!name.endsWith('perde') && !name.includes('cibinlik') && !name.includes('yastik')) {
        name = name + '-perde';
    }

    // Max 50 karakter
    if (name.length > 50) {
        name = name.substring(0, 50).replace(/-[^-]*$/, '');
    }

    return name;
}

function detectCategory(productName: string) {
    const nameLower = productName.toLowerCase();

    const rules = [
        { keywords: ['blackout', 'karartma', 'fon perde', 'ışık geçirmez'], parentSlug: 'perde', categorySlug: 'blackout-perde', subcategory: 'Blackout Perde' },
        { keywords: ['saten'], parentSlug: 'perde', categorySlug: 'saten-perde', subcategory: 'Saten Perde' },
        { keywords: ['tül', 'tul'], parentSlug: 'perde', categorySlug: 'tul-perde', subcategory: 'Tül Perde' },
        { keywords: ['yastık', 'yastik', 'kılıf', 'kilif', 'yorgan'], parentSlug: 'ev-tekstili', categorySlug: 'yastik-kilifi', subcategory: 'Yastık Kılıfı' },
    ];

    for (const rule of rules) {
        for (const keyword of rule.keywords) {
            if (nameLower.includes(keyword)) {
                return { parentSlug: rule.parentSlug, categorySlug: rule.categorySlug, subcategory: rule.subcategory };
            }
        }
    }

    return { parentSlug: 'perde', categorySlug: 'blackout-perde', subcategory: 'Blackout Perde' };
}

/**
 * SEO Title oluşturur.
 * Ürün adından renk + ürün tipini çıkarır.
 * Örnek: "Özel Dikim 1.Sınıf Bej Blackout..." → "Bej Blackout Perde | Özel Ölçü"
 */
function createSeoTitle(productName: string, subcategory: string): string {
    const colors = [
        'Bej', 'Beyaz', 'Siyah', 'Gri', 'Krem', 'Kahverengi', 'Mavi',
        'Kırmızı', 'Yeşil', 'Pembe', 'Mor', 'Turuncu', 'Sarı', 'Lacivert',
        'Bordo', 'Füme', 'Ekru', 'Antrasit', 'Vizon',
    ];

    // Renk bul
    let foundColor = '';
    for (const color of colors) {
        if (productName.toLowerCase().includes(color.toLowerCase())) {
            foundColor = color;
            break;
        }
    }

    // Balkon/özel bilgi
    const isBalkon = productName.toLowerCase().includes('balkon');
    const suffix = isBalkon ? ' Balkon Perdesi' : '';

    // Temiz title oluştur
    if (foundColor) {
        return `${foundColor} ${subcategory}${suffix} | Özel Ölçü`;
    }
    return `${subcategory}${suffix} | Özel Ölçü`;
}

export default function MigrateSlugsPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [results, setResults] = useState<{ name: string; url: string }[]>([]);
    const [running, setRunning] = useState(false);

    async function handleLogin() {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setStatus('✅ Giriş başarılı!');
        } catch (err) {
            setStatus(`❌ Giriş hatası: ${String(err)}`);
        }
    }

    async function runMigration() {
        if (!auth.currentUser) {
            setStatus('❌ Önce giriş yapın!');
            return;
        }

        setRunning(true);
        setStatus('⏳ Ürünler okunuyor...');

        try {
            const snapshot = await getDocs(collection(db, 'products'));
            type ProductDoc = { id: string; name: string;[key: string]: unknown };
            const products: ProductDoc[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProductDoc));

            setStatus(`📦 ${products.length} ürün bulundu. Temiz slug'lar hesaplanıyor...`);

            const slugMap = new Map<string, number>();
            const updates: { id: string; slug: string; categorySlug: string; parentSlug: string; subcategory: string; seoTitle: string; name: string; variants: unknown[] }[] = [];

            for (const product of products) {
                const { parentSlug, categorySlug, subcategory } = detectCategory(product.name);
                const baseSlug = createCleanSlug(product.name);

                let finalSlug = baseSlug;
                if (slugMap.has(baseSlug)) {
                    const count = slugMap.get(baseSlug)! + 1;
                    slugMap.set(baseSlug, count);
                    finalSlug = `${baseSlug}-${count}`;
                } else {
                    slugMap.set(baseSlug, 1);
                }

                // SEO Title oluştur (temiz, kısa)
                const seoTitle = createSeoTitle(product.name, subcategory);

                updates.push({
                    id: product.id,
                    slug: finalSlug,
                    categorySlug,
                    parentSlug,
                    subcategory,
                    seoTitle,
                    name: product.name,
                    variants: (product as Record<string, unknown>).variants as unknown[] || [],
                });
            }

            setStatus(`📝 ${updates.length} ürün Firestore'a yazılıyor...`);

            const batch = writeBatch(db);
            for (const update of updates) {
                const docRef = doc(db, 'products', update.id);

                // Renk boşluklarını temizle
                const cleanedVariants = (update.variants as Array<Record<string, unknown>>).map(v => ({
                    ...v,
                    color: typeof v.color === 'string' ? v.color.trim() : v.color,
                }));

                // Trendyol details'ını temizle
                const cleanDetails = [
                    `${update.subcategory} - Özel dikim, istediğiniz ölçüde üretim`,
                    'Yüksek kalite kumaş, solmaz ve deforme olmaz',
                    'Kolay montaj, kullanıma hazır teslimat',
                    'Profesyonel dikim, düzgün döküm',
                    'Yıkanabilir, kolay bakım',
                ];

                batch.update(docRef, {
                    slug: update.slug,
                    categorySlug: update.categorySlug,
                    parentSlug: update.parentSlug,
                    subcategory: update.subcategory,
                    seoTitle: update.seoTitle,
                    details: cleanDetails,
                    variants: cleanedVariants,
                });
            }

            await batch.commit();

            setResults(updates.map(u => ({
                name: u.name,
                url: `/${u.parentSlug}/${u.categorySlug}/${u.slug}`,
            })));

            setStatus(`🎉 Tamamlandı! ${updates.length} ürün güncellendi.`);
        } catch (err) {
            setStatus(`❌ Hata: ${String(err)}`);
        } finally {
            setRunning(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">🔧 Slug Migration v2</h1>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="font-semibold mb-4">Admin Girişi</h2>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded mb-2" />
                    <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded mb-4" />
                    <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Giriş Yap</button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <p className="text-sm text-gray-500 mb-1">Temiz SEO slug'lar oluşturur:</p>
                    <p className="text-sm text-green-600 font-mono mb-4">/perde/blackout-perde/bej-blackout-perde</p>
                    <button onClick={runMigration} disabled={running} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold">
                        {running ? '⏳ Çalışıyor...' : '🚀 Migration Başlat'}
                    </button>
                </div>

                {status && (
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <pre className="text-sm whitespace-pre-wrap">{status}</pre>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold mb-3">Sonuçlar ({results.length} ürün):</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {results.map((r, i) => (
                                <div key={i} className="text-sm border-b pb-2">
                                    <div className="text-gray-600">{r.name}</div>
                                    <div className="text-green-600 font-mono">{r.url}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
