'use server';

import type { CheckoutValues } from '@/features/checkout/utils/checkout.types';
import { getCustomerUser } from '@/features/auth/server/auth.session';
import { getCheckoutPlans } from '@/features/checkout/server/get.checkout.plans.action';
import {
    validateCheckoutValues,
    validateCheckoutAllocation,
} from '@/features/checkout/utils/checkout.validations';
import { createStripeCheckout } from '@/features/checkout/utils/checkout.stripe';
import {
    formatCheckoutAddress,
    validateCheckoutPostalCode,
} from '@/features/checkout/utils/checkout.address';

/** Validates and records submitted checkout information for order processing. */
export async function submitCheckout(values: CheckoutValues): Promise<string> {
    const customer = await getCustomerUser();
    if (!customer) throw new Error('Customer authentication required');
    validateCheckoutValues(values);
    validateCheckoutPostalCode(values.postalCode);
    const plan = validateCheckoutAllocation(values, await getCheckoutPlans());
    return createStripeCheckout(
        customer,
        {
            ...values,
            shippingAddress: formatCheckoutAddress(values),
        },
        plan,
    );
}
