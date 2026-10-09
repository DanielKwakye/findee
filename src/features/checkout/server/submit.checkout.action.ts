"use server";

import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { checkoutVariants } from "@/features/checkout/data/checkout.variants";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

/** Validates and records submitted checkout information for order processing. */
export async function submitCheckout(values: CheckoutValues): Promise<string> {
    if (!values || !Array.isArray(values.variants) || values.variants.length === 0
        || new Set(values.variants).size !== values.variants.length
        || values.variants.some(variant => !checkoutVariants.some(option => option.id === variant))
        || !values.allocation || typeof values.allocation !== "object"
        || typeof values.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
        || typeof values.name !== "string" || typeof values.phone !== "string"
        || typeof values.shippingAddress !== "string" || !values.shippingAddress.trim()
        || typeof values.contactByEmail !== "boolean" || typeof values.contactByPhone !== "boolean"
        || typeof values.showName !== "boolean" || (!values.contactByEmail && !values.contactByPhone)
        || (values.contactByPhone && !values.phone.trim())) {
        throw new Error("Invalid checkout information");
    }
    const plans = await getCheckoutPlans();
    const plan = plans.find(plan => plan.id === values.plan);
    const quantities = values.variants.map(variant => values.allocation[variant]);
    if (!plan || quantities.some(quantity => typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity < 0)
        || quantities.reduce<number>((total, quantity) => total + Number(quantity), 0) > plan.quantity) {
        throw new Error("Invalid sticker allocation");
    }

    const submission = {
        plan,
        variants: values.variants,
        allocation: Object.fromEntries(values.variants.map(variant => [variant, values.allocation[variant]])),
        email: values.email,
        name: values.name,
        phone: values.phone,
        contactByEmail: values.contactByEmail,
        contactByPhone: values.contactByPhone,
        showName: values.showName,
        shippingAddress: values.shippingAddress,
    };
    console.log("Checkout submitted:", JSON.stringify(submission, null, 2));
    return "https://www.google.com/";
}
