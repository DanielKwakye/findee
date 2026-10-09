"use client";

import Link from "next/link";
import { Controller, type UseFormRegisterReturn, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/core/ui/checkbox";
import { Input } from "@/components/core/ui/input";
import { Field, FieldLabel } from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { checkoutContactFields } from "@/features/checkout/data/checkout.contact.fields";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";

type Props = {
    form: UseFormReturn<CheckoutValues>;
    contactInputs: Record<"email" | "name" | "phone", UseFormRegisterReturn>;
    shippingInput: UseFormRegisterReturn;
    maxProfiles: number | null;
    contactMissing: boolean;
    isSubmitting: boolean;
    submitError: boolean;
};

/** Presents contact preferences and the delivery destination for checkout. */
export default function CheckoutDetails({ form, contactInputs, shippingInput, maxProfiles, contactMissing, isSubmitting, submitError }: Props) {
    const t = useTranslations("Checkout.details");
    const { errors } = form.formState;

    return (
        <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
            {checkoutContactFields.map(input => (
                <Field key={input.name} className="gap-2">
                    <FieldLabel htmlFor={`checkout-${input.name}`}><TypographyBody className="text-sm">{t(input.name)}</TypographyBody></FieldLabel>
                    <Input id={`checkout-${input.name}`} type={input.type} autoComplete={input.autoComplete}
                        {...contactInputs[input.name]} aria-invalid={!!errors[input.name]} aria-describedby={errors[input.name] ? `checkout-${input.name}-error` : undefined} />
                    {errors[input.name] && <div id={`checkout-${input.name}-error`} role="alert"><TypographyParagraph className="text-xs text-destructive">{errors[input.name]?.message}</TypographyParagraph></div>}
                    <Controller name={input.toggle} control={form.control} render={({ field }) => (
                        <FieldLabel className="w-full items-start gap-2">
                            <Checkbox name={field.name} checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur} ref={field.ref} />
                            <TypographyBody className="text-xs text-muted-foreground">{t(input.toggle)}</TypographyBody>
                        </FieldLabel>
                    )} />
                </Field>
            ))}
            {contactMissing && <div role="alert"><TypographyParagraph className="text-xs text-destructive">{t("contactRequired")}</TypographyParagraph></div>}
            <div className="space-y-1">
                <TypographyParagraph className="text-xs leading-5 text-muted-foreground">
                    {maxProfiles === null
                        ? t.rich("allocationUnlimited", { strong: chunks => <strong>{chunks}</strong> })
                        : t.rich("allocationNote", { profiles: maxProfiles, strong: chunks => <strong>{chunks}</strong> })}
                </TypographyParagraph>
                <Link href="#" className="text-primary underline underline-offset-4">
                    <TypographyBody className="text-xs">{t("learnHow")}</TypographyBody>
                </Link>
            </div>
            <Field className="gap-2">
                <FieldLabel htmlFor="checkout-address"><TypographyBody className="text-sm">{t("shippingAddress")}</TypographyBody></FieldLabel>
                <Input id="checkout-address" autoComplete="street-address" {...shippingInput} aria-invalid={!!errors.shippingAddress}
                    aria-describedby="checkout-address-help checkout-address-error" />
                <TypographyParagraph className="text-xs leading-5 text-muted-foreground"><span id="checkout-address-help">{t("addressHelp")}</span></TypographyParagraph>
                <div id="checkout-address-error" role={errors.shippingAddress ? "alert" : undefined}>
                    {errors.shippingAddress && <TypographyParagraph className="text-xs text-destructive">{errors.shippingAddress.message}</TypographyParagraph>}
                </div>
            </Field>
            {submitError && <div role="alert"><TypographyParagraph className="text-xs text-destructive">{t("submitError")}</TypographyParagraph></div>}
        </fieldset>
    );
}
