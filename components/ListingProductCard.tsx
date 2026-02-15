"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 👈 EKLENDİ
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartIcon, CartIcon, RulerIcon } from './Icons';
import StarRating from './StarRating';

import { createSlug } from '@/utils/slugify';

interface ListingProductCardProps {
  product: Product;
  index?: number; // 👈 EKLENDİ: LCP için sıra numarası lazım
}

const ListingProductCard: React.FC<ListingProductCardProps> = ({ product, index = -1 }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  // 🚀 PERFORMANS AYARI: İlk 4 ürün (0,1,2,3) hemen yüklensin (LCP Düşürücü)
  const isPriority = index !== -1 && index < 4;

  const hasVariants = product.variants.length > 1;
  const isOutOfStock = product.variants.every(v => v.stock === 0);

  // Fiyat Hesaplama
  const displayPrice = useMemo(() => {
    if (product.isCustomSize && product.pricePerSqM) {
      const minWidthMetric = (product.minWidth || 100) / 100; // cm to m
      return product.pricePerSqM * minWidthMetric;
    }
    return product.priceFrom;
  }, [product]);

  // İndirim Oranı
  const discountRate = product.originalPrice && product.originalPrice > displayPrice
    ? Math.round(((product.originalPrice - displayPrice) / product.originalPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants || product.isCustomSize) {
      // Varyant varsa detay sayfasına gitmesi için boş bırakıldı (Link çalışacak)
    } else {
      addToCart(product, product.variants[0], 1);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${createSlug(product.name, product.id)}`} className="block h-full">

        {/* 👇 GÖRSEL ALANI GÜNCELLENDİ 👇 */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill // 👈 Kapsayıcıya (aspect-[4/5]) tam oturur
            priority={isPriority} // 👈 9.7sn sorununu çözen kod
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 👈 Doğru boyutu indirir
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {product.isFeatured && (
              <span className="bg-brand-secondary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">Öne Çıkan</span>
            )}
            {discountRate > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">%{discountRate} İndirim</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm"
            aria-label={isWishlisted ? "Favorilerden çıkar" : "Favorilere ekle"}
          >
            <HeartIcon className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick Action Overlay (Desktop) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm border-t border-gray-100 hidden lg:flex flex-col gap-2 z-10">
            <button
              onClick={hasVariants || product.isCustomSize ? undefined : handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 ${isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-brand-primary text-white hover:bg-brand-secondary transition-colors'
                }`}
            >
              <CartIcon className="w-4 h-4" />
              {isOutOfStock ? 'Tükendi' : ((hasVariants || product.isCustomSize) ? 'Seçenekleri Gör' : 'Sepete Ekle')}
            </button>
          </div>
        </div>
        {/* 👆 GÖRSEL ALANI BİTİŞ 👆 */}

        <div className="p-4">


          // ... inside component ...

          <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
          <h2 className="font-serif text-lg font-medium text-brand-primary mb-1 line-clamp-1 group-hover:text-brand-secondary transition-colors">
            {product.name}
          </h2>

          {/* Star Rating Display */}
          <div className="flex items-center mb-2">
            <StarRating rating={product.averageRating || 0} />
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-lg">{displayPrice.toFixed(2)} TL</span>
                {(product.originalPrice || 0) > displayPrice && (
                  <span className="text-sm text-gray-400 line-through">{(product.originalPrice || 0).toFixed(2)} TL</span>
                )}
              </div>
              {product.isCustomSize && (
                <span className="text-xs text-brand-secondary flex items-center gap-1">
                  <RulerIcon className="w-3 h-3" /> Özel Ölçü
                </span>
              )}
            </div>
          </div>
          {/* Mobile Add to Cart */}
          <div className="mt-4 lg:hidden">
            <button
              onClick={hasVariants || product.isCustomSize ? undefined : handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 ${isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-brand-primary text-white hover:bg-brand-secondary transition-colors'
                }`}
            >
              <CartIcon className="w-4 h-4" />
              {isOutOfStock ? 'Tükendi' : ((hasVariants || product.isCustomSize) ? 'Seçenekleri Gör' : 'Sepete Ekle')}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingProductCard;
