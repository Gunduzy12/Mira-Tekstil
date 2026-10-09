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

/** Reads the existing payment confirmation; never changes the payment or order. */
export default function GooglePurchaseTracker() {
    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('view') !== 'paymentSuccess') return;
        let stopped = false;
        let unsubscribe: (() => void) | undefined;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        let sent = false;
        try {
            const rawPendingPurchase = sessionStorage.getItem('pending-google-purchase');
            if (!rawPendingPurchase) return;
            const { transactionId, value, currency } = JSON.parse(rawPendingPurchase) as PendingPurchase;
            if (!transactionId || !/^SIP\d+$/.test(transactionId) || !Number.isFinite(value) || Number(value) <= 0) return;

            const deduplicationKey = `ga4-purchase:${transactionId}`;
            if (localStorage.getItem(deduplicationKey)) return;

            // The redirect may arrive before the existing PayTR callback writes isPaid.
            // Observe that record briefly, but never count pending/failed payments.
            void Promise.all([import('firebase/firestore'), import('../firebaseConfig')])
                .then(([{ doc, onSnapshot }, { db }]) => {
                    if (stopped) return;
                    unsubscribe = onSnapshot(doc(db, 'orders', transactionId), { includeMetadataChanges: true }, snapshot => {
                        if (stopped || sent || snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites || !snapshot.exists()) return;
                        const order = snapshot.data();
                        const paidAmount = Number(order.paymentAmount) / 100;
                        if (order.isPaid !== true || order.paymentMethod !== 'PayTR' || !order.paymentDate || !Number.isFinite(paidAmount) || paidAmount <= 0) return;
                        const purchaseData = {
                            transaction_id: transactionId,
                            value: paidAmount,
                            currency: currency || 'TRY'
                        };
                        // Keep all analytics/storage failures isolated from checkout.
                        try {
                            if (localStorage.getItem(deduplicationKey)) return;
                            if (typeof window.gtag === 'function') {
                                window.gtag('event', 'purchase', purchaseData);
                            } else {
                                window.dataLayer = window.dataLayer || [];
                                window.dataLayer.push((function (..._args: unknown[]) {
                                    return arguments;
                                })('event', 'purchase', purchaseData));
                            }
                            sent = true;
                            localStorage.setItem(deduplicationKey, '1');
                            sessionStorage.removeItem('pending-google-purchase');
                        } catch {
                            // Analytics must never interrupt the payment experience.
                        }
                    }, () => {
                        // No confirmed record means no purchase event.
                    });
                    timeout = setTimeout(() => unsubscribe?.(), 60_000);
                }).catch(() => {
                    // Analytics must never interrupt the payment experience.
                });
        } catch {
            // Bozuk tarayıcı verisi ödeme deneyimini etkilemez.
        }
        return () => {
            stopped = true;
            unsubscribe?.();
            if (timeout) clearTimeout(timeout);
        };
    }, []);

    return null;
}
