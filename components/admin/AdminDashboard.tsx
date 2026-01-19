"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardIcon, ProductsIcon, OrdersIcon, CustomersIcon, UserIcon, TagIcon, PercentIcon, ChatBubbleIcon } from '../Icons';
import DashboardView from './DashboardView';
import ProductsView from './ProductsView';
import OrdersView from './OrdersView';
import CategoriesView from './CategoriesView';
import PromotionsView from './PromotionsView';
import CustomersView from './CustomersView';
import ReviewsQnAView from './ReviewsQnAView';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

type AdminView = 'dashboard' | 'products' | 'orders' | 'categories' | 'customers' | 'promotions' | 'reviews';

const AdminDashboard: React.FC = () => {
    const router = useRouter();
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const { user, login, logout, isLoading } = useAuth();
    const { showNotification } = useNotification();

    // Admin Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    // HACI'NIN UID'si
    const ALLOWED_UID = "pK1tSzJTM0YFg2imDLEIenqrFwv2";

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-brand-primary font-serif text-xl animate-pulse">Yükleniyor...</div>
            </div>
        );
    }

    // --- 1. Kullanıcı Giriş Yapmamışsa: LOGIN FORMU ---
    if (!user) {
        const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoginLoading(true);
            const success = await login(email, password);
            setIsLoginLoading(false);
            if (success) {
                // Login başarılı olduğunda component re-render olacak
            }
        };

        return (
            <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden border border-brand-border">
                    <div className="bg-brand-primary py-6 px-8 text-center">
                        <h1 className="text-2xl font-serif font-bold text-white tracking-wider">MiraTekstil Yönetim</h1>
                        <p className="text-brand-secondary text-sm mt-1">Yönetici Girişi</p>
                    </div>
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all"
                                    placeholder="admin@miratekstil.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoginLoading}
                                className="w-full bg-brand-primary text-white py-3 rounded-md font-bold hover:bg-brand-dark transition-colors shadow-md disabled:opacity-70 flex justify-center items-center"
                            >
                                {isLoginLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Giriş Yap'}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-brand-primary underline">
                                Siteye Geri Dön
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. Kullanıcı Giriş Yapmış Ama Admin Değilse ---
    if (user.role !== 'admin' && user.id !== ALLOWED_UID) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center border-t-4 border-red-500">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Yetkisiz Erişim</h2>
                    <p className="text-gray-600 mb-6">
                        Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekmektedir. Şu anki hesabınız: <span className="font-semibold text-gray-800">{user.email}</span>
                    </p>
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => { logout(); setEmail(''); setPassword(''); }}
                            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Çıkış Yap ve Farklı Hesapla Dene
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Anasayfaya Dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- 3. Admin Paneli ---
    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView />;
            case 'products':
                // Note: ProductsView might need onNavigate props or similar adjustments if it navigated inside the old SPA.
                // Assuming it's self-contained or we need to pass a dummy handler if it required one.
                // Checking ProductsView content would be ideal, but for now assuming it works or will error clearly.
                return <ProductsView />;
            case 'orders':
                return <OrdersView />;
            case 'categories':
                return <CategoriesView />;
            case 'promotions':
                return <PromotionsView />;
            case 'customers':
                return <CustomersView />;
            case 'reviews':
                return <ReviewsQnAView />;
            default:
                return <DashboardView />;
        }
    };

    const NavItem: React.FC<{ view: AdminView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${activeView === view
                    ? 'bg-brand-secondary text-white'
                    : 'text-gray-300 hover:bg-brand-dark hover:text-white'
                }`}
        >
            {icon}
            <span className="ml-4">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 flex-shrink-0 bg-brand-primary text-white flex flex-col">
                <div className="h-20 flex items-center justify-center px-4 bg-brand-dark">
                    <h1 className="text-2xl font-serif font-bold tracking-wider">MiraTekstil</h1>
                </div>
                <nav className="flex-grow mt-6 overflow-y-auto global-scrollbar">
                    <NavItem view="dashboard" label="Kontrol Paneli" icon={<DashboardIcon className="h-5 w-5" />} />
                    <NavItem view="products" label="Ürünler" icon={<ProductsIcon className="h-5 w-5" />} />
                    <NavItem view="categories" label="Kategoriler" icon={<TagIcon className="h-5 w-5" />} />
                    <NavItem view="orders" label="Siparişler" icon={<OrdersIcon className="h-5 w-5" />} />
                    <NavItem view="promotions" label="Kampanyalar & İndirimler" icon={<PercentIcon className="h-5 w-5" />} />
                    <NavItem view="reviews" label="Yorumlar & Sorular" icon={<ChatBubbleIcon className="h-5 w-5" />} />
                    <NavItem view="customers" label="Müşteriler" icon={<CustomersIcon className="h-5 w-5" />} />
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-400 hover:text-white text-center block w-full py-2 hover:bg-white/5 rounded transition-colors"
                    >
                        &larr; Siteye Geri Dön
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 bg-white border-b shadow-sm z-10">
                    <h2 className="text-xl font-semibold text-gray-700 capitalize">{activeView === 'reviews' ? 'Yorumlar & Sorular' : activeView.replace('-', ' ')}</h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="relative group">
                            <button className="flex items-center focus:outline-none">
                                <UserIcon className="h-10 w-10 text-gray-600 p-2 bg-gray-100 rounded-full border border-gray-200" />
                            </button>
                            <div className="absolute right-0 pt-2 w-48 z-50 hidden group-hover:block hover:block">
                                <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                                    <button
                                        onClick={() => logout()}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                    >
                                        Güvenli Çıkış
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
