"use client";

import Link from "next/link";
import { PortalConfirmDialog } from "@/components/platform";
import { Button } from "@/components/core/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/core/ui/card";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { useCloseCustomerAccount } from "@/features/auth/components/hooks/use.close.customer.account";

/** Explains account closure and provides a confirmed action with a support route. */
export default function CloseCustomerAccount() {
    const { t, confirmRef, mutation, requestClosure } = useCloseCustomerAccount();
    return (
        <Card className="w-full border border-border ring-0">
            <CardHeader>
                <CardTitle><TypographyBody className="text-lg font-semibold">{t("title")}</TypographyBody></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <TypographyParagraph className="max-w-xl text-sm text-muted-foreground">{t("description")}</TypographyParagraph>
                <TypographyParagraph className="max-w-xl text-sm text-muted-foreground">
                    {t.rich("support", { contact: chunks => <Link href="/customer/tickets" className="text-primary underline underline-offset-4">{chunks}</Link>,
                        privacy: chunks => <Link href="/privacy" className="text-primary underline underline-offset-4">{chunks}</Link> })}
                </TypographyParagraph>
                <Button type="button" variant="destructive" disabled={mutation.isPending} onClick={requestClosure}>
                    <TypographyBody className="text-sm">{t("title")}</TypographyBody>
                </Button>
            </CardContent>
            <PortalConfirmDialog ref={confirmRef} />
        </Card>
    );
}
