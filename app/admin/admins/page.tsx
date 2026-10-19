import { requireAdmin } from "@/features/auth/server/auth.session";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import AdminsTable from "@/features/users/components/ui/admins-table";

export const metadata: Metadata = { title: messages.PageMetadata.titles.admins };

/** Presents administrator account management to authorized administrators. */
export default async function AdminsPage() {
    await requireAdmin();
    return <AdminsTable />;
}
