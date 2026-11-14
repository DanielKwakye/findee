import TicketTable from '@/features/tickets/components/ui/ticket-table';
import type { Metadata } from 'next';
import messages from '@/translations/en.json';
import { requireAdmin } from '@/features/auth/server/auth.session';
import { UserDepartments } from '@/features/users/utils/users.constants';

export const metadata: Metadata = { title: messages.PageMetadata.titles.adminTickets };

/** Presents support ticket management in the administrator portal. */
export default async function TicketsPage() {
    await requireAdmin({ department: UserDepartments.support });
    return <TicketTable audience="admin" />;
}
