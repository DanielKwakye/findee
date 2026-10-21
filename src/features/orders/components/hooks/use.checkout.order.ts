"use client";

import { useQuery } from "@tanstack/react-query";
import { completeCheckoutOrder } from "@/features/orders/server/complete.checkout.order.action";

/** Manages payment verification and order acknowledgement behavior. */
export function useCheckoutOrder(sessionId?: string) {
    return useQuery({
        queryKey: ["orders", "checkout", sessionId],
        queryFn: () => completeCheckoutOrder(sessionId),
        retry: false,
        staleTime: Infinity,
    });
}
