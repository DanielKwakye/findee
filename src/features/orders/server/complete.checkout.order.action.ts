"use server";

import { getCustomerUser } from "@/features/auth/server/auth.session";
import { getStripeCheckout } from "@/features/checkout/utils/checkout.stripe";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { createOrder } from "@/features/orders/server/order.creation";
import { db } from "@/lib/db";

/** Verifies the customer's payment and records their order once. */
export async function completeCheckoutOrder(sessionId?: string): Promise<string> {
    const customer = await getCustomerUser();
    if (!customer || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
        throw new Error("A customer checkout session is required");
    }
    const session = await getStripeCheckout(sessionId);
    if (session.status !== "complete" || session.payment_status !== "paid"
        || session.metadata?.customerId !== customer.id || !session.metadata.orderNumber) {
        throw new Error("Unable to verify checkout payment");
    }
    const existing = await db.order.findUnique({ where: { number: session.metadata.orderNumber }, select: { customerId: true } });
    if (existing) {
        if (existing.customerId !== customer.id) throw new Error("Order does not belong to this customer");
        return session.metadata.orderNumber;
    }
    const values = Object.fromEntries(Object.entries(session.metadata)
        .filter(([key]) => key !== "customerId" && key !== "orderNumber")
        .map(([key, value]) => [key, JSON.parse(value)])) as CheckoutValues;
    return createOrder(customer.id, values, session.metadata.orderNumber);
}
