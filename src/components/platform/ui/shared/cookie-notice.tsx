"use client";

import type { Ref } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/core/ui/card";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useCookieNotice } from "@/components/platform/hooks/use.cookie.notice";
import type { CookieNoticeHandle } from "@/components/platform/utils/cookie.notice";

/** Presents a compact notice about Findmus cookies and remembers the visitor's acknowledgement. */
export default function CookieNotice({ ref }: { ref?: Ref<CookieNoticeHandle> }) {
    const t = useTranslations("CookieNotice");
    const { isOpen, changeOpen, accept } = useCookieNotice(ref);

    if (!isOpen) return null;

    return (
        <Card role="region" aria-label={t("title")} size="sm" className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 max-h-[calc(100dvh-7rem)] gap-3 overflow-y-auto shadow-lg sm:inset-x-auto sm:right-6 sm:w-80 xl:bottom-6">
            <CardHeader>
                <CardTitle><TypographyBody className="font-heading text-sm font-semibold">{t("title")}</TypographyBody></CardTitle>
                <CardAction>
                    <Button type="button" variant="ghost" size="icon-xs" aria-label={t("dismiss")} onClick={() => changeOpen(false)}><XIcon aria-hidden="true" /></Button>
                </CardAction>
                <CardDescription><TypographyBody className="text-xs leading-5 text-muted-foreground">{t("description")}</TypographyBody></CardDescription>
            </CardHeader>
            <CardContent>
                <TypographyParagraph className="text-xs leading-5 text-muted-foreground">
                    {t.rich("learnMore", {
                        privacy: chunks => <Link href="/privacy" onClick={() => changeOpen(false)} className="text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{chunks}</Link>,
                    })}
                </TypographyParagraph>
            </CardContent>
            <CardFooter>
                <Button type="button" size="sm" onClick={accept} className="w-full"><TypographyBody className="text-xs">{t("accept")}</TypographyBody></Button>
            </CardFooter>
        </Card>
    );
}
