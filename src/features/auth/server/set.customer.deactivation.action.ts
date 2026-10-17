"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";

/** Temporarily suspends or restores portal access for an open customer account. */
export async function setCustomerDeactivation({ id, deactivated }: { id: string; deactivated: boolean }) {
    await requireAdmin();
    if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id) || typeof deactivated !== "boolean") {
        throw new Error("Invalid customer account update");
    }
    const result = await db.user.updateMany({
        where: { id, role: "CUSTOMER", OR: [{ closedAt: null }, { closedAt: { isSet: false } }] },
        data: { deactivatedAt: deactivated ? new Date() : null, otp: null, otpCreatedAt: null },
    });
    if (result.count !== 1) throw new Error("Customer account is unavailable");
}
