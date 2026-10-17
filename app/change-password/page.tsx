import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/auth/server/auth.session";
import ChangeAdminPasswordForm from "@/features/auth/components/ui/change-admin-password-form";

/** Presents the required password change for administrators with temporary credentials. */
export default async function ChangePasswordPage() {
    const user = await requireAdmin({ allowPasswordChange: true });
    if (!user.mustChangePassword) redirect("/admin");
    return <main className="flex min-h-svh items-center justify-center px-4 py-8"><ChangeAdminPasswordForm /></main>;
}
