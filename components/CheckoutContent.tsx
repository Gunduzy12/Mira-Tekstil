"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePromotions } from '../context/PromotionContext';
import { initializePaytrPayment } from '../services/paytrService';
import { useNotification } from '../context/NotificationContext';
import { Coupon } from '../types';
import { sendFormToEmail } from '../services/emailService';

// İkon (SVG)
const CreditCardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const CheckoutContent: React.FC = () => {
    const router = useRouter();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const promotionContext = usePromotions();
    const coupons = promotionContext ? promotionContext.coupons : [];
    const { showNotification } = useNotification();

    // STATE
    const [iframeToken, setIframeToken] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [userIp, setUserIp] = useState('127.0.0.1');
    const [couponCode, setCouponCode] = useState('');
    const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
    const [contractsAccepted, setContractsAccepted] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        zipCode: '',
    });

    // 1. IP Al
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setUserIp(data.ip))
            .catch(err => console.error("IP hatası", err));
    }, []);

    // 2. PayTR Dönüş Kontrolü
    useEffect(() => {
        // Next.js client component - window usage is safe in useEffect
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        if (status === 'success') {
            clearCart();
            setOrderPlaced(true);
            window.history.replaceState({}, '', window.location.pathname);
        } else if (status === 'failed') {
            showNotification(params.get('fail_message') || 'Ödeme başarısız.', 'error');
            setIsProcessing(false);
            setIframeToken(null);
        }
    }, [clearCart, showNotification]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- HESAPLAMALAR ---
    const discountAmount = useMemo(() => {
        if (!activeCoupon) return 0;
        const val = Number(activeCoupon.value);
        if (isNaN(val)) return 0;
        if (activeCoupon.minSpend && cartTotal < activeCoupon.minSpend) return 0;

        let discount = activeCoupon.type === 'percent' ? (cartTotal * val) / 100 : val;
        return discount > cartTotal ? cartTotal : discount;
    }, [cartTotal, activeCoupon]);

    const shippingCost = (cartTotal - discountAmount) > 500 ? 0 : 50;
    const subTotalAfterDiscount = cartTotal - discountAmount;
    const total = Math.max(0, subTotalAfterDiscount + shippingCost);

    // --- KUPON ---
    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        const code = couponCode.trim().toUpperCase();
        if (!code) return showNotification('Kupon kodu giriniz.', 'error');

        const coupon = coupons.find(c => c.code === code && c.isActive);
        if (!coupon) {
            setActiveCoupon(null);
            return showNotification('Geçersiz kupon.', 'error');
        }
        if (coupon.minSpend && cartTotal < coupon.minSpend) {
            return showNotification(`Sepet en az ${coupon.minSpend} TL olmalı.`, 'error');
        }
        setActiveCoupon(coupon);
        showNotification('Kupon uygulandı!', 'success');
    };

    // --- ÖDEME BAŞLAT ---
    const handleStartPayment = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
            return showNotification('Teslimat bilgilerini doldurunuz.', 'error');
        }
        if (!contractsAccepted) {
            return showNotification('Sözleşmeleri onaylayınız.', 'error');
        }

        setIsProcessing(true);

        const fullName = `${formData.firstName} ${formData.lastName}`;
        const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
        const fullAddress = `${formData.address} ${formData.district}/${formData.city}`;
        const shippingAddress = fullAddress;
        const orderId = "SIP" + Date.now();

        const itemsDetailString = cartItems.map(item => {
            let details = `- ${item.productName} (x${item.quantity})`;
            if (item.variant?.color) details += ` [Renk: ${item.variant.color}]`;
            if (item.variant?.size) details += ` [Beden: ${item.variant.size}]`;
            if (item.customDimensions) details += ` [Özel Ölçü: ${item.customDimensions.width}x${item.customDimensions.height}cm]`;
            return details;
        }).join('\n');

        try {
            await sendFormToEmail('Yeni Sipariş (Admin)', {
                orderId: orderId,
                customerName: fullName,
                email: formData.email,
                phone: formData.phone,
                address: shippingAddress,
                total: total.toFixed(2),
                items: itemsDetailString
            });

            await sendFormToEmail('Sipariş Alındı (Müşteri)', {
                orderId: orderId,
                customerName: fullName,
                email: formData.email,
                total: total.toFixed(2),
                address: shippingAddress
            });
        } catch (mailError) {
            console.error("Mail hatası:", mailError);
        }

        const paytrBasketItems: any[] = [];
        cartItems.forEach(item => {
            let price = item.variant.price;
            if (discountAmount > 0) {
                price = (price / cartTotal) * (cartTotal - discountAmount);
            }
            paytrBasketItems.push([item.productName, price.toFixed(2), item.quantity.toString()]);
        });

        if (shippingCost > 0) {
            paytrBasketItems.push(["Kargo Ücreti", shippingCost.toFixed(2), "1"]);
        }

        try {
            const requestData = {
                orderId: orderId,
                email: formData.email,
                paymentAmount: Math.round(total * 100),
                userName: fullName,
                userAddress: fullAddress,
                userPhone: cleanPhone,
                basketItems: paytrBasketItems,
                userIp: userIp,
            };

            // @ts-ignore
            const paytrResponse = await initializePaytrPayment(requestData);

            if (paytrResponse && (paytrResponse as any).token) {
                setIframeToken((paytrResponse as any).token);
            } else if (typeof paytrResponse === 'string') {
                setIframeToken(paytrResponse);
            } else {
                showNotification('PayTR Token alınamadı.', 'error');
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("API Hatası:", error);
            setIsProcessing(false);
            showNotification('Sistem hatası.', 'error');
        }
    };

    // --- RENDER ---
    if (orderPlaced) {
        return (
            <div style={{ padding: '100px 20px', textAlign: 'center', fontFamily: "'Garamond', serif" }}>
                <div style={{ fontSize: 50, color: 'green', marginBottom: 20 }}>✓</div>
                <h1 style={{ fontSize: '2.5rem' }}>Siparişiniz Alındı!</h1>
                <p>Teşekkür ederiz.</p>
                <button onClick={() => router.push('/shop')} style={{ marginTop: 20, padding: '10px 20px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>Alışverişe Dön</button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <style>{`
        .checkout-container { font-family: 'Segoe UI', sans-serif; background-color: #fcfcfc; min-height: 100vh; padding: 40px 20px; color: #333; }
        .layout-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 40px; max-width: 1200px; margin: 0 auto; align-items: start; }
        @media (max-width: 900px) { .layout-grid { grid-template-columns: 1fr; } }
        .section-title { font-family: 'Garamond', serif; font-size: 1.8rem; margin-bottom: 25px; color: #222; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .info-card, .summary-card { background: #fff; border: 1px solid #e5e5e5; padding: 30px; border-radius: 4px; margin-bottom: 30px; }
        .summary-card { position: sticky; top: 20px; }
        .input-row { display: flex; gap: 20px; margin-bottom: 20px; }
        .styled-input { width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 4px; outline: none; box-sizing: border-box; }
        .styled-input:focus { border-color: #333; }
        .checkout-btn { width: 100%; background-color: #222; color: white; padding: 16px; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; margin-top: 25px; }
        .checkout-btn:disabled { background-color: #999; }
        .product-item { display: flex; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .product-img { width: 60px; height: 80px; object-fit: cover; background: #eee; border-radius: 4px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #555; }
        .total { font-weight: bold; font-size: 1.2rem; color: #000; border-top: 1px solid #eee; paddingTop: 20px; marginTop: 20px; display: flex; justify-content: space-between; }
      `}</style>

            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 className="section-title" style={{ border: 'none', fontSize: '2.5rem' }}>Güvenli Ödeme</h1>
            </div>

            <div className="layout-grid">
                {/* SOL TARAFLAR */}
                <div>
                    {iframeToken ? (
                        <div className="info-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h2 className="section-title" style={{ margin: 0, border: 0 }}>Kart ile Ödeme</h2>
                                <button
                                    onClick={() => { setIframeToken(null); setIsProcessing(false); }}
                                    style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Bilgileri Düzenle / İptal
                                </button>
                            </div>
                            <iframe
  src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
  title="PayTR Güvenli Ödeme"
  style={{
    width: "100%",
    minHeight: "100vh",
    height: "1400px",   // Mobil güvenli alan
    border: "none"
  }}
/>
                        </div>
                    ) : (
                        <>
                            <div className="info-card">
                                <h2 className="section-title">Teslimat Bilgileri</h2>
                                <div className="input-row">
                                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ad" className="styled-input" />
                                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Soyad" className="styled-input" />
                                </div>
                                <div className="input-row"><input name="email" value={formData.email} onChange={handleInputChange} placeholder="E-posta" className="styled-input" /></div>
                                <div className="input-row"><input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Telefon" className="styled-input" /></div>
                                <div className="input-row"><input name="address" value={formData.address} onChange={handleInputChange} placeholder="Adres" className="styled-input" /></div>
                                <div className="input-row">
                                    <input name="city" value={formData.city} onChange={handleInputChange} placeholder="İl" className="styled-input" />
                                    <input name="district" value={formData.district} onChange={handleInputChange} placeholder="İlçe" className="styled-input" />
                                </div>
                                <div className="input-row"><input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="Posta Kodu" className="styled-input" /></div>
                            </div>

                            <div className="info-card">
                                <h2 className="section-title">Ödeme Yöntemi</h2>
                                <div style={{ border: '1px solid #eee', padding: 20, background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <CreditCardIcon />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Kredi / Banka Kartı</div>
                                            <div style={{ fontSize: 12, color: '#666' }}>PayTR güvencesiyle 3D Secure ödeme.</div>
                                        </div>
                                    </div>
                                    <img src="https://imgur.com/gmm8GTE.png" alt="PayTR" style={{ height: 25, objectFit: 'contain' }} />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* SAĞ TARAF (ÖZET) */}
                <div>
                    <div className="summary-card">
                        <h2 className="section-title">Sipariş Özeti</h2>

                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {cartItems.length === 0 ? <p>Sepetiniz boş.</p> : cartItems.map(item => (
                                <div key={item.productId || Math.random()} className="product-item">
                                    <img src={item.variant?.imageUrl || item.productImageUrl} className="product-img" alt={item.productName} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.productName}</div>
                                        <div style={{ fontSize: 12, color: '#777' }}>x{item.quantity}</div>
                                        <div style={{ fontWeight: 500, marginTop: 5 }}>{(item.variant?.price * item.quantity).toFixed(2)} TL</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
                            <input
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="KUPON KODU"
                                className="styled-input"
                                style={{ padding: 10, textTransform: 'uppercase' }}
                                disabled={!!activeCoupon || !!iframeToken}
                            />
                            {activeCoupon ? (
                                <button onClick={() => { setActiveCoupon(null); setCouponCode(''); }} disabled={!!iframeToken} style={{ background: '#fee2e2', color: 'red', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '0 15px' }}>Sil</button>
                            ) : (
                                <button onClick={handleApplyCoupon} disabled={!!iframeToken} style={{ background: '#c3a783', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', padding: '0 15px' }}>Uygula</button>
                            )}
                        </div>

                        <div className="row"><span>Ara Toplam</span><span>{cartTotal.toFixed(2)} TL</span></div>
                        {activeCoupon && <div className="row" style={{ color: 'green' }}><span>İndirim</span><span>-{discountAmount.toFixed(2)} TL</span></div>}
                        <div className="row"><span>Kargo</span><span>{shippingCost === 0 ? 'Ücretsiz' : shippingCost + ' TL'}</span></div>

                        <div className="total"><span>Toplam</span><span>{total.toFixed(2)} TL</span></div>

                        {!iframeToken && (
                            <div style={{ fontSize: 12, color: '#777', marginTop: 15, display: 'flex', gap: 5 }}>
                                <input type="checkbox" checked={contractsAccepted} onChange={(e) => setContractsAccepted(e.target.checked)} style={{ marginTop: 2 }} />
                                <span>Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum.</span>
                            </div>
                        )}

                        {!iframeToken && (
                            <button className="checkout-btn" onClick={handleStartPayment} disabled={isProcessing}>
                                {isProcessing ? "İşleniyor..." : `Ödeme Yap (${total.toFixed(2)} TL)`}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutContent;
