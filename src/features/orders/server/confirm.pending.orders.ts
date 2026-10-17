import "server-only";

import { confirmOrder } from "@/features/orders/server/confirm.order";
import { getPendingConfirmationOrders, scheduleOrderConfirmationRetry, summarizeConfirmationBatch,
    validateConfirmationBatchOptions } from "@/features/orders/utils/order.confirmation.batch.utils";
import type { ConfirmationBatchOptions, ConfirmationBatchStatus, ConfirmationResult } from "@/features/orders/utils/order.types";

let isProcessing = false;

/**
 * Confirms pending orders from oldest to newest for a trusted, authenticated server caller.
 *
 * - Validates the options; defaults to 5 orders, a 45-second budget, and a 5-minute retry delay.
 * - Returns `busy` if a batch is already running in this application process.
 * - Fetches the oldest eligible pending orders and confirmed orders awaiting stock or notification delivery.
 * - Excludes orders whose retry delay has not elapsed, using the ID to break creation-time ties.
 * - Processes orders sequentially, checking the time budget before each one.
 * - Schedules the next retry before calling `confirmOrder` with the order ID and deadline.
 * - Records individual failures and continues; stops starting new orders if time runs out.
 * - Clears the in-process running flag in `finally`, including when processing throws.
 * - Returns the batch status, counts by outcome, outstanding notification count, and per-order results.
 */
export async function confirmPendingOrders({ batchSize = 5, timeBudgetMs = 45_000, retryDelayMs = 300_000 }: ConfirmationBatchOptions = {}) {
    // Validate the configured batch limits before starting work.
    validateConfirmationBatchOptions({ batchSize, timeBudgetMs, retryDelayMs });
    const deadline = Date.now() + timeBudgetMs;
    const results: ConfirmationResult[] = [];
    let status: ConfirmationBatchStatus = "completed";

    // Prevent overlapping cron requests from starting another batch in this process.
    if (isProcessing) return summarizeConfirmationBatch("busy", results);
    isProcessing = true;

    try {
        // Fetch only the oldest due orders, including holds and outstanding notification retries.
        const orders = await getPendingConfirmationOrders(batchSize);

        // Finish each order before the next one can claim inventory.
        for (const order of orders) {
            if (Date.now() >= deadline) {
                status = "time_budget";
                break;
            }
            try {
                // A cooldown also covers crashes, preventing old failures or holds from starving newer orders.
                await scheduleOrderConfirmationRetry(order.id, retryDelayMs);
                // Confirm this order with the batch deadline enforced during allocation.
                const result = await confirmOrder(order.id, { deadline });
                results.push({ id: order.id, ...result });
            } catch (error) {
                console.error("Order confirmation failed", { orderId: order.id, error });
                results.push({ id: order.id, outcome: "failed", error: error instanceof Error ? error.message : "Order confirmation failed" });
            }
        }
    } finally {
        // Allow the next cron request to run even if this batch fails.
        isProcessing = false;
    }
    // Report the batch status, outcome counts, and individual order results.
    return summarizeConfirmationBatch(status, results);
}
