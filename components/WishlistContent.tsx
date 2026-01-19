"use client";

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from './ProductCard'; // Use base ProductCard (already refined)
import { HeartIcon } from './Icons';

const WishlistContent: React.FC = () => {
    const { wishlistItems } = useWishlist();

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif text-brand-primary">İstek Listem</h1>
                <p className="text-gray-600 mt-2">Favori ürünlerinizi burada bulabilirsiniz.</p>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistItems.map(product => (
                        <ProductCard key={product.id} product={product} />
                        // ProductCard handles navigation internally via Link now. 
                        // Removed onSelectProduct as it's not needed with Link routing.
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed rounded-lg bg-gray-50">
                    <HeartIcon className="h-16 w-16 mx-auto text-gray-300" />
                    <h2 className="mt-4 text-2xl font-serif text-brand-primary">İstek Listeniz Boş</h2>
                    <p className="text-gray-600 mt-2">Beğendiğiniz ürünleri kalp ikonuna tıklayarak ekleyebilirsiniz.</p>
                    <Link
                        href="/shop"
                        className="mt-6 inline-block bg-brand-primary text-white px-8 py-3 rounded hover:bg-brand-dark transition-colors"
                    >
                        Alışverişe Başla
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistContent;
