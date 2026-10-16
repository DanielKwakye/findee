"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppIcon } from "@/components/platform";
import TypographyH1 from "@/components/core/ui/typography-h1";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { CustomerOtpForm } from "@/features/auth/components/ui/customer-otp-form";
import { useCustomerSignIn } from "@/features/auth/components/hooks/use.customer.sign.in";
import styles from "@/features/auth/components/ui/customer-sign-in.module.css";
import { cn } from "@/lib/utils";

/** Presents customer sign-in with a responsive branded welcome panel. */
export function CustomerSignIn() {
    const t = useTranslations("Auth.customerSignIn");
    const tFooter = useTranslations("Footer");
    const { onVerified } = useCustomerSignIn();

    return (
        <main className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
            <section className="flex min-h-svh flex-col px-6 py-6 sm:px-10 sm:py-8">
                <Link href="/" aria-label={t("home")} className="w-fit rounded-md focus-visible:outline-2 focus-visible:outline-ring">
                    <AppIcon size="compact" />
                </Link>
                <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">
                    <div className="mb-8 space-y-3">
                        <TypographyH1 className="text-2xl tracking-tight sm:text-3xl">{t("title")}</TypographyH1>
                        <TypographyParagraph className="text-sm leading-6 text-muted-foreground">{t("description")}</TypographyParagraph>
                    </div>
                    <CustomerOtpForm onVerified={onVerified} fullWidth />
                    <TypographyParagraph className="mt-8 text-center text-xs leading-5 text-muted-foreground">
                        {t.rich("termsNotice", {
                            terms: chunks => <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">{chunks}</Link>,
                            privacy: chunks => <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">{chunks}</Link>,
                        })}
                    </TypographyParagraph>
                </div>
            </section>
            <aside className={cn("relative hidden overflow-hidden px-12 py-16 text-primary-foreground lg:flex lg:items-center xl:px-20", styles.patternPanel)}>
                <div className="relative max-w-lg space-y-6">
                    <AppIcon brightness="light" />
                    <TypographyParagraph className="font-heading text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">{tFooter("tagline")}</TypographyParagraph>
                    <TypographyBody className="block text-lg leading-8 text-primary-foreground/75">{tFooter("description")}</TypographyBody>
                </div>
            </aside>
        </main>
    );
}
