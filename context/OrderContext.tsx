"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { Order } from '../types';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  addOrder: (order: Omit<Order, 'id'>) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingInfo?: { trackingNumber?: string; shippingCompany?: any }) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();
  const { user, isLoading: authLoading } = useAuth();

  // Gerçek zamanlı sipariş takibi
  useEffect(() => {
    if (authLoading) return;

    if (!db) {
        setIsLoading(false);
        return;
    }

    // Kullanıcı giriş yapmamışsa siparişleri dinlemeyi durdur (Güvenlik ve Hata Önleme)
    if (!user) {
        setOrders([]);
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    let unsubscribe: () => void;

    try {
        let q;
        // Eğer kullanıcı admin ise tüm siparişleri tarihe göre sıralı getir
        if (user.role === 'admin') {
             // Admin tüm siparişleri görür. 
             // NOT: Firestore kurallarında admin'in tüm siparişleri okumasına izin verilmelidir.
             q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        } else {
             // Normal kullanıcı ise sadece kendi siparişlerini userId eşleşmesi ile getir.
             // Firestore güvenlik kuralları (request.auth.uid == resource.data.userId) ile uyumlu olması için bu şarttır.
             // orderBy('date', 'desc') eklersek Composite Index hatası alabiliriz, bu yüzden sıralamayı client tarafında yapıyoruz.
             q = query(collection(db, 'orders'), where('userId', '==', user.id));
        }
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const ordersList: Order[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            ordersList.push({ 
                id: doc.id, 
                items: data.items || [], 
                total: data.total || 0,
                status: data.status || 'İşleniyor',
                date: data.date || new Date().toISOString(),
                shippingAddress: data.shippingAddress || '',
                trackingNumber: data.trackingNumber || '',
                shippingCompany: data.shippingCompany || undefined,
                userId: data.userId || undefined,
                ...data 
            } as Order);
          });
          
          // Client-side sorting (Sıralama)
          // Admin sorgusu zaten sıralı geliyor ama normal kullanıcı sorgusu index hatası vermemesi için burada sıralanıyor.
          ordersList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          setOrders(ordersList);
          setIsLoading(false);
        }, (error) => {
          console.error("Siparişler dinlenirken hata:", error);
          if (error.code === 'permission-denied') {
             console.warn("Firestore izni yok. Admin iseniz veritabanı kurallarınızı kontrol edin: allow read: if request.auth.uid == 'ADMIN_UID' veya userId kontrolü.");
             // Hata durumunda kullanıcıya boş liste göster, uygulamayı kırma
             setOrders([]); 
             if (user.role === 'admin') {
                 showNotification('Admin yetkisi ile tüm siparişler çekilemedi (İzin Hatası). Veritabanı kurallarını kontrol edin.', 'error');
             }
          }
          setIsLoading(false);
        });

    } catch (e) {
        console.error("Order query failed:", e);
        setIsLoading(false);
    }

    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, [user, authLoading, showNotification]);

  const addOrder = async (orderData: Omit<Order, 'id'>) => {
    if (!db) {
        showNotification('Veritabanı bağlantısı yok.', 'error');
        return `DEMO-${Date.now()}`;
    }
    try {
      const sanitizedOrder = JSON.parse(JSON.stringify(orderData));

      // userId ekle (eğer auth context'ten geliyorsa zaten eklenmiş olmalı ama garanti olsun)
      if (user && !sanitizedOrder.userId) {
          sanitizedOrder.userId = user.id;
      }
      
      // Email alanı da ekli olsun, admin panelinde arama yapmak için faydalı olabilir
      if (user && !sanitizedOrder.email) {
          sanitizedOrder.email = user.email;
      }

      const docRef = await addDoc(collection(db, 'orders'), sanitizedOrder);
      return docRef.id;
    } catch (error: any) {
      console.error("Sipariş eklenirken hata:", error);
      
      const fallbackId = `TEMP-${Date.now()}`;
      
      if (error.code === 'permission-denied') {
          console.warn('UYARI: Veritabanı izni yok. Geçici ID kullanılıyor.');
          return fallbackId;
      } else {
          showNotification('Sipariş kaydı sırasında hata oluştu ancak ödeme sayfasına yönlendiriliyorsunuz.', 'info');
          return fallbackId;
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], trackingInfo?: { trackingNumber?: string; shippingCompany?: any }) => {
    if (!db) return;
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData: any = { status };
      
      if (trackingInfo) {
        if (trackingInfo.trackingNumber) updateData.trackingNumber = trackingInfo.trackingNumber;
        if (trackingInfo.shippingCompany) updateData.shippingCompany = trackingInfo.shippingCompany;
      }
      
      await updateDoc(orderRef, updateData);
      showNotification('Sipariş durumu güncellendi.', 'success');
    } catch (error) {
      console.error("Sipariş güncellenirken hata:", error);
      showNotification('Sipariş güncellenemedi.', 'error');
    }
  };

  const deleteOrder = async (orderId: string) => {
      if (!db) return;
      if (!window.confirm('Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

      try {
          await deleteDoc(doc(db, 'orders', orderId));
          showNotification('Sipariş silindi.', 'success');
      } catch (error) {
          console.error("Sipariş silinirken hata:", error);
          showNotification('Sipariş silinemedi.', 'error');
      }
  };

  return (
    <OrderContext.Provider value={{ orders, isLoading, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
