import type { getTickets } from "@/features/tickets/server/get.tickets.action";
import type { TicketStatus } from "@/generated/client";

export type TicketNotification = {
    id: string;
    code: string;
    customerName: string;
    customerEmail: string;
    message: string;
    status: TicketStatus;
    updatedAt: Date;
};

export type TicketValues = {
    name: string;
    email: string;
    message: string;
};

export type TicketRow = Awaited<ReturnType<typeof getTickets>>["tickets"][number];
export type TicketDialogHandle = { open: (id: string) => void };
export type TicketUpdateValues = { status: TicketStatus; remarks: string };
export type TicketUpdate = TicketUpdateValues & { id: string };

export type TicketQuery = {
    page: number;
    pageSize: number;
    search: string;
    sortBy: string;
    direction: "asc" | "desc";
};
