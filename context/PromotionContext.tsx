"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Coupon } from '../types';
import { useNotification } from './NotificationContext';

interface PromotionContextType {
  coupons: Coupon[];
  isLoading: boolean;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export const PromotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'coupons'));
      const couponList: Coupon[] = [];
      querySnapshot.forEach((doc) => {
        couponList.push({ id: doc.id, ...doc.data() } as Coupon);
      });
      setCoupons(couponList);
    } catch (error: any) {
      console.error("Error fetching coupons:", error);
      // İzin hatası varsa sessiz kal veya logla
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'coupons'), couponData);
      const newCoupon = { ...couponData, id: docRef.id };
      setCoupons(prev => [...prev, newCoupon]);
      showNotification('Kupon başarıyla oluşturuldu.', 'success');
    } catch (error) {
      console.error("Error adding coupon:", error);
      showNotification('Kupon oluşturulurken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCoupon = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons(prev => prev.filter(c => c.id !== id));
      showNotification('Kupon silindi.', 'success');
    } catch (error) {
      console.error("Error deleting coupon:", error);
      showNotification('Kupon silinirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PromotionContext.Provider value={{ coupons, isLoading, addCoupon, deleteCoupon }}>
      {children}
    </PromotionContext.Provider>
  );
};

export const usePromotions = (): PromotionContextType => {
  const context = useContext(PromotionContext);
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionProvider');
  }
  return context;
};
