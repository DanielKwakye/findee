import "server-only";

import { getTranslations } from "next-intl/server";
import { getStripe, getStripeCustomerId } from "@/features/checkout/utils/checkout.stripe";
import { db } from "@/lib/db";

/** Creates and emails an order's payment invoice, resuming safely after interrupted requests. */
export async function sendOrderInvoice(number: string, resend = false) {
    const stripe = getStripe();
    const order = await db.order.findUniqueOrThrow({ where: { number }, select: {
        id: true, customerId: true, paymentAt: true, status: true, stripeInvoiceId: true, invoiceSentAt: true, planDetail: true,
    } });
    if (order.paymentAt || (!resend && order.invoiceSentAt)) return;
    if (order.status !== "AWAITING_PAYMENT") throw new Error("Order is not awaiting payment");
    const customer = await getStripeCustomerId(order.customerId);
    let invoice = order.stripeInvoiceId ? await stripe.invoices.retrieve(order.stripeInvoiceId)
        : await stripe.invoices.create({
            customer, currency: order.planDetail.currency.toLowerCase(), collection_method: "send_invoice",
            days_until_due: 7, auto_advance: false, pending_invoice_items_behavior: "exclude",
            metadata: { orderNumber: number, customerId: order.customerId },
        }, { idempotencyKey: `order-invoice/${order.id}` });
    await db.order.update({ where: { id: order.id }, data: { stripeInvoiceId: invoice.id }, select: { id: true } });
    if (invoice.status === "draft") {
        if (!invoice.lines.data.length) {
            const t = await getTranslations("orders.create");
            await stripe.invoiceItems.create({
                customer, invoice: invoice.id, currency: order.planDetail.currency.toLowerCase(),
                amount: Math.round(order.planDetail.price * 100),
                description: t("invoiceDescription", { number, quantity: order.planDetail.quantity }),
            }, { idempotencyKey: `order-invoice-item/${order.id}` });
        }
        invoice = await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: false },
            { idempotencyKey: `order-invoice-finalize/${order.id}` });
    }
    if (invoice.status === "paid") {
        await recordInvoicePayment(invoice.id);
        return;
    }
    if (invoice.status !== "open") throw new Error("Order invoice is not payable");
    const sendKey = resend && order.invoiceSentAt
        ? `order-invoice-resend/${order.id}/${order.invoiceSentAt.toISOString()}` : `order-invoice-send/${order.id}`;
    await stripe.invoices.sendInvoice(invoice.id, {}, { idempotencyKey: sendKey });
    await db.order.update({ where: { id: order.id }, data: { invoiceSentAt: new Date() }, select: { id: true } });
}

/** Verifies an order invoice with Stripe and records its payment once. */
export async function recordInvoicePayment(invoiceId: string) {
    const stripe = getStripe();
    const invoice = await stripe.invoices.retrieve(invoiceId);
    const number = invoice.metadata?.orderNumber;
    if (!number || !invoice.metadata?.customerId) return;
    const order = await db.order.findUniqueOrThrow({ where: { number }, select: {
        id: true, customerId: true, stripeInvoiceId: true, planDetail: true,
        customer: { select: { stripeCustomerId: true } },
    } });
    const customer = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
    const amount = Math.round(order.planDetail.price * 100);
    if (order.stripeInvoiceId !== invoice.id || order.customerId !== invoice.metadata.customerId
        || !order.customer.stripeCustomerId || customer !== order.customer.stripeCustomerId
        || invoice.currency !== order.planDetail.currency.toLowerCase()
        || invoice.status !== "paid" || invoice.total !== amount || invoice.amount_paid < amount) {
        throw new Error("Invoice payment does not match its order");
    }
    await db.order.updateMany({ where: { id: order.id, paymentAt: null }, data: { paymentAt: new Date(), status: "PENDING" } });
}
