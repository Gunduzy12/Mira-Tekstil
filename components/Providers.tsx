"use client";

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ProductProvider } from '../context/ProductContext';
import { OrderProvider } from '../context/OrderContext';
import { CategoryProvider } from '../context/CategoryContext';
import { PromotionProvider } from '../context/PromotionContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NotificationProvider>
            <AuthProvider>
                <PromotionProvider>
                    <ProductProvider>
                        <CategoryProvider>
                            <OrderProvider>
                                <CartProvider>
                                    <WishlistProvider>
                                        {children}
                                    </WishlistProvider>
                                </CartProvider>
                            </OrderProvider>
                        </CategoryProvider>
                    </ProductProvider>
                </PromotionProvider>
            </AuthProvider>
        </NotificationProvider>
    );
}
