'use client';

import { useQuery } from '@tanstack/react-query';
import { completeCheckoutOrder } from '@/features/orders/server/complete.checkout.order.action';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { identifyMetaVisitor } from '@/lib/meta.pixel';
import { subscribeCookieNotice } from '@/components/platform/utils/cookie.notice';

/** Manages payment verification and order acknowledgement behavior. */
export function useCheckoutOrder(sessionId?: string) {
    const order = useQuery({
        queryKey: ['orders', 'checkout', sessionId],
        queryFn: () => completeCheckoutOrder(sessionId),
        retry: false,
        staleTime: Infinity,
    });
    useEffect(() => {
        if (!order.data) return;
        const { email, phone, purchase } = order.data;
        /** Reports a verified purchase when the visitor's advertising preference changes. */
        function trackPurchase() {
            identifyMetaVisitor(email, phone);
            void trackEvent('purchase', purchase);
        }
        trackPurchase();
        return subscribeCookieNotice(trackPurchase);
    }, [order.data]);
    return order;
}
