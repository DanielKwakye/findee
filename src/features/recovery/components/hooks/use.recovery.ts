"use client";

import {useQuery} from "@tanstack/react-query";
import {getRecoveryProduct} from "@/features/recovery/server/get.recovery.product.action";
import {normalizeProductCode} from "@/features/products/utils/product.code";
import {useEffect, useRef} from "react";
import {trackEvent} from "@/lib/firebase";

/** Manages public recovery lookup and its loading and failure states. */
export function useRecovery(code: string) {
    const normalizedCode = normalizeProductCode(code);
    const query = useQuery({
        queryKey: ["recovery", normalizedCode],
        queryFn: () => getRecoveryProduct(normalizedCode),
        retry: false,
        staleTime: 0,
    });
    const trackedCode = useRef<string | null>(null);
    useEffect(() => {
        if (!query.data || trackedCode.current === normalizedCode) return;
        trackedCode.current = normalizedCode;
        void trackEvent("recovery_page_viewed");
    }, [normalizedCode, query.data]);

    /** Records which available contact method a finder chooses. */
    function onContactClick(method: "phone" | "email") {
        void trackEvent("owner_contact_clicked", { contact_method: method });
    }

    return {...query, onContactClick};
}
