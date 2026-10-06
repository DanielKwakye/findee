import { LoginForm } from "@/features/auth/components/ui/login-form";

/** Presents sign-in and sends authenticated administrators to their portal. */
export default async function LoginPage() {
    return <main className="flex min-h-svh items-center justify-center px-4 py-8"><LoginForm /></main>;
}
