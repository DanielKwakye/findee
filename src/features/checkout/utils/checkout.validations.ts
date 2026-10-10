import { checkoutVariants } from "@/features/checkout/data/checkout.variants";
import type { CheckoutPlan, CheckoutValues } from "@/features/checkout/utils/checkout.types";

/** Validates purchase, contact, and shipping inputs for checkout. */
export function validateCheckoutValues(values: CheckoutValues) {
    if (!values || !Array.isArray(values.variants) || values.variants.length === 0
        || new Set(values.variants).size !== values.variants.length
        || values.variants.some(variant => !checkoutVariants.some(option => option.id === variant))
        || !values.allocation || typeof values.allocation !== "object"
        || typeof values.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
        || typeof values.name !== "string" || typeof values.phone !== "string"
        || typeof values.shippingAddress !== "string" || !values.shippingAddress.trim()
        || typeof values.deliveryInstructions !== "string"
        || typeof values.contactByEmail !== "boolean" || typeof values.contactByPhone !== "boolean"
        || typeof values.showName !== "boolean" || (!values.contactByEmail && !values.contactByPhone)
        || (values.contactByPhone && !values.phone.trim())) {
        throw new Error("Invalid checkout information");
    }
}

/** Validates sticker quantities against the selected checkout plan. */
export function validateCheckoutAllocation(values: CheckoutValues, plans: CheckoutPlan[]) {
    const plan = plans.find(plan => plan.id === values.plan);
    if (!plan || getCheckoutAllocationError(values, plan)) {
        throw new Error("Invalid sticker allocation");
    }
    return plan;
}

/** Identifies quantity errors for the selected plan and sticker allocations. */
export function getCheckoutAllocationError(values: Pick<CheckoutValues, "variants" | "allocation">, plan: CheckoutPlan) {
    const quantities = values.variants.map(variant => values.allocation[variant]);
    const total = quantities.reduce<number>((sum, quantity) => sum + Number(quantity), 0);
    if (quantities.some(quantity => typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 0)
        || !Number.isSafeInteger(total)) return "invalid";
    if (total < plan.quantity) return plan.quantityIsMinimum ? "minimumRemaining" : "remaining";
    if (!plan.quantityIsMinimum && total > plan.quantity) return "excess";
    return null;
}
