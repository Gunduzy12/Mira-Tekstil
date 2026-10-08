"use client";

import { useEffect } from 'react';

declare global {
    interface Window {
        dataLayer?: IArguments[];
        gtag?: (...args: unknown[]) => void;
    }
}

type PendingPurchase = {
    transactionId?: string;
    value?: number;
    currency?: string;
};

/** Tracks a PayTR success return once per merchant order without modifying PayTR. */
export default function GooglePurchaseTracker() {
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('view') !== 'paymentSuccess') return;

        const rawPendingPurchase = sessionStorage.getItem('pending-google-purchase');
        if (!rawPendingPurchase) return;

        try {
            const { transactionId, value, currency } = JSON.parse(rawPendingPurchase) as PendingPurchase;
            if (!transactionId || !Number.isFinite(value) || Number(value) <= 0) return;

            const deduplicationKey = `ga4-purchase:${transactionId}`;
            if (localStorage.getItem(deduplicationKey)) return;

            const purchaseData = {
                transaction_id: transactionId,
                value: Number(value),
                currency: currency || 'TRY'
            };

            if (typeof window.gtag === 'function') {
                window.gtag('event', 'purchase', purchaseData);
            } else {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push((function (..._args: unknown[]) {
                    return arguments;
                })('event', 'purchase', purchaseData));
            }

            localStorage.setItem(deduplicationKey, '1');
            sessionStorage.removeItem('pending-google-purchase');
        } catch {
            // Bozuk tarayıcı verisi ödeme deneyimini etkilemez.
        }
    }, []);

    return null;
}
