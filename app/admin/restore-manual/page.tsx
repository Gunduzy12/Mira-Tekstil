"use client";
import React, { useState } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const RestorePage = () => {
    const [status, setStatus] = useState("Waiting for action...");

    const handleRestore = async () => {
        setStatus("Processing...");
        const orderId = "SIP1770889145258";

        try {
            // Check if exists
            const orderRef = doc(db, 'orders', orderId);
            const docSnap = await getDoc(orderRef);

            if (docSnap.exists()) {
                setStatus(`⚠️ Order ${orderId} already exists!`);
                return;
            }

            const customerName = "Burak EVLI";
            const email = "burak_evli@hotmail.com";
            const phone = "05352507844";
            const address = "Şehit Osman Avcı Mah. Şehit Mahmut Şahin Sok. 9/8 Germencik Apt. Eryaman Etimesgut ANKARA Etimesgut/ANKARA";
            const total = 520.00;

            // Month 1 = February
            const orderDate = new Date(2026, 1, 12, 12, 40, 5).toISOString();

            const items = [
                {
                    id: "restored-item-1",
                    name: "Özel Dikim 1.Sınıf Antrasit Blackout Işık Geçirmez Fon Perde Ekstraforlu Karartma Blackout",
                    price: 520.00,
                    quantity: 1,
                    // imageUrl: "https://via.placeholder.com/150",
                    selectedColor: "Antrasit",
                    selectedSize: "Özel Dikim"
                }
            ];

            const orderData = {
                id: orderId,
                date: orderDate,
                status: 'İşleniyor', // Approved
                paymentMethod: 'Kredi / Banka Kartı',
                total: total,
                customerName: customerName,
                email: email,
                phone: phone,
                shippingAddress: address,
                items: items,
                paymentId: "MANUAL-RESTORE-CLIENT-" + Date.now(),
                restoredBy: "admin-client-manual",
                createdAt: new Date().toISOString()
            };

            await setDoc(orderRef, orderData);
            setStatus(`✅ SUCCESS: Order ${orderId} restored! check your admin panel.`);

        } catch (error: any) {
            console.error(error);
            setStatus("❌ Error: " + error.message);
        }
    };

    return (
        <div style={{ padding: 50 }}>
            <h1>Manual Order Restore Tool</h1>
            <p>This tool uses your current login session to restore the missing order.</p>
            <button
                onClick={handleRestore}
                style={{
                    padding: '10px 20px',
                    background: 'blue',
                    color: 'white',
                    fontSize: 20,
                    cursor: 'pointer'
                }}
            >
                RESTORE MISSING ORDER
            </button>
            <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
                {status}
            </div>
        </div>
    );
};

export default RestorePage;
