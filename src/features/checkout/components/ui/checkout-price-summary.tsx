'use client';

import { useFormatter, useTranslations } from 'next-intl';
import TypographyBody from '@/components/core/ui/typography-body';
import type { CheckoutPlan } from '@/features/checkout/utils/checkout.types';

/** Presents the merchandise subtotal, order shipping charge, and payable total. */
export default function CheckoutPriceSummary({ plan }: { plan: CheckoutPlan }) {
    const t = useTranslations('Checkout.preview');
    const format = useFormatter();
    const currency = {
        style: 'currency',
        currency: plan.currency,
        currencyDisplay: 'code',
    } as const;
    return (
        <div className="space-y-2 border-t pt-3" aria-live="polite">
            <div className="flex justify-between gap-4">
                <TypographyBody className="text-sm">{t('subtotal')}</TypographyBody>
                <TypographyBody className="text-sm">
                    {format.number(plan.price - (plan.shippingCost ?? 0), currency)}
                </TypographyBody>
            </div>
            <div className="flex justify-between gap-4">
                <TypographyBody className="text-sm">{t('shipping')}</TypographyBody>
                <TypographyBody className="text-sm">
                    {plan.shippingCost
                        ? format.number(plan.shippingCost, currency)
                        : t('freeShipping')}
                </TypographyBody>
            </div>
            <div className="flex justify-between gap-4">
                <TypographyBody className="text-sm font-semibold">{t('total')}</TypographyBody>
                <TypographyBody className="text-sm font-semibold">
                    {format.number(plan.price, currency)}
                </TypographyBody>
            </div>
        </div>
    );
}
