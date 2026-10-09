"use server";

import type { CheckoutPlan } from "@/features/checkout/utils/checkout.types";

/** Retrieves the available sticker plans and their purchase limits. */
export async function getCheckoutPlans(): Promise<CheckoutPlan[]> {
    return [
        { id: "personal", title: "Starter", price: 14.99, currency: "CAD", quantity: 10, maxRecoveryProfiles: 3 },
        { id: "family", title: "Family", price: 24.99, currency: "CAD", quantity: 20, maxRecoveryProfiles: 6 },
        { id: "business", title: "Business", price: 999, currency: "CAD", quantity: 1000, quantityIsMinimum: true, maxRecoveryProfiles: null },
    ];
}
