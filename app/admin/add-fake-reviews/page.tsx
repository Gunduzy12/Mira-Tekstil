import Link from 'next/link';

export default function RetiredReviewGeneratorPage() {
    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-4">Otomatik yorum üretimi kapatıldı</h1>
            <p className="text-gray-600 mb-6">Ürün değerlendirmeleri gerçek müşteri deneyimine dayanmalıdır. Bu sayfa artık ürünlere yorum, puan veya değerlendirme sayısı yazmaz. Mevcut ürün verileri değiştirilmemiştir.</p>
            <Link href="/admin" className="underline">Yönetim paneline dön</Link>
        </div>
    );
}
