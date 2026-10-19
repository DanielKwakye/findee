import TicketForm from "@/features/tickets/components/ui/ticket-form";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import { requireCustomer } from "@/features/auth/server/auth.session";

export const metadata: Metadata = { title: messages.PageMetadata.titles.customerSupport };

/** Presents support requests with the signed-in customer's contact details. */
export default async function CustomerTicketsPage() {
    const user = await requireCustomer();
    return (
        <div className="min-w-0 space-y-8">
            <TicketForm initialValues={{ name: user.name ?? "", email: user.email, message: "" }} showTrackingLink />
        </div>
    );
}
