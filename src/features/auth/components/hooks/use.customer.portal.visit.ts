"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { recordCustomerPortalVisit } from "@/features/auth/server/record.customer.portal.visit.action";

/** Tracks portal entry and navigation while limiting visit requests. */
export function useCustomerPortalVisit() {
    const pathname = usePathname();
    const lastAttemptAt = useRef(0);
    const { mutate } = useMutation({ mutationFn: recordCustomerPortalVisit, retry: false });
    useEffect(() => {
        const now = Date.now();
        if (now - lastAttemptAt.current < 5 * 60_000) return;
        lastAttemptAt.current = now;
        mutate();
    }, [pathname, mutate]);
}
