'use server';

import { getCustomerUser } from '@/features/auth/server/auth.session';
import { fulfillCheckoutOrder } from '@/features/orders/server/fulfill.checkout.order';

/** Verifies the customer's payment and records their order once. */
export async function completeCheckoutOrder(sessionId?: string): Promise<string> {
    const customer = await getCustomerUser();
    if (!customer || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
        throw new Error('A customer checkout session is required');
    }
    const orderNumber = await fulfillCheckoutOrder(sessionId, customer.id);
    if (!orderNumber) throw new Error('Unable to verify checkout payment');
    return orderNumber;
}
