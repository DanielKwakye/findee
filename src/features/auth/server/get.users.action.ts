"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { db } from "@/lib/db";
import type { AuthRole } from "@/features/auth/utils/auth.types";

/** Retrieves administrator account summaries for the management table. */
export async function getUsers(role: AuthRole = "ADMIN") {
    await requireAdmin();
    if (role !== "ADMIN" && role !== "CUSTOMER") throw new Error("Invalid user role");
    return db.user.findMany({
        where: { role, ...(role === "ADMIN" ? { OR: [{ closedAt: null }, { closedAt: { isSet: false } }] } : {}) },
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: { id: true, name: true, email: true, mustChangePassword: role === "ADMIN", phone: role === "CUSTOMER", closedAt: role === "CUSTOMER", deactivatedAt: role === "CUSTOMER", createdAt: role === "CUSTOMER", lastPortalVisitedAt: role === "CUSTOMER" },
    });
}
