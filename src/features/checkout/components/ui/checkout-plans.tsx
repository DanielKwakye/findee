"use client";

import { Controller, useWatch, type Control } from "react-hook-form";
import { useFormatter, useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { Input } from "@/components/core/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import type { CheckoutPlan, CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { checkoutVariants } from "@/features/checkout/data/checkout.variants";
import { getCheckoutUnitPrice } from "@/features/checkout/utils/checkout.pricing";
import { distributeCheckoutQuantity } from "@/features/checkout/utils/checkout.allocation";

type Props = {
    control: Control<CheckoutValues>;
    plans: CheckoutPlan[];
};

/** Presents the available sticker plans as a single purchase choice. */
export default function CheckoutPlans({ control, plans }: Props) {
    const t = useTranslations("Checkout.plans");
    const variantsText = useTranslations("Checkout.variants");
    const format = useFormatter();
    const variants = useWatch({ control, name: "variants" });
    const custom = plans.find(plan => plan.id === "custom");
    if (!custom) return null;
    const allocation = distributeCheckoutQuantity(variants, custom.quantity);

    return (
        <div className="space-y-4">
            <Controller name="customQuantity" control={control}
                rules={{
                    /** Requires a whole sticker quantity within the custom plan's purchase limits. */
                    validate: value => (typeof value === "number" && Number.isSafeInteger(value)
                        && value >= custom.minimumQuantity!) || t("customQuantityInvalid", { minimum: custom.minimumQuantity! }),
                }}
                render={({ field, fieldState }) => (
                    <Field className="gap-2">
                        <FieldLabel htmlFor="checkout-custom-quantity"><TypographyBody className="text-sm">{t("customQuantity")}</TypographyBody></FieldLabel>
                        <Input id="checkout-custom-quantity" type="number" inputMode="numeric" min={custom.minimumQuantity} step={1}
                            name={field.name} ref={field.ref} value={field.value ?? ""} onBlur={field.onBlur}
                            onChange={event => field.onChange(event.target.value === "" ? "" : event.target.valueAsNumber)}
                            aria-invalid={fieldState.invalid} aria-describedby="checkout-custom-quantity-help" />
                        <TypographyParagraph className="text-xs text-muted-foreground"><span id="checkout-custom-quantity-help">{fieldState.error?.message ?? t("customQuantityInvalid", { minimum: custom.minimumQuantity! })}</span></TypographyParagraph>
                    </Field>
                )} />
            <Field className="rounded-xl border border-border p-4">
                <FieldContent className="gap-3">
                    <div className="flex items-start gap-2 text-muted-foreground">
                        <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                        <TypographyParagraph className="text-xs">{t("pricingReference")}</TypographyParagraph>
                    </div>
                    {checkoutVariants.filter(variant => variants.includes(variant.id)).map(variant => (
                        <div key={variant.id} className="flex flex-wrap items-center justify-between gap-2">
                            <TypographyBody className="text-sm">{variantsText(`${variant.key}.title`)}</TypographyBody>
                            <TypographyBody className="text-sm font-semibold">{t("perUnit", { price: format.number(getCheckoutUnitPrice(custom, variant.id, Number(allocation[variant.id]) || 0), {
                                style: "currency", currency: custom.currency, currencyDisplay: "code", maximumFractionDigits: 3,
                            }) })}</TypographyBody>
                        </div>
                    ))}
                </FieldContent>
            </Field>
        </div>
    );
}
