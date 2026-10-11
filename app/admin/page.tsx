import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/auth/server/auth.session";

/** Routes authorized administrators to the current portal landing page. */
export default async function AdminPage() {
    await requireAdmin();
    redirect("/admin/orders?status=PENDING");
}
