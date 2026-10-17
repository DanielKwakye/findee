import { randomUUID } from "node:crypto";
import { authorizeCronRequest } from "@/lib/cron.authorization";
import { confirmPendingOrders } from "@/features/orders/server/confirm.pending.orders";

export const runtime = "nodejs";

/** Authenticates scheduled requests and returns the completed order confirmation batch summary. */
export async function POST(request: Request) {
    // Reject unauthenticated requests before reading orders or starting the batch.
    const authorizationError = authorizeCronRequest(request);
    if (authorizationError) return authorizationError;

    const runId = randomUUID();
    const startedAt = Date.now();
    console.info("Scheduled order confirmation started", { runId, timestamp: new Date(startedAt).toISOString() });

    try {
        // Await the five-order batch so the caller receives its actual outcomes.
        const summary = await confirmPendingOrders();
        console.info("Scheduled order confirmation completed", {
            runId, timestamp: new Date().toISOString(), durationMs: Date.now() - startedAt,
            status: summary.status, attempted: summary.attempted, confirmed: summary.confirmed,
            held: summary.held, failed: summary.failed, skipped: summary.skipped,
            notificationsPending: summary.notificationsPending,
        });
        return Response.json(summary);
    } catch (error) {
        console.error("Scheduled order confirmation failed", {
            runId, timestamp: new Date().toISOString(), durationMs: Date.now() - startedAt, error,
        });
        return Response.json({ error: "order_confirmation_failed" }, { status: 500 });
    }
}
