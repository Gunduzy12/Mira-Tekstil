import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // --- PAYTR MAĞAZA BİLGİLERİ ---
        const MERCHANT_ID = process.env.PAYTR_MERCHANT_ID;
        const MERCHANT_KEY = process.env.PAYTR_MERCHANT_KEY;
        const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT;

        if (!MERCHANT_ID || !MERCHANT_KEY || !MERCHANT_SALT) {
            console.error("❌ PayTR Environment Variables Missing!");
            return NextResponse.json({ status: 'error', message: 'Sunucu yapılandırma hatası (Env)' }, { status: 500 });
        }

        // --- YARDIMCI FONKSİYON: VERİLERİ DÜZENLE ---
        let basketItems = null;
        let userBasketBase64 = "";

        // 1. Sepet Verisini İşle
        if (body.user_basket) {
            userBasketBase64 = body.user_basket;
        } else if (body.basketItems) {
            // Eğer basketItems array olarak gelirse JSON yapıp Base64'e çevir
            try {
                const jsonStr = JSON.stringify(body.basketItems);
                userBasketBase64 = Buffer.from(jsonStr).toString("base64");
            } catch (e) {
                console.error("Sepet dönüştürme hatası:", e);
                return NextResponse.json({ status: 'error', message: 'Sepet verisi geçersiz' }, { status: 400 });
            }
        } else {
            // Sepet yoksa varsayılan oluştur
            const defaultBasket = [["Genel Sipariş", "1.00", "1"]];
            userBasketBase64 = Buffer.from(JSON.stringify(defaultBasket)).toString("base64");
        }

        // 2. Tutar İşle (TL -> Kuruş veya direkt Kuruş)
        let paymentAmountStr = "";
        if (body.paymentAmount !== undefined && body.paymentAmount !== null) {
            paymentAmountStr = String(body.paymentAmount);
        } else if (body.payment_amount !== undefined && body.payment_amount !== null) {
            paymentAmountStr = String(body.payment_amount);
        }

        if (paymentAmountStr.includes(".")) {
            const asNum = Math.round(parseFloat(paymentAmountStr) * 100);
            paymentAmountStr = String(asNum);
        }

        const payload = {
            merchant_oid: body.orderId || body.merchant_oid || `OID-${Date.now()}`,
            email: body.email || body.user_email || "musteri@example.com",
            payment_amount: paymentAmountStr,
            user_ip: body.userIp || body.user_ip || "127.0.0.1",
            user_name: body.userName || body.user_name || "Misafir Kullanıcı",
            user_address: body.userAddress || body.user_address || "Adres Yok",
            user_phone: body.userPhone || body.user_phone || "05555555555",
            user_basket: userBasketBase64
        };

        console.log("🔵 İşlenen Payload:", {
            oid: payload.merchant_oid,
            amount: payload.payment_amount,
            email: payload.email
        });

        // Sabit Ayarlar
        const no_installment = "0";
        const max_installment = "0";
        const currency = "TL";
        const test_mode = "0"; // Dikkat: Test modu kapalı
        const debug_on = "1";
        const timeout_limit = "30";
        const merchant_ok_url = "https://www.miratekstiltr.com/?view=paymentSuccess"; // Bu URL'ler prodüksiyonda güncellenmeli veya env'den gelmeli
        const merchant_fail_url = "https://www.miratekstiltr.com/?view=paymentFailure";

        // Hash Oluşturma Sırası
        const hash_str =
            MERCHANT_ID +
            payload.user_ip +
            payload.merchant_oid +
            payload.email +
            payload.payment_amount +
            payload.user_basket +
            no_installment +
            max_installment +
            currency +
            test_mode;

        const paytr_token = crypto
            .createHmac("sha256", MERCHANT_KEY)
            .update(hash_str + MERCHANT_SALT)
            .digest("base64");

        // PayTR API'sine Gönderilecek Veri
        const formData = new URLSearchParams();
        formData.append('merchant_id', MERCHANT_ID);
        formData.append('user_ip', payload.user_ip);
        formData.append('merchant_oid', payload.merchant_oid);
        formData.append('email', payload.email);
        formData.append('payment_amount', payload.payment_amount);
        formData.append('paytr_token', paytr_token);
        formData.append('user_basket', payload.user_basket);
        formData.append('debug_on', debug_on);
        formData.append('no_installment', no_installment);
        formData.append('max_installment', max_installment);
        formData.append('user_name', payload.user_name);
        formData.append('user_address', payload.user_address);
        formData.append('user_phone', payload.user_phone);
        formData.append('merchant_ok_url', merchant_ok_url);
        formData.append('merchant_fail_url', merchant_fail_url);
        formData.append('timeout_limit', timeout_limit);
        formData.append('currency', currency);
        formData.append('test_mode', test_mode);

        // PayTR'a İstek At
        const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });

        const paytrData = await paytrResponse.json();

        if (paytrData.status === 'success') {
            console.log("✅ Token Başarıyla Alındı");
            return NextResponse.json({
                token: paytrData.token,
                status: "success"
            });
        } else {
            console.error("❌ PayTR API Hatası:", paytrData);
            return NextResponse.json({
                status: 'error',
                message: paytrData.reason || 'PayTR token alınamadı.'
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("❌ Genel Sunucu Hatası:", error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
