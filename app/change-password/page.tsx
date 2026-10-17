import { requireAdmin } from "@/features/auth/server/auth.session";
import ChangeAdminPasswordForm from "@/features/auth/components/ui/change-admin-password-form";
import PortalSessionGuard from "@/features/auth/components/ui/portal-session-guard";

/** Presents the required password change for administrators with temporary credentials. */
export default async function ChangePasswordPage() {
    await requireAdmin({ allowPasswordChange: true });
    return <main className="flex min-h-svh items-center justify-center px-4 py-8"><PortalSessionGuard role="ADMIN" /><ChangeAdminPasswordForm /></main>;
}
