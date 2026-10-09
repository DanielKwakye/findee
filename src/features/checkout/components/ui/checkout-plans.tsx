"use client";

import { Controller, type Control } from "react-hook-form";
import { useFormatter, useTranslations } from "next-intl";
import { Info, Sticker, Users } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/core/ui/radio-group";
import { Badge } from "@/components/core/ui/badge";
import { checkoutPlanAccentClasses, checkoutPlanBadgeClasses } from "@/features/checkout/data/checkout.plan.badges";
import { cn } from "@/lib/utils";
import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import type { CheckoutPlan, CheckoutValues } from "@/features/checkout/utils/checkout.types";

type Props = {
    control: Control<CheckoutValues>;
    plans: CheckoutPlan[];
};

/** Presents the available sticker plans as a single purchase choice. */
export default function CheckoutPlans({ control, plans }: Props) {
    const t = useTranslations("Checkout.plans");
    const format = useFormatter();

    return (
        <div className="space-y-4">
            <Controller name="plan" control={control} render={({ field }) => (
                <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange}
                    onBlur={field.onBlur} aria-label={t("title")} className="gap-2 sm:gap-3 xl:gap-4">
                    {plans.map(plan => (
                        <FieldLabel key={plan.id} className={cn("xl:*:data-[slot=field]:p-3", field.value === plan.id && checkoutPlanAccentClasses[plan.id])}>
                            <Field orientation="horizontal">
                                <FieldContent className="gap-2">
                                    <FieldTitle>
                                        <Sticker aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
                                        <TypographyBody className="text-sm font-bold">{t(plan.quantityIsMinimum ? "stickersPlus" : "stickers", { quantity: plan.quantity })}</TypographyBody>
                                    </FieldTitle>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Users aria-hidden="true" className="size-3.5 shrink-0" />
                                            <TypographyBody className="text-xs">{plan.maxRecoveryProfiles === null ? t("unlimitedProfiles") : t("profiles", { profiles: plan.maxRecoveryProfiles })}</TypographyBody>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <TypographyBody className="text-sm font-bold">
                                            {format.number(plan.price, { style: "currency", currency: plan.currency, currencyDisplay: "code" })}
                                        </TypographyBody>
                                        <Badge variant="secondary" className={checkoutPlanBadgeClasses[plan.id]}>
                                            <TypographyBody className="text-xs">{t(`names.${plan.title}`)}</TypographyBody>
                                        </Badge>
                                    </div>
                                </FieldContent>
                                <RadioGroupItem value={plan.id} />
                            </Field>
                        </FieldLabel>
                    ))}
                </RadioGroup>
            )} />
            <div className="flex items-start gap-2 text-muted-foreground">
                <Info aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
                <TypographyParagraph className="text-xs leading-5">
                    {t("profilesExplanation")}
                </TypographyParagraph>
            </div>
        </div>
    );
}
