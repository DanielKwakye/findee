import "server-only";

import type { ConfirmationBatchOptions, ConfirmationBatchStatus, ConfirmationResult } from "@/features/orders/utils/order.types";
import { db } from "@/lib/db";

/** Validates the resolved limits and retry delay for an order confirmation batch. */
export function validateConfirmationBatchOptions({ batchSize, timeBudgetMs, retryDelayMs }: Required<ConfirmationBatchOptions>) {
    if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 100
        || !Number.isSafeInteger(timeBudgetMs) || timeBudgetMs < 1 || timeBudgetMs > 300_000
        || !Number.isSafeInteger(retryDelayMs) || retryDelayMs < 1) {
        throw new Error("Invalid order confirmation batch options");
    }
}

/** Retrieves the oldest due orders needing initial confirmation, restocking, or notification retries. */
export async function getPendingConfirmationOrders(batchSize: number) {
    return db.order.findMany({
        where: {
            AND: [
                { OR: [
                    { status: "PENDING" },
                    { status: "CONFIRMED", OR: [
                        { cancellable: true }, { confirmationNotifiedAt: null },
                        { confirmationNotifiedAt: { isSet: false } },
                    ] },
                ] },
                { OR: [
                    { nextConfirmationAttemptAt: null }, { nextConfirmationAttemptAt: { isSet: false } },
                    { nextConfirmationAttemptAt: { lte: new Date() } },
                ] },
            ],
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        take: batchSize, select: { id: true },
    });
}

/** Defers subsequent attempts so unsuccessful orders do not monopolize future batches. */
export async function scheduleOrderConfirmationRetry(id: string, retryDelayMs: number) {
    await db.order.update({ where: { id },
        data: { nextConfirmationAttemptAt: new Date(Date.now() + retryDelayMs) }, select: { id: true } });
}

/** Summarizes batch progress while retaining each order's outcome for the caller. */
export function summarizeConfirmationBatch(status: ConfirmationBatchStatus, results: ConfirmationResult[]) {
    return {
        status, attempted: results.length,
        confirmed: results.filter(result => result.outcome === "processing").length,
        held: results.filter(result => result.outcome === "restocking").length,
        failed: results.filter(result => result.outcome === "failed").length,
        skipped: results.filter(result => result.outcome === "skipped").length,
        notificationsPending: results.filter(result => "notified" in result && !result.notified && result.outcome !== "skipped").length,
        results,
    };
}
