"use client";

import { Controller, type Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Field, FieldGroup, FieldLabel } from "@/components/core/ui/field";
import { Input } from "@/components/core/ui/input";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { checkoutVariants, type CheckoutVariant } from "@/features/checkout/data/checkout.variants";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

type Props = {
    control: Control<CheckoutValues>;
    variants: CheckoutVariant[];
    limit: number;
    total: number;
    invalid: boolean;
    overLimit: boolean;
};

/** Presents sticker quantities and the allocation limit for a purchase. */
export default function CheckoutAllocation({ control, variants, limit, total, invalid, overLimit }: Props) {
    const t = useTranslations("Checkout");

    return (
        <div className="space-y-4">
            <FieldGroup className="gap-3 xl:gap-4">
                {checkoutVariants.filter(variant => variants.includes(variant.id)).map(variant => (
                    <Controller key={variant.id} name={`allocation.${variant.id}`} control={control} render={({ field }) => (
                        <Field>
                            <FieldLabel htmlFor={`allocation-${variant.id}`}>
                                <TypographyBody className="text-sm">{t(`variants.${variant.key}.title`)}</TypographyBody>
                            </FieldLabel>
                            <Input id={`allocation-${variant.id}`} type="number" inputMode="numeric" min={0} max={limit} step={1}
                                name={field.name} ref={field.ref} value={field.value ?? ""} onBlur={field.onBlur}
                                onChange={event => field.onChange(event.target.value === "" ? "" : event.target.valueAsNumber)}
                                aria-invalid={overLimit || invalid} aria-describedby="allocation-status" />
                        </Field>
                    )} />
                ))}
            </FieldGroup>
            <div id="allocation-status" aria-live="polite" className="space-y-2">
                <TypographyParagraph className="text-xs text-muted-foreground">
                    {t("allocation.total", { total: Number.isFinite(total) ? total : 0, limit })}
                </TypographyParagraph>
                {overLimit && <TypographyParagraph className="text-xs text-destructive">{t("allocation.overLimit", { limit })}</TypographyParagraph>}
                {invalid && <TypographyParagraph className="text-xs text-destructive">{t("allocation.invalid")}</TypographyParagraph>}
            </div>
        </div>
    );
}
