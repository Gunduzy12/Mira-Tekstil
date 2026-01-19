
import { ShippingCompany } from '../types';

export const getTrackingUrl = (company: ShippingCompany | undefined, trackingNumber: string | undefined): string => {
    if (!trackingNumber) return '#';

    // Kargo firmasına göre link oluşturma mantığı
    switch (company) {
        case 'Yurtiçi Kargo':
            return `https://yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${trackingNumber}`;
        case 'MNG Kargo':
            return `https://kargotakip.mngkargo.com.tr/?takipNo=${trackingNumber}`;
        case 'Aras Kargo':
            return `https://kargotakip.araskargo.com.tr/mainpage.aspx?code=${trackingNumber}`;
        case 'Sürat Kargo':
             return `https://suratkargo.com.tr/KargoTakip/?kargotakipno=${trackingNumber}`;
        case 'PTT Kargo':
            return `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${trackingNumber}`;
        case 'Trendyol Express':
            return `https://kargotakip.trendyol.com/?orderNumber=${trackingNumber}`;
        case 'UPS Kargo':
            return `https://www.ups.com.tr/WaybillSorgu.aspx?Waybill=${trackingNumber}`;
        default:
            // Eğer firma bilinmiyorsa Google aramaya yönlendir
            return `https://www.google.com/search?q=${trackingNumber}+kargo+takip`;
    }
};

export const getShippingCompanyLogo = (company: ShippingCompany | undefined): string => {
    switch (company) {
        case 'Trendyol Express': return 'https://cdn.dsmcdn.com/web/production/ty-express.svg';
        case 'Yurtiçi Kargo': return 'https://yurticikargo.com/images/logo.svg';
        case 'MNG Kargo': return 'https://mngkargo.com.tr/assets/img/logo.svg';
        // Diğerleri için placeholder veya text dönebiliriz, şimdilik null.
        default: return ''; 
    }
};

// Mock ortamda gerçekçi takip numaraları üretmek için
export const generateMockTrackingNumber = (company: ShippingCompany): string => {
    const randomNum = (length: number) => Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
    
    switch (company) {
        case 'Yurtiçi Kargo':
            return `1${randomNum(11)}`; // Genelde 12 hane
        case 'Aras Kargo':
            return `2${randomNum(12)}`; // Genelde 13 hane
        case 'MNG Kargo':
            return `MN${randomNum(10)}`;
        case 'Trendyol Express':
            return `7${randomNum(9)}`;
        case 'PTT Kargo':
            return `27${randomNum(11)}`;
        case 'Sürat Kargo':
            return `14${randomNum(10)}`;
        default:
            return randomNum(12);
    }
};
