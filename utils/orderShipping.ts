// Shared order policy; Product schema's shipping helper delegates here too.
export const ORDER_FREE_SHIPPING_THRESHOLD = 700;
export const ORDER_STANDARD_SHIPPING_COST = 100;

export function calculateOrderShippingCost(discountedSubtotal: number): number {
    if (!Number.isFinite(discountedSubtotal) || discountedSubtotal <= 0) return 0;
    return discountedSubtotal > ORDER_FREE_SHIPPING_THRESHOLD ? 0 : ORDER_STANDARD_SHIPPING_COST;
}
