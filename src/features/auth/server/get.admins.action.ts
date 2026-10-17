"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Retrieves administrator account summaries for the management table. */
export async function getAdmins() {
    await requireAdmin();
    return db.user.findMany({
        where: { role: "ADMIN", OR: [{ closedAt: null }, { closedAt: { isSet: false } }] },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: { id: true, name: true, email: true, mustChangePassword: true },
    });
}
