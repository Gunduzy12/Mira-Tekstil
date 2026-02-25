import React from 'react';
import Link from 'next/link';
import { useCategories } from '../context/CategoryContext';
import { getCategoryUrl } from '../data/seoCategories';

const CategoriesSection: React.FC = () => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-brand-primary font-medium tracking-wide">Kategorilerimiz</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200 mb-3 md:mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-primary font-medium tracking-wide">Perde Koleksiyonları</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryUrl(category.name)}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#FFF9F0] border border-transparent group-hover:border-brand-secondary/30 transition-all duration-500 flex items-center justify-center mb-3 md:mb-4 shadow-sm group-hover:shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-brand-secondary/0 group-hover:bg-brand-secondary/5 transition-colors duration-500 z-10"></div>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
              </div>
              <h3 className="text-center font-serif text-sm text-gray-600 font-medium group-hover:text-brand-secondary transition-colors tracking-wide max-w-[120px]">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
