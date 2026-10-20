export const FREE_SHIPPING_THRESHOLD = 700;
export const STANDARD_SHIPPING_COST = 100;
import { calculateOrderShippingCost } from './orderShipping';

export function calculateShippingCost(orderTotal: number): number {
    return calculateOrderShippingCost(orderTotal);
}

export function getProductDisplayPrice(product: any): number {
    if (!product) return 0;
    if (typeof product.priceFrom === 'number' && !isNaN(product.priceFrom) && product.priceFrom > 0) {
        return product.priceFrom;
    }
    if (typeof product.price === 'number' && !isNaN(product.price) && product.price > 0) {
        return product.price;
    }
    if (Array.isArray(product.variants) && product.variants.length > 0) {
        const prices = product.variants
            .map((v: any) => typeof v?.price === 'number' ? v.price : parseFloat(v?.price))
            .filter((p: number) => !isNaN(p) && p > 0);
        if (prices.length > 0) {
            return Math.min(...prices);
        }
    }
    return 0;
}

/**
 * Kuponun bitiş tarihi (YYYY-MM-DD) geçmiş mi? Kupon bitiş gününün sonuna kadar geçerlidir.
 * Tarih boş veya geçersizse kupon süresiz kabul edilir.
 */
export function isCouponExpired(expirationDate?: string | null, now: Date = new Date()): boolean {
    if (!expirationDate) return false;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(expirationDate);
    if (!match) return false;
    const endOfDay = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 23, 59, 59, 999);
    if (Number.isNaN(endOfDay.getTime())) return false;
    return now.getTime() > endOfDay.getTime();
}
