import { requireAdmin } from "@/features/auth/server/auth.session";
import type { Metadata } from "next";
import messages from "@/translations/en.json";
import ChangeAdminPasswordForm from "@/features/auth/components/ui/change-admin-password-form";
import PortalSessionGuard from "@/features/auth/components/ui/portal-session-guard";

export const metadata: Metadata = { title: messages.PageMetadata.titles.changePassword };

/** Presents the required password change for administrators with temporary credentials. */
export default async function ChangePasswordPage() {
    await requireAdmin({ allowPasswordChange: true });
    return <main className="flex min-h-svh items-center justify-center px-4 py-8"><PortalSessionGuard role="ADMIN" /><ChangeAdminPasswordForm /></main>;
}
