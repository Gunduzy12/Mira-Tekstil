"use client";

import React from 'react';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import CategoriesSection from '../components/CategoriesSection';
import { ChevronRightIcon } from '../components/Icons';

const HomePage: React.FC = () => {
    const { products } = useProducts();

    const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

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
                    <Link
                        href="/shop"
                        className="mt-12 group bg-white text-brand-primary font-bold py-4 px-12 rounded-full hover:bg-brand-secondary hover:text-white transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(191,160,128,0.3)] transform hover:-translate-y-1 inline-block"
                        aria-label="Tüm koleksiyonu incele"
                        title="Koleksiyonu Keşfet"
                    >
                        Koleksiyonu Keşfet
                    </Link>
                </div>
            </header>

            {/* Categories Section */}
            <CategoriesSection />

            {/* Featured Products Section */}
            <section className="bg-brand-bg py-24" aria-labelledby="featured-products-title">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-brand-border pb-6">
                        <div>
                            <h2 id="featured-products-title" className="text-3xl md:text-4xl font-serif text-brand-primary">Öne Çıkan Ürünler</h2>
                            <p className="text-brand-accent mt-2 text-lg">Müşterilerimizin en çok tercih ettiği, yüksek puanlı ev tekstili ürünleri.</p>
                        </div>
                        <Link
                            href="/shop"
                            className="hidden md:flex items-center font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                            title="Tüm Ürünleri Gör"
                        >
                            Tümünü Gör <ChevronRightIcon className="ml-1 w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onSelectProduct={() => { }} />
                        ))}
                        {featuredProducts.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                Henüz öne çıkan ürün eklenmemiş (Yükleniyor olabilir).
                            </div>
                        )}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link
                            href="/shop"
                            className="inline-flex items-center font-semibold text-brand-primary hover:text-brand-secondary transition-colors border border-brand-primary px-6 py-3 rounded-md"
                            title="Tüm Ürünleri Gör"
                        >
                            Tümünü Gör <ChevronRightIcon className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SEO Content Block - Keyword Boosting */}
            <section className="bg-white py-16 border-t border-brand-border">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-serif text-brand-primary mb-6">Neden MiraTekstil Perde Modelleri?</h2>
                    <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-lg">
                        Evinizin havasını değiştirecek en şık <strong>perde modelleri</strong> MiraTekstil'de.
                        Modern salonlarınız için <strong>zebra perde</strong> ve <strong>fon perde</strong> seçeneklerinden,
                        yatak odanızda tam karanlık sağlayan <strong>blackout (karartma) perde</strong> modellerine kadar geniş ürün yelpazemizi keşfedin.
                        Her pencereye uygun <strong>tül perde</strong> çeşitlerimiz ve uygun <strong>perde fiyatları</strong> ile dekorasyonunuzu tamamlayın.
                    </p>
                </div>
            </section>

            {/* Promo Section - BRAND PRIMARY THEME (Matches Footer) */}
            <section className="bg-brand-primary text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">Evinizi Yenilemeye Hazır Mısınız?</h2>
                    <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto font-light text-gray-300">Yeni sezon ürünlerimizde geçerli %20 indirim fırsatını kaçırmayın. Sınırlı süre için geçerlidir.</p>
                    <Link
                        href="/shop"
                        className="bg-brand-secondary text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-brand-primary transition-all duration-300 shadow-xl transform hover:scale-105 border border-transparent hover:border-white inline-block"
                        title="Alışverişe Başla"
                    >
                        Alışverişe Başla
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
