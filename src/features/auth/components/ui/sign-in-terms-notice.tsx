"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";

/** Presents the terms and privacy notice for email sign-in. */
export function SignInTermsNotice() {
    const t = useTranslations("Auth.customerSignIn");

    return (
        <TypographyParagraph className="text-xs leading-5 text-muted-foreground">
            {t.rich("termsNotice", {
                terms: chunks => <Link href="/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{chunks}</Link>,
                privacy: chunks => <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{chunks}</Link>,
            })}
        </TypographyParagraph>
    );
}
