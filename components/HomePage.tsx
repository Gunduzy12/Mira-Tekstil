"use client";

import React from 'react';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';
import { ChevronRightIcon } from '../components/Icons';
import { getProductUrl } from '../data/seoCategories';
import Image from 'next/image';

const HomePage: React.FC = () => {
    const { products } = useProducts();

    return (
        <div className="bg-brand-bg text-brand-primary">
            {/* Hero Section */}
            <header className="relative h-[75vh] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('https://imgur.com/RHzDAQB.png')" }} role="banner">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white pt-10">

                    <div className="relative group cursor-default mb-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-secondary/20 to-brand-light/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative px-8 py-3 bg-black/40 backdrop-blur-md rounded-full border border-brand-secondary/30 ring-1 ring-white/10 shadow-2xl flex items-center justify-center">
                            <span className="text-brand-secondary font-serif tracking-[0.25em] text-xs md:text-sm font-bold uppercase drop-shadow-md">
                                MiraTekstil 2025 Perde Koleksiyonu
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold max-w-5xl leading-tight drop-shadow-2xl tracking-tight mb-6">
                        Evinizin Işıltısı,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Perde Modelleri</span>
                    </h1>
                    <p className="mt-4 max-w-xl text-lg md:text-xl font-medium text-gray-200 drop-shadow-lg leading-relaxed">
                        Salonunuzdan yatak odanıza, en şık tül, fon ve blackout perde seçenekleri ile yaşam alanlarınıza değer katın.
                    </p>

                    {/* Kategori CTA Linkleri */}
                    <div className="mt-10 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/perde/blackout-perde"
                            className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium py-2.5 px-6 rounded-full hover:bg-white hover:text-brand-primary transition-all duration-300 text-sm"
                            title="Blackout Perde Modelleri"
                        >
                            Blackout Perde
                        </Link>
                        <Link
                            href="/perde/saten-perde"
                            className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium py-2.5 px-6 rounded-full hover:bg-white hover:text-brand-primary transition-all duration-300 text-sm"
                            title="Saten Perde Modelleri"
                        >
                            Saten Perde
                        </Link>
                        <Link
                            href="/perde/tul-perde"
                            className="bg-white/10 backdrop-blur-sm text-white border border-white/20 font-medium py-2.5 px-6 rounded-full hover:bg-white hover:text-brand-primary transition-all duration-300 text-sm"
                            title="Tül Perde Modelleri"
                        >
                            Tül Perde
                        </Link>

                    </div>
                </div>
            </header>

            {/* Kategori Link Blokları (SEO İç Linkleme) */}
            <nav className="py-8 bg-white border-b border-brand-border" aria-label="Perde Kategorileri">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-lg font-serif text-brand-primary mb-4">Perde Kategorileri</h2>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/perde/blackout-perde"
                            className="px-4 py-2 bg-brand-bg border border-brand-border rounded-full text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                            title="Blackout Perde Modelleri ve Fiyatları"
                        >
                            Blackout Perde
                        </Link>
                        <Link
                            href="/perde/saten-perde"
                            className="px-4 py-2 bg-brand-bg border border-brand-border rounded-full text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                            title="Saten Perde Modelleri ve Fiyatları"
                        >
                            Saten Perde
                        </Link>
                        <Link
                            href="/perde/tul-perde"
                            className="px-4 py-2 bg-brand-bg border border-brand-border rounded-full text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                            title="Tül Perde Modelleri ve Fiyatları"
                        >
                            Tül Perde
                        </Link>
                        <Link
                            href="/perde/ozel-olcu-perde"
                            className="px-4 py-2 bg-brand-bg border border-brand-border rounded-full text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                            title="Özel Ölçü Perde Dikimi"
                        >
                            Özel Ölçü Perde
                        </Link>
                        <Link
                            href="/ev-tekstili/yastik-kilifi"
                            className="px-4 py-2 bg-brand-bg border border-brand-border rounded-full text-sm font-medium text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
                            title="Dekoratif Yastık Kılıfı Modelleri"
                        >
                            Yastık Kılıfı
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Tüm Ürünler Grid */}
            <section className="py-10 md:py-14" aria-labelledby="all-products-title">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-6 border-b border-brand-border pb-3">
                        <h2 id="all-products-title" className="text-xl md:text-2xl font-serif text-brand-primary">Tüm Ürünler</h2>
                        <span className="text-xs text-gray-500">{products.length} ürün</span>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                            {products.map((product, index) => (
                                <Link
                                    key={product.id}
                                    href={getProductUrl(product.name, product.id, product.category, product.slug, product.categorySlug, product.parentSlug)}
                                    className="group block bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                                >
                                    {/* Ürün Görseli */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            priority={index < 4}
                                        />
                                        {/* İndirim Badge */}
                                        {product.originalPrice && product.originalPrice > product.priceFrom && (
                                            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                %{Math.round(((product.originalPrice - product.priceFrom) / product.originalPrice) * 100)}
                                            </div>
                                        )}
                                        {product.isFeatured && (
                                            <div className="absolute top-1.5 right-1.5 bg-brand-secondary text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                Öne Çıkan
                                            </div>
                                        )}
                                    </div>

                                    {/* Ürün Bilgileri */}
                                    <div className="p-2 md:p-3">
                                        <p className="text-[10px] md:text-xs text-gray-400 mb-0.5 truncate">{product.brand}</p>
                                        <h3 className="font-serif text-xs md:text-sm font-medium text-brand-primary group-hover:text-brand-secondary transition-colors line-clamp-2 leading-snug mb-1.5">
                                            {product.name}
                                        </h3>
                                        {/* Yıldız */}
                                        {product.averageRating > 0 && (
                                            <div className="flex items-center gap-0.5 mb-1.5">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.averageRating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-[9px] md:text-[10px] text-gray-400">({product.reviewCount || 0})</span>
                                            </div>
                                        )}
                                        {/* Fiyat */}
                                        <div className="flex items-baseline gap-1 flex-wrap">
                                            <span className="font-semibold text-sm md:text-base text-brand-primary">
                                                {product.priceFrom.toFixed(2)} TL
                                            </span>
                                            {product.originalPrice && product.originalPrice > product.priceFrom && (
                                                <span className="text-[10px] md:text-xs text-gray-400 line-through">
                                                    {product.originalPrice.toFixed(2)} TL
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="animate-pulse">
                                <div className="grid grid-cols-2 gap-3 md:gap-5">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="bg-white rounded-md border border-gray-200 overflow-hidden">
                                            <div className="aspect-[3/4] bg-gray-200"></div>
                                            <div className="p-2 space-y-1.5">
                                                <div className="h-2.5 bg-gray-200 rounded w-1/3"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* SEO Content Block - 500 Kelime */}
            <section className="bg-white py-16 border-t border-brand-border">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-2xl md:text-3xl font-serif text-brand-primary mb-8 text-center">Perde Seçim Rehberi: Evinize En Uygun Perdeyi Bulun</h2>

                    <div className="text-gray-600 leading-relaxed space-y-6">
                        <p>
                            Evinizin dekorasyonunu tamamlayan en önemli unsurlardan biri olan <strong>perde</strong>, hem estetik hem de fonksiyonel bir görev üstlenir. Doğru perde seçimi, odanızın atmosferini tamamen değiştirebilir. Işık kontrolünden gürültü yalıtımına, mahremiyetten enerji tasarrufuna kadar birçok faydası bulunan perdeler, yaşam alanlarınızın vazgeçilmez aksesuarlarıdır.
                        </p>

                        <h3 className="text-xl font-serif text-brand-primary mt-8">Hangi Oda İçin Hangi Perde?</h3>
                        <p>
                            <strong>Yatak odası</strong> için <strong>karartma blackout perde</strong> en ideal seçimdir. Güneş ışığını tamamen keserek kaliteli uyku ortamı sağlar. Özellikle güneye bakan yatak odalarında <strong>güneş geçirmeyen perde</strong> modelleri tercih edilmelidir. Bebek ve çocuk odalarında da gündüz uykusu için blackout perde şarttır.
                        </p>
                        <p>
                            <strong>Salon</strong> ve oturma odaları için <strong>parlak saten perde</strong> modelleri zarif bir tercihdir. Saten kumaşın doğal parlaklığı, ışıkla buluştuğunda odanıza sofistike bir ambiyans yaratır. <strong>Salon için saten perde</strong> seçerken mobilya ve duvar renkleriyle uyumu gözetmelisiniz.
                        </p>
                        <p>
                            <strong>Tül perde</strong>, her odada kullanılabilen çok yönlü bir perde türüdür. <strong>Sade tül perde modeli</strong> arayanlar için düz beyaz ve krem tonları en popüler seçimlerdir. Özellikle <strong>salon için tül perde</strong> tercih edilirken fon perde ile birlikte kullanmak hem estetik hem de işlevsel açıdan en doğru kombinasyondur.
                        </p>

                        <h3 className="text-xl font-serif text-brand-primary mt-8">Özel Ölçü Perde Avantajı</h3>
                        <p>
                            Her pencerenin boyutu farklıdır ve standart ölçüler her zaman uyum sağlamaz. <strong>Özel ölçü tül perde dikimi</strong> ve <strong>özel dikim saten perde</strong> hizmetimiz sayesinde pencerelerinize birebir oturan, kusursuz perdeler elde edebilirsiniz. Özel ölçü perde, hem estetik açıdan hem de ışık sızmasını önleme konusunda büyük avantaj sağlar.
                        </p>

                        <h3 className="text-xl font-serif text-brand-primary mt-8">Çocuk Odası Dekorasyonu</h3>
                        <p>
                            Çocuk odası dekorasyonunda <strong>bebek cibinlik modeli</strong> ve <strong>çocuk odası cibinlik</strong> ürünleri hem dekoratif hem de fonksiyonel bir çözüm sunar. <strong>Dekoratif cibinlik tül</strong> modelleri, bebeğinizin yatağı üzerine yerleştirilerek masalsı bir ortam yaratır ve böceklere karşı koruma sağlar.
                        </p>

                        <h3 className="text-xl font-serif text-brand-primary mt-8">Ev Tekstili ile Tamamlayın</h3>
                        <p>
                            Perdelerinizi <strong>dekoratif yastık kılıfı</strong> ve diğer ev tekstili ürünleri ile tamamlayabilirsiniz. <strong>Salon yastık kılıfı</strong> ve <strong>modern yastık kılıfı modeli</strong> seçeneklerimiz ile yaşam alanlarınıza renk ve sıcaklık katın. MiraTekstil olarak birinci sınıf kumaşlar ve özenli dikiş işçiliği ile en kaliteli ürünleri sunuyoruz.
                        </p>

                        <p>
                            Perde ve ev tekstili ihtiyaçlarınız için MiraTekstil koleksiyonumuzu keşfedin. 500 TL üzeri siparişlerde <strong>ücretsiz kargo</strong>, kolay iade ve güvenli ödeme seçenekleri ile alışveriş keyfinizi yaşayın.
                        </p>
                    </div>
                </div>
            </section>

            {/* Promo Section */}
            <section className="bg-brand-primary text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">Evinizi Yenilemeye Hazır Mısınız?</h2>
                    <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto font-light text-gray-300">Yeni sezon ürünlerimizde geçerli %20 indirim fırsatını kaçırmayın. Sınırlı süre için geçerlidir.</p>
                    <Link
                        href="/perde"
                        className="bg-brand-secondary text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-brand-primary transition-all duration-300 shadow-xl transform hover:scale-105 border border-transparent hover:border-white inline-block"
                        title="Perde Koleksiyonunu Keşfet"
                    >
                        Koleksiyonu Keşfet
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
