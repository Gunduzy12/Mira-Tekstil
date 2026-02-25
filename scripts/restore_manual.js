
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// 1. Load Environment Variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            envVars[key.trim()] = value.trim();
        }
    });
}

// Config
const firebaseConfig = {
    apiKey: envVars.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: envVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: envVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: envVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: envVars.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: envVars.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log("Initializing Firebase with project:", firebaseConfig.projectId);

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function restoreOrder() {
    const orderId = "SIP1770889145258";

    // Check if exists
    const orderRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(orderRef);

    if (docSnap.exists()) {
        console.log(`✅ Order ${orderId} already exists!`);
        console.log("Data:", docSnap.data());
        return;
    }

    console.log(`⚠️ Order ${orderId} not found. 创建ing...`);

    const customerName = "Burak EVLI";
    const email = "burak_evli@hotmail.com";
    const phone = "05352507844";
    const address = "Şehit Osman Avcı Mah. Şehit Mahmut Şahin Sok. 9/8 Germencik Apt. Eryaman Etimesgut ANKARA Etimesgut/ANKARA";
    const total = 520.00;

    // Note: ISO string for date. 12.02.2026 12:40:05
    // Month is 0-indexed in JS Date constructor: 1 = February
    const orderDate = new Date(2026, 1, 12, 12, 40, 5).toISOString();

    const items = [
        {
            id: "restored-item-1",
            name: "Özel Dikim 1.Sınıf Antrasit Blackout Işık Geçirmez Fon Perde Ekstraforlu Karartma Blackout",
            price: 520.00,
            quantity: 1,
            imageUrl: "https://via.placeholder.com/150", // Placeholder since we don't have exact URL
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
        paymentId: "MANUAL-RESTORE-" + Date.now(),
        restoredBy: "admin-script",
        createdAt: new Date().toISOString()
    };

    try {
        await setDoc(orderRef, orderData);
        console.log(`✅ SUCCESS: Order ${orderId} has been restored manually.`);
    } catch (error) {
        console.error("❌ FAILED to write order:", error);
    }
}

restoreOrder().then(() => {
    console.log("Done.");
    process.exit(0);
}).catch(err => {
    console.error("Script Error:", err);
    process.exit(1);
});
