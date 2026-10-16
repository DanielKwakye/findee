"use server";

import { requireAdmin, requireCustomer } from "@/features/auth/server/auth.session";
import { validateTicketId } from "@/features/tickets/utils/ticket.validation";
import { db } from "@/lib/db";

/** Retrieves a ticket's submitted information and internal handling details for administrators. */
export async function getTicketDetails(id: string, audience: "admin" | "customer" = "admin") {
    const user = audience === "customer" ? await requireCustomer() : await requireAdmin();
    validateTicketId(id);
    const ticket = await db.ticket.findUnique({ where: { id, ...(audience === "customer" ? { customerId: user.id } : {}) },
        select: { code: true, customerName: true, customerEmail: true, message: true, createdAt: true, status: true, remarks: audience === "admin" },
    });
    if (!ticket) throw new Error("ticketNotFound");
    return ticket;
}
