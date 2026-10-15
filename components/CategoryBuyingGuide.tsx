import Link from 'next/link';

export default function CategoryBuyingGuide({ categorySlug }: { categorySlug: string }) {
    const balcony = categorySlug === 'balkon-perdesi';
    const pillow = categorySlug === 'yastik-kilifi';
    if (pillow) return null;
    return (
        <aside className="mt-10 rounded-xl border border-brand-border bg-white p-6" aria-labelledby="buying-guide-title">
            <h2 id="buying-guide-title" className="text-xl font-serif text-brand-primary">Sipariş Öncesi Ölçü ve Seçim Rehberi</h2>
            <p className="mt-3 text-gray-600">En, boy, paket adedi ve bağlantı biçimini ürün detaylarıyla karşılaştırın. Listelenen başlangıç fiyatı, seçtiğiniz ölçünün fiyatından farklı olabilir; son fiyatı ürün sayfasında kontrol edin.</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm underline">
                <Link href={balcony ? '/blog/balkon-perdesi-olcusu-nasil-alinir' : '/blog/perde-olcusu-nasil-alinir'}>Ölçü alma rehberi</Link>
                {!balcony && <Link href="/blog/perde-pile-hesabi-nasil-yapilir">Pile hesabı ve örnekler</Link>}
                <Link href="/contact">Ölçü konusunda destek alın</Link>
            </div>
        </aside>
    );
}
