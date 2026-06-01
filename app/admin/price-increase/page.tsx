'use client';

import { useState } from 'react';
import { db, auth } from '@/firebaseConfig';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LogLine {
    type: 'info' | 'success' | 'warn' | 'error' | 'product';
    text: string;
}

export default function PriceIncreasePage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [logs, setLogs] = useState<LogLine[]>([]);
    const [running, setRunning] = useState(false);
    const [dryRun, setDryRun] = useState(true);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [summary, setSummary] = useState({ updated: 0, total: 0 });
    const [revalidateLoading, setRevalidateLoading] = useState(false);

    const ZAM_ORANI = 1.075; // %7.5

    function addLog(text: string, type: LogLine['type'] = 'info') {
        setLogs(prev => [...prev, { text, type }]);
    }

    function zamUygula(fiyat: any) {
        if (typeof fiyat !== 'number' || isNaN(fiyat) || fiyat <= 0) return fiyat;
        return Math.round(fiyat * ZAM_ORANI);
    }

    async function handleLogin() {
        try {
            setStatus('Giriş yapılıyor...');
            await signInWithEmailAndPassword(auth, email, password);
            setStatus('✅ Giriş başarılı! Artık güncelleme yapabilirsiniz.');
            addLog('Yönetici girişi başarıyla sağlandı.', 'success');
        } catch (err: any) {
            setStatus(`❌ Giriş hatası: ${err.message}`);
            addLog(`Giriş hatası: ${err.message}`, 'error');
        }
    }

    async function handleRevalidate() {
        setRevalidateLoading(true);
        addLog('Web sitesinin önbelleği (Anasayfa, Mağaza ve Ürünler) temizleniyor...', 'warn');
        try {
            const res = await fetch('/api/revalidate', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                addLog('✅ Web sitesi önbelleği başarıyla sıfırlandı! Yeni fiyatlar tüm sitede anında yayında.', 'success');
                setStatus('🎉 Tüm site güncellendi ve yeni fiyatlar anında yayına alındı!');
            } else {
                addLog(`⚠️ Önbellek temizleme uyarısı: ${data.error || 'Bilinmeyen Hata'}`, 'warn');
            }
        } catch (err: any) {
            addLog(`❌ Önbellek temizleme hatası: ${err.message}`, 'error');
        } finally {
            setRevalidateLoading(false);
        }
    }

    async function runPriceIncrease() {
        if (!auth.currentUser) {
            setStatus('❌ Önce giriş yapın!');
            addLog('Hata: Yetkisiz işlem. Lütfen giriş yapın.', 'error');
            return;
        }

        setRunning(true);
        setLogs([]);
        setProgress({ current: 0, total: 0 });
        setSummary({ updated: 0, total: 0 });
        setStatus(dryRun ? '⏳ Fiyat artışı simüle ediliyor...' : '⏳ Fiyat artışı Firestore\'a uygulanıyor...');

        try {
            addLog('Firestore\'dan ürünler çekiliyor...', 'info');
            const snapshot = await getDocs(collection(db, 'products'));
            const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            addLog(`Toplam ${products.length} ürün başarıyla yüklendi.`, 'success');
            setProgress({ current: 0, total: products.length });

            let guncellenenSayi = 0;
            const batchSize = 450;
            let currentBatch = writeBatch(db);
            let batchCounter = 0;

            for (let i = 0; i < products.length; i++) {
                const product: any = products[i];
                const guncellemeler: any = {};
                let urunGuncellendi = false;

                addLog(`[Ürün ${i + 1}/${products.length}] ${product.name}`, 'product');

                // 1. priceFrom
                if (typeof product.priceFrom === 'number') {
                    const yeniFiyat = zamUygula(product.priceFrom);
                    guncellemeler.priceFrom = yeniFiyat;
                    addLog(`  • priceFrom: ${product.priceFrom} TL → ${yeniFiyat} TL`, 'info');
                    urunGuncellendi = true;
                }

                // 2. originalPrice (top-level)
                if (typeof product.originalPrice === 'number') {
                    const yeniOrijinal = zamUygula(product.originalPrice);
                    guncellemeler.originalPrice = yeniOrijinal;
                    addLog(`  • originalPrice (üst): ${product.originalPrice} TL → ${yeniOrijinal} TL`, 'info');
                    urunGuncellendi = true;
                }

                // 3. pricePerSqM
                if (typeof product.pricePerSqM === 'number' && product.pricePerSqM > 0) {
                    const yeniM2 = zamUygula(product.pricePerSqM);
                    guncellemeler.pricePerSqM = yeniM2;
                    addLog(`  • m² Fiyatı: ${product.pricePerSqM} TL → ${yeniM2} TL`, 'info');
                    urunGuncellendi = true;
                }

                // 4. Variants
                if (Array.isArray(product.variants) && product.variants.length > 0) {
                    const yeniVariants = product.variants.map((v: any, index: number) => {
                        const updatedVariant = { ...v };
                        
                        if (typeof v.price === 'number') {
                            const yeniVarPrice = zamUygula(v.price);
                            updatedVariant.price = yeniVarPrice;
                            addLog(`    - varyant[${index}] price: ${v.price} TL → ${yeniVarPrice} TL ${v.size ? `(${v.size})` : ''}`, 'info');
                        }
                        
                        if (typeof v.originalPrice === 'number') {
                            const yeniVarOrig = zamUygula(v.originalPrice);
                            updatedVariant.originalPrice = yeniVarOrig;
                            addLog(`    - varyant[${index}] originalPrice: ${v.originalPrice} TL → ${yeniVarOrig} TL`, 'info');
                        }

                        return updatedVariant;
                    });
                    
                    guncellemeler.variants = yeniVariants;
                    urunGuncellendi = true;
                }

                if (urunGuncellendi) {
                    guncellenenSayi++;
                    if (!dryRun) {
                        const docRef = doc(db, 'products', product.id);
                        currentBatch.update(docRef, guncellemeler);
                        batchCounter++;

                        if (batchCounter >= batchSize) {
                            addLog(`\n⏳ Batch paketi gönderiliyor (${batchCounter} ürün)...`, 'warn');
                            await currentBatch.commit();
                            addLog('✅ Batch paketi başarıyla Firestore\'a yazıldı.\n', 'success');
                            currentBatch = writeBatch(db);
                            batchCounter = 0;
                        }
                    }
                }

                setProgress(prev => ({ ...prev, current: i + 1 }));
                // Küçük bir gecikme ekleyerek arayüzün kilitlenmesini önleyelim ve log akışını güzelleştirelim
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            // Kalan batch
            if (batchCounter > 0 && !dryRun) {
                addLog(`\n⏳ Son batch paketi gönderiliyor (${batchCounter} ürün)...`, 'warn');
                await currentBatch.commit();
                addLog('✅ Son batch paketi başarıyla Firestore\'a yazıldı.\n', 'success');
            }

            setSummary({ updated: guncellenenSayi, total: products.length });
            setStatus(dryRun 
                ? `✅ Simülasyon Tamamlandı! ${guncellenenSayi} ürün etkilenecektir.`
                : `🎉 Başarıyla Tamamlandı! ${guncellenenSayi} ürün güncellendi.`
            );
            addLog(dryRun
                ? `Simülasyon başarıyla bitti. Toplam ${guncellenenSayi} üründe fiyat artışı simüle edildi.`
                : `Firestore güncellemesi tamamlandı! ${guncellenenSayi} ürünün fiyatları %7.5 artırıldı.`,
                'success'
            );

            if (!dryRun) {
                await handleRevalidate();
            }

        } catch (err: any) {
            setStatus(`❌ Hata oluştu: ${err.message}`);
            addLog(`HATA: ${err.message}`, 'error');
        } finally {
            setRunning(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased pb-12">
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">⚡</span>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">MiraTekstil Fiyat Yönetim Modülü</h1>
                            <p className="text-xs text-slate-400">Toplu Fiyat Güncelleme & %7.5 Zam Aracı</p>
                        </div>
                    </div>
                    <div className="text-sm bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
                        Durum: <span className="font-semibold text-amber-400">{auth.currentUser ? 'Giriş Yapıldı' : 'Giriş Bekleniyor'}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sol Panel: Giriş & Kontroller */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Giriş Kartı */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                            <span className="mr-2">🔐</span> Yönetici Girişi
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">E-posta</label>
                                <input 
                                    type="email" 
                                    placeholder="admin@miratekstil.com" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2.5 outline-none transition-all text-sm text-slate-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Şifre</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2.5 outline-none transition-all text-sm text-slate-100"
                                />
                            </div>
                            <button 
                                onClick={handleLogin}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/20 text-sm"
                            >
                                Güvenli Giriş Yap
                            </button>
                        </div>
                    </div>

                    {/* Kontrol Paneli Kartı */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                            <span className="mr-2">⚙️</span> İşlem Paneli
                        </h2>

                        <div className="space-y-5">
                            {/* Mod Seçimi */}
                            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
                                <label className="flex items-start space-x-3 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={dryRun} 
                                        onChange={e => setDryRun(e.target.checked)}
                                        className="mt-1 h-4.5 w-4.5 rounded border-slate-800 bg-slate-900 text-amber-600 focus:ring-amber-500 focus:ring-offset-slate-900"
                                    />
                                    <div>
                                        <span className="text-sm font-semibold text-white block">Simülasyon Modu (Dry Run)</span>
                                        <span className="text-xs text-slate-400 block mt-0.5">
                                            İşaretli olduğunda sadece hesaplama yapar, veritabanına yazmaz. Önce test etmeniz tavsiye edilir.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Detay Kartı */}
                            <div className="text-xs text-slate-400 space-y-2 border-t border-slate-800 pt-4">
                                <p className="flex justify-between">
                                    <span>Zam Miktarı:</span>
                                    <span className="font-bold text-emerald-400">%7.5 Artış</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Çarpan Oranı:</span>
                                    <span className="font-mono text-slate-300">1.075</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Kapsanan Alanlar:</span>
                                    <span className="text-slate-300 text-right">variants, priceFrom, originalPrice, pricePerSqM</span>
                                </p>
                            </div>

                            <button 
                                onClick={runPriceIncrease}
                                disabled={running || !auth.currentUser}
                                className={`w-full font-bold py-3.5 rounded-lg transition-all shadow-lg text-sm tracking-wide ${
                                    running 
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : !auth.currentUser
                                            ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                                            : dryRun
                                                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:shadow-amber-500/20'
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-500/20'
                                }`}
                            >
                                {running 
                                    ? '⏳ İşlem Devam Ediyor...' 
                                    : !auth.currentUser
                                        ? '🔒 Önce Giriş Yapın'
                                        : dryRun 
                                            ? '🔍 Simülasyonu Başlat' 
                                            : '🚀 Canlı Güncellemeyi Başlat (%7.5 ZAM)'
                                }
                            </button>

                            {auth.currentUser && !running && (
                                <button
                                    onClick={handleRevalidate}
                                    disabled={revalidateLoading}
                                    className={`w-full font-bold py-3 rounded-lg transition-all shadow-lg text-sm tracking-wide border border-indigo-500 text-indigo-400 hover:bg-indigo-950/30 flex justify-center items-center space-x-2 ${
                                        revalidateLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <span>🔄</span>
                                    <span>{revalidateLoading ? 'Önbellek Temizleniyor...' : 'Sitedeki Önbelleği Temizle (Anında Yayınla)'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sağ Panel: Canlı Log Ekranı */}
                <div className="lg:col-span-2 space-y-6">
                    {/* İlerleme Çubuğu */}
                    {running && (
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl">
                            <div className="flex justify-between text-sm mb-2 font-semibold">
                                <span className="text-slate-300">Ürün İşleme İlerleme Durumu</span>
                                <span className="text-indigo-400 font-mono">%{Math.round((progress.current / progress.total) * 100) || 0} ({progress.current}/{progress.total})</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-350"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Konsol Ekranı */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl shadow-xl flex flex-col h-[650px] overflow-hidden">
                        {/* Konsol Header */}
                        <div className="bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                                <span className="h-3 w-3 rounded-full bg-amber-500"></span>
                                <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                                <span className="text-sm font-semibold text-slate-300 ml-2 font-mono">system_terminal.log</span>
                            </div>
                            <button 
                                onClick={() => setLogs([])}
                                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                Temizle
                            </button>
                        </div>

                        {/* Konsol İçeriği */}
                        <div className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2.5 bg-slate-950 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                                    <span className="text-3xl">💻</span>
                                    <span>Konsol hazır. İşlemleri başlatın.</span>
                                </div>
                            ) : (
                                logs.map((log, index) => {
                                    let colorClass = 'text-slate-400';
                                    let prefix = '•';
                                    
                                    if (log.type === 'success') {
                                        colorClass = 'text-emerald-400 font-semibold';
                                        prefix = '✔';
                                    } else if (log.type === 'error') {
                                        colorClass = 'text-rose-500 font-bold bg-rose-950/20 px-1 py-0.5 rounded';
                                        prefix = '✘';
                                    } else if (log.type === 'warn') {
                                        colorClass = 'text-amber-400 font-semibold';
                                        prefix = '⚠';
                                    } else if (log.type === 'product') {
                                        colorClass = 'text-sky-300 font-bold mt-4 block border-b border-slate-800/50 pb-1';
                                        prefix = '📦';
                                    }

                                    return (
                                        <div key={index} className={`${colorClass} whitespace-pre-wrap`}>
                                            <span className="mr-2 text-slate-600 select-none">{prefix}</span>
                                            {log.text}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Durum Altlığı */}
                        {status && (
                            <div className="bg-slate-900 border-t border-slate-800 px-5 py-4 text-xs font-semibold flex items-center justify-between text-slate-300 flex-shrink-0">
                                <span>{status}</span>
                                {summary.total > 0 && (
                                    <span className="text-indigo-400">
                                        Etkilenen: {summary.updated} / Toplam: {summary.total}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
