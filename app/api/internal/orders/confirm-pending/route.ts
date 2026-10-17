import { randomUUID, timingSafeEqual } from "node:crypto";
import { confirmPendingOrders } from "@/features/orders/server/confirm.pending.orders";

export const runtime = "nodejs";

/** Authenticates scheduled requests and returns the completed order confirmation batch summary. */
export async function POST(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret) return Response.json({ error: "cron_not_configured" }, { status: 503 });

    // Reject unauthenticated requests before reading orders or starting the batch.
    const authorization = Buffer.from(request.headers.get("authorization") ?? "");
    const expected = Buffer.from(`Bearer ${secret}`);
    if (authorization.length !== expected.length || !timingSafeEqual(authorization, expected)) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
    }

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
