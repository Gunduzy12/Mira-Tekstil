import React, { useMemo } from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { HeartIcon, CartIcon, RulerIcon, ChevronRightIcon } from './Icons';
import StarRating from './StarRating';

import { createSlug } from '@/utils/slugify';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
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

  // Boyut Etiketi
  const sizeInfo = useMemo(() => {
    if (product.isCustomSize) {
      return { text: "100+ Beden", count: 0, isCustom: true };
    }
    const uniqueSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))];
    if (uniqueSizes.length > 0) {
      return {
        text: uniqueSizes[0],
        count: uniqueSizes.length - 1,
        isCustom: false
      };
    }
    return null;
  }, [product]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Link'in tetiklenmesini engelle
    if (isOutOfStock) return;

    if (hasVariants || product.isCustomSize) {
      // onSelectProduct(product); // Artık link'e gidecek
      // Link wrapper handles this
    } else {
      addToCart(product, product.variants[0], 1);
    }
  };

  return (
    <div
      className="group relative cursor-pointer flex flex-col h-full"
    >



      <Link href={`/product/${createSlug(product.name, product.id)}`} className="contents">
        {/* Link wraps content for navigation, but buttons inside need e.stopPropagation() */}
        <div
          className="overflow-hidden bg-white relative border border-brand-border rounded-lg aspect-[4/5]"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>

          {/* İndirim Etiketi: Sadece >0 ise göster */}
          {discountRate > 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
              %{discountRate} İndirim
            </div>
          )}

          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 text-brand-dark hover:text-red-500 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-10 shadow-sm border border-gray-100"
            aria-label={isWishlisted ? "İstek listesinden kaldır" : "İstek listesine ekle"}
          >
            <HeartIcon className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="pt-4 text-left flex flex-col flex-grow">
          <h3 className="text-base font-serif text-brand-primary group-hover:text-brand-secondary transition-colors mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-brand-accent mb-2">{product.brand}</p>

          {/* Boyut Etiketi */}
          {sizeInfo && (
            <div className="mb-2 inline-flex items-center bg-gray-50 rounded-md px-2 py-1 w-fit border border-gray-100">
              {sizeInfo.isCustom ? (
                <RulerIcon className="w-3 h-3 text-brand-secondary mr-1.5" />
              ) : (
                <span className="text-gray-400 mr-1.5 text-xs">📏</span>
              )}

              <span className="text-xs font-medium text-gray-700">
                {sizeInfo.text}
              </span>

              {sizeInfo.count > 0 && (
                <span className="ml-1 text-[10px] text-gray-500 font-bold">
                  +{sizeInfo.count} Boyut
                </span>
              )}
              <ChevronRightIcon className="w-3 h-3 text-gray-300 ml-1" />
            </div>
          )}

          <div className="mt-auto flex items-baseline gap-2">
            <span className="font-semibold text-brand-primary text-lg">{displayPrice.toFixed(2)} TL</span>

            {/* HACI: 0 kontrolü buraya da eklendi */}
            {(product.originalPrice || 0) > 0 && (product.originalPrice || 0) > displayPrice && (
              <span className="text-sm text-gray-400 line-through">{(product.originalPrice || 0).toFixed(2)} TL</span>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2.5 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 ${isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-primary text-white hover:bg-brand-secondary shadow-md hover:shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
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

export default ProductCard;