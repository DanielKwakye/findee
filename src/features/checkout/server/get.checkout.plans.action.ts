"use server";

import type { CheckoutPlan } from "@/features/checkout/utils/checkout.types";
import { getCheckoutPlanPrice } from "@/features/checkout/utils/checkout.pricing";

/** Retrieves the available sticker plans and their purchase limits. */
export async function getCheckoutPlans(): Promise<CheckoutPlan[]> {
    const plans: CheckoutPlan[] = [
        { id: "custom", title: "Custom", price: 0, currency: "CAD", quantity: 20, minimumQuantity: 10, maxRecoveryProfiles: null,
            unitPrices: [
                { maximumQuantity: 19, prices: { Everyday: 1.50, Tough: 1.75, Fabric: 2.00 } },
                { maximumQuantity: 29, prices: { Everyday: 1.25, Tough: 1.50, Fabric: 1.75 } },
                { maximumQuantity: 39, prices: { Everyday: 1.125, Tough: 1.375, Fabric: 1.625 } },
                { maximumQuantity: null, prices: { Everyday: 1.00, Tough: 1.25, Fabric: 1.50 } },
            ] },
    ];
    return plans.map(plan => getCheckoutPlanPrice(plan, plan.quantity));
}
