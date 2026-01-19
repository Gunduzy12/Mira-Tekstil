"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCart as useCartDirect } from '../context/CartContext';
import { PackageIcon, ChevronRightIcon } from './Icons';

const PaymentSuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCartDirect();

    useEffect(() => {
        // Clear cart on mount
        clearCart();

        // Clean URL params to avoid re-triggering logic on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }, [clearCart]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-xl text-center border border-gray-100 animate-fadeIn">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h1>
                <p className="text-gray-600 mb-8">
                    Teşekkür ederiz. Ödemeniz başarıyla gerçekleşti ve siparişiniz hazırlanmak üzere işleme alındı.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-8 text-left">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                        <PackageIcon className="w-5 h-5 mr-2 text-brand-secondary" />
                        Ne zaman kargolanır?
                    </h3>
                    <p className="text-sm text-gray-500">
                        Siparişleriniz genellikle 1-3 iş günü içerisinde kargoya teslim edilir. Kargo takip numarası e-posta adresinize gönderilecektir.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/account')}
                        className="w-full bg-brand-primary text-white py-3.5 rounded-lg font-semibold hover:bg-brand-secondary transition-all shadow-md flex items-center justify-center"
                    >
                        Siparişlerimi Görüntüle
                    </button>

                    <button
                        onClick={() => router.push('/shop')}
                        className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center group"
                    >
                        Alışverişe Devam Et
                        <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
