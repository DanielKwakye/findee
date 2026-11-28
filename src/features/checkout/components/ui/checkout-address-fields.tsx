'use client';

import { Controller, type UseFormRegisterReturn, type UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Input } from '@/components/core/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/core/ui/input-otp';
import { Textarea } from '@/components/core/ui/textarea';
import { Field, FieldLabel } from '@/components/core/ui/field';
import TypographyBody from '@/components/core/ui/typography-body';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';
import CheckoutRegionFields from '@/features/checkout/components/ui/checkout-region-fields';
import {
    checkoutPostalCodePattern,
    onPostalCodePaste,
} from '@/features/checkout/utils/checkout.address';
import type { CheckoutValues } from '@/features/checkout/utils/checkout.types';

type Props = {
    form: UseFormReturn<CheckoutValues>;
    id: string;
    shippingInput: UseFormRegisterReturn;
    postalCodeRequired?: boolean;
    deliveryEstimate?: string;
};

/** Renders the shipping destination fields and delivery instructions. */
export default function CheckoutAddressFields({
    form,
    id,
    shippingInput,
    postalCodeRequired = true,
    deliveryEstimate,
}: Props) {
    const t = useTranslations('Checkout.details');
    const { errors } = form.formState;
    return (
        <>
            <CheckoutRegionFields control={form.control} id={id} />
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                <Field className="min-w-0 gap-2">
                    <FieldLabel htmlFor={`${id}-address`}>
                        <TypographyBody className="text-sm">{t('shippingAddress')}</TypographyBody>
                    </FieldLabel>
                    <Input
                        id={`${id}-address`}
                        autoComplete="street-address"
                        {...shippingInput}
                        aria-invalid={!!errors.shippingAddress}
                        aria-describedby={`${id}-address-help ${id}-address-error`}
                    />
                    <TypographyParagraph className="text-xs leading-5 text-muted-foreground">
                        <span id={`${id}-address-help`}>{t('addressHelp')}</span>
                    </TypographyParagraph>
                    <div
                        id={`${id}-address-error`}
                        role={errors.shippingAddress ? 'alert' : undefined}
                    >
                        {errors.shippingAddress && (
                            <TypographyParagraph className="text-xs text-destructive">
                                {errors.shippingAddress.message}
                            </TypographyParagraph>
                        )}
                    </div>
                </Field>
                <Field className="gap-2">
                    <FieldLabel htmlFor={`${id}-postal-code`}>
                        <TypographyBody className="text-sm">{t('postalCode')}</TypographyBody>
                    </FieldLabel>
                    <Controller
                        name="postalCode"
                        control={form.control}
                        rules={{
                            required: postalCodeRequired && t('postalCodeRequired'),
                            pattern: {
                                value: checkoutPostalCodePattern,
                                message: t('postalCodeInvalid'),
                            },
                        }}
                        render={({ field }) => (
                            <InputOTP
                                id={`${id}-postal-code`}
                                maxLength={6}
                                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                inputMode="text"
                                autoComplete="postal-code"
                                autoCapitalize="characters"
                                {...field}
                                value={field.value ?? ''}
                                onChange={(value) => field.onChange(value.toUpperCase())}
                                pasteTransformer={onPostalCodePaste}
                                containerClassName="gap-2"
                                aria-invalid={!!errors.postalCode}
                                aria-describedby={`${id}-postal-code-help ${id}-postal-code-error`}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    />
                    <TypographyParagraph className="text-xs leading-5 text-muted-foreground">
                        <span id={`${id}-postal-code-help`}>{t('postalCodeHelp')}</span>
                    </TypographyParagraph>
                    <div
                        id={`${id}-postal-code-error`}
                        role={errors.postalCode ? 'alert' : undefined}
                    >
                        {errors.postalCode && (
                            <TypographyParagraph className="text-xs text-destructive">
                                {errors.postalCode.message}
                            </TypographyParagraph>
                        )}
                    </div>
                </Field>
            </div>
            {deliveryEstimate && (
                <div className="space-y-1" aria-live="polite">
                    <TypographyParagraph className="text-sm font-semibold">
                        {deliveryEstimate}
                    </TypographyParagraph>
                    <TypographyParagraph className="text-xs text-muted-foreground">
                        {t('deliveryEstimateNote')}
                    </TypographyParagraph>
                </div>
            )}
            <Field className="gap-2">
                <FieldLabel htmlFor={`${id}-delivery-instructions`}>
                    <TypographyBody className="text-sm">{t('deliveryInstructions')}</TypographyBody>
                </FieldLabel>
                <Textarea
                    id={`${id}-delivery-instructions`}
                    rows={4}
                    className="field-sizing-fixed"
                    {...form.register('deliveryInstructions')}
                />
            </Field>
        </>
    );
}
