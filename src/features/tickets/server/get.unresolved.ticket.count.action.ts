"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Counts support tickets that still need administrator attention. */
export async function getUnresolvedTicketCount() {
    await requireAdmin();
    return db.ticket.count({ where: { status: { not: "RESOLVED" } } });
}
