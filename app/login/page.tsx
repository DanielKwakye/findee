import { LoginForm } from "@/features/auth/components/ui/login-form";
import type { Metadata } from "next";
import messages from "@/translations/en.json";

export const metadata: Metadata = { title: messages.PageMetadata.titles.adminLogin };

/** Presents sign-in and sends authenticated administrators to their portal. */
export default async function LoginPage() {
    return <main className="flex min-h-svh items-center justify-center px-4 py-8"><LoginForm /></main>;
}
