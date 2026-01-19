"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, Question } from '../types';
import { mockProducts } from '../data/products';
import { useNotification } from './NotificationContext';
import { sendFormToEmail } from '../services/emailService';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addQuestion: (productId: string, question: Question) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  seedDatabase: () => Promise<void>;
  deleteReview: (productId: string, reviewId: number) => Promise<void>;
  deleteQuestion: (productId: string, questionId: number) => Promise<void>;
  answerQuestion: (productId: string, questionId: number, answer: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// HACI: Gelişmiş temizleyici. Array içindeki undefined'ları bile temizler.
const removeUndefinedFields = (obj: any): any => {
  if (obj === undefined) return null; // undefined ise null döndür (Firebase null sever)
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    // Array içindeki undefined veya null olmayanları al ve temizle
    return obj.filter(item => item !== undefined).map(removeUndefinedFields);
  }
  
  const newObj: any = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined) {
      newObj[key] = removeUndefinedFields(value);
    }
  }
  return newObj;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsList);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      if (error.code === 'permission-denied') {
          showNotification('Ürünleri listelemek için veritabanı izni gerekiyor.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    setIsLoading(true);
    try {
      // Veriyi temizle ve undefined alanları uçur
      const safeData = removeUndefinedFields(productData);
      
      const docRef = await addDoc(collection(db, 'products'), safeData);
      const newProduct = { ...safeData, id: docRef.id };
      setProducts(prev => [newProduct, ...prev]);
      
      showNotification('Ürün başarıyla eklendi.', 'success');
    } catch (error) {
      console.error("Error adding product:", error);
      showNotification('Ürün eklenirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    setIsLoading(true);
    try {
      const { id, ...data } = product;
      // Veriyi temizle
      const safeData = removeUndefinedFields(data);

      await updateDoc(doc(db, 'products', id), safeData);
      
      // Local state'i güncelle (temiz veriyle)
      setProducts(prev => prev.map(p => p.id === id ? { ...product, ...safeData } : p));
      
      showNotification('Ürün güncellendi.', 'success');
    } catch (error) {
      console.error("Error updating product:", error);
      showNotification('Ürün güncellenirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
      showNotification('Ürün silindi.', 'success');
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification('Ürün silinirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = async (productId: string, question: Question) => {
    try {
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists()) {
        const productData = productDoc.data() as Product;
        const currentQuestions = productData.questions || [];
        const updatedQuestions = [question, ...currentQuestions];
        
        await updateDoc(productRef, { questions: updatedQuestions });
        
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return { ...p, questions: updatedQuestions };
            }
            return p;
        }));
        
        showNotification('Sorunuz iletildi ve yayınlandı.', 'success');
      }
    } catch (error) {
      console.error("Error adding question:", error);
      showNotification('Soru iletilemedi.', 'error');
    }
  };

  const deleteReview = async (productId: string, reviewId: number) => {
      try {
          const productRef = doc(db, 'products', productId);
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
              const productData = productDoc.data() as Product;
              const updatedReviews = (productData.reviews || []).filter(r => r.id !== reviewId);
              
              await updateDoc(productRef, { reviews: updatedReviews });

              setProducts(prev => prev.map(p => {
                  if (p.id === productId) {
                      return { ...p, reviews: updatedReviews };
                  }
                  return p;
              }));
              showNotification('Yorum silindi.', 'success');
          }
      } catch (error) {
          console.error("Error deleting review:", error);
          showNotification('Yorum silinemedi.', 'error');
      }
  };

  const deleteQuestion = async (productId: string, questionId: number) => {
      try {
          const productRef = doc(db, 'products', productId);
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
              const productData = productDoc.data() as Product;
              const updatedQuestions = (productData.questions || []).filter(q => q.id !== questionId);

              await updateDoc(productRef, { questions: updatedQuestions });

              setProducts(prev => prev.map(p => {
                  if (p.id === productId) {
                      return { ...p, questions: updatedQuestions };
                  }
                  return p;
              }));
              showNotification('Soru silindi.', 'success');
          }
      } catch (error) {
          console.error("Error deleting question:", error);
          showNotification('Soru silinemedi.', 'error');
      }
  };

  const answerQuestion = async (productId: string, questionId: number, answer: string) => {
      try {
          const productRef = doc(db, 'products', productId);
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
              const productData = productDoc.data() as Product;
              
              const updatedQuestions = (productData.questions || []).map(q => {
                  if (q.id === questionId) {
                      return { ...q, answer: answer };
                  }
                  return q;
              });

              await updateDoc(productRef, { questions: updatedQuestions });

              setProducts(prev => prev.map(p => {
                  if (p.id === productId) {
                      return { ...p, questions: updatedQuestions };
                  }
                  return p;
              }));

              const answeredQuestion = (productData.questions || []).find(q => q.id === questionId);
              if (answeredQuestion) {
                  await sendFormToEmail('Satıcı Cevap Verdi', {
                      customerName: answeredQuestion.user,
                      email: answeredQuestion.email, 
                      productName: productData.name,
                      question: answeredQuestion.text,
                      answer: answer,
                      date: new Date().toLocaleDateString('tr-TR')
                  });
              }

              showNotification('Cevap kaydedildi ve müşteriye bildirildi.', 'success');
          }
      } catch (error) {
          console.error("Error answering question:", error);
          showNotification('Cevap kaydedilemedi.', 'error');
      }
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!file) throw new Error("Dosya seçilmedi");
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
  };

  const seedDatabase = async () => {
      if (products.length > 0) {
          showNotification('Veritabanı zaten dolu.', 'info');
          return;
      }
      setIsLoading(true);
      try {
          for (const product of mockProducts) {
              const { id, ...data } = product;
              await addDoc(collection(db, 'products'), removeUndefinedFields(data));
          }
          await fetchProducts();
          showNotification('Örnek veriler yüklendi!', 'success');
      } catch (error) {
          console.error("Seeding error:", error);
          showNotification('Veri yüklenirken hata oluştu.', 'error');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <ProductContext.Provider value={{ 
        products, 
        isLoading, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        addQuestion, 
        uploadImage, 
        seedDatabase,
        deleteReview,
        deleteQuestion,
        answerQuestion
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
