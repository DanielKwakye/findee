import TicketTable from "@/features/tickets/components/ui/ticket-table";
import type { Metadata } from "next";
import messages from "@/translations/en.json";

export const metadata: Metadata = { title: messages.PageMetadata.titles.customerTickets };

/** Presents the customer's support ticket history. */
export default function CustomerTicketHistoryPage() {
    return <TicketTable />;
}
