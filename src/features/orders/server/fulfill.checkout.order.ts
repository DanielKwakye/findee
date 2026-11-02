import "server-only";

import { getStripeCheckout } from "@/features/checkout/utils/checkout.stripe";
import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";
import { validateCheckoutValues, validateCheckoutAllocation } from "@/features/checkout/utils/checkout.validations";
import type { CheckoutPlan, CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { createOrder } from "@/features/orders/server/order.creation";
import { db } from "@/lib/db";

/** Verifies a paid Stripe checkout and records its order independently of a browser session. */
export async function fulfillCheckoutOrder(sessionId: string, expectedCustomerId?: string): Promise<string | null> {
    if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
        throw new Error("A Stripe checkout session is required");
    }
    const session = await getStripeCheckout(sessionId);
    const metadata = session.metadata;
    if (session.mode !== "payment" || !metadata?.customerId || !metadata.orderNumber
        || !/^[a-f\d]{24}$/i.test(metadata.customerId)
        || (expectedCustomerId && metadata.customerId !== expectedCustomerId)) {
        throw new Error("Unable to verify checkout customer");
    }
    const customer = await db.user.findUnique({
        where: { id: metadata.customerId },
        select: { role: true, email: true, stripeCustomerId: true },
    });
    const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    if (!customer || customer.role !== "CUSTOMER" || !customer.stripeCustomerId
        || customer.stripeCustomerId !== stripeCustomerId) {
        throw new Error("Checkout does not belong to this customer");
    }
    if (session.status !== "complete" || session.payment_status !== "paid") return null;

    const values = Object.fromEntries(Object.entries(metadata)
        .filter(([key]) => key !== "customerId" && key !== "orderNumber" && key !== "checkoutPlan")
        .map(([key, value]) => [key, JSON.parse(value)])) as CheckoutValues;
    validateCheckoutValues(values);
    if (values.email !== customer.email) throw new Error("Checkout email does not match its customer");
    const plans: CheckoutPlan[] = metadata.checkoutPlan ? [JSON.parse(metadata.checkoutPlan)] : await getCheckoutPlans();
    const plan = validateCheckoutAllocation(values, plans);
    const expectedAmount = Math.round(plan.price * 100);
    if (!Number.isSafeInteger(expectedAmount) || expectedAmount <= 0
        || session.amount_total !== expectedAmount || session.currency !== plan.currency.toLowerCase()) {
        throw new Error("Checkout payment does not match the order total");
    }
    const existing = await db.order.findUnique({ where: { number: metadata.orderNumber }, select: { customerId: true } });
    if (existing) {
        if (existing.customerId !== metadata.customerId) throw new Error("Order does not belong to this customer");
        await db.order.updateMany({ where: { number: metadata.orderNumber, OR: [
            { paymentAt: null }, { paymentAt: { isSet: false } },
        ] }, data: { paymentAt: new Date(), status: "PENDING" } });
        return metadata.orderNumber;
    }
    return createOrder(metadata.customerId, values, metadata.orderNumber, plan);
}
