"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order, OrderItem, ReturnRequest } from '../types';
import { useOrders } from '../context/OrderContext';

interface ReturnRequestContentProps {
    orderId: string;
}

// Helper types
type ReturnItemDetails = {
    selected: boolean;
    quantity: number;
    reason: string;
    maxQuantity: number;
};
type ReturnItemSelection = Record<string, ReturnItemDetails>;

const ReturnRequestContent: React.FC<ReturnRequestContentProps> = ({ orderId }) => {
    const router = useRouter();
    const { orders } = useOrders();
    const [order, setOrder] = useState<Order | null>(null);

    const [selectedItems, setSelectedItems] = useState<ReturnItemSelection>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Find order
        const foundOrder = orders.find(o => o.id === orderId);
        if (!foundOrder) {
            // Handle not found
            // router.push('/account'); // Or show error
        } else {
            setOrder(foundOrder);
            // Initialize selection
            const initialSelection: ReturnItemSelection = foundOrder.items.reduce((acc, item) => {
                acc[item.id] = { selected: false, quantity: 1, reason: '', maxQuantity: item.quantity };
                return acc;
            }, {} as ReturnItemSelection);
            setSelectedItems(initialSelection);
        }
    }, [orderId, orders]);

    if (!order) {
        return <div className="p-12 text-center">Yükleniyor...</div>;
    }

    const handleCheckboxChange = (itemId: string) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], selected: !prev[itemId].selected }
        }));
    };

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        const max = selectedItems[itemId].maxQuantity;
        if (newQuantity >= 1 && newQuantity <= max) {
            setSelectedItems(prev => ({
                ...prev,
                [itemId]: { ...prev[itemId], quantity: newQuantity }
            }));
        }
    };

    const handleReasonChange = (itemId: string, reason: string) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], reason: reason }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // In a real app, send to API
        const itemsToReturn: OrderItem[] = order.items
            .filter(item => selectedItems[item.id].selected)
            .map(item => ({ ...item, quantity: selectedItems[item.id].quantity }));

        // Simulate API call
        setTimeout(() => {
            const newReturnRequest: ReturnRequest = {
                id: `RTN-${Math.floor(10000 + Math.random() * 90000)}`,
                orderId: order.id,
                date: new Date().toISOString().split('T')[0],
                status: 'Talep Alındı',
                items: itemsToReturn,
                returnCode: `MNG-RTN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            };

            // Store in simple local storage or context if we had a ReturnContext
            // For now, let's just navigate to status page with the new ID (simulated)
            // In a real app, the backend gives us the ID.
            console.log('Return Created:', newReturnRequest);

            // Since we don't have a real backend, we can't persist this between refreshes easily without a context.
            // But for the demo/migration purpose, we can pass data via URL or maybe just mock it on the status page.
            // Or better, let's just go to a generic status page that mocks looking it up, or pass params.

            // Encode data to pass to success page for demo purposes
            const dataStr = encodeURIComponent(JSON.stringify(newReturnRequest));
            router.push(`/account/return-status/${newReturnRequest.id}?data=${dataStr}`);
        }, 1500);
    };

    const isAnyItemSelected = Object.values(selectedItems).some((item: ReturnItemDetails) => item.selected);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-8">
                <button onClick={() => router.push('/account')} className="text-sm text-gray-600 hover:text-brand-primary">&larr; Sipariş Detaylarına Geri Dön</button>
            </div>

            <h1 className="text-4xl font-serif text-brand-primary mb-2">İade Talebi Oluştur</h1>
            <p className="text-gray-600 mb-8">Sipariş No: {order.id}</p>

            <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-200">
                <h2 className="text-2xl font-serif mb-6">İade Edilecek Ürünleri Seçin</h2>

                <div className="space-y-6">
                    {order.items.map(item => (
                        <div key={item.id} className={`p-4 border rounded-lg transition-all ${selectedItems[item.id]?.selected ? 'border-brand-secondary bg-brand-secondary/5' : 'border-gray-200'}`}>
                            <div className="flex items-start space-x-4">
                                <input
                                    type="checkbox"
                                    checked={selectedItems[item.id]?.selected || false}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="mt-1 h-5 w-5 text-brand-primary focus:ring-brand-secondary border-gray-300 rounded"
                                />
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-brand-dark">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.price.toFixed(2)} TL</p>
                                </div>
                            </div>

                            {selectedItems[item.id]?.selected && (
                                <div className="mt-4 pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Adet</label>
                                        <input
                                            type="number"
                                            value={selectedItems[item.id].quantity}
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                            min="1"
                                            max={selectedItems[item.id].maxQuantity}
                                            className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">İade Nedeni</label>
                                        <select
                                            value={selectedItems[item.id].reason}
                                            onChange={(e) => handleReasonChange(item.id, e.target.value)}
                                            required
                                            className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                        >
                                            <option value="">Neden seçin...</option>
                                            <option value="yanlis_beden">Yanlış beden/numara</option>
                                            <option value="begenmedim">Ürünü beğenmedim</option>
                                            <option value="hasarli_urun">Hasarlı/kusurlu ürün</option>
                                            <option value="yanlis_urun">Yanlış ürün gönderilmiş</option>
                                            <option value="diger">Diğer</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t">
                    <button
                        type="submit"
                        disabled={!isAnyItemSelected || isSubmitting}
                        className="w-full md:w-auto bg-brand-primary text-white px-10 py-3 text-center hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'İade Talebi Gönder'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReturnRequestContent;
