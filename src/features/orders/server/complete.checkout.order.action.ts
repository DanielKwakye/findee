'use server';

import { getCustomerUser } from '@/features/auth/server/auth.session';
import { fulfillCheckoutOrder } from '@/features/orders/server/fulfill.checkout.order';
import { db } from '@/lib/db';

/** Verifies the customer's payment and records their order once. */
export async function completeCheckoutOrder(sessionId?: string) {
    const customer = await getCustomerUser();
    if (!customer || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
        throw new Error('A customer checkout session is required');
    }
    const orderNumber = await fulfillCheckoutOrder(sessionId, customer.id);
    if (!orderNumber) throw new Error('Unable to verify checkout payment');
    const order = await db.order.findUniqueOrThrow({
        where: { number: orderNumber, customerId: customer.id },
        select: {
            number: true,
            planDetail: { select: { price: true, currency: true, quantity: true } },
            customer: { select: { email: true, phone: true } },
        },
    });
    return {
        transaction_id: order.number,
        value: order.planDetail.price,
        currency: order.planDetail.currency,
        sticker_quantity: order.planDetail.quantity,
        email: order.customer.email,
        phone: order.customer.phone,
    };
}
