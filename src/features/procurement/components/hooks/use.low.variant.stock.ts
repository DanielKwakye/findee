"use client";

import { useQuery } from "@tanstack/react-query";
import { getLowVariantStockForAdmin } from "@/features/procurement/server/get.low.variant.stock.action";

/** Shares low-stock inventory warnings between the products page and navigation. */
export function useLowVariantStock() {
    return useQuery({
        queryKey: ["products", "low-stock"],
        queryFn: getLowVariantStockForAdmin,
        refetchOnMount: "always",
    });
}
