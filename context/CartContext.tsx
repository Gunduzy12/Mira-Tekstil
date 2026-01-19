"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { useNotification } from './NotificationContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { showNotification } = useNotification();

  const addToCart = useCallback((product: Product, variant: ProductVariant, quantity = 1) => {
    setCartItems(prevItems => {
      // The variant.sku is already modified in ProductDetailPage for custom items to include dims (e.g. SKU-W200-H200)
      const cartItemId = variant.sku; 
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Extract Custom Dimensions if available in the variant SKU or logic
      let customDimensions = undefined;
      const match = cartItemId.match(/-W(\d+)-H(\d+)$/);
      if (match) {
          customDimensions = {
              width: parseInt(match[1]),
              height: parseInt(match[2])
          };
      }

      const newCartItem: CartItem = {
        cartItemId,
        productId: product.id,
        productName: product.name,
        quantity,
        variant,
        productImageUrl: product.imageUrl,
        customDimensions
      };
      return [...prevItems, newCartItem];
    });
    showNotification(`'${product.name}' sepete eklendi.`, 'success');
  }, [showNotification]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + item.variant.price * item.quantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
