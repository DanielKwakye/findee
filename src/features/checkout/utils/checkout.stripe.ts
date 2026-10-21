import "server-only";

import Stripe from "stripe";
import type { CheckoutPlan, CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { generateReferenceCode } from "@/components/platform/utils/reference.code.utils";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/** Resolves the Stripe customer associated with a Findee account. */
async function getStripeCustomerId(customerId: string): Promise<string> {
    const user = await db.user.findUniqueOrThrow({
        where: { id: customerId },
        select: { stripeCustomerId: true, email: true },
    });
    if (user.stripeCustomerId) return user.stripeCustomerId;

    const customer = await stripe.customers.create({
        email: user.email,
        metadata: { customerId },
    }, { idempotencyKey: `findee-customer-${customerId}` });
    await db.user.update({
        where: { id: customerId },
        data: { stripeCustomerId: customer.id },
        select: { id: true },
    });
    return customer.id;
}

/** Creates a hosted payment session containing the customer's checkout details. */
export async function createStripeCheckout(customer: { id: string; email: string }, values: CheckoutValues, plan: CheckoutPlan): Promise<string> {
    const metadata: Record<string, string> = { customerId: customer.id, orderNumber: generateReferenceCode() };
    for (const [key, value] of Object.entries(values)) {
        const encoded = JSON.stringify(value);
        if (encoded.length > 500) throw new Error("Checkout field exceeds the payment provider's length limit");
        metadata[key] = encoded;
    }
    const stripeCustomerId = await getStripeCustomerId(customer.id);
    const t = await getTranslations("Checkout.plans");
    const session = await stripe.checkout.sessions.create({
        ui_mode: "hosted_page",
        mode: "payment",
        customer: stripeCustomerId,
        billing_address_collection: "auto",
        phone_number_collection: { enabled: false },
        automatic_tax: { enabled: false },
        allow_promotion_codes: false,
        submit_type: "auto",
        saved_payment_method_options: { payment_method_save: "enabled" },
        integration_identifier: "hosted_web_0001",
        origin_context: "web",
        success_url: `${process.env.APP_URL}/checkout/order-received?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/checkout`,
        line_items: [{
            price_data: {
                currency: plan.currency.toLowerCase(),
                unit_amount: Math.round(plan.price * 100),
                product_data: { name: `${t(`names.${plan.title}`)} · ${t("stickers", { quantity: plan.quantity })}` },
            },
            quantity: 1,
        }],
        metadata,
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return session.url;
}

/** Retrieves a checkout session for server-side payment verification. */
export async function getStripeCheckout(sessionId: string) {
    return stripe.checkout.sessions.retrieve(sessionId);
}
