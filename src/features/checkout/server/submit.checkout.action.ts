"use server";

import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { getCustomerUser } from "@/features/auth/server/auth.session";
import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { validateCheckoutValues, validateCheckoutAllocation } from "@/features/checkout/utils/checkout.validations";
import { createStripeCheckout } from "@/features/checkout/utils/checkout.stripe";

/** Validates and records submitted checkout information for order processing. */
export async function submitCheckout(values: CheckoutValues): Promise<string> {
    const customer = await getCustomerUser();
    if (!customer) throw new Error("Customer authentication required");
    validateCheckoutValues(values);
    if (typeof values.postalCode !== "string" || !/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(values.postalCode)) {
        throw new Error("A valid postal code is required");
    }
    const plan = validateCheckoutAllocation(values, await getCheckoutPlans());
    return createStripeCheckout(customer, {
        ...values,
        shippingAddress: `${values.shippingAddress.trim()}, ${values.postalCode.slice(0, 3)}-${values.postalCode.slice(3)}`,
    }, plan);
}
