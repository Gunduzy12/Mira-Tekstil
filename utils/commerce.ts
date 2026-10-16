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
