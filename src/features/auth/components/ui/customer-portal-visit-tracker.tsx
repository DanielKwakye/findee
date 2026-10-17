"use client";

import { useCustomerPortalVisit } from "@/features/auth/components/hooks/use.customer.portal.visit";

/** Records visits from the authenticated customer portal. */
export default function CustomerPortalVisitTracker() {
    useCustomerPortalVisit();
    return null;
}
