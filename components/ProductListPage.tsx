"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { ChevronDownIcon, ChevronUpIcon, SortIcon } from '../components/Icons';
import ListingProductCard from '../components/ListingProductCard';
import ProductSkeleton from './ProductSkeleton'; // 👈 YENİ: İskelet dosyasını import ettik
import { Product, Category } from '../types';

// Filtre Grupları Bileşeni
const FilterGroup: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-brand-border py-5">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left font-semibold text-brand-primary">
                <span>{title}</span>
                {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

// Ana İçerik Bileşeni
interface ProductListPageContentProps {
    initialProducts?: Product[];
    initialCategories?: Category[];
}

const ProductListPageContent: React.FC<ProductListPageContentProps> = ({ initialProducts, initialCategories }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { products: contextProducts } = useProducts();
    const { categories: contextCategories } = useCategories();

    const products = (initialProducts && initialProducts.length > 0) ? initialProducts : contextProducts;
    const categories = (initialCategories && initialCategories.length > 0) ? initialCategories : contextCategories;

    const initialCategory = searchParams.get('category') || 'Tümü';
    const initialSearchQuery = searchParams.get('q') || '';

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [sortOption, setSortOption] = useState<string>('featured');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // URL Parametrelerini State ile Eşle
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCategory(cat);
        else if (!searchParams.has('view')) setSelectedCategory('Tümü');
    }, [searchParams]);

    const updateUrl = (newCategory: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newCategory && newCategory !== 'Tümü') {
            params.set('category', newCategory);
        } else {
            params.delete('category');
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        updateUrl(category);
    };

    // Filtreleme ve Sıralama Mantığı
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Arama Sorgusu
        if (initialSearchQuery) {
            const query = initialSearchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query)
            );
        }

        // Kategori Filtresi
        if (selectedCategory !== 'Tümü') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Fiyat Filtresi
        result = result.filter(p => p.priceFrom >= priceRange[0] && p.priceFrom <= priceRange[1]);

        // Sıralama
        switch (sortOption) {
            case 'priceAsc':
                result.sort((a, b) => a.priceFrom - b.priceFrom);
                break;
            case 'priceDesc':
                result.sort((a, b) => b.priceFrom - a.priceFrom);
                break;
            case 'newest':
                result.sort((a, b) => (a.id > b.id ? -1 : 1));
                break;
            case 'rating':
                result.sort((a, b) => b.averageRating - a.averageRating);
                break;
            default: // featured
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
                break;
        }

        return result;
    }, [products, initialSearchQuery, selectedCategory, priceRange, sortOption]);

    const priceInputClass = "w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm text-center text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary shadow-sm placeholder-gray-400";

    return (
        <div className="bg-brand-bg min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-brand-primary">Mağaza</h1>
                        <p className="text-gray-500 mt-2">
                            {filteredProducts.length} ürün listeleniyor
                            {initialSearchQuery && <span className="font-semibold"> ("{initialSearchQuery}" için sonuçlar)</span>}
                            {selectedCategory !== 'Tümü' && !initialSearchQuery && <span className="font-semibold"> ({selectedCategory})</span>}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="w-full md:w-auto border border-brand-border bg-white rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                            aria-label="Sıralama Seçenekleri"
                        >
                            <option value="featured">Öne Çıkanlar</option>
                            <option value="priceAsc">Fiyat (Artan)</option>
                            <option value="priceDesc">Fiyat (Azalan)</option>
                            <option value="newest">En Yeniler</option>
                            <option value="rating">En Çok Değerlendirilenler</option>
                        </select>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Mobil Filtre Butonu */}
                    <button
                        className="lg:hidden flex items-center justify-center gap-2 w-full bg-white border border-brand-border rounded-lg py-3 text-brand-primary font-semibold shadow-sm hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    >
                        <SortIcon className="w-5 h-5" />
                        <span>Filtrele</span>
                        {isMobileFiltersOpen ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />}
                    </button>

                    {/* Sidebar Filtreleri */}
                    <aside className={`w-full lg:w-1/4 space-y-2 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
                        <FilterGroup title="Kategoriler">
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === 'Tümü'}
                                        onChange={() => handleCategoryChange('Tümü')}
                                        className="text-brand-secondary focus:ring-brand-secondary h-4 w-4 border-gray-300"
                                    />
                                    <span className="ml-3 text-sm text-gray-600">Tümü</span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat.id} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === cat.name}
                                            onChange={() => handleCategoryChange(cat.name)}
                                            className="text-brand-secondary focus:ring-brand-secondary h-4 w-4 border-gray-300"
                                        />
                                        <span className="ml-3 text-sm text-gray-600">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </FilterGroup>

                        <FilterGroup title="Fiyat Aralığı">
                            <div className="px-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span>{priceRange[0]} TL</span>
                                    <span>{priceRange[1]}+ TL</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
                                />
                                <div className="mt-4 flex gap-4">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        className={priceInputClass}
                                        placeholder="Min"
                                    />
                                    <span className="text-gray-400 self-center">-</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                                        className={priceInputClass}
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </FilterGroup>
                    </aside>

                    {/* Ürün Listesi Grid */}
                    <main className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                                {filteredProducts.map((product, index) => (
                                    <ListingProductCard
                                        key={product.id}
                                        product={product}
                                        index={index} /* 👈 KRİTİK: LCP için sıra numarası gönderiliyor */
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                                <p className="text-xl text-gray-500 font-serif">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                                <button
                                    onClick={() => {
                                        handleCategoryChange('Tümü');
                                        setPriceRange([0, 5000]);
                                        setSortOption('featured');
                                        router.push('/shop');
                                    }}
                                    className="mt-4 text-brand-secondary font-medium hover:underline"
                                >
                                    Filtreleri Temizle
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

// Ana Export: Suspense ve Skeleton ile sarmalanmış hali
const ProductListPage = ({ initialProducts, initialCategories }: { initialProducts?: Product[]; initialCategories?: Category[] }) => (
    <Suspense
        fallback={
            // 👈 Beyaz ekran yerine bu düzen yüklenecek (FCP Çözümü)
            <div className="bg-brand-bg min-h-screen">
                <div className="container mx-auto px-6 py-12">
                    {/* Başlık İskeleti */}
                    <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar İskeleti */}
                        <aside className="hidden lg:block w-1/4 space-y-4">
                            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                        </aside>

                        {/* Ürün Listesi İskeleti (Gri Kutular) */}
                        <main className="flex-1">
                            <ProductSkeleton />
                        </main>
                    </div>
                </div>
            </div>
        }
    >
        <ProductListPageContent initialProducts={initialProducts} initialCategories={initialCategories} />
    </Suspense>
);

export default ProductListPage;
