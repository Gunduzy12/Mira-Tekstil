// components/ProductSkeleton.tsx
import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
      {/* 6 adet sahte kutu oluşturuyoruz */}
      {[...Array(6)].map((_, index) => (
        <div 
          key={index} 
          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse"
        >
          {/* Resim alanı (Gri Kutu) */}
          <div className="aspect-[4/5] bg-gray-200 w-full" />
          
          {/* Yazı alanları (Gri Çizgiler) */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" /> {/* Marka */}
            <div className="h-6 bg-gray-200 rounded w-3/4" /> {/* Başlık */}
            
            <div className="flex justify-between items-center pt-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" /> {/* Fiyat */}
              <div className="h-8 bg-gray-200 rounded w-1/4" /> {/* Buton */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
