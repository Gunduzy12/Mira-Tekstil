

"use client";

import React, { useState } from 'react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { HeartIcon, AwardIcon } from './Icons';
import StarRating from './StarRating';

interface StoreProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

const StoreProductCard: React.FC<StoreProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      className="group relative flex-shrink-0 w-48 sm:w-56 md:w-64 cursor-pointer"
      onClick={() => onSelectProduct(product)}
    >
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-hidden bg-white relative aspect-[4/5]">
          <img
            src={allImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
          />

          {product.advantageTier && (
            <div className="absolute top-0 left-0 z-10">
              <img src="https://cdn-icons-png.flaticon.com/512/7550/7550307.png" alt="Avantajlı Ürün" className="w-12 h-12 drop-shadow-md" />
            </div>
          )}

          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 sm:p-2 text-gray-700 hover:text-red-500 transition-all z-10 border border-gray-100 shadow-sm"
            aria-label={isWishlisted ? "İstek listesinden kaldır" : "İstek listesine ekle"}
          >
            <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {allImages.length > 1 && (
            <div className="absolute bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${currentImageIndex === index ? 'bg-gray-800 ring-1 ring-white/50' : 'bg-gray-300'
                    }`}
                  aria-label={`Go to image ${index + 1}`}
                ></button>
              ))}
            </div>
          )}

          {product.badges?.includes('BAŞARILI SATICI') && (
            <div className="absolute bottom-0 left-0 w-full bg-brand-secondary text-white text-xs sm:text-sm font-semibold py-1.5 px-2 sm:py-2 sm:px-4 flex items-center justify-center">
              <AwardIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Başarılı Satıcı</span>
            </div>
          )}
        </div>
      </div>
      <div className="pt-3 text-left">
        <p className="text-xs text-brand-accent uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-sm font-serif text-brand-primary group-hover:text-brand-secondary transition-colors truncate mt-1">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2 h-5">
          <div className="flex items-center gap-2 mt-2 h-5">
            <StarRating rating={product.averageRating || 0} />
            <span className="text-xs text-brand-accent">({product.reviewCount || 0})</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-semibold text-brand-primary">{product.priceFrom.toFixed(2)} TL</p>
          {product.originalPrice && product.originalPrice > product.priceFrom && (
            <p className="text-sm text-gray-400 line-through">{product.originalPrice.toFixed(2)} TL</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreProductCard;
