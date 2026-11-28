'use client';

import { CustomerOtpForm } from '@/features/auth/components/ui/customer-otp-form';
import CheckoutContactFields from '@/features/checkout/components/ui/checkout-contact-fields';
import type { CheckoutCustomer } from '@/features/checkout/utils/checkout.types';
import { useRecoveryActivationDetails } from '@/features/recovery/components/hooks/use.recovery.activation.details';
import { useFormatter, useTranslations } from 'next-intl';
import { formatAmount } from '@/components/platform';
import { Button } from '@/components/core/ui/button';
import TypographyBody from '@/components/core/ui/typography-body';
import TypographyParagraph from '@/components/core/ui/typography-paragraph';

/** Presents customer verification and the contact fields for a sticker activation. */
export default function RecoveryActivationDetails({
    code,
    customer,
    price,
    currency,
}: {
    code: string;
    customer: CheckoutCustomer | null;
    price: number;
    currency: string;
}) {
    const t = useTranslations('Checkout.details');
    const format = useFormatter();
    const recovery = useTranslations('recovery');
    const {
        form,
        contactInputs,
        contactMissing,
        onVerified,
        onSubmit,
        isSubmitting,
        paymentError,
    } = useRecoveryActivationDetails(code, customer);

    if (!customer) return <CustomerOtpForm onVerified={onVerified} fullWidth />;

    return (
        <form noValidate onSubmit={onSubmit} aria-busy={isSubmitting} className="space-y-4">
            <fieldset disabled={isSubmitting} className="min-w-0 space-y-4">
                <CheckoutContactFields
                    form={form}
                    contactInputs={contactInputs}
                    contactMissing={contactMissing}
                    id="recovery-activation"
                />
            </fieldset>
            {paymentError && (
                <div role="alert">
                    <TypographyParagraph className="text-xs text-destructive">
                        {recovery('activationPaymentError')}
                    </TypographyParagraph>
                </div>
            )}
            <Button type="submit" disabled={contactMissing || isSubmitting} className="w-full">
                <TypographyBody className="text-sm">
                    {isSubmitting
                        ? t('submitting')
                        : t('payWithAmount', { amount: formatAmount(price, currency, format) })}
                </TypographyBody>
            </Button>
        </form>
    );
}
