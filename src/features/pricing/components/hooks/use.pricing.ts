'use client';

import { useQuery } from '@tanstack/react-query';
import { getCheckoutPlans } from '@/features/checkout/server/get.checkout.plans.action';
import { checkoutVariants } from '@/features/checkout/data/checkout.variants';

/** Loads the sticker plans shared by pricing and checkout. */
export function usePricing() {
    return useQuery({
        queryKey: ['checkout', 'plans'],
        queryFn: getCheckoutPlans,
        /** Prepares variant cards from the shared checkout pricing configuration. */
        select(plans) {
            const plan = plans.find((option) => option.id === 'custom');
            if (!plan?.unitPrices?.length) throw new Error('Sticker pricing is unavailable');
            const tiers = plan.unitPrices;
            return checkoutVariants.map((variant) => {
                const variantTiers = tiers.filter(
                    (tier, index) =>
                        tier.prices[variant.id] !== tiers[index + 1]?.prices[variant.id],
                );
                return {
                    ...variant,
                    currency: plan.currency,
                    minimumQuantity: plan.minimumQuantity,
                    startingPrice: Math.min(...tiers.map((tier) => tier.prices[variant.id])),
                    tiers: variantTiers.map((tier, index) => ({
                        minimum:
                            index === 0
                                ? (plan.minimumQuantity ?? 1)
                                : (variantTiers[index - 1].maximumQuantity ?? 0) + 1,
                        maximum: tier.maximumQuantity,
                        price: tier.prices[variant.id],
                    })),
                };
            });
        },
    });
}
