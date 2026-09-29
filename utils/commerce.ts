export const FREE_SHIPPING_THRESHOLD = 500;
export const STANDARD_SHIPPING_COST = 50;

export function calculateShippingCost(orderTotal: number): number {
    return orderTotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}
