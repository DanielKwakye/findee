'use client';

import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';
import type { CheckoutValues } from '@/features/checkout/utils/checkout.types';
import CheckoutAddressFields from '@/features/checkout/components/ui/checkout-address-fields';
import CheckoutContactFields from '@/features/checkout/components/ui/checkout-contact-fields';

type Props = {
    form: UseFormReturn<CheckoutValues>;
    contactInputs: Record<'email' | 'name' | 'phone', UseFormRegisterReturn>;
    shippingInput: UseFormRegisterReturn;
    deliveryEstimate: string;
    contactMissing: boolean;
    isSubmitting: boolean;
    submitError: boolean;
};

/** Presents contact preferences and the delivery destination for checkout. */
export default function CheckoutDetails({
    form,
    contactInputs,
    shippingInput,
    deliveryEstimate,
    contactMissing,
    isSubmitting,
    submitError,
}: Props) {
    const t = useTranslations('Checkout.details');

    return (
        <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
            <CheckoutContactFields
                form={form}
                contactInputs={contactInputs}
                contactMissing={contactMissing}
                id="checkout"
            />
            <CheckoutAddressFields
                form={form}
                id="checkout"
                shippingInput={shippingInput}
                deliveryEstimate={deliveryEstimate}
            />
            {submitError && (
                <div role="alert">
                    <TypographyParagraph className="text-xs text-destructive">
                        {t('submitError')}
                    </TypographyParagraph>
                </div>
            )}
        </fieldset>
    );
}
