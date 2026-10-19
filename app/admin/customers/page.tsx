import { requireAdmin } from "@/features/auth/server/auth.session";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import CustomersTable from "@/features/users/components/ui/customers-table";

export const metadata: Metadata = { title: messages.PageMetadata.titles.customers };

/** Presents customer account summaries to authorized administrators. */
export default async function CustomersPage() {
    await requireAdmin();
    return <CustomersTable />;
}
