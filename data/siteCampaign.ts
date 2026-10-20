// Sitenin üst şeridinde duyurulan kupon kampanyası.
// Kupon kodu ve tarihi yönetim panelindeki kuponla (Kampanyalar & İndirimler) aynı olmalıdır.
// Kampanya bittiğinde veya kupon silindiğinde bu değeri null yapın.
export const SITE_COUPON_CAMPAIGN: { code: string; percent: number; expirationDate: string; label: string } | null = {
    code: 'MIRA5',
    percent: 5,
    expirationDate: '2026-11-19',
    label: '19 KASIM\'A KADAR',
};
