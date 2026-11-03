import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_INFO } from '@/data/businessInfo';
import { ORDER_FREE_SHIPPING_THRESHOLD as FREE_SHIPPING_THRESHOLD, ORDER_STANDARD_SHIPPING_COST as STANDARD_SHIPPING_COST } from '@/utils/orderShipping';

export const metadata: Metadata = {
    title: 'Ön Bilgilendirme Formu | MiraTekstil',
    description: 'MiraTekstil siparişleri öncesinde satıcı bilgileri, fiyat, ödeme, teslimat, 14 gün cayma hakkı ve şikâyet yolları hakkında ön bilgilendirme.',
    alternates: { canonical: '/on-bilgilendirme-formu' },
};

const b = BUSINESS_INFO;

export default function PreInformationFormPage() {
    return (
        <article className="container mx-auto max-w-4xl px-6 py-12 text-brand-dark">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-primary mb-4">Ön Bilgilendirme Formu</h1>
            <p className="text-gray-600 mb-8">Bu form, Mesafeli Sözleşmeler Yönetmeliği uyarınca siparişinizi onaylamadan önce bilmeniz gerekenleri özetler. Siparişinize özel ürün, adet ve tutar bilgileri ödeme adımındaki sipariş özetinde gösterilir.</p>

            <div className="space-y-8 leading-relaxed">
                <section aria-labelledby="seller">
                    <h2 id="seller" className="text-xl font-semibold mb-3">Satıcı bilgileri</h2>
                    <ul className="list-disc list-inside">
                        <li>Unvan: {b.sellerName} ({b.businessType}) – {b.brandName}</li>
                        <li>Vergi dairesi / Vergi kimlik no: {b.taxOffice} / {b.taxId}</li>
                        <li>Adres: {b.streetAddress}, {b.postalCode} {b.district}/{b.province}, {b.country}</li>
                        <li>Telefon: <a href="tel:+905374009410" className="underline text-brand-primary">0537 400 94 10</a> · E-posta: <a href="mailto:yilmazbaris814@gmail.com" className="underline text-brand-primary">yilmazbaris814@gmail.com</a></li>
                    </ul>
                </section>

                <section aria-labelledby="product">
                    <h2 id="product" className="text-xl font-semibold mb-3">Ürünün temel nitelikleri ve fiyatı</h2>
                    <p>Ürünlerin kumaş, renk, ölçü ve diğer özellikleri ürün sayfalarında yer alır. Fiyatlar Türk lirası cinsindendir ve KDV dahildir. Özel ölçü ürünlerde fiyat seçilen en ölçüsüne göre hesaplanır. Ürünlerin adı, adedi, birim ve toplam fiyatı ile kargo ücreti ödeme adımındaki sipariş özetinde gösterilir.</p>
                </section>

                <section aria-labelledby="payment">
                    <h2 id="payment" className="text-xl font-semibold mb-3">Ödeme</h2>
                    <p>Ödeme, PayTR güvenli ödeme altyapısı üzerinden kredi veya banka kartı ile tek çekim olarak alınır.</p>
                </section>

                <section aria-labelledby="delivery">
                    <h2 id="delivery" className="text-xl font-semibold mb-3">Teslimat</h2>
                    <p>{FREE_SHIPPING_THRESHOLD} TL üzerindeki siparişlerde kargo ücretsizdir; diğer siparişlerde kargo ücreti {STANDARD_SHIPPING_COST} TL&apos;dir. Siparişler genellikle 1-3 iş günü içinde kargoya verilir ve en geç 30 gün içinde teslim edilir. Ayrıntılar: <Link href="/kargo-ve-teslimat" className="underline text-brand-primary">Kargo ve Teslimat</Link>.</p>
                </section>

                <section aria-labelledby="withdrawal">
                    <h2 id="withdrawal" className="text-xl font-semibold mb-3">Cayma hakkı</h2>
                    <p>Özel ölçüde dikilen perdeler dahil tüm ürünlerde, teslimden itibaren 14 gün içinde gerekçe göstermeden cayma hakkınızı kullanabilirsiniz. Cayma bildirimini e-posta, telefon veya WhatsApp ile yapabilirsiniz; iade gönderimi satıcının ilettiği kod veya etiketle ücretsizdir. Ürün bize ulaştıktan sonra 7 gün içinde ödemeniz ek ücret alınmadan iade edilir. Ayrıntılar: <Link href="/iade-ve-geri-odeme" className="underline text-brand-primary">İade ve Geri Ödeme Politikası</Link>.</p>
                </section>

                <section aria-labelledby="complaints">
                    <h2 id="complaints" className="text-xl font-semibold mb-3">Şikâyet ve başvuru yolları</h2>
                    <p>Şikâyetlerinizi yukarıdaki iletişim bilgilerinden bize iletebilirsiniz. Uyuşmazlık halinde, Ticaret Bakanlığı&apos;nca belirlenen parasal sınırlar dahilinde Tüketici Hakem Heyeti&apos;ne, bu sınırların üzerinde Tüketici Mahkemesi&apos;ne başvurabilirsiniz.</p>
                </section>

                <section aria-labelledby="contract">
                    <h2 id="contract" className="text-xl font-semibold mb-3">Sözleşme</h2>
                    <p>Siparişiniz <Link href="/mesafeli-satis-sozlesmesi" className="underline text-brand-primary">Mesafeli Satış Sözleşmesi</Link> hükümlerine tabidir.</p>
                </section>
            </div>
        </article>
    );
}
