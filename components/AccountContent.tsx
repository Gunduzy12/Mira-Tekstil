"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Order, ReturnRequest } from '../types';
import { ChevronRightIcon, PackageIcon, TruckIcon } from './Icons';
import { getTrackingUrl } from '../utils/shippingUtils';
import { mockReturnRequests } from '../data/orders';

type ActiveTab = 'orders' | 'returns' | 'profile';

const AccountContent: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
    const { orders } = useOrders();
    const { user } = useAuth();

    // Orders are now already filtered by the OrderContext based on the user's role and email
    const userOrders = orders;

    const handleSelectOrder = (order: Order) => {
        // Navigate to return request page if status is valid (simple demo logic)
        // In real app maybe detail page first.
        // For now let's just assume we want to create a return for this order.
        router.push(`/account/orders/${order.id}/return`);
    };

    const handleViewReturnStatus = (request: ReturnRequest) => {
        router.push(`/account/return-status/${request.id}`);
    };

    const StatusBadge: React.FC<{ status: Order['status'] | ReturnRequest['status'] }> = ({ status }) => {
        const colorClasses: Record<string, string> = {
            'Teslim Edildi': 'bg-green-100 text-green-800',
            'Yolda': 'bg-blue-100 text-blue-800',
            'Kargolandı': 'bg-blue-100 text-blue-800',
            'İşleniyor': 'bg-yellow-100 text-yellow-800',
            'Talep Alındı': 'bg-gray-100 text-gray-800',
            'İnceleniyor': 'bg-yellow-100 text-yellow-800',
            'Onaylandı': 'bg-green-100 text-green-800',
            'Reddedildi': 'bg-red-100 text-red-800',
            'Ödeme Bekleniyor': 'bg-orange-100 text-orange-800',
        };
        return (
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-serif text-brand-primary mb-8">Hesabım</h1>

            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-primary'}`}>Siparişlerim</button>
                <button onClick={() => setActiveTab('returns')} className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'returns' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-primary'}`}>İade Taleplerim</button>
                <button onClick={() => router.push('/wishlist')} className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors text-gray-500 hover:text-brand-primary`}>İstek Listem</button>
                <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'profile' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-brand-primary'}`}>Profilim</button>
            </div>

            <div>
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-6">Sipariş Geçmişi</h2>
                        {userOrders.length > 0 ? (
                            <div className="space-y-4">
                                {userOrders.map(order => (
                                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all overflow-hidden">
                                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 border-b border-gray-100">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="font-bold text-brand-primary text-lg">Sipariş #{order.id}</p>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <p className="text-sm text-gray-500">Tarih: {new Date(order.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 mb-1">Toplam Tutar</p>
                                                <p className="text-lg font-bold text-brand-primary">{order.total.toFixed(2)} TL</p>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <div className="flex -space-x-3 overflow-hidden p-1">
                                                    {order.items.slice(0, 4).map((item, idx) => (
                                                        <img key={idx} className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover" src={item.imageUrl} alt={item.name} />
                                                    ))}
                                                    {order.items.length > 4 && (
                                                        <div className="h-12 w-12 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                                            +{order.items.length - 4}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                                    {order.trackingNumber && (
                                                        <a
                                                            href={getTrackingUrl(order.shippingCompany, order.trackingNumber)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
                                                        >
                                                            <TruckIcon className="h-5 w-5" />
                                                            Kargom Nerede?
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleSelectOrder(order)}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 border border-brand-border text-brand-primary px-5 py-2.5 rounded-md hover:bg-gray-50 transition-colors font-medium"
                                                    >
                                                        Detaylar
                                                        <ChevronRightIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <PackageIcon className="h-12 w-12 mx-auto text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">Henüz siparişiniz yok</h3>
                                <p className="mt-1 text-sm text-gray-500">Hemen alışverişe başlayın, evinize şıklık katın.</p>
                                <button onClick={() => router.push('/shop')} className="mt-6 bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-dark">Alışverişe Başla</button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'returns' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-6">İade Talepleri</h2>
                        {mockReturnRequests.length > 0 ? (
                            <div className="space-y-4">
                                {mockReturnRequests.map(request => (
                                    <div key={request.id} onClick={() => handleViewReturnStatus(request)} className="bg-white p-4 border border-gray-200 hover:shadow-md hover:border-brand-secondary transition-all cursor-pointer flex justify-between items-center">
                                        <div>
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                                <p className="font-semibold text-brand-dark">İade #{request.id}</p>
                                                <StatusBadge status={request.status} />
                                            </div>
                                            <p className="text-sm text-gray-500">Sipariş ID: {request.orderId}</p>
                                            <p className="text-sm text-gray-500">Tarih: {request.date}</p>
                                        </div>
                                        <ChevronRightIcon className="h-6 w-6 text-gray-400 ml-4" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border border-dashed rounded-lg">
                                <PackageIcon className="h-12 w-12 mx-auto text-gray-400" />
                                <h3 className="mt-2 text-xl font-medium text-gray-900">İade Talebiniz Bulunmuyor</h3>
                                <p className="mt-1 text-sm text-gray-500">Bir ürünü iade etmek için Siparişlerim sayfasını ziyaret edebilirsiniz.</p>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="mt-6 bg-brand-primary text-white px-6 py-2 hover:bg-brand-dark transition-colors"
                                >
                                    Siparişlerimi Görüntüle
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div>
                        <h2 className="text-2xl font-serif mb-6">Profil Bilgileri</h2>
                        <div className="bg-white p-6 border rounded-lg max-w-lg">
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Ad Soyad</label>
                                <p className="p-2 bg-gray-50 rounded border">{user?.name}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">E-posta</label>
                                <p className="p-2 bg-gray-50 rounded border">{user?.email}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">Şifre ve adres değişiklikleri için lütfen müşteri hizmetleri ile iletişime geçiniz.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountContent;
