import { verifyStripeWebhook } from "@/features/checkout/utils/checkout.stripe";
import { fulfillCheckoutOrder } from "@/features/orders/server/fulfill.checkout.order";
import { recordInvoicePayment } from "@/features/orders/server/order.invoice";

/** Accepts authenticated Stripe payment events and records paid checkout orders. */
export async function POST(request: Request) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return Response.json({ error: "webhook_not_configured" }, { status: 503 });
    }
    const signature = request.headers.get("stripe-signature");
    if (!signature) return Response.json({ error: "missing_signature" }, { status: 400 });

    let event;
    try {
        event = verifyStripeWebhook(await request.text(), signature);
    } catch {
        return Response.json({ error: "invalid_signature" }, { status: 400 });
    }
    if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded" && event.type !== "invoice.paid") {
        return Response.json({ received: true });
    }
    try {
        if (event.type === "invoice.paid") await recordInvoicePayment(event.data.object.id);
        else await fulfillCheckoutOrder(event.data.object.id);
        return Response.json({ received: true });
    } catch {
        console.error("Stripe checkout fulfillment failed", { eventId: event.id, sessionId: event.data.object.id });
        return Response.json({ error: "checkout_fulfillment_failed" }, { status: 500 });
    }
}
