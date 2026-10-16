import type { TicketStatus } from "@/generated/client";

export const ticketStatuses = ["PENDING", "PROCESSING", "RESOLVED"] as const satisfies readonly TicketStatus[];

export const ticketStatusBadgeClasses: Record<TicketStatus, string> = {
    PENDING: "bg-warning/15 text-warning",
    PROCESSING: "bg-primary/15 text-primary",
    RESOLVED: "bg-success/15 text-success",
};
