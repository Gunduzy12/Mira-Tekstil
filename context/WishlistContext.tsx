"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product } from '../types';
import { useNotification } from './NotificationContext';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { showNotification } = useNotification();

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const addToWishlist = useCallback((product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlistItems(prevItems => [...prevItems, product]);
      showNotification(`'${product.name}' istek listesine eklendi.`, 'success');
    }
  }, [isInWishlist, showNotification]);

  const removeFromWishlist = useCallback((productId: string) => {
    const itemToRemove = wishlistItems.find(item => item.id === productId);
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    if (itemToRemove) {
        showNotification(`'${itemToRemove.name}' istek listesinden kaldırıldı.`, 'success');
    }
  }, [wishlistItems, showNotification]);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
