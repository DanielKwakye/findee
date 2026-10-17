"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import type { OrderStatus } from "@/generated/client";

/** Counts orders currently on hold for administrator navigation. */
export async function getOrderCounts() {
    await requireAdmin();
    // Default to on-hold orders while allowing the pending badge to reuse the same query.
    // Supply every status and the overall total together for all Orders navigation badges.
    const groups = await db.order.groupBy({ by: ["status"], _count: { _all: true } });
    const counts: Partial<Record<OrderStatus | "all", number>> = { all: 0 };
    for (const group of groups) {
        counts[group.status] = group._count._all;
        counts.all = (counts.all ?? 0) + group._count._all;
    }
    return counts;
}
