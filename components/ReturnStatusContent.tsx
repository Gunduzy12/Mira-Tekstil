"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Correct import
import { ReturnRequest } from '../types';
import { PackageIcon } from './Icons';
import { mockReturnRequests } from '../data/orders';

interface ReturnStatusContentProps {
    requestId: string;
}

const ReturnStatusContent: React.FC<ReturnStatusContentProps> = ({ requestId }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [returnRequest, setReturnRequest] = useState<ReturnRequest | null>(null);

    useEffect(() => {
        // 1. Try to get from URL params (for demo of newly created return)
        const dataParam = searchParams.get('data');
        if (dataParam) {
            try {
                setReturnRequest(JSON.parse(decodeURIComponent(dataParam)));
                return;
            } catch (e) {
                console.error("Failed to parse return data", e);
            }
        }

        // 2. Try to find in mock data
        const found = mockReturnRequests.find(r => r.id === requestId);
        if (found) {
            setReturnRequest(found);
        }
    }, [requestId, searchParams]);

    if (!returnRequest) {
        return <div className="p-12 text-center">İade talebi bulunamadı veya yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-8">
                <button onClick={() => router.push('/account')} className="text-sm text-gray-600 hover:text-brand-primary">&larr; Hesabıma Geri Dön</button>
            </div>

            <div className="bg-white p-8 border border-gray-200 text-center">
                <PackageIcon className="h-16 w-16 mx-auto text-brand-secondary" />
                <h1 className="text-3xl font-serif text-brand-primary mt-4">İade Talebi Detayı</h1>
                <p className="text-gray-600 mt-2">Durum: <span className="font-semibold text-brand-dark">{returnRequest.status}</span></p>

                <div className="mt-8 text-left max-w-2xl mx-auto">
                    <div className="bg-brand-light p-6 border border-dashed border-brand-accent">
                        <h2 className="text-xl font-serif mb-4">Gönderim Bilgileri</h2>
                        {returnRequest.returnCode ? (
                            <>
                                <p className="text-sm text-gray-700 mb-4">
                                    Lütfen aşağıdaki iade kodunu kullanarak iade edilecek ürünleri paketleyip size en yakın MNG Kargo şubesine teslim ediniz.
                                </p>
                                <p className="text-center text-lg font-bold tracking-widest bg-white p-4 border border-gray-300">
                                    {returnRequest.returnCode}
                                </p>
                                <ul className="text-sm text-gray-600 mt-4 list-disc list-inside space-y-1">
                                    <li>Ürünleri orijinal ambalajı ve faturasıyla birlikte paketlediğinizden emin olun.</li>
                                    <li>Kargo görevlisine bu kodu vermeniz yeterlidir, ek bir ücret ödemenize gerek yoktur.</li>
                                </ul>
                            </>
                        ) : (
                            <p className="text-sm text-gray-700">İade talebiniz inceleniyor. Onaylandığında kargo kodu iletilecektir.</p>
                        )}
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-serif mb-4">İade Edilen Ürünler</h3>
                        <div className="space-y-3">
                            {returnRequest.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <p>{item.name} <span className="text-gray-500">x {item.quantity}</span></p>
                                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} TL</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/shop')}
                    className="mt-10 bg-brand-primary text-white px-8 py-3 hover:bg-brand-dark transition-colors"
                >
                    Alışverişe Devam Et
                </button>
            </div>
        </div>
    );
};

export default ReturnStatusContent;
