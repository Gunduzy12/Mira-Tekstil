"use client";
import React, { useState } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';

const fakeReviews = [
    "Ürün harika, çok beğendim.",
    "Kargo çok hızlıydı, teşekkürler.",
    "Tam istediğim gibi geldi.",
    "Kumaşı çok kaliteli.",
    "Rengi göründüğü gibi canlı.",
    "Mükemmel.",
    "Fiyat performans ürünü.",
    "Hızlı kargo, özenli paketleme.",
    "Tavsiye ederim.",
    "Sorunsuz alışveriş.",
    "Beklediğimden daha iyi çıktı.",
    "Çok şık duruyor.",
    "Kaliteli malzeme.",
    "Hediye olarak aldım, çok beğenildi.",
    "Özenle paketlenmiş.",
    "İlgili satıcı.",
    "Tam ölçüsünde geldi.",
    "Renkleri çok canlı.",
    "Dokusu yumuşacık.",
    "Hızlı teslimat için teşekkürler.",
    "Bayıldım, harika bir ürün.",
    "Kesinlikle tekrar alacağım.",
    "Çok memnun kaldım.",
    "Fotoğraftakinden daha güzel."
];

const fakeNames = [
    "Ayşe K.", "Mehmet Y.", "Fatma A.", "Ali S.", "Zeynep T.", "Mustafa B.", "Elif D.", "Ahmet C.", "Seda E.", "Onur F.",
    "Canan G.", "Burak H.", "Merve I.", "Kemal J.", "Derya K.", "Orhan L.", "Pelin M.", "Selim N.", "Gizem O.", "Kaan P."
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// %90 5 Yıldız, %10 4 Yıldız
const getRandomRating = () => Math.random() > 0.1 ? 5 : 4;

const BulkReviewsPage = () => {
    const [status, setStatus] = useState("Ready to add reviews.");
    const [isProcessing, setIsProcessing] = useState(false);
    const [mode, setMode] = useState<'append' | 'reset'>('append');

    const handleAddReviews = async () => {
        setIsProcessing(true);
        setStatus("Fetching products...");
        try {
            const productsRef = collection(db, "products");
            const snapshot = await getDocs(productsRef);

            let count = 0;
            const total = snapshot.size;

            for (const productDoc of snapshot.docs) {
                const product = productDoc.data();
                let currentReviews = product.reviews || [];

                // Reset Mode: Clear existing reviews first
                if (mode === 'reset') {
                    currentReviews = [];
                }

                // If appending, skip if already has too many (to avoid spamming)
                if (mode === 'append' && currentReviews.length > 15) {
                    continue;
                }

                // Generate 5 to 10 new reviews (Increased count)
                const numNewReviews = Math.floor(Math.random() * 6) + 5;
                const newReviews = [];

                for (let i = 0; i < numNewReviews; i++) {
                    newReviews.push({
                        id: Date.now() + Math.random(),
                        author: getRandom(fakeNames),
                        rating: getRandomRating(),
                        comment: getRandom(fakeReviews),
                        // Random date within last 6 months
                        date: new Date(Date.now() - Math.floor(Math.random() * 15000000000)).toISOString().split('T')[0]
                    });
                }

                const allReviews = [...currentReviews, ...newReviews];

                // Calculate new average
                const totalRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                const averageRating = parseFloat((totalRating / allReviews.length).toFixed(1));

                await updateDoc(doc(db, "products", productDoc.id), {
                    reviews: allReviews,
                    reviewCount: allReviews.length,
                    averageRating: averageRating
                });

                count++;
                setStatus(`Processed ${count}/${total} products...`);
            }

            setStatus(`🎉 SUCCESS! Updated reviews for ${count} products.`);

        } catch (error: any) {
            console.error(error);
            setStatus("❌ Error: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={{ padding: 50, fontFamily: 'sans-serif' }}>
            <h1>Admin: Bulk Add Fake Reviews</h1>
            <p>Bu araç ürünlere bol miktarda 5 yıldızlı yorum ekler.</p>

            <div style={{ margin: '20px 0', padding: 20, background: '#f0f0f0', borderRadius: 8 }}>
                <label style={{ display: 'block', marginBottom: 10, fontWeight: 'bold' }}>İşlem Modu:</label>
                <div>
                    <input
                        type="radio"
                        id="append"
                        name="mode"
                        value="append"
                        checked={mode === 'append'}
                        onChange={() => setMode('append')}
                    />
                    <label htmlFor="append" style={{ marginLeft: 8, marginRight: 20 }}>Ekle (Mevcutların üstüne ekle)</label>

                    <input
                        type="radio"
                        id="reset"
                        name="mode"
                        value="reset"
                        checked={mode === 'reset'}
                        onChange={() => setMode('reset')}
                    />
                    <label htmlFor="reset" style={{ marginLeft: 8 }}>Sıfırla ve Ekle (Eskileri sil, yeniden oluştur)</label>
                </div>
                <p style={{ fontSize: 12, color: '#666', marginTop: 5 }}>
                    * "Sıfırla ve Ekle" seçeneği ürünlerin puanını tamamen yeniler ve yükseltir.
                </p>
            </div>

            <button
                onClick={handleAddReviews}
                disabled={isProcessing}
                style={{
                    padding: '15px 30px',
                    background: isProcessing ? 'gray' : (mode === 'reset' ? '#d9534f' : '#0275d8'),
                    color: 'white',
                    fontSize: 18,
                    cursor: isProcessing ? 'default' : 'pointer',
                    border: 'none',
                    borderRadius: 4
                }}
            >
                {isProcessing ? 'PROCESSING...' : (mode === 'reset' ? 'RESET & GENERATE (5 STARS)' : 'ADD MORE REVIEWS')}
            </button>
            <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
                {status}
            </div>
        </div>
    );
};

export default BulkReviewsPage;
