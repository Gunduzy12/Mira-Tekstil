"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { auth, db } from '../firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  // --- 1. AUTH STATE LISTENER ---
  useEffect(() => {
    // Dinleyiciyi başlat
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      
      // Eğer kullanıcı zaten varsa ve işlem yapılıyorsa loading'i elleme
      // Ama genel bir auth değişimi varsa loading açılabilir.
      // Döngüye girmemek için burada dikkatli oluyoruz.
      
      if (currentUser) {
        // ADMIN KONTROLÜ (Senin özel ID)
        if (currentUser.uid === "pK1tSzJTM0YFg2imDLEIenqrFwv2") {
             setUser({
                 id: currentUser.uid,
                 email: currentUser.email || '',
                 name: "Barış Yılmaz", 
                 role: 'admin',
                 createdAt: new Date().toISOString()
             });
             setIsLoading(false);
             return;
        }

        // NORMAL KULLANICI VERİSİ ÇEKME
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
          } else {
             // Döküman henüz yoksa (Register'daki yarış durumu için fallback)
             setUser({
                 id: currentUser.uid,
                 email: currentUser.email || '',
                 name: currentUser.displayName || 'Kullanıcı',
                 role: 'customer',
                 createdAt: new Date().toISOString()
             });
          }
        } catch (error: any) {
          console.error("Error fetching user data:", error);
          // Hata olsa bile oturumu açık göster ki ekran donmasın
          setUser({
             id: currentUser.uid,
             email: currentUser.email || '',
             name: currentUser.displayName || 'Kullanıcı'
         });
        }
      } else {
        // Kullanıcı yoksa
        setUser(null);
      }
      
      // Her durumda yükleme bitti
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []); // <--- HACI HATA BURADAYDI. BURASI BOŞ [] OLMALI, [user] DEĞİL!

  // --- 2. LOGIN FONKSİYONU ---
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true); // Butona basınca kullanıcı tepki görsün
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification('Giriş başarılı!', 'success');
        return true;
    } catch (error: any) {
        console.error("Login error:", error);
        let msg = 'Giriş yapılamadı.';
        if (error.code === 'auth/invalid-credential') msg = 'E-posta veya şifre hatalı.';
        if (error.code === 'auth/user-not-found') msg = 'Kullanıcı bulunamadı.';
        if (error.code === 'auth/wrong-password') msg = 'Hatalı şifre.';
        showNotification(msg, 'error');
        setIsLoading(false);
        return false;
    }
  }, [showNotification]);

  // --- 3. REGISTER FONKSİYONU ---
  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true); 
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUser: User = {
            id: firebaseUser.uid,
            name: name,
            email: email,
            role: 'customer',
            createdAt: new Date().toISOString()
        };

        try {
            await setDoc(doc(db, "users", firebaseUser.uid), newUser);
        } catch (firestoreError: any) {
            console.error("Firestore Save Error:", firestoreError);
        }

        // KRİTİK HAMLE: State'i elle güncelle ve loading'i kapat
        setUser(newUser);
        setIsLoading(false);

        showNotification('Kayıt başarılı! Hoş geldiniz.', 'success');
        return true;

    } catch (error: any) {
        console.error("Register error:", error);
        let msg = 'Kayıt oluşturulamadı.';
        if (error.code === 'auth/email-already-in-use') msg = 'Bu e-posta adresi zaten kullanımda.';
        if (error.code === 'auth/weak-password') msg = 'Şifre çok zayıf (en az 6 karakter).';
        
        showNotification(msg, 'error');
        setIsLoading(false);
        return false;
    }
  }, [showNotification]);

  // --- 4. LOGOUT FONKSİYONU ---
  const logout = useCallback(async () => {
    try {
        await signOut(auth);
        setUser(null);
        showNotification('Başarıyla çıkış yapıldı.', 'info');
    } catch (error) {
        console.error("Logout error", error);
    }
  }, [showNotification]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
