import "server-only";

import { getOrderNotificationContext, sendOrderConfirmationNotifications } from "@/features/orders/utils/order.confirmation.notifications";
import { assignOrderConfirmationProducts, createOrderRestockTicket, findOrderConfirmationProducts,
    getConfirmationOrder, saveOrderConfirmation } from "@/features/orders/utils/order.confirmation.utils";
import type { OrderConfirmationOptions, OrderConfirmationResult } from "@/features/orders/utils/order.types";
import { validateOrderId } from "@/features/orders/utils/order.validations";
import { db } from "@/lib/db";

/**
 * Confirms and allocates an entire order for a trusted, authenticated server caller.
 *
 * - Validates the order ID and notification configuration; authentication belongs to the calling endpoint.
 * - Checks any supplied deadline before processing the database transaction.
 * - Skips orders outside PENDING or CONFIRMED; confirmed orders without a hold only retry outstanding notifications.
 * - Validates variant quantities and selects published stickers without a purchaser, owner, or linked order.
 * - Selects each variant's oldest stickers by createdAt, using the ID to break ties, before assigning anything.
 * - If any variant is short, assigns nothing, confirms the order on hold, and makes it cancellable.
 * - Creates a support ticket with the order number and all requested quantities on the initial shortage only.
 * - When every variant is available, reserves and assigns the full selection to the customer and links it to the order.
 * - Saves assignments, any support ticket, and the confirmed order state atomically; fulfilled orders are not cancellable.
 * - After commit, emails the customer and ORDERS_EMAIL about processing or restocking, linking held customers to portal orders.
 * - Tracks delivery per recipient, skips successful deliveries, and uses idempotency keys, pacing, timeouts, and bounded retries.
 * - Returns processing, restocking, or skipped with a notified flag; later calls can retry held stock or incomplete delivery.
 */
export async function confirmOrder(id: string, options: OrderConfirmationOptions = {}): Promise<OrderConfirmationResult> {
    // The calling endpoint is responsible for authenticating and authorizing the request.
    validateOrderId(id);
    // Load translations and validate the email destinations before changing the order.
    const context = await getOrderNotificationContext();

    // Commit the ticket, allocations, and order state together so partial fulfillment cannot persist.
    const result = await db.$transaction(async transaction => {
        if (options.deadline && Date.now() >= options.deadline) throw new Error("Order confirmation time budget reached");
        // Load only the order details needed for allocation and notifications.
        const order = await getConfirmationOrder(transaction, id);
        // Retry allocation only for pending orders or confirmed orders waiting for stock.
        if (order.status !== "PENDING" && order.status !== "CONFIRMED") return null;
        if (order.status === "CONFIRMED" && !order.cancellable) return order;

        // Validate the requested variants and find the complete oldest-first sticker selection.
        const { productIds, restocking } = await findOrderConfirmationProducts(transaction, order.planDetail.allocations);
        // Repeated shortages leave the existing hold and support ticket intact.
        if (restocking && order.status === "CONFIRMED" && order.cancellable) return order;
        if (restocking) {
            // Record all requested quantities for the administrator without assigning any stickers.
            await createOrderRestockTicket(transaction, order, context.t);
        } else {
            // Reserve and assign the entire selection while rechecking that every sticker is still available.
            await assignOrderConfirmationProducts(transaction, order, productIds);
        }
        // Only held orders are cancellable; each state change needs its own notification.
        return saveOrderConfirmation(transaction, order, restocking);
    });
    if (!result) return { outcome: "skipped", notified: false };
    const event = result.cancellable ? "restocking" : "processing";
    if (result.confirmationNotifiedAt) return { outcome: event, notified: true };

    // Send after commit so delivery failures do not undo fulfillment; later calls can retry delivery.
    const notified = await sendOrderConfirmationNotifications(result, context, options);
    return { outcome: event, notified };
}
