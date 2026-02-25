"use client";
import React, { useState } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const FixOrderPage = () => {
    const [status, setStatus] = useState("Ready to link order.");
    const [email, setEmail] = useState("burak_evli@hotmail.com");
    const [orderId, setOrderId] = useState("SIP1770889145258");

    const handleLinkUser = async () => {
        setStatus("Searching for user...");
        try {
            // 1. Find User by Email
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setStatus(`❌ User with email ${email} not found in 'users' collection.`);
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const userId = userDoc.id;
            const userData = userDoc.data();

            console.log("Found User:", userData);
            setStatus(`✅ User found: ${userData.name} (${userId}). Updating order...`);

            // 2. Update Order
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);

            if (!orderSnap.exists()) {
                setStatus(`❌ Order ${orderId} not found.`);
                return;
            }

            await updateDoc(orderRef, {
                userId: userId,
                // Also update generic fields just in case
                email: email
            });

            setStatus(`🎉 SUCCESS! Order linked to user ID: ${userId}`);

        } catch (error: any) {
            console.error(error);
            setStatus("❌ Error: " + error.message);
        }
    };

    return (
        <div style={{ padding: 50, fontFamily: 'sans-serif' }}>
            <h1>Admin: Link Order to User</h1>

            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5 }}>Order ID:</label>
                <input
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    style={{ padding: 8, width: 300 }}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 5 }}>Customer Email:</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: 8, width: 300 }}
                />
            </div>

            <button
                onClick={handleLinkUser}
                style={{
                    padding: '10px 20px',
                    background: 'green',
                    color: 'white',
                    fontSize: 16,
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: 4
                }}
            >
                LINK ORDER TO USER
            </button>
            <div style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>
                {status}
            </div>
        </div>
    );
};

export default FixOrderPage;
