import "server-only";

import { timingSafeEqual } from "node:crypto";

/** Validates a scheduled caller's credentials, returning an error response when access is denied. */
export function authorizeCronRequest(request: Request): Response | null {
    const secret = process.env.CRON_SECRET;
    if (!secret) return Response.json({ error: "cron_not_configured" }, { status: 503 });

    const authorization = Buffer.from(request.headers.get("authorization") ?? "");
    const expected = Buffer.from(`Bearer ${secret}`);
    if (authorization.length !== expected.length || !timingSafeEqual(authorization, expected)) {
        return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    return null;
}
