import { requireAdmin } from "@/features/auth/server/auth.session";
import AdminsTable from "@/features/auth/components/ui/admins-table";

/** Presents administrator account management to authorized administrators. */
export default async function AdminsPage() {
    await requireAdmin();
    return <AdminsTable />;
}
