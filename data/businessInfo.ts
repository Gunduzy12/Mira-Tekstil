// Sitede herkese açık gösterilen satıcı (işletme) bilgileri.
// Not: Buraya yalnızca işletme kimliği girilir. TC kimlik no, imza, doğum tarihi gibi kişisel bilgiler eklenmez.
export const BUSINESS_INFO = {
    brandName: 'MiraTekstil',
    sellerName: 'Barış Yılmaz',
    businessType: 'Şahıs İşletmesi',
    taxOffice: 'Samandağ Vergi Dairesi',
    taxId: '9670463640',
    streetAddress: 'Kurtderesi Mah. Berrak Sok. No: 8/1C',
    district: 'Samandağ',
    province: 'Hatay',
    postalCode: '31800',
    country: 'Türkiye',
} as const;

export function getSellerLine(): string {
    const b = BUSINESS_INFO;
    return `${b.sellerName} (${b.businessType}) · ${b.taxOffice} · Vergi Kimlik No: ${b.taxId}`;
}
