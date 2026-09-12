import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_ep1ag7h";
const EMAILJS_TEMPLATE_ID = "template_b2gtwra";
const EMAILJS_USER_ID = "d6OwWqWLEUHWVkIhA";

const sendEmailServerSide = async (templateParams: any) => {
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_USER_ID,
                template_params: templateParams
            }),
        });
        if (!response.ok) {
            const errText = await response.text();
            console.error("EmailJS API Error:", errText);
        } else {
            console.log("Email sent successfully via API");
        }
    } catch (error) {
        console.error("Email API Network Error:", error);
    }
};

export async function POST(req: NextRequest) {
    try {
        const data: Record<string, string> = {};

        // PayTR sends application/x-www-form-urlencoded
        try {
            const formData = await req.formData();
            formData.forEach((value, key) => {
                data[key] = String(value);
            });
        } catch {
            const rawText = await req.text();
            const params = new URLSearchParams(rawText);
            params.forEach((value, key) => {
                data[key] = value;
            });
        }

        console.log("📥 PayTR Callback Received:", data.merchant_oid, data.status);

        const merchant_key = process.env.PAYTR_MERCHANT_KEY;
        const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

        if (!merchant_key || !merchant_salt) {
            console.error("❌ PAYTR_MERCHANT_KEY or SALT missing");
            return new NextResponse("PAYTR notification failed: config error", { status: 500 });
        }

        const incoming_hash = data.hash;
        const hash_str = data.merchant_oid + merchant_salt + data.status + data.total_amount;
        const check_hash = crypto
            .createHmac('sha256', merchant_key)
            .update(hash_str)
            .digest('base64');

        if (incoming_hash !== check_hash) {
            console.error("❌ Hash mismatch!");
            return new NextResponse("PAYTR notification failed: bad hash", { status: 200 });
        }

        if (data.status === 'success') {
            console.log("✅ Payment Success for Order:", data.merchant_oid);

            const orderRef = doc(db, 'orders', data.merchant_oid);

            // 1. Update Firestore - Status strictly set to 'İşleniyor' and isPaid to true
            await updateDoc(orderRef, {
                status: 'İşleniyor',
                isPaid: true,
                paymentId: data.payment_id || 'paytr_unknown',
                paymentDate: new Date().toISOString(),
                paymentAmount: data.total_amount,
                paymentMethod: 'PayTR'
            });

            // 2. Send Emails
            const clientEmail = data.email;

            // Send to Customer
            if (clientEmail) {
                await sendEmailServerSide({
                    to_name: "Değerli Müşterimiz",
                    to_email: clientEmail,
                    from_name: "MiraTekstil",
                    subject: `✅ Siparişiniz Alındı - #${data.merchant_oid}`,
                    message: `Siparişiniz (#${data.merchant_oid}) başarıyla alındı ve ödemesi onaylandı. Tutar: ${data.total_amount} TL. Siparişiniz hazırlanmaya başlandı.`,
                    reply_to: "yilmazbaris814@gmail.com"
                });
            }

            // Send to Admin
            await sendEmailServerSide({
                to_name: "Yönetici",
                to_email: "yilmazbaris814@gmail.com",
                from_name: "MiraTekstil Sistem",
                subject: `🎉 ÖDEME ONAYLANDI (HAZIRLANACAK) - #${data.merchant_oid}`,
                message: `Sipariş #${data.merchant_oid} için PayTR ödemesi BAŞARILI! Tutar: ${data.total_amount} TL. Bu siparişi hazırlayıp kargolayabilirsiniz.`,
                reply_to: clientEmail || "yilmazbaris814@gmail.com"
            });

        } else {
            console.warn("⚠️ Payment Failed:", data.merchant_oid);
            const orderRef = doc(db, 'orders', data.merchant_oid);
            await updateDoc(orderRef, {
                status: 'Ödeme Başarısız',
                isPaid: false,
                failedReason: data.failed_reason_msg || 'Ödeme tamamlanamadı'
            });
        }

        // PayTR requires exactly 'OK' with 200 status
        return new NextResponse("OK");

    } catch (error) {
        console.error("❌ Callback Error:", error);
        return new NextResponse("Callback error", { status: 500 });
    }
}