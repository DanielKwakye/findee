import TicketTable from "@/features/tickets/components/ui/ticket-table";
import type { Metadata } from "next";
import messages from "@/translations/en.json";

export const metadata: Metadata = { title: messages.PageMetadata.titles.adminTickets };

/** Presents support ticket management in the administrator portal. */
export default function TicketsPage() {
    return <TicketTable audience="admin" />;
}
