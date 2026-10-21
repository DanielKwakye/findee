"use client";

import { Controller, type UseFormRegisterReturn, type UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Checkbox } from "@/components/core/ui/checkbox";
import { Input } from "@/components/core/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/core/ui/input-otp";
import { Textarea } from "@/components/core/ui/textarea";
import { Field, FieldLabel } from "@/components/core/ui/field";
import TypographyBody from "@/components/core/ui/typography-body";
import TypographyParagraph from "@/components/core/ui/typography-paragraph";
import { checkoutContactFields } from "@/features/checkout/data/checkout.contact.fields";
import type { CheckoutValues } from "@/features/checkout/utils/checkout.types";
import type { useCheckout } from "@/features/checkout/components/hooks/use.checkout";

type Props = {
    form: UseFormReturn<CheckoutValues>;
    contactInputs: Record<"email" | "name" | "phone", UseFormRegisterReturn>;
    shippingInput: UseFormRegisterReturn;
    postalCodeRules: ReturnType<typeof useCheckout>["postalCodeRules"];
    onPostalCodePaste: (value: string) => string;
    deliveryEstimate: string;
    contactMissing: boolean;
    isSubmitting: boolean;
    submitError: boolean;
};

/** Presents contact preferences and the delivery destination for checkout. */
export default function CheckoutDetails({ form, contactInputs, shippingInput, postalCodeRules, onPostalCodePaste, deliveryEstimate, contactMissing, isSubmitting, submitError }: Props) {
    const t = useTranslations("Checkout.details");
    const { errors } = form.formState;

    return (
        <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
            {checkoutContactFields.map(input => (
                <Field key={input.name} className="gap-2">
                    <FieldLabel htmlFor={`checkout-${input.name}`}><TypographyBody className="text-sm">{t(input.name)}</TypographyBody></FieldLabel>
                    <Input id={`checkout-${input.name}`} type={input.type} autoComplete={input.autoComplete} readOnly={input.name === "email"}
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
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Field className="min-w-0 gap-2">
                <FieldLabel htmlFor="checkout-address"><TypographyBody className="text-sm">{t("shippingAddress")}</TypographyBody></FieldLabel>
                <Input id="checkout-address" autoComplete="street-address" {...shippingInput} aria-invalid={!!errors.shippingAddress}
                    aria-describedby="checkout-address-help checkout-address-error" />
                <TypographyParagraph className="text-xs leading-5 text-muted-foreground"><span id="checkout-address-help">{t("addressHelp")}</span></TypographyParagraph>
                <div id="checkout-address-error" role={errors.shippingAddress ? "alert" : undefined}>
                    {errors.shippingAddress && <TypographyParagraph className="text-xs text-destructive">{errors.shippingAddress.message}</TypographyParagraph>}
                </div>
            </Field>
            <Field className="gap-2">
                <FieldLabel htmlFor="checkout-postal-code"><TypographyBody className="text-sm">{t("postalCode")}</TypographyBody></FieldLabel>
                <Controller name="postalCode" control={form.control} rules={postalCodeRules} render={({ field }) => (
                    <InputOTP id="checkout-postal-code" maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        inputMode="text" autoComplete="postal-code" autoCapitalize="characters" {...field} value={field.value ?? ""}
                        onChange={value => field.onChange(value.toUpperCase())} pasteTransformer={onPostalCodePaste}
                        containerClassName="gap-2" aria-invalid={!!errors.postalCode}
                        aria-describedby="checkout-postal-code-help checkout-postal-code-error">
                        <InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup>
                    </InputOTP>
                )} />
                <TypographyParagraph className="text-xs leading-5 text-muted-foreground"><span id="checkout-postal-code-help">{t("postalCodeHelp")}</span></TypographyParagraph>
                <div id="checkout-postal-code-error" role={errors.postalCode ? "alert" : undefined}>
                    {errors.postalCode && <TypographyParagraph className="text-xs text-destructive">{errors.postalCode.message}</TypographyParagraph>}
                </div>
            </Field>
            </div>
            <div className="space-y-1" aria-live="polite">
                <TypographyParagraph className="text-sm font-semibold">{deliveryEstimate}</TypographyParagraph>
                <TypographyParagraph className="text-xs text-muted-foreground">{t("deliveryEstimateNote")}</TypographyParagraph>
            </div>
            <Field className="gap-2">
                <FieldLabel htmlFor="checkout-delivery-instructions"><TypographyBody className="text-sm">{t("deliveryInstructions")}</TypographyBody></FieldLabel>
                <Textarea id="checkout-delivery-instructions" rows={4} className="field-sizing-fixed" {...form.register("deliveryInstructions")} />
            </Field>
            {submitError && <div role="alert"><TypographyParagraph className="text-xs text-destructive">{t("submitError")}</TypographyParagraph></div>}
        </fieldset>
    );
}
