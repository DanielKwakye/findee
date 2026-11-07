'use server';

import type { CheckoutPlan } from '@/features/checkout/utils/checkout.types';
import { getCheckoutPlanPrice } from '@/features/checkout/utils/checkout.pricing';

/** Retrieves the available sticker plans and their purchase limits. */
export async function getCheckoutPlans(): Promise<CheckoutPlan[]> {
    const plans: CheckoutPlan[] = [
        {
            id: 'custom',
            title: 'Pricing',
            price: 0,
            currency: 'CAD',
            quantity: 20,
            minimumQuantity: 10,
            maxRecoveryProfiles: null,
            unitPrices: [
                { maximumQuantity: 19, prices: { Everyday: 9.99 / 10, Tough: 1.75, Fabric: 2.0 } },
                {
                    maximumQuantity: 39,
                    prices: { Everyday: 16.99 / 20, Tough: 1.375, Fabric: 1.625 },
                },
                {
                    maximumQuantity: null,
                    prices: { Everyday: 29.99 / 40, Tough: 1.25, Fabric: 1.5 },
                },
            ],
            shippingPrices: [
                { maximumQuantity: 19, prices: { Everyday: 2.99, Tough: 2.99, Fabric: 2.99 } },
                { maximumQuantity: 39, prices: { Everyday: 2.99, Tough: 2.99, Fabric: 2.99 } },
                { maximumQuantity: null, prices: { Everyday: 0, Tough: 0, Fabric: 0 } },
            ],
        },
    ];
    return plans.map((plan) => getCheckoutPlanPrice(plan, plan.quantity));
}
