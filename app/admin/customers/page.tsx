import { requireAdmin } from "@/features/auth/server/auth.session";
import CustomersTable from "@/features/users/components/ui/customers-table";

/** Presents customer account summaries to authorized administrators. */
export default async function CustomersPage() {
    await requireAdmin();
    return <CustomersTable />;
}
