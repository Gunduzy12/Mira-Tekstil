export const FREE_SHIPPING_THRESHOLD = 500;
export const STANDARD_SHIPPING_COST = 50;

export function calculateShippingCost(orderTotal: number): number {
    return (orderTotal || 0) > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
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