"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/core/ui/button";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyH3 from "@/components/core/ui/typography-h3";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { orderReceivedAnimation } from "@/features/checkout/data/checkout.order.received";

/** Acknowledges the submitted order and its processing status. */
export default function OrderReceived() {
    const t = useTranslations("Checkout.orderReceived");

    return (
        <div className="w-full max-w-md space-y-4 text-center">
            <div aria-hidden="true" className="mx-auto size-48 sm:size-56">
                <DotLottieReact src={orderReceivedAnimation} autoplay loop={false} />
            </div>
            <TypographyH3 className="text-xl">{t("title")}</TypographyH3>
            <TypographyParagraph className="text-sm text-muted-foreground">{t("description")}</TypographyParagraph>
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Button variant="secondary" render={<Link href="/" />} nativeButton={false}>
                    <TypographyBody className="text-sm">{t("goHome")}</TypographyBody>
                </Button>
                <Button render={<Link href="#" />} nativeButton={false}>
                    <TypographyBody className="text-sm">{t("trackDelivery")}</TypographyBody>
                </Button>
            </div>
        </div>
    );
}
