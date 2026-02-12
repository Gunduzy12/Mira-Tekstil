import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_ep1ag7h";
const EMAILJS_TEMPLATE_ID = "template_b2gtwra";
const EMAILJS_USER_ID = "d6OwWqWLEUHWVkIhA"; // This is the Public Key
// Note: Ideally, use Private Key for server-side, but EmailJS allows Public Key for this endpoint if configured.
// If "Access Token" (Private Key) is required, it should be in env vars. 
// Standard client-side init uses Public Key. The API endpoint https://api.emailjs.com/api/v1.0/email/send requires user_id (Public Key) + service_id + template_id.
// It also supports 'accessToken' for security if 'Allow Public Key' is disabled in EmailJS dashboard. 
// Assuming current config works with Public Key for now.

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
        const formData = await req.formData();
        const data: any = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log("🔵 PayTR Callback Received:", data.merchant_oid, data.status);

        const merchant_key = process.env.PAYTR_MERCHANT_KEY;
        const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

        if (!merchant_key || !merchant_salt) {
            console.error("❌ PAYTR_MERCHANT_KEY or SALT missing");
            return NextResponse.json({ status: 'failed', msg: 'Config error' }, { status: 500 });
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

            // 1. Update Firestore
            await updateDoc(orderRef, {
                status: 'İşleniyor',
                paymentId: data.payment_id || 'paytr_unknown',
                paymentDate: new Date().toISOString(),
                paymentAmount: data.total_amount,
                paymentMethod: 'PayTR'
            });

            // 2. Send Emails
            // We need to fetch order details to get the customer email address
            // because PayTR callback might not return all customer details we need for the email body
            // although PayTR sends 'email' in the post data if we sent it.

            const clientEmail = data.email; // PayTR sends back the email

            // Send to Customer
            if (clientEmail) {
                await sendEmailServerSide({
                    to_name: "Değerli Müşterimiz",
                    to_email: clientEmail,
                    from_name: "MiraTekstil",
                    subject: `✅ Siparişiniz Alındı - #${data.merchant_oid}`,
                    message: `Siparişiniz (#${data.merchant_oid}) başarıyla alındı ve ödemesi onaylandı. Tutar: ${data.total_amount} TL.`,
                    reply_to: "yilmazbaris814@gmail.com"
                });
            }

            // Send to Admin
            await sendEmailServerSide({
                to_name: "Yönetici",
                to_email: "yilmazbaris814@gmail.com",
                from_name: "MiraTekstil System",
                subject: `💰 Ödeme Onaylandı - #${data.merchant_oid}`,
                message: `Sipariş #${data.merchant_oid} için PayTR ödemesi başarılı. Tutar: ${data.total_amount} TL.`,
                reply_to: clientEmail || "yilmazbaris814@gmail.com"
            });

        } else {
            console.warn("⚠️ Payment Failed:", data.merchant_oid);
            const orderRef = doc(db, 'orders', data.merchant_oid);
            await updateDoc(orderRef, {
                status: 'Ödeme Başarısız',
                failedReason: data.failed_reason_msg || 'Unknown error'
            });
        }

        return new NextResponse("OK");

    } catch (error) {
        console.error("❌ Callback Error:", error);
        return new NextResponse("Callback error", { status: 500 });
    }
}
