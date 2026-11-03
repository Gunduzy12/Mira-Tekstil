import type { Metadata } from 'next';
import Link from 'next/link';
import { BUSINESS_INFO } from '@/data/businessInfo';
import { ORDER_FREE_SHIPPING_THRESHOLD as FREE_SHIPPING_THRESHOLD, ORDER_STANDARD_SHIPPING_COST as STANDARD_SHIPPING_COST } from '@/utils/orderShipping';

export const metadata: Metadata = {
    title: 'Mesafeli Satış Sözleşmesi | MiraTekstil',
    description: 'MiraTekstil web sitesinden verilen siparişlere uygulanan mesafeli satış sözleşmesi: taraflar, ödeme, teslimat, 14 gün cayma hakkı ve uyuşmazlık çözümü.',
    alternates: { canonical: '/mesafeli-satis-sozlesmesi' },
};

const b = BUSINESS_INFO;

export default function DistanceSalesContractPage() {
    return (
        <article className="container mx-auto max-w-4xl px-6 py-12 text-brand-dark">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-primary mb-4">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-gray-600 mb-8">Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, MiraTekstil web sitesi üzerinden Türkiye içinde verilen siparişlere uygulanır. Sözleşmeyi okumak için üyelik gerekmez.</p>

            <div className="space-y-8 leading-relaxed">
                <section aria-labelledby="parties">
                    <h2 id="parties" className="text-xl font-semibold mb-3">1. Taraflar</h2>
                    <p className="font-semibold">Satıcı</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>Unvan: {b.sellerName} ({b.businessType}) – {b.brandName}</li>
                        <li>Vergi dairesi / Vergi kimlik no: {b.taxOffice} / {b.taxId}</li>
                        <li>Adres: {b.streetAddress}, {b.postalCode} {b.district}/{b.province}, {b.country}</li>
                        <li>Telefon: <a href="tel:+905374009410" className="underline text-brand-primary">0537 400 94 10</a></li>
                        <li>E-posta: <a href="mailto:yilmazbaris814@gmail.com" className="underline text-brand-primary">yilmazbaris814@gmail.com</a></li>
                    </ul>
                    <p className="font-semibold">Alıcı</p>
                    <p>Siparişi veren kişidir. Alıcının adı, teslimat ve fatura adresi, telefon ve e-posta bilgileri sipariş sırasında girdiği bilgilerdir.</p>
                </section>

                <section aria-labelledby="subject">
                    <h2 id="subject" className="text-xl font-semibold mb-3">2. Sözleşmenin konusu</h2>
                    <p>Sözleşmenin konusu, alıcının web sitesi üzerinden elektronik ortamda sipariş verdiği ürünlerin satışı ve teslimidir. Ürünlerin adı, rengi, ölçüsü, adedi, KDV dahil satış fiyatı, kargo ücreti ve toplam tutar ödeme adımındaki sipariş özetinde gösterilir ve bu sözleşmenin ayrılmaz parçasıdır. Alıcı, siparişi onaylamadan önce <Link href="/on-bilgilendirme-formu" className="underline text-brand-primary">Ön Bilgilendirme Formu</Link>&apos;nu okuduğunu kabul eder.</p>
                </section>

                <section aria-labelledby="price-payment">
                    <h2 id="price-payment" className="text-xl font-semibold mb-3">3. Fiyat ve ödeme</h2>
                    <p>Sitede gösterilen fiyatlar Türk lirası cinsindendir ve KDV dahildir. Özel ölçü ürünlerde fiyat, seçilen en ölçüsüne göre hesaplanır ve sepete eklemeden önce ürün sayfasında gösterilir. Ödeme, PayTR güvenli ödeme altyapısı üzerinden kredi veya banka kartı ile tek çekim olarak alınır; kart bilgileri satıcı tarafından görülmez veya saklanmaz.</p>
                </section>

                <section aria-labelledby="delivery">
                    <h2 id="delivery" className="text-xl font-semibold mb-3">4. Teslimat</h2>
                    <p>Ürünler, alıcının sipariş sırasında belirttiği Türkiye içindeki adrese kargo ile gönderilir. {FREE_SHIPPING_THRESHOLD} TL üzerindeki siparişlerde kargo ücretsizdir; diğer siparişlerde kargo ücreti {STANDARD_SHIPPING_COST} TL&apos;dir ve alıcıya aittir. Siparişler genellikle 1-3 iş günü içinde kargoya verilir; özel ölçü ürünlerde hazırlık süresi uzayabilir. Teslimat, her durumda siparişin verildiği tarihten itibaren yasal üst sınır olan 30 gün içinde yapılır. Ayrıntılar için <Link href="/kargo-ve-teslimat" className="underline text-brand-primary">Kargo ve Teslimat</Link> sayfasına bakabilirsiniz.</p>
                </section>

                <section aria-labelledby="withdrawal">
                    <h2 id="withdrawal" className="text-xl font-semibold mb-3">5. Cayma hakkı</h2>
                    <p>Alıcı, özel ölçüde dikilen perdeler dahil tüm ürünlerde, ürünü teslim aldığı tarihten itibaren 14 gün içinde hiçbir gerekçe göstermeden ve cezai şart ödemeden cayma hakkını kullanabilir. Cayma bildirimi <a href="mailto:yilmazbaris814@gmail.com" className="underline text-brand-primary">yilmazbaris814@gmail.com</a> adresine, telefonla veya WhatsApp üzerinden yapılabilir. İade gönderimi, satıcının ilettiği iade kodu veya etiketi ile ücretsizdir. Satıcı, ürünün kendisine ulaşmasından itibaren 7 gün içinde ürün bedelini ve varsa teslimat bedelini, alıcının ödeme yaptığı araca ek ücret almadan iade eder. Ayrıntılar <Link href="/iade-ve-geri-odeme" className="underline text-brand-primary">İade ve Geri Ödeme Politikası</Link> sayfasındadır.</p>
                </section>

                <section aria-labelledby="defects">
                    <h2 id="defects" className="text-xl font-semibold mb-3">6. Ayıplı veya hatalı ürün</h2>
                    <p>Ürün ayıplı, hasarlı veya siparişten farklı gönderilmişse alıcı, 6502 sayılı Kanun&apos;daki seçimlik haklarını (bedel iadesi, ücretsiz onarım, misliyle değişim veya ayıp oranında indirim) kullanabilir. Bu durumlarda iade ve gönderim masrafları satıcıya aittir.</p>
                </section>

                <section aria-labelledby="disputes">
                    <h2 id="disputes" className="text-xl font-semibold mb-3">7. Şikâyet ve uyuşmazlık çözümü</h2>
                    <p>Şikâyetlerinizi öncelikle yukarıdaki iletişim bilgilerinden bize iletebilirsiniz. Uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca her yıl belirlenen parasal sınırlar dahilinde alıcının yerleşim yerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyeti, bu sınırların üzerindeki uyuşmazlıklarda Tüketici Mahkemesi yetkilidir.</p>
                </section>

                <section aria-labelledby="effect">
                    <h2 id="effect" className="text-xl font-semibold mb-3">8. Yürürlük</h2>
                    <p>Alıcı, ödeme adımında bu sözleşmeyi ve Ön Bilgilendirme Formu&apos;nu okuduğunu onaylayıp ödemeyi tamamladığında sözleşme kurulmuş olur. Sözleşme, tüketicinin yürürlükteki mevzuattan doğan haklarını sınırlandırmaz.</p>
                </section>
            </div>
        </article>
    );
}
