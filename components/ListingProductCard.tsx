"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartIcon, CartIcon, RulerIcon } from './Icons';

import { createSlug } from '@/utils/slugify';

interface ListingProductCardProps {
  product: Product;
}

const ListingProductCard: React.FC<ListingProductCardProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

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
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (isOutOfStock) return;

    if (hasVariants || product.isCustomSize) {
      // Variants selection is needed, so maybe redirect to product page anyway?
      // Or open a modal? For now, let's redirect via the main Link (so do nothing and let event bubble? No, we prevented default)
      // If we want to redirect, we shouldn't have prevented default.
      // But the button says "Select Options" usually.
      // Let's just navigate to product page manually or let the user click the card.
    } else {
      addToCart(product, product.variants[0], 1);
    }
  };

  // Custom navigation handler for "Select Options" button to avoid conflict if needed, 
  // but since the whole card is a Link, we might just let it bubble if we want navigation.
  // BUT the instruction says "Refactor... Use Link". So we wrap the card in Link.

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">



      <Link href={`/product/${createSlug(product.name, product.id)}`} className="block h-full">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-brand-secondary text-white text-xs font-bold px-2 py-1 rounded">Öne Çıkan</span>
            )}
            {discountRate > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">%{discountRate} İndirim</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm"
          >
            <HeartIcon className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Quick Action Overlay (Desktop) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm border-t border-gray-100 hidden lg:flex flex-col gap-2">
            <button
              onClick={hasVariants || product.isCustomSize ? undefined : handleAddToCart} // If variants, let Link handle click (go to details)
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

        <div className="p-4">
          <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
          <h3 className="font-serif text-lg font-medium text-brand-primary mb-2 line-clamp-1 group-hover:text-brand-secondary transition-colors">
            {product.name}
          </h3>

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
          {/* Mobile Add to Cart (Visible only on small screens) */}
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