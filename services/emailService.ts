
import emailjs from '@emailjs/browser';

// ==============================================================================
// EMAILJS AYARLARI
// ==============================================================================
const PUBLIC_KEY: string = "d6OwWqWLEUHWVkIhA"; 
const SERVICE_ID = "service_ep1ag7h";
const TEMPLATE_ID = "template_b2gtwra";

// YÖNETİCİ E-POSTASI (Bildirimler buraya gelir)
const TARGET_EMAIL = "yilmazbaris814@gmail.com"; 

export const sendFormToEmail = async (formType: string, formData: any): Promise<boolean> => {
  // console.log(`📧 [Email Service] İşlem: ${formType}`);
  
  let emailSubject = `MiraTekstil: ${formType}`;
  let messageBody = "";
  let replyToEmail = formData.email || TARGET_EMAIL;
  let recipientEmail = TARGET_EMAIL; // Varsayılan alıcı (Admin)
  let recipientName = "Yönetici";

  // -------------------------------------------------------------------
  // 1. YÖNETİCİYE GİDECEK E-POSTALAR
  // -------------------------------------------------------------------

  if (formType === 'Yeni Sipariş (Admin)') {
      emailSubject = `🚨 YENİ SİPARİŞ VAR! - #${formData.orderId}`;
      recipientEmail = TARGET_EMAIL;
      replyToEmail = formData.email; 
      
      messageBody = `
      YÖNETİCİ DİKKATİNE, YENİ SİPARİŞ!
      ===================================
      Sipariş No: #${formData.orderId}
      
      MÜŞTERİ BİLGİLERİ
      -----------------------------------
      Ad Soyad : ${formData.customerName}
      Telefon  : ${formData.phone}
      E-posta  : ${formData.email}
      Adres    : ${formData.address}
      
      SATIN ALINAN ÜRÜNLER
      -----------------------------------
      ${formData.items}
      
      TOPLAM TUTAR: ${formData.total} TL
      `;
  }

  else if (formType === 'İletişim Formu') {
      emailSubject = `📩 Yeni Mesaj: ${formData.subject}`;
      recipientEmail = TARGET_EMAIL;
      replyToEmail = formData.email;

      messageBody = `
      Web sitesinden yeni bir iletişim mesajı aldınız.
      
      Gönderen: ${formData.name}
      E-posta: ${formData.email}
      Konu: ${formData.subject}
      
      MESAJ:
      -----------------------------------
      ${formData.message}
      `;
  }

  else if (formType === 'Satıcıya Sor') {
      emailSubject = `❓ Yeni Soru: ${formData.productName}`;
      recipientEmail = TARGET_EMAIL;
      replyToEmail = formData.email;
      
      messageBody = `
      "${formData.productName}" ürünü için yeni bir soru var.
      
      Soran: ${formData.asker}
      E-posta: ${formData.email}
      
      SORU:
      "${formData.question}"
      
      Cevaplamak için Admin panelindeki "Yorumlar & Sorular" bölümüne gidiniz.
      `;
  }

  else if (formType === 'Bülten Aboneliği') {
      emailSubject = `📰 Yeni Bülten Abonesi`;
      recipientEmail = TARGET_EMAIL;
      
      messageBody = `
      Yeni bir kullanıcı bülten listesine kaydoldu.
      
      Abone E-postası: ${formData.email}
      `;
  }

  // -------------------------------------------------------------------
  // 2. MÜŞTERİYE GİDECEK E-POSTALAR
  // -------------------------------------------------------------------

  else if (formType === 'Sipariş Alındı (Müşteri)') {
      emailSubject = `✅ Siparişiniz Alındı - #${formData.orderId}`;
      recipientEmail = formData.email; // Müşterinin kendi maili
      recipientName = formData.customerName || "Değerli Müşterimiz";
      replyToEmail = TARGET_EMAIL;
      
      messageBody = `
      Siparişiniz (#${formData.orderId}) tarafımıza başarıyla ulaşmıştır. Ödemeniz onaylanmış olup, siparişiniz hazırlanma aşamasındadır.
      
      SİPARİŞ ÖZETİ
      -----------------------------------
      Sipariş No: #${formData.orderId}
      Tutar: ${formData.total} TL
      Teslimat Adresi: ${formData.address}

      Sipariş durumunuzu web sitemizdeki "Hesabım" sayfasından takip edebilirsiniz.

      Bizi tercih ettiğiniz için teşekkür ederiz.
      `;
  }

  else if (formType === 'Sipariş Kargolandı') {
      emailSubject = `📦 Kargonuz Yola Çıktı! - Sipariş #${formData.orderId}`;
      recipientEmail = formData.email; // Müşterinin kendi maili
      recipientName = formData.customerName || "Değerli Müşterimiz";
      replyToEmail = TARGET_EMAIL;
      
      messageBody = `
      Güzel haber! Siparişiniz özenle hazırlandı ve kargoya verildi.
      
      KARGO BİLGİLERİ
      -----------------------------------
      Kargo Firması: ${formData.shippingCompany}
      Takip Numarası: ${formData.trackingNumber}

      Kargonuzun durumunu kargo firmasının web sitesinden veya sitemizdeki "Sipariş Takibi" sayfasından sorgulayabilirsiniz.

      Güzel günlerde kullanmanızı dileriz.
      `;
  }

  else if (formType === 'Satıcı Cevap Verdi') {
      emailSubject = `💬 Sorunuz Cevaplandı: ${formData.productName}`;
      recipientEmail = formData.email; // Müşterinin kendi maili
      recipientName = formData.customerName || "Değerli Müşterimiz";
      replyToEmail = TARGET_EMAIL;

      messageBody = `
      "${formData.productName}" ürünü için sorduğunuz soru satıcı tarafından cevaplandı.
      
      SORUNUZ:
      "${formData.question}"
      
      CEVAP:
      "${formData.answer}"
      
      Keyifli alışverişler dileriz.
      `;
  } 
  
  // Bilinmeyen Form Tipi
  else {
      messageBody = JSON.stringify(formData, null, 2);
  }

  // EmailJS Parametreleri
  // EmailJS panelinde {{message}} ve {{to_name}} kullanmalısın.
  const templateParams = {
      to_name: recipientName,
      to_email: recipientEmail,
      from_name: "MiraTekstil",
      subject: emailSubject,
      message: messageBody,
      reply_to: replyToEmail,
  };

  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    
    if (response.status === 200) {
        return true;
    } else {
        console.error("❌ E-posta gönderilemedi:", response);
        return false;
    }
  } catch (error) {
    console.error("❌ EmailJS Hatası:", error);
    return false;
  }
};
