"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH3 from "@/components/core/ui/typography-h3";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import OrderReceived from "@/features/checkout/components/ui/order-received";
import { useCheckoutOrder } from "@/features/orders/components/hooks/use.checkout.order";

/** Displays payment verification progress before acknowledging a completed order. */
export default function CheckoutOrder({ sessionId }: { sessionId?: string }) {
    const t = useTranslations("Checkout.orderReceived");
    const order = useCheckoutOrder(sessionId);
    if (order.isError) {
        return (
            <div className="w-full max-w-md space-y-3 text-center" role="alert">
                <TypographyH3 className="text-xl">{t("verificationErrorTitle")}</TypographyH3>
                <TypographyParagraph className="text-sm text-muted-foreground">{t("verificationError")}</TypographyParagraph>
                <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                    <Button onClick={() => void order.refetch()}><TypographyBody className="text-sm">{t("retryVerification")}</TypographyBody></Button>
                    <Button variant="secondary" render={<Link href="/customer/orders" />} nativeButton={false}>
                        <TypographyBody className="text-sm">{t("trackDelivery")}</TypographyBody>
                    </Button>
                </div>
            </div>
        );
    }

    if (order.isPending) {
        return (
            <div className="w-full max-w-md space-y-3 text-center" role="status">
                <LoaderCircle aria-hidden="true" className="mx-auto size-8 animate-spin text-muted-foreground" />
                <TypographyH3 className="text-xl">{t("verifyingTitle")}</TypographyH3>
                <TypographyParagraph className="text-sm text-muted-foreground">{t("verifyingDescription")}</TypographyParagraph>
            </div>
        );
    }

    return <OrderReceived />;
}
