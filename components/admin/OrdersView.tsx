
import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { Order, ShippingCompany } from '../../types';
import { sendFormToEmail } from '../../services/emailService';
import { CloseIcon, TruckIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '../Icons';

const OrdersView: React.FC = () => {
    const { orders, updateOrderStatus, deleteOrder } = useOrders();

    // Modal State
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [tempStatus, setTempStatus] = useState<Order['status']>('İşleniyor');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [shippingCompany, setShippingCompany] = useState<ShippingCompany>('Yurtiçi Kargo');
    const [isSending, setIsSending] = useState(false);

    // Expand State
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const toggleExpand = (orderId: string) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        // Eğer kargolandı veya yolda seçildiyse modal aç
        if (newStatus === 'Kargolandı' || newStatus === 'Yolda') {
            setSelectedOrderId(orderId);
            setTempStatus(newStatus);
            setTrackingNumber(''); // Reset for manual entry
            setShippingCompany('Yurtiçi Kargo');
            setIsTrackingModalOpen(true);
        } else {
            // Diğer durumlar için direkt güncelle
            updateOrderStatus(orderId, newStatus);
        }
    };

    const handleSaveTrackingInfo = async () => {
        if (!selectedOrderId) return;
        setIsSending(true);

        // Veritabanını güncelle
        await updateOrderStatus(selectedOrderId, tempStatus, { trackingNumber, shippingCompany });

        // Mail Gönderimi (Müşteriye)
        // order nesnesini bul
        const order = orders.find(o => o.id === selectedOrderId);
        if (order) {
            await sendFormToEmail('Sipariş Kargolandı', {
                orderId: order.id,
                trackingNumber: trackingNumber,
                shippingCompany: shippingCompany,
                customerName: order.customerName || 'Değerli Müşterimiz',
                email: order.email // Müşterinin e-posta adresi (artık Order tipinde var)
            });
        }

        setIsSending(false);
        setIsTrackingModalOpen(false);
        setSelectedOrderId(null);
    };

    const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
        const colorClasses = {
            'Teslim Edildi': 'bg-green-100 text-green-800',
            'Yolda': 'bg-blue-100 text-blue-800',
            'Kargolandı': 'bg-blue-100 text-blue-800',
            'İşleniyor': 'bg-yellow-100 text-yellow-800',
            'Ödeme Bekleniyor': 'bg-orange-100 text-orange-800',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
                {status}
            </span>
        );
    };

    const companies: ShippingCompany[] = ['Yurtiçi Kargo', 'MNG Kargo', 'Aras Kargo', 'Trendyol Express', 'Sürat Kargo', 'PTT Kargo', 'UPS Kargo'];

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Sipariş Yönetimi</h1>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-10 px-2 py-3"></th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri / Adres</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length > 0 ? orders.map(order => (
                            <React.Fragment key={order.id}>
                                <tr className={`hover:bg-gray-50 transition-colors ${expandedOrderId === order.id ? 'bg-gray-50' : ''}`}>
                                    <td className="px-2 py-4 text-center">
                                        <button
                                            onClick={() => toggleExpand(order.id)}
                                            className="text-gray-500 hover:text-brand-primary focus:outline-none"
                                            title="Detayları Göster"
                                        >
                                            {expandedOrderId === order.id ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString('tr-TR')}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs" title={order.shippingAddress}>
                                        <div className="font-medium text-gray-900">{order.customerName}</div>
                                        <div className="text-xs">{order.email}</div>
                                        <div className="text-xs truncate">{order.shippingAddress || 'Adres Bilgisi Yok'}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toFixed(2)} TL</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <StatusBadge status={order.status} />
                                        {order.trackingNumber && <div className="text-xs text-gray-400 mt-1">{order.trackingNumber}</div>}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                                className="block w-full pl-2 pr-8 py-1 text-sm bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary rounded-md shadow-sm"
                                            >
                                                <option value="Ödeme Bekleniyor">Ödeme Bekleniyor</option>
                                                <option value="İşleniyor">İşleniyor</option>
                                                <option value="Kargolandı">Kargolandı</option>
                                                <option value="Yolda">Yolda</option>
                                                <option value="Teslim Edildi">Teslim Edildi</option>
                                            </select>
                                            <button
                                                onClick={() => deleteOrder(order.id)}
                                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 border border-red-200"
                                                title="Siparişi Sil"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                                <span className="text-xs font-bold">Sil</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedOrderId === order.id && (
                                    <tr>
                                        <td colSpan={7} className="px-0 py-0 border-b border-gray-200">
                                            <div className="bg-gray-50 p-6 shadow-inner">
                                                <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                                    <span className="bg-brand-secondary w-2 h-6 mr-3 rounded-full"></span>
                                                    Sipariş Detayları
                                                </h3>

                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                                    <div className="lg:col-span-2">
                                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                            <table className="min-w-full divide-y divide-gray-200">
                                                                <thead className="bg-gray-100">
                                                                    <tr>
                                                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Ürün</th>
                                                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Seçenekler</th>
                                                                        <th className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">Adet</th>
                                                                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase">Fiyat</th>
                                                                        <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase">Toplam</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-200">
                                                                    {order.items.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td className="px-4 py-3">
                                                                                <div className="flex items-center">
                                                                                    <img src={item.imageUrl} alt={item.name} className="h-10 w-10 object-cover rounded border border-gray-200 mr-3" />
                                                                                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                                                {item.customDimensions ? (
                                                                                    <div className="flex flex-col">
                                                                                        <span className="text-brand-secondary font-bold text-xs">Özel Ölçü</span>
                                                                                        <span>{item.customDimensions.width} x {item.customDimensions.height} cm</span>
                                                                                        {item.selectedColor && <span className="text-xs text-gray-500">Renk: {item.selectedColor}</span>}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex flex-col space-y-0.5">
                                                                                        {item.selectedColor && <span><span className="font-semibold">Renk:</span> {item.selectedColor}</span>}
                                                                                        {item.selectedSize && <span><span className="font-semibold">Beden:</span> {item.selectedSize}</span>}
                                                                                        {!item.selectedColor && !item.selectedSize && <span className="text-gray-400 italic">Standart</span>}
                                                                                    </div>
                                                                                )}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                                                                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.price.toFixed(2)} TL</td>
                                                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{(item.price * item.quantity).toFixed(2)} TL</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-5 rounded-lg border border-gray-200 h-fit">
                                                        <h4 className="font-bold text-gray-700 border-b border-gray-100 pb-2 mb-3">Müşteri & Teslimat</h4>
                                                        <p className="text-sm text-gray-800 font-semibold">{order.customerName}</p>
                                                        <p className="text-sm text-gray-600 mb-1">{order.phone}</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                            {order.shippingAddress}
                                                        </p>

                                                        <h4 className="font-bold text-gray-700 border-b border-gray-100 pb-2 mb-3">Özet</h4>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-gray-500">Ara Toplam:</span>
                                                            <span className="text-gray-900">{order.total.toFixed(2)} TL</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm font-bold text-brand-primary border-t border-gray-100 pt-2 mt-2">
                                                            <span>Genel Toplam:</span>
                                                            <span>{order.total.toFixed(2)} TL</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                                    Henüz sipariş bulunmuyor.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Kargo Bilgisi Modal - MANUEL GİRİŞ */}
            {isTrackingModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <TruckIcon className="h-5 w-5 mr-2 text-brand-secondary" />
                                Kargo Bilgisi Gir
                            </h3>
                            <button onClick={() => setIsTrackingModalOpen(false)}>
                                <CloseIcon className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-md mb-6 border border-yellow-100">
                            <p className="text-sm text-yellow-800 flex items-start">
                                <span className="mr-2">📦</span>
                                <span>
                                    Sipariş <strong>{selectedOrderId}</strong> için kargoya verdiğiniz fişin üzerindeki takip numarasını aşağıya giriniz.
                                </span>
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kargo Firması</label>
                                <select
                                    value={shippingCompany}
                                    onChange={(e) => setShippingCompany(e.target.value as ShippingCompany)}
                                    className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary text-sm text-gray-900"
                                >
                                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Takip Numarası</label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-secondary focus:border-brand-secondary text-sm bg-white font-mono text-gray-900"
                                    placeholder="Örn: 404938291823"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * Müşteri bu numara ile kargosunu takip edecektir.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setIsTrackingModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSaveTrackingInfo}
                                disabled={!trackingNumber || isSending}
                                className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-dark disabled:opacity-50 flex items-center text-sm font-medium shadow-sm"
                            >
                                {isSending ? 'Kaydediliyor...' : 'Kaydet ve Bildir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersView;