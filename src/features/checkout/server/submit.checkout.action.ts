"use server";

import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { getCustomerUser } from "@/features/auth/server/auth.session";
import { createOrder } from "@/features/orders/server/order.creation";

/** Validates and records submitted checkout information for order processing. */
export async function submitCheckout(values: CheckoutValues): Promise<string> {
    const customer = await getCustomerUser();
    if (!customer) throw new Error("Customer authentication required");
    return createOrder(customer.id, values);
}
