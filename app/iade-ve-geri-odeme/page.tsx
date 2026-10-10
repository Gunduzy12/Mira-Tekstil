import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'İade ve Geri Ödeme Politikası | MiraTekstil',
    description: 'MiraTekstil standart ve özel ölçü ürünlerinde iade koşulları, ücretsiz iade gönderimi, başvuru ve geri ödeme bilgileri.',
    alternates: { canonical: '/iade-ve-geri-odeme' },
};

export default function ReturnPolicyPage() {
    return (
        <article className="container mx-auto max-w-4xl px-6 py-12 text-brand-dark">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-primary mb-4">İade ve Geri Ödeme Politikası</h1>
            <p className="text-gray-600 mb-8">Bu politika MiraTekstil web sitesinden Türkiye içinde verilen siparişler için geçerlidir. Politikayı okumak veya e-posta ile iade bildirimi yapmak için üyelik gerekmez.</p>

            <div className="space-y-8 leading-relaxed">
                <section aria-labelledby="standard-returns">
                    <h2 id="standard-returns" className="text-xl font-semibold mb-3">Standart ürünlerde iade</h2>
                    <p>Size özel üretilmemiş standart ürünlerde, teslim aldığınız tarihten itibaren 14 gün içinde gerekçe göstermeden cayma bildirimi yapabilirsiniz. Ürünü kontrol etmek için gereken olağan inceleme, tek başına iade hakkını ortadan kaldırmaz. Bildirimin ardından ürünü yasal geri gönderim süresi içinde, taşıma sırasında zarar görmeyecek şekilde paketleyerek gönderin.</p>
                </section>

                <section aria-labelledby="custom-returns">
                    <h2 id="custom-returns" className="text-xl font-semibold mb-3">Özel ölçü ve kişiye özel dikim ürünler</h2>
                    <p>İsteğiniz veya kişisel ihtiyaçlarınız doğrultusunda size özel ölçüde kesilen ya da dikilen ürünler, standart cayma hakkının istisnasıdır. Yalnızca katalogdaki hazır ölçü veya renklerden birini seçmeniz, ürünü kendiliğinden kişiye özel üretim yapmaz. Hatalı üretim, siparişten farklı ürün veya ayıplı ürün durumlarında yasal haklarınız saklıdır; inceleme ve çözüm için bize ulaşabilirsiniz.</p>
                </section>

                <section aria-labelledby="return-request">
                    <h2 id="return-request" className="text-xl font-semibold mb-3">İade bildirimi nasıl yapılır?</h2>
                    <p>Sipariş numaranızı ve iade etmek istediğiniz ürünleri <a href="mailto:yilmazbaris814@gmail.com" className="underline text-brand-primary">yilmazbaris814@gmail.com</a> adresine yazabilirsiniz. Cayma hakkı kapsamındaki başvurularda gerekçe belirtmeniz zorunlu değildir. Siparişle ilgili destek için <a href="tel:+905374009410" className="underline text-brand-primary">0537 400 94 10</a> numarasından veya <a href="https://wa.me/905374009410" className="underline text-brand-primary" target="_blank" rel="noopener noreferrer">WhatsApp</a> üzerinden de ulaşabilirsiniz. Hesabınız varsa Siparişlerim bölümündeki iade talebi ekranını da kullanabilirsiniz.</p>
                    <p className="mt-3">Gönderim için iade kodu ve teslim adresi tarafınıza iletilir. İade kodunun hazırlanması, süresi içinde yaptığınız cayma bildirimini geçersiz kılmaz.</p>
                </section>

                <section aria-labelledby="return-shipping">
                    <h2 id="return-shipping" className="text-xl font-semibold mb-3">İade kargosu ve ücretler</h2>
                    <p>İade kapsamındaki ürünler için tarafımızdan sağlanan iade kodu ile gönderim ücretsizdir; ayrıca iade işlem veya yeniden stoklama ücreti alınmaz. Kodu ve gönderim bilgilerini aldıktan sonra ürünü belirtilen taşıyıcıya teslim edin. Farklı bir taşıyıcı kullanmak isterseniz gönderimden önce bize ulaşın. Ayıplı veya yanlış gönderilmiş ürünlerin iadesinde tüketiciye masraf yüklenmez.</p>
                </section>

                <section aria-labelledby="refunds">
                    <h2 id="refunds" className="text-xl font-semibold mb-3">Geri ödeme</h2>
                    <p>Cayma hakkı kapsamındaki geri ödeme, cayma bildiriminizin bize ulaşmasından itibaren en geç 14 gün içinde yapılır. İade edilen ürünlerin bedeli ve mevzuat gereği iade edilmesi gereken teslimat bedelleri, satın alırken kullandığınız ödeme aracına uygun şekilde, ek işlem ücreti alınmadan geri ödenir. Kartınıza veya hesabınıza yansıma süresi bankanızın işlem sürecine bağlıdır. Ayıplı ürün başvurularında ilgili yasal haklar ve süreler geçerlidir.</p>
                </section>

                <section aria-labelledby="contact">
                    <h2 id="contact" className="text-xl font-semibold mb-3">İletişim ve yasal haklar</h2>
                    <p>İade, değişim ve geri ödeme sorularınız için <Link href="/contact" className="underline text-brand-primary">iletişim sayfamızdan</Link> bize ulaşabilirsiniz. Bu politika tüketicinin yürürlükteki mevzuattan doğan haklarını sınırlandırmaz.</p>
                </section>
            </div>
        </article>
    );
}
