import RecoveryDetails from "@/features/recovery/components/ui/recovery-details";
import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {AppIcon} from "@/components/platform";

/** Provides the unauthenticated recovery page for a sticker's unique code. */
export default async function RecoveryPage({params}: {params: Promise<{code: string}>}) {
    const {code} = await params;
    const t = await getTranslations("recovery");
    return (
        <div className="relative isolate flex min-h-dvh flex-col overflow-hidden" style={{backgroundColor: "color-mix(in oklch, var(--chart-5) 22%, var(--foreground))"}}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-10" style={{
                backgroundImage: "linear-gradient(color-mix(in oklch, var(--chart-2) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--chart-2) 40%, transparent) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
            }} />
            <header className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8">
                <Link href="/" prefetch={false} aria-label={t("home")} className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                    <AppIcon brightness="light" size="compact" />
                </Link>
            </header>
            <main className="flex flex-1 items-center justify-center px-5 pt-4 pb-16 sm:px-8 sm:pb-24">
                <RecoveryDetails code={code} />
            </main>
        </div>
    );
}
