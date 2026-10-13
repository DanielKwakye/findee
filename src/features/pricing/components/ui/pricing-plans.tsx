"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowRight, Check, Sticker, Users } from "lucide-react";
import { Badge } from "@/components/core/ui/badge";
import { Button } from "@/components/core/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/core/ui/card";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { checkoutPlanBadgeClasses } from "@/features/checkout/data/checkout.plan.badges";
import { checkoutPlanParams } from "@/features/checkout/data/checkout.plan.params";
import { usePricing } from "@/features/pricing/components/hooks/use.pricing";
import { cn } from "@/lib/utils";

/** Presents checkout's sticker plans for comparison before purchase. */
export default function PricingPlans() {
  const t = useTranslations("Pricing");
  const tPlans = useTranslations("Checkout.plans");
  const format = useFormatter();
  const plans = usePricing();

  return (
    <section aria-label={t("plansLabel")} className="container mx-auto px-5 pb-12 sm:px-6 sm:pb-20">
      {plans.isPending ? (
        <div role="status" className="py-12 text-center">
          <TypographyParagraph className="text-muted-foreground">{tPlans("loading")}</TypographyParagraph>
        </div>
      ) : plans.isError ? (
        <div className="space-y-4 py-12 text-center">
          <div role="alert"><TypographyParagraph className="text-muted-foreground">{tPlans("error")}</TypographyParagraph></div>
          <Button variant="secondary" onClick={() => plans.refetch()}>
            <TypographyBody>{tPlans("retry")}</TypographyBody>
          </Button>
        </div>
      ) : (
        <>
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
            {plans.data.map(plan => (
              <Card key={plan.id} className={cn("relative gap-6 border border-border py-7 ring-0 transition-[scale,box-shadow] duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_12px_2px_var(--tw-shadow-color)] hover:shadow-chart-2/10 focus-within:shadow-[0_0_12px_2px_var(--tw-shadow-color)] focus-within:shadow-chart-2/10 motion-reduce:transform-none motion-reduce:scale-100 motion-reduce:transition-none", plan.id === "family" && "border-primary bg-primary/5")}>
                <CardHeader className="gap-3">
                  <Badge variant="secondary" className={cn("h-auto px-3 py-1", checkoutPlanBadgeClasses[plan.id])}>
                    <TypographyBody className="text-xs font-semibold">{tPlans(`names.${plan.title}`)}</TypographyBody>
                  </Badge>
                  <TypographyBody className="text-lg font-semibold">{t(`descriptions.${plan.id}`)}</TypographyBody>
                  <TypographyBody className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                    {format.number(plan.price, { style: "currency", currency: plan.currency, currencyDisplay: "code" })}
                  </TypographyBody>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 border-t border-border pt-6">
                    <li className="flex items-center gap-3">
                      <Sticker aria-hidden="true" className="size-5 shrink-0 text-primary" />
                      <TypographyBody className="font-semibold">{tPlans(plan.quantityIsMinimum ? "stickersPlus" : "stickers", { quantity: plan.quantity })}</TypographyBody>
                    </li>
                    <li className="flex items-center gap-3">
                      <Users aria-hidden="true" className="size-5 shrink-0 text-primary" />
                      <TypographyBody>{plan.maxRecoveryProfiles === null ? tPlans("unlimitedProfiles") : tPlans("profiles", { profiles: plan.maxRecoveryProfiles })}</TypographyBody>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check aria-hidden="true" className="size-5 shrink-0 text-primary" />
                      <TypographyBody>{t("readyToUse")}</TypographyBody>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant={plan.id === "family" ? "default" : "outline"} render={<Link href={`/checkout?plan=${checkoutPlanParams[plan.id]}`} aria-label={t("choosePlan", { plan: tPlans(`names.${plan.title}`) })} />} nativeButton={false} className="h-11 w-full gap-2">
                    <TypographyBody className="font-semibold">{t("getStickers")}</TypographyBody>
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <TypographyParagraph className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-muted-foreground">
            {tPlans("profilesExplanation")}
          </TypographyParagraph>
        </>
      )}
    </section>
  );
}
