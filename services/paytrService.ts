
// Firebase Functions URL (Backend deploy edildikten sonra aktif olur)
// Local API Route URL
const FIREBASE_FUNCTION_URL = "/api/paytr/get-token";

interface PaymentInitData {
  orderId: string;
  email: string;
  paymentAmount: number; // Kuruş değil, 100 katı (Örn: 100 TL -> 10000)
  userIp: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  basketItems: any[];
}

export const initializePaytrPayment = async (data: PaymentInitData): Promise<{ token: string } | null> => {
  console.log("🔵 PayTR Backend İsteği Başlatılıyor...", data);
  console.log("👉 Hedef URL:", FIREBASE_FUNCTION_URL);

  try {
    const response = await fetch(FIREBASE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log("📥 Sunucu Yanıt Kodu:", response.status, response.statusText);

    if (response.ok) {
      const result = await response.json();
      console.log("📦 Sunucu JSON Yanıtı:", result);

      if (result.token) {
        return { token: result.token };
      } else {
        console.error("❌ PayTR Token yanıtı geçersiz veya boş:", result);
        return null;
      }
    } else {
      const errorText = await response.text();
      console.error(`❌ Sunucu hatası: ${response.status} ${response.statusText}`, errorText);
      return null;
    }
  } catch (error) {
    console.error("❌ PayTR Backend erişim hatası (Network/Fetch):", error);
    return null;
  }
};
