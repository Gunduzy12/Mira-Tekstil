import React, { useState, useEffect } from 'react';
import { usePromotions } from '../../context/PromotionContext'; 
import { useProducts } from '../../context/ProductContext';
import { Coupon, Product, ProductVariant } from '../../types';
import { TicketIcon, TagIcon, PlusIcon, TrashIcon } from '../Icons';

// ... (PromotionProductRowProps ve PromotionProductRow bileşeni aynı)

interface PromotionProductRowProps {
    product: Product;
    onUpdate: (id: string, newPrice: number, newDate: string) => void;
}

const PromotionProductRow: React.FC<PromotionProductRowProps> = ({ product, onUpdate }) => {
    const originalPrice = product.originalPrice || 0;
    const basePrice = originalPrice > 0 && originalPrice > product.priceFrom 
        ? originalPrice 
        : product.priceFrom;
    
    const [priceInput, setPriceInput] = useState(product.priceFrom);
    const [dateInput, setDateInput] = useState(product.discountEndDate || '');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setPriceInput(product.priceFrom);
        setDateInput(product.discountEndDate || '');
        setIsDirty(false);
    }, [product]);

    const handlePriceChange = (val: string) => {
        setPriceInput(Number(val));
        setIsDirty(true);
    };

    const handleDateChange = (val: string) => {
        setDateInput(val);
        setIsDirty(true);
    };

    const handleSave = () => {
        onUpdate(product.id, priceInput, dateInput);
        setIsDirty(false);
    };

    const handleReset = () => {
        setPriceInput(basePrice);
        setDateInput('');
        onUpdate(product.id, basePrice, '');
    };

    const discountPercentage = basePrice > 0 ? Math.round(((basePrice - priceInput) / basePrice) * 100) : 0;
    const isDiscounted = priceInput < basePrice;

    const inputStyle = "w-full p-2 bg-white text-black border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-secondary";

    return (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 border border-gray-200 rounded-md overflow-hidden">
                        <img className="h-12 w-12 object-cover" src={product.imageUrl} alt="" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{basePrice.toFixed(2)} TL</span>
                    {originalPrice > 0 && originalPrice > product.priceFrom && (
                        <span className="text-xs text-green-600 font-bold">Şu an: {product.priceFrom.toFixed(2)} TL</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                    <div className="relative">
                        <input 
                            type="number" 
                            min="0"
                            step="0.01"
                            value={priceInput}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            className={`${inputStyle} w-32 pl-3 pr-8 ${isDiscounted ? 'text-red-600 font-bold border-red-300' : ''}`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">TL</span>
                    </div>
                    {isDiscounted && discountPercentage > 0 ? (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit">
                            %{discountPercentage} İndirim
                        </span>
                    ) : null}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <input 
                    type="date" 
                    value={dateInput}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className={inputStyle}
                />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-2">
                    {(isDirty || isDiscounted) && (
                        <button 
                            onClick={handleSave}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-bold transition-all shadow-sm ${isDirty ? 'bg-brand-primary text-white hover:bg-brand-dark' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                            {isDirty ? 'Kaydet' : 'Güncelle'}
                        </button>
                    )}
                    
                    {originalPrice > 0 && originalPrice > product.priceFrom && (
                        <button 
                            onClick={handleReset}
                            className="flex items-center px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm font-bold hover:bg-red-100 hover:border-red-300 transition-colors shadow-sm"
                            title="Fiyatı eski haline döndür ve indirimi kaldır"
                        >
                           İndirimi Sıfırla
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

const PromotionsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'coupons' | 'discounts'>('coupons');
    const { products, updateProduct } = useProducts();
    const { coupons, addCoupon, deleteCoupon } = usePromotions();
    
    const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
        code: '',
        type: 'percent',
        value: 0,
        minSpend: 0,
        expirationDate: '',
        isActive: true
    });

    const handleAddCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        const couponToAdd: Omit<Coupon, 'id'> = {
            code: newCoupon.code?.toUpperCase() || '',
            type: newCoupon.type || 'percent',
            value: Number(newCoupon.value),
            minSpend: Number(newCoupon.minSpend),
            expirationDate: newCoupon.expirationDate,
            isActive: true
        };
        await addCoupon(couponToAdd);
        setNewCoupon({ code: '', type: 'percent', value: 0, minSpend: 0, expirationDate: '', isActive: true });
    };

    const handleDeleteCoupon = (id: string) => {
        if(window.confirm("Bu kuponu silmek istediğinize emin misiniz?")) {
            deleteCoupon(id);
        }
    };

    // HACI: Fiyat Güncelleme Mantığı (Fix: 0'a bölünme hatası giderildi)
    const handleProductUpdate = async (id: string, newPrice: number, newDate: string) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const originalBasePrice = (product.originalPrice || 0) > 0 
            ? product.originalPrice! 
            : product.priceFrom;

        const isRemovingDiscount = newPrice >= originalBasePrice;

        // Eğer mevcut fiyat 0 ise (ki olmamalı ama önlem alalım), değişim oranı 1 olsun (değişmesin)
        const changeRatio = product.priceFrom > 0 ? (newPrice / product.priceFrom) : 1;
        
        let updatedVariants: ProductVariant[] = [];

        if (isRemovingDiscount) {
            updatedVariants = product.variants.map(v => {
                const restorePrice = (v.originalPrice || 0) > 0 
                    ? v.originalPrice! 
                    : (v.price * changeRatio);
                
                return {
                    ...v,
                    price: Number(restorePrice.toFixed(2)),
                    originalPrice: 0 
                };
            });
        } else {
            updatedVariants = product.variants.map(v => {
                const vBase = (v.originalPrice || 0) > 0 ? v.originalPrice! : v.price;
                const vNewPrice = vBase * (newPrice / originalBasePrice);
                
                return {
                    ...v,
                    price: Number(vNewPrice.toFixed(2)), 
                    originalPrice: vBase 
                };
            });
        }
        
        let updatedPricePerSqM = product.pricePerSqM;
        if (product.isCustomSize && product.pricePerSqM) {
            updatedPricePerSqM = product.pricePerSqM * changeRatio;
        }

        let updatedProduct: Product;

        if (isRemovingDiscount) {
            updatedProduct = {
                ...product,
                priceFrom: originalBasePrice,
                originalPrice: 0,
                discountEndDate: null, 
                isDeal: false,
                advantageTier: null,
                variants: updatedVariants,
                pricePerSqM: updatedPricePerSqM
            };
        } else {
            updatedProduct = {
                ...product,
                priceFrom: Number(newPrice.toFixed(2)),
                originalPrice: originalBasePrice,
                discountEndDate: newDate,
                isDeal: true,
                advantageTier: 'Süper Avantajlı',
                variants: updatedVariants,
                pricePerSqM: updatedPricePerSqM
            };
        }

        await updateProduct(updatedProduct);
    };

    const inputClass = "w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition-all font-medium";

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Kampanya Yönetimi</h1>
            </div>

            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 w-fit mb-8">
                <button
                    onClick={() => setActiveTab('coupons')}
                    className={`py-2.5 px-6 font-medium text-sm rounded-md transition-all ${activeTab === 'coupons' ? 'bg-brand-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                    <div className="flex items-center space-x-2">
                        <TicketIcon className="h-4 w-4" />
                        <span>Kupon Kodları</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('discounts')}
                    className={`py-2.5 px-6 font-medium text-sm rounded-md transition-all ${activeTab === 'discounts' ? 'bg-brand-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                    <div className="flex items-center space-x-2">
                        <TagIcon className="h-4 w-4" />
                        <span>Ürün İndirimleri</span>
                    </div>
                </button>
            </div>

            {activeTab === 'coupons' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ... (Aynı) ... */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Yeni Kupon Oluştur</h2>
                        <form onSubmit={handleAddCoupon} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kupon Kodu</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newCoupon.code}
                                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                                    className={inputClass} 
                                    placeholder="Örn: YAZ20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tip</label>
                                    <select 
                                        value={newCoupon.type}
                                        onChange={e => setNewCoupon({...newCoupon, type: e.target.value as 'percent' | 'fixed'})}
                                        className={inputClass}
                                    >
                                        <option value="percent">Yüzde (%)</option>
                                        <option value="fixed">Tutar (TL)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Değer</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newCoupon.value}
                                        onChange={e => setNewCoupon({...newCoupon, value: Number(e.target.value)})}
                                        className={inputClass} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Min. Sepet Tutarı</label>
                                <input 
                                    type="number" 
                                    value={newCoupon.minSpend}
                                    onChange={e => setNewCoupon({...newCoupon, minSpend: Number(e.target.value)})}
                                    className={inputClass} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Bitiş Tarihi</label>
                                <input 
                                    type="date" 
                                    value={newCoupon.expirationDate}
                                    onChange={e => setNewCoupon({...newCoupon, expirationDate: e.target.value})}
                                    className={inputClass} 
                                />
                            </div>
                            <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center font-bold shadow-lg shadow-brand-primary/20">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Kuponu Kaydet
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-lg font-bold text-gray-900">Aktif Kuponlar</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kod</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">İndirim</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Koşul</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bitiş</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Sil</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {coupons.map(coupon => (
                                        <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <TicketIcon className="w-5 h-5 text-brand-secondary mr-2" />
                                                    <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                {coupon.type === 'percent' ? `%${coupon.value}` : `${coupon.value} TL`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {(coupon.minSpend || 0) > 0 ? `Min. ${coupon.minSpend} TL` : 'Alt limit yok'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                {coupon.expirationDate || 'Süresiz'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-gray-400 hover:text-red-600 transition-colors p-2">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {coupons.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                                Henüz oluşturulmuş bir kupon yok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'discounts' && (
                <div className="space-y-6">
                     <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md flex items-start shadow-sm">
                        <span className="text-2xl mr-4">💡</span>
                        <div>
                            <h3 className="font-bold text-blue-900">Hızlı İndirim Düzenleme</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                İndirimi kaldırmak için <strong>"İndirimi Sıfırla"</strong> butonuna basın veya fiyatı eski haline getirip güncelleyin. 
                                Sistem otomatik olarak eski fiyatları geri yükleyecektir.
                            </p>
                        </div>
                     </div>

                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün Bilgisi</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Orijinal / Baz</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">İndirimli Fiyat Gir</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kampanya Bitiş</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {products.map(product => (
                                    <PromotionProductRow 
                                        key={product.id} 
                                        product={product} 
                                        onUpdate={handleProductUpdate} 
                                    />
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Ürün bulunamadı.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}
        </div>
    );
};

export default PromotionsView;