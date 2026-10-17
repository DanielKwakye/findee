"use server";

import { requireCustomer } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Records customer portal visits at most once per five-minute interval. */
export async function recordCustomerPortalVisit() {
    const user = await requireCustomer();
    const now = new Date();
    await db.user.updateMany({
        where: {
            id: user.id, role: "CUSTOMER",
            AND: [
                { OR: [{ closedAt: null }, { closedAt: { isSet: false } }] },
                { OR: [
                    { lastPortalVisitedAt: null },
                    { lastPortalVisitedAt: { isSet: false } },
                    { lastPortalVisitedAt: { lte: new Date(now.getTime() - 5 * 60_000) } },
                ] },
            ],
        },
        data: { lastPortalVisitedAt: now },
    });
}
