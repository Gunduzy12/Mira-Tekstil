import type { Metadata } from 'next';
import Link from 'next/link';
import { ORDER_FREE_SHIPPING_THRESHOLD as FREE_SHIPPING_THRESHOLD, ORDER_STANDARD_SHIPPING_COST as STANDARD_SHIPPING_COST } from '@/utils/orderShipping';

export const metadata: Metadata = {
    title: 'Kargo ve Teslimat Bilgileri | MiraTekstil',
    description: `MiraTekstil kargo ücreti, ${FREE_SHIPPING_THRESHOLD} TL üzeri ücretsiz kargo, teslimat süresi, kargo takibi ve özel ölçü ürünlerde hazırlık süreci hakkında bilgi alın.`,
    alternates: { canonical: '/kargo-ve-teslimat' },
};

export default function ShippingPage() {
    return (
        <article className="container mx-auto max-w-4xl px-6 py-12 text-brand-dark">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-primary mb-4">Kargo ve Teslimat Bilgileri</h1>
            <p className="text-gray-600 mb-8">Bu sayfa MiraTekstil web sitesinden Türkiye içinde verilen siparişlerin kargo ücretini, teslimat sürecini ve kargo takibini açıklar. Sayfayı okumak için üyelik gerekmez.</p>

            <div className="space-y-8 leading-relaxed">
                <section aria-labelledby="shipping-cost">
                    <h2 id="shipping-cost" className="text-xl font-semibold mb-3">Kargo ücreti</h2>
                    <p>{FREE_SHIPPING_THRESHOLD} TL üzerindeki siparişlerde kargo ücretsizdir. Sipariş tutarı {FREE_SHIPPING_THRESHOLD} TL ve altındaysa kargo ücreti {STANDARD_SHIPPING_COST} TL&apos;dir. Kargo ücreti, ödeme adımında sipariş özetinde ayrıca gösterilir.</p>
                </section>

                <section aria-labelledby="delivery-time">
                    <h2 id="delivery-time" className="text-xl font-semibold mb-3">Teslimat süresi</h2>
                    <p>Siparişleriniz genellikle 1-3 iş günü içerisinde kargoya teslim edilir. Özel ölçü ürünler siparişinize göre hazırlandığı için hazırlık süresi modele ve sipariş yoğunluğuna göre değişebilir; güncel süre için sipariş öncesinde bize ulaşabilirsiniz. Kargo şirketinin teslimat süresi gönderi adresine göre ayrıca değişebilir.</p>
                </section>

                <section aria-labelledby="delivery-area">
                    <h2 id="delivery-area" className="text-xl font-semibold mb-3">Teslimat bölgesi</h2>
                    <p>Siparişler Türkiye içindeki adreslere gönderilir.</p>
                </section>

                <section aria-labelledby="tracking">
                    <h2 id="tracking" className="text-xl font-semibold mb-3">Kargo takibi</h2>
                    <p>Siparişiniz kargoya verildiğinde kargo takip numarası e-posta adresinize gönderilir. Siparişinizin durumunu <Link href="/order-tracking" className="underline text-brand-primary">sipariş takip sayfasından</Link> da kontrol edebilirsiniz.</p>
                </section>

                <section aria-labelledby="receiving">
                    <h2 id="receiving" className="text-xl font-semibold mb-3">Teslim alırken</h2>
                    <p>Paketi teslim alırken kargo görevlisinin yanında dış ambalajı kontrol etmenizi öneririz. Pakette hasar görürseniz kargo görevlisine tutanak tutturup bize hemen bildirin. Eksik veya yanlış ürün durumunda da sipariş numaranızla bize ulaşın.</p>
                </section>

                <section aria-labelledby="returns-link">
                    <h2 id="returns-link" className="text-xl font-semibold mb-3">İade ve değişim</h2>
                    <p>İade ve geri ödeme koşulları için <Link href="/iade-ve-geri-odeme" className="underline text-brand-primary">İade ve Geri Ödeme Politikası</Link> sayfamıza bakabilirsiniz. İade etiketi pakete dahildir.</p>
                </section>

                <section aria-labelledby="shipping-contact">
                    <h2 id="shipping-contact" className="text-xl font-semibold mb-3">İletişim</h2>
                    <p>Kargo ve teslimatla ilgili sorularınız için <Link href="/contact" className="underline text-brand-primary">iletişim sayfamızdan</Link>, <a href="tel:+905374009410" className="underline text-brand-primary">0537 400 94 10</a> numarasından veya <a href="https://wa.me/905374009410" className="underline text-brand-primary" target="_blank" rel="noopener noreferrer">WhatsApp</a> üzerinden bize ulaşabilirsiniz.</p>
                </section>
            </div>
        </article>
    );
}
