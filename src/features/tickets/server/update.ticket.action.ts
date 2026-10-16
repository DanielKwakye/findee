"use server";

import { requireAdmin } from "@/features/auth/server/auth.session";
import { validateTicketUpdate } from "@/features/tickets/utils/ticket.validation";
import type { TicketUpdate } from "@/features/tickets/utils/ticket.types";
import { db } from "@/lib/db";
import { sendTicketNotifications } from "@/features/tickets/server/ticket.notifications";

/** Saves administrator changes to a ticket's status and internal remarks. */
export async function updateTicket(values: TicketUpdate) {
    await requireAdmin();
    const data = validateTicketUpdate(values);
    const previous = await db.ticket.findUniqueOrThrow({ where: { id: values.id }, select: { status: true } });
    const ticket = await db.ticket.update({ where: { id: values.id }, data,
        select: { id: true, code: true, customerName: true, customerEmail: true, message: true, status: true, updatedAt: true } });
    const notified = previous.status === ticket.status || await sendTicketNotifications(ticket, "updated").catch(() => false);
    return { notified };
}
