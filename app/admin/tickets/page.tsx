import TicketTable from "@/features/tickets/components/ui/ticket-table";

/** Presents support ticket management in the administrator portal. */
export default function TicketsPage() {
    return <TicketTable audience="admin" />;
}
