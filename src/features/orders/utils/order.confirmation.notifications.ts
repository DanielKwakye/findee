import "server-only";

import { getTranslations } from "next-intl/server";
import { renderNotificationEmail } from "@/features/notifications/server/notification.email";
import { sendEmail } from "@/features/notifications/server/send.email";
import type { ConfirmationOrder, OrderConfirmationOptions } from "@/features/orders/utils/order.types";
import { db } from "@/lib/db";

type OrderNotificationContext = Awaited<ReturnType<typeof getOrderNotificationContext>>;

/** Loads the translations and verified destinations used by order confirmation notifications. */
export async function getOrderNotificationContext() {
    const t = await getTranslations({ locale: "en", namespace: "OrderNotifications" });
    const tEmail = await getTranslations({ locale: "en", namespace: "Notifications.email" });
    const ordersEmail = process.env.ORDERS_EMAIL;
    const appUrl = process.env.APP_URL;
    if (!ordersEmail || !appUrl) throw new Error("Order notifications are not configured.");
    const ordersUrl = new URL("/customer/orders", appUrl);
    if (!["https:", "http:"].includes(ordersUrl.protocol)) throw new Error("Invalid APP_URL");
    return { t, tEmail, ordersEmail, ordersUrl };
}

/** Delivers an outstanding confirmation and records that recipient's successful delivery. */
async function deliverNotification(order: ConfirmationOrder, recipient: "customer" | "admin", context: OrderNotificationContext,
    options: OrderConfirmationOptions) {
    const { t, tEmail, ordersEmail, ordersUrl } = context;
    const event = order.status === "HOLD" ? "restocking" : "processing";
    const deliveryField = recipient === "admin" ? "adminConfirmationNotifiedAt" : "customerConfirmationNotifiedAt";
    if (order[deliveryField]) return true;
    const allocations = order.planDetail.allocations.map(allocation => t("allocation", allocation)).join("\n");
    for (let deliveryAttempt = 0; deliveryAttempt < 2; deliveryAttempt++) {
        try {
            if (options.deadline && Date.now() >= options.deadline) return false;
            const admin = recipient === "admin";
            const values = { number: order.number, name: order.customer.name || order.customer.email,
                email: order.customer.email, status: t(`admin.${event}`) };
            const content = await renderNotificationEmail({
                brand: tEmail("brand"), title: t(admin ? "admin.title" : `${event}.title`),
                introduction: t(admin ? "admin.introduction" : `${event}.introduction`, values),
                highlight: order.number,
                guidance: admin ? t("admin.guidance", { allocations })
                    : t(`${event}.guidance`, { url: ordersUrl.toString() }),
                signoff: tEmail("signoff"), footer: tEmail("footer"),
            });
            await sendEmail({
                to: admin ? ordersEmail : order.customer.email,
                replyTo: admin ? order.customer.email : ordersEmail,
                subject: t(admin ? "admin.subject" : `${event}.subject`, values), ...content,
                // Stable keys let the email provider deduplicate overlapping delivery attempts.
                idempotencyKey: `order-confirmation/${order.id}/${event}/${recipient}`,
            }, { minIntervalMs: 600, rateLimitRetries: 1, deadline: options.deadline, timeoutMs: 10_000 });
            await db.order.updateMany({
                where: { id: order.id, status: order.status, cancellable: order.cancellable },
                data: { [deliveryField]: new Date() },
            });
            return true;
        } catch {
            if (deliveryAttempt === 1) console.error("Order notification delivery failed", { orderId: order.id, event, recipient });
            else if (!options.deadline || Date.now() + 1_000 < options.deadline) {
                await new Promise(resolve => setTimeout(resolve, 1_000));
            }
        }
    }
    return false;
}

/** Sends outstanding customer and administrator emails and records complete notification delivery. */
export async function sendOrderConfirmationNotifications(order: ConfirmationOrder, context: OrderNotificationContext, options: OrderConfirmationOptions) {
    const deliveries: boolean[] = [];
    // Keep recipient sends sequential so a rate-limit response also delays the next recipient.
    for (const recipient of ["customer", "admin"] as const) {
        // Skip delivered messages and retry only this recipient's outstanding confirmation.
        deliveries.push(await deliverNotification(order, recipient, context, options));
    }
    const notified = deliveries.every(Boolean);
    // Mark delivery only when both recipients succeed and the order still matches this notification.
    if (notified) await db.order.updateMany({
        where: { id: order.id, status: order.status, cancellable: order.cancellable },
        data: { confirmationNotifiedAt: new Date() },
    });
    return notified;
}
