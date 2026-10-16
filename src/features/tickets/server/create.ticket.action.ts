"use server";

import { getCustomerUser } from "@/features/auth/server/auth.session";
import { generateReferenceCode } from "@/components/platform/utils/reference.code.utils";
import { validateTicketValues } from "@/features/tickets/utils/ticket.validation";
import type { TicketValues } from "@/features/tickets/utils/ticket.types";
import { Prisma } from "@/generated/client";
import { db } from "@/lib/db";
import { sendTicketNotifications } from "@/features/tickets/server/ticket.notifications";

/** Creates a support ticket owned by the authenticated customer. */
export async function createTicket(values: TicketValues) {
    const user = await getCustomerUser();
    const submission = validateTicketValues(values);
    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const ticket = await db.ticket.create({
                data: {
                    code: generateReferenceCode(), customerId: user?.id ?? null,
                    customerName: submission.name, customerEmail: submission.email, message: submission.message,
                },
                select: { id: true, code: true, customerName: true, customerEmail: true, message: true, status: true, updatedAt: true },
            });
            const notified = await sendTicketNotifications(ticket, "created").catch(() => false);
            return { code: ticket.code, notified };
        } catch (error) {
            if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
        }
    }
    throw new Error("ticketCodeUnavailable");
}
