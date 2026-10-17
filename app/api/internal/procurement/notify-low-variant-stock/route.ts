import { authorizeCronRequest } from "@/lib/cron.authorization";
import { notifyLowVariantStock } from "@/features/procurement/server/notify.low.variant.stock";

export const runtime = "nodejs";

/** Authenticates scheduled requests and sends low-stock notifications to the operations inbox. */
export async function POST(request: Request) {
    const authorizationError = authorizeCronRequest(request);
    if (authorizationError) return authorizationError;

    try {
        return Response.json(await notifyLowVariantStock());
    } catch (error) {
        console.error("Scheduled low variant stock notification failed", { error });
        return Response.json({ error: "stock_notification_failed" }, { status: 500 });
    }
}
