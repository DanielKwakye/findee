"use client";

import {useTranslations} from "next-intl";
import {Card, CardHeader, CardContent} from "@/components/core/ui/card";
import {Button} from "@/components/core/ui/button";
import TypographyH2 from "@/components/core/ui/typography-h2";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import TypographyBody from "@/components/core/ui/typography-body";
import {useRecovery} from "@/features/recovery/components/hooks/use.recovery";
import Link from "next/link";
import {Mail, Phone, ScanLine, UserRound} from "lucide-react";
import TypographySubtitle from "@/components/core/ui/typography-subtitle";

/** Displays the owner and available contact details for a public recovery link. */
export default function RecoveryDetails({code}: {code: string}) {
    const t = useTranslations("recovery");
    const query = useRecovery(code);
    const product = query.data;
    return (
        <Card className="w-full max-w-lg gap-6 rounded-3xl py-8 shadow-lg sm:py-10">
            {query.isSuccess && product && <CardHeader className="items-center gap-4 px-6 text-center sm:px-10">
                <div aria-hidden="true" className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <ScanLine className="size-7" strokeWidth={1.5} />
                </div>
                {query.isSuccess && product && <>
                    <TypographyBody className="text-xs font-semibold tracking-widest text-primary uppercase">{t("eyebrow")}</TypographyBody>
                    <TypographyH2 className="font-heading text-xl leading-tight tracking-tight sm:text-2xl">{t("title")}</TypographyH2>
                </>}
            </CardHeader>}
            <CardContent className="space-y-4 px-6 break-words sm:px-10" aria-live="polite" aria-busy={query.isFetching}>
                {query.isPending ? <div className="rounded-2xl bg-muted/50 p-5 text-center"><TypographySubtitle>{t("loading")}</TypographySubtitle></div>
                    : query.isError ? <>
                        <TypographyParagraph className="text-center text-muted-foreground">{t("error")}</TypographyParagraph>
                        <Button className="w-full" onClick={() => query.refetch()} disabled={query.isFetching}><TypographyBody className="text-sm">{t("retry")}</TypographyBody></Button>
                    </> : !product ? <div className="rounded-2xl bg-muted/50 p-5 text-center"><TypographyParagraph>{t("notFound")}</TypographyParagraph></div>
                        : <>
                            <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                                <div aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-primary"><UserRound className="size-5" strokeWidth={1.5} /></div>
                                <div className="min-w-0 space-y-1">
                                    <TypographySubtitle className="text-xs">{t("ownerLabel")}</TypographySubtitle>
                                    <TypographyParagraph className="font-semibold leading-5">{product.assignedTo.name || t("ownerFallback")}</TypographyParagraph>
                                </div>
                            </div>
                            {product.assignedTo.phone && <Button render={<Link href={`tel:${product.assignedTo.phone.replace(/[^+\d]/g, "")}`} prefetch={false} />} nativeButton={false} className="h-auto min-h-12 w-full gap-3 whitespace-normal py-3">
                                <Phone aria-hidden="true" className="size-4 shrink-0" />
                                <TypographyBody className="text-sm">{t("phone", {phone: product.assignedTo.phone})}</TypographyBody>
                            </Button>}
                            {product.assignedTo.email && <Button render={<Link href={`mailto:${product.assignedTo.email}`} prefetch={false} />} nativeButton={false} variant="outline" className="h-auto min-h-12 w-full gap-3 whitespace-normal py-3">
                                <Mail aria-hidden="true" className="size-4 shrink-0" />
                                <TypographyBody className="min-w-0 break-all text-sm">{t("email", {email: product.assignedTo.email})}</TypographyBody>
                            </Button>}
                            {/*{product.reachoutModes?.chat && <TypographyParagraph>{t("chatEnabled")}</TypographyParagraph>}*/}
                            {!product.assignedTo.email && !product.assignedTo.phone && <TypographySubtitle className="text-center">{t("noContact")}</TypographySubtitle>}
                        </>}
                {query.isSuccess && product && <div className="border-t border-border pt-4 text-center">
                    <TypographySubtitle className="text-xs">{t("unreachableGuidance")}</TypographySubtitle>
                </div>}
            </CardContent>
        </Card>
    );
}
