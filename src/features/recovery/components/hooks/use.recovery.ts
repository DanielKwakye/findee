"use client";

import {useQuery} from "@tanstack/react-query";
import {getRecoveryProduct} from "@/features/recovery/server/get.recovery.product.action";
import {normalizeProductCode} from "@/features/products/utils/product.code";

/** Manages public recovery lookup and its loading and failure states. */
export function useRecovery(code: string) {
    const normalizedCode = normalizeProductCode(code);
    return useQuery({
        queryKey: ["recovery", normalizedCode],
        queryFn: () => getRecoveryProduct(normalizedCode),
        retry: false,
        staleTime: 0,
    });
}
