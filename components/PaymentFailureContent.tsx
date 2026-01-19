"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CloseIcon } from './Icons';

const PaymentFailureContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const failMessage = searchParams.get('fail_message') || 'Ödeme işlemi sırasında beklenmedik bir hata oluştu.';

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-xl text-center border border-red-100 animate-fadeIn">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                    <CloseIcon className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Ödeme Başarısız</h1>
                <p className="text-gray-500 mb-6">
                    Maalesef ödeme işleminiz tamamlanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.
                </p>

                <div className="bg-red-50 border border-red-100 p-4 rounded-lg mb-8 text-left">
                    <p className="text-xs font-bold text-red-800 uppercase mb-1">Hata Detayı:</p>
                    <p className="text-sm text-red-700 font-medium">
                        {failMessage}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-brand-primary text-white py-3.5 rounded-lg font-semibold hover:bg-brand-secondary transition-all shadow-md"
                    >
                        Tekrar Dene
                    </button>

                    <button
                        onClick={() => router.push('/contact')}
                        className="w-full text-gray-500 py-3 rounded-lg font-medium hover:text-brand-primary transition-colors text-sm hover:underline"
                    >
                        Sorun devam ederse bizimle iletişime geçin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailureContent;
