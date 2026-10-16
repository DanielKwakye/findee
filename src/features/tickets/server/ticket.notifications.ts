import "server-only";

import { getTranslations } from "next-intl/server";
import { sendEmail } from "@/features/notifications/server/send.email";
import { renderNotificationEmail } from "@/features/notifications/server/notification.email";
import type { TicketNotification } from "@/features/tickets/utils/ticket.types";

/** Sends ticket notifications independently of the saved request, with safe delivery retries. */
export async function sendTicketNotifications(ticket: TicketNotification, event: "created" | "updated") {
    const t = await getTranslations("TicketNotifications");
    const tEmail = await getTranslations("Notifications.email");
    const tStatus = await getTranslations("TicketHistory.statuses");
    const supportEmail = process.env.TICKET_EMAIL;
    const recipients = event === "created" ? ["customer", "support"] as const : ["customer"] as const;
    const results = await Promise.all(recipients.map(async recipient => {
        const to = recipient === "support" ? supportEmail : ticket.customerEmail;
        if (!to) return false;
        const kind = recipient === "support" ? "support" : event;
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const content = await renderNotificationEmail({
                    brand: tEmail("brand"), title: t(`${kind}.title`),
                    introduction: t(`${kind}.introduction`, { name: ticket.customerName, code: ticket.code, status: tStatus(ticket.status) }),
                    highlight: ticket.code,
                    guidance: recipient === "support"
                        ? t("support.details", { name: ticket.customerName, email: ticket.customerEmail, message: ticket.message })
                        : t(`${kind}.guidance`),
                    signoff: tEmail("signoff"), footer: tEmail("footer"),
                });
                await sendEmail({ to, subject: t(`${kind}.subject`, { code: ticket.code }), ...content,
                    replyTo: recipient === "support" ? ticket.customerEmail : supportEmail,
                    idempotencyKey: `ticket-${event}-${recipient}/${ticket.id}/${event === "created" ? "initial" : ticket.updatedAt.getTime()}`,
                });
                return true;
            } catch {
                if (attempt === 1) console.error("Ticket notification delivery failed", { ticketId: ticket.id, event, recipient });
            }
        }
        return false;
    }));
    return results.every(Boolean);
}
