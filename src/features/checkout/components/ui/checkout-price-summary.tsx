'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { formatAmount } from '@/components/platform';
import TypographyBody from '@/components/core/ui/typography-body';
import type { CheckoutPlan } from '@/features/checkout/utils/checkout.types';

/** Presents the merchandise subtotal, order shipping charge, and payable total. */
export default function CheckoutPriceSummary({ plan }: { plan: CheckoutPlan }) {
    const t = useTranslations('Checkout.preview');
    const format = useFormatter();
    return (
        <div className="space-y-2 border-t pt-3" aria-live="polite">
            <div className="flex justify-between gap-4">
                <TypographyBody className="text-sm">{t('subtotal')}</TypographyBody>
                <TypographyBody className="text-sm">
                    {formatAmount(plan.price - (plan.shippingCost ?? 0), plan.currency, format)}
                </TypographyBody>
            </div>
            <div className="flex justify-between gap-4">
                <TypographyBody className="text-sm">{t('shipping')}</TypographyBody>
                <TypographyBody className="text-sm">
                    {plan.shippingCost
                        ? formatAmount(plan.shippingCost, plan.currency, format)
                        : t('freeShipping')}
                </TypographyBody>
            </div>
            <div className="flex justify-between gap-4">
                <TypographyBody className="text-sm font-semibold">{t('total')}</TypographyBody>
                <TypographyBody className="text-sm font-semibold">
                    {formatAmount(plan.price, plan.currency, format)}
                </TypographyBody>
            </div>
        </div>
    );
}
