"use client";

import { Controller, type Control } from "react-hook-form";
import { useFormatter, useTranslations } from "next-intl";
import { Field, FieldGroup, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { checkoutVariants, type CheckoutVariant } from "@/features/checkout/data/checkout.variants";
import type { CheckoutPlan, CheckoutValues } from "@/features/checkout/utils/checkout.types";
import { getCheckoutSubtotal, getCheckoutUnitPrice } from "@/features/checkout/utils/checkout.pricing";

type Props = {
    control: Control<CheckoutValues>;
    variants: CheckoutVariant[];
    limit: number;
    total: number;
    error?: string;
    quantityIsMinimum: boolean;
    onQuantityKeyUp: () => void;
    plan?: CheckoutPlan;
};

/** Presents sticker quantities and the allocation limit for a purchase. */
export default function CheckoutAllocation({ control, variants, limit, total, error, quantityIsMinimum, onQuantityKeyUp, plan }: Props) {
    const t = useTranslations("Checkout");
    const format = useFormatter();

    return (
        <div className="space-y-4">
            <FieldGroup className="gap-3 xl:gap-4">
                {checkoutVariants.filter(variant => variants.includes(variant.id)).map(variant => (
                    <Controller key={variant.id} name={`allocation.${variant.id}`} control={control} render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor={`allocation-${variant.id}`}>
                                <TypographyBody className="text-sm">{t(`variants.${variant.key}.title`)}</TypographyBody>
                            </FieldLabel>
                            <Input id={`allocation-${variant.id}`} type="number" inputMode="numeric" min={0} max={quantityIsMinimum ? undefined : limit} step={1}
                                name={field.name} ref={field.ref} value={field.value ?? ""} onBlur={field.onBlur}
                                onChange={event => {
                                    field.onChange(event.target.value === "" ? "" : event.target.valueAsNumber);
                                    onQuantityKeyUp();
                                }}
                                onKeyUp={onQuantityKeyUp}
                                aria-invalid={!!error} aria-describedby="allocation-status" />
                            {plan?.unitPrices && <div className="flex items-center justify-between gap-3">
                                <TypographyParagraph className="text-xs text-muted-foreground">{t("plans.perUnit", {
                                    price: format.number(getCheckoutUnitPrice(plan, variant.id, Number(field.value) || 0), {
                                        style: "currency", currency: plan.currency, currencyDisplay: "code", maximumFractionDigits: 3,
                                    }),
                                })}</TypographyParagraph>
                                <TypographyParagraph className="text-sm font-semibold">{t("allocation.subtotal", {
                                    amount: format.number(getCheckoutSubtotal(plan, variant.id, field.value), {
                                        style: "currency", currency: plan.currency, currencyDisplay: "code",
                                    }),
                                })}</TypographyParagraph>
                            </div>}
                        </Field>
                    )} />
                ))}
            </FieldGroup>
            <div id="allocation-status" aria-live="polite" className="space-y-2">
                <TypographyParagraph className="text-xs text-muted-foreground">
                    {t(quantityIsMinimum ? "allocation.minimumTotal" : "allocation.total", { total: Number.isFinite(total) ? total : 0, limit })}
                </TypographyParagraph>
                {error && <div role="alert"><TypographyParagraph className="text-xs text-destructive">{error}</TypographyParagraph></div>}
            </div>
        </div>
    );
}
