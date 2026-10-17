"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderCounts } from "@/features/orders/server/get.order.counts.action";

/** Manages the on-hold order count for navigation that includes the administrator's hold view. */
export function usePortalOrderCounts(enabled: boolean) {
    return useQuery({
        // Both status badges refresh when an order mutation invalidates the orders query prefix.
        queryKey: ["orders", "status-counts"],
        queryFn: getOrderCounts,
        enabled,
    });
}
