import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Hakkımızda | MiraTekstil',
    description: 'MiraTekstil\'in perde ve ev tekstili koleksiyonunu, özel ölçü yaklaşımını ve müşteri destek anlayışını yakından tanıyın.',
    alternates: {
        canonical: '/about',
    },
};

export default function AboutPage() {
    return (
        <div className="bg-brand-bg">
            {/* Hero Section */}
            <section className="relative h-[50vh] overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1600"
                    alt="Perde ve ev tekstiliyle dekore edilmiş modern yaşam alanı"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 drop-shadow-md">Hakkımızda - MiraTekstil</h1>
                    <p className="text-lg md:text-xl max-w-2xl text-gray-200 drop-shadow-sm">Evinize Zarafet, Hayatınıza Konfor Katıyoruz.</p>
                </div>
            </section>

            <article className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-serif text-brand-primary mb-6">Kalite ve Estetiğin Buluşma Noktası</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            <strong className="text-brand-primary">MiraTekstil</strong>, farklı yaşam alanlarının ışık kontrolü ve dekorasyon ihtiyaçlarına uygun perde ve ev tekstili seçeneklerini bir araya getirir. Amacımız, ürün bilgilerini anlaşılır biçimde sunarak müşterilerimizin ölçü, kumaş ve renk kararını güvenle verebilmesini sağlamaktır.
                        </p>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Blackout, tül ve saten perde seçeneklerinin yanında pencereye göre hazırlanabilen özel ölçü çözümleri sunuyoruz. Her ürün sayfasında ölçü, renk, fiyat ve bakım ayrıntılarını mümkün olduğunca açık paylaşmaya önem veriyoruz.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Sipariş öncesinde ürün veya ölçü konusunda yardıma ihtiyaç duyduğunuzda iletişim kanallarımız üzerinden bize ulaşabilirsiniz. Satış sonrasında da sipariş ve kargo sürecinizle ilgili sorularınızı yanıtlamaya devam ediyoruz.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative min-h-80 translate-y-8 overflow-hidden rounded-lg shadow-lg">
                            <Image src="https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&q=80&w=800" alt="Perde kumaşı dokusu" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="relative min-h-80 overflow-hidden rounded-lg shadow-lg">
                            <Image src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=800" alt="Tekstil kumaşı ve tasarım ayrıntıları" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </article>

            {/* Values Section */}
            <section className="bg-brand-light py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif text-brand-primary">Neden MiraTekstil?</h2>
                        <p className="text-gray-600 mt-3 text-lg">Bizi farklı kılan değerlerimiz ve kalite anlayışımız.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-brand-primary mb-3">Ölçüye Uygun Seçim</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Özel ölçü seçenekleri ve ölçü alma rehberleriyle pencerenize uygun perdeyi seçmenizi kolaylaştırıyoruz.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-brand-primary mb-3">Açık Ürün Bilgisi</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Fiyat, ölçü, renk, stok ve bakım bilgilerini ürün sayfalarında karşılaştırılabilir biçimde sunuyoruz.</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-brand-primary mb-3">Ulaşılabilir Destek</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Ürün seçimi, ölçü ve sipariş süreciyle ilgili sorularınız için iletişim kanallarımız üzerinden destek veriyoruz.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
