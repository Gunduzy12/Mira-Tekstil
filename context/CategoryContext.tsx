"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Category } from '../types';
import { useNotification } from './NotificationContext';

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  uploadCategoryImage: (file: File) => Promise<string>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoryList: Category[] = [];
      querySnapshot.forEach((doc) => {
        categoryList.push({ id: doc.id, ...doc.data() } as Category);
      });
      setCategories(categoryList);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      if (error.code === 'permission-denied') {
          // Silent fail or notify
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      const newCategory = { ...categoryData, id: docRef.id };
      setCategories(prev => [...prev, newCategory]);
      showNotification('Kategori başarıyla eklendi.', 'success');
    } catch (error) {
      console.error("Error adding category:", error);
      showNotification('Kategori eklenirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (category: Category) => {
    setIsLoading(true);
    try {
      const { id, ...data } = category;
      await updateDoc(doc(db, 'categories', id), data as any);
      setCategories(prev => prev.map(c => c.id === id ? category : c));
      showNotification('Kategori güncellendi.', 'success');
    } catch (error) {
      console.error("Error updating category:", error);
      showNotification('Kategori güncellenirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(prev => prev.filter(c => c.id !== id));
      showNotification('Kategori silindi.', 'success');
    } catch (error) {
      console.error("Error deleting category:", error);
      showNotification('Kategori silinirken hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadCategoryImage = async (file: File): Promise<string> => {
    if (!file) throw new Error("Dosya seçilmedi");
    const storageRef = ref(storage, `categories/${Date.now()}_${file.name}`);
    try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    } catch (error) {
        console.error("Category image upload error:", error);
        throw error;
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, isLoading, addCategory, updateCategory, deleteCategory, uploadCategoryImage }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
