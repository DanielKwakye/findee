'use server';

import { requireCustomer } from '@/features/auth/server/auth.session';
import { createStripeCheckout } from '@/features/checkout/utils/checkout.stripe';
import type { CheckoutContactValues } from '@/features/checkout/utils/checkout.types';
import { validateCheckoutContact } from '@/features/checkout/utils/checkout.validations';
import { normalizeProductCode } from '@/features/products/utils/product.code';
import { getRecoveryProduct } from '@/features/recovery/server/get.recovery.product.action';

/** Starts payment for one eligible sticker at its existing variant price. */
export async function submitRecoveryActivation(code: string, values: CheckoutContactValues) {
    const customer = await requireCustomer();
    const contact = {
        email: customer.email,
        name: values.name,
        phone: values.phone,
        contactByEmail: values.contactByEmail,
        contactByPhone: values.contactByPhone,
        showName: values.showName,
    };
    validateCheckoutContact(contact);
    const product = await getRecoveryProduct(code);
    if (product?.status !== 'available') throw new Error('Sticker is unavailable for activation');

    return createStripeCheckout(
        customer,
        {
            ...contact,
            activationCode: normalizeProductCode(code),
            activationVariant: product.variant,
        },
        product.plan,
    );
}
