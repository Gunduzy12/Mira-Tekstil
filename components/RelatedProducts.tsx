'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { getProductUrl } from '../data/seoCategories';

interface RelatedProductsProps {
    products: Product[];
    title?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
    products,
    title = 'Benzer Ürünler',
}) => {
    if (products.length === 0) return null;

    return (
        <section className="container mx-auto px-6 pb-12">
            <div className="border-t border-brand-border pt-10">
                <h2 className="text-xl md:text-2xl font-serif text-brand-primary mb-6">{title}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.slice(0, 8).map(product => (
                        <Link
                            key={product.id}
                            href={getProductUrl(product.name, product.id, product.category, product.slug, product.categorySlug, product.parentSlug)}
                            className="group block"
                        >
                            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-2">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-brand-primary group-hover:text-brand-secondary transition-colors line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-sm font-semibold text-brand-primary mt-1">
                                {product.priceFrom.toFixed(2)} TL
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;
