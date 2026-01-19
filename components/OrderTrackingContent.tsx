"use client";

import React, { useState } from 'react';
import { TruckIcon, SearchIcon } from './Icons';
import { getTrackingUrl } from '../utils/shippingUtils';
import { ShippingCompany } from '../types';

const OrderTrackingContent: React.FC = () => {
    const [trackingCode, setTrackingCode] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<ShippingCompany | 'Diğer'>('Diğer');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingCode) return;

        const url = getTrackingUrl(selectedCompany === 'Diğer' ? undefined : selectedCompany, trackingCode);
        window.open(url, '_blank');
    };

    const companies: ShippingCompany[] = ['Yurtiçi Kargo', 'MNG Kargo', 'Aras Kargo', 'Trendyol Express', 'Sürat Kargo', 'PTT Kargo', 'UPS Kargo'];

    return (
        <div className="bg-brand-light min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl border border-brand-border">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-brand-secondary/10 flex items-center justify-center rounded-full text-brand-secondary">
                        <TruckIcon className="h-10 w-10" />
                    </div>
                    <h2 className="mt-6 text-3xl font-serif font-bold text-brand-primary">
                        Sipariş Takibi
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Siparişinizin nerede olduğunu öğrenmek için takip numaranızı girin.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Kargo Firması</label>
                            <select
                                id="company"
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value as any)}
                                className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary"
                                style={{ backgroundColor: 'white', color: '#1a1a1a' }}
                            >
                                <option value="Diğer">Firma Seçin (Otomatik)</option>
                                {companies.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tracking-code" className="block text-sm font-medium text-gray-700 mb-1">Takip Numarası</label>
                            <div className="relative">
                                <input
                                    id="tracking-code"
                                    name="code"
                                    type="text"
                                    required
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    className="appearance-none relative block w-full px-3 py-3 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm pl-10"
                                    style={{ backgroundColor: 'white', color: '#1a1a1a' }}
                                    placeholder="Örn: 123456789"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-all shadow-md hover:shadow-lg"
                        >
                            Sorgula
                        </button>
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-4">
                        <p>Sipariş takip numaranızı sipariş onay e-postanızda veya Hesabım &gt; Siparişlerim sayfasında bulabilirsiniz.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderTrackingContent;
