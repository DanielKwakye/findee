'use server';

import { requireCustomer } from '@/features/auth/server/auth.session';
import { db } from '@/lib/db';
import { parseCheckoutAddress } from '@/features/checkout/utils/checkout.address';

/** Retrieves the signed-in customer's most recently used shipping destination. */
export async function getLastShippingAddress() {
    const customer = await requireCustomer();
    const order = await db.order.findFirst({
        where: { customerId: customer.id, shippingAddress: { not: null } },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: { shippingAddress: true },
    });
    const address = order?.shippingAddress?.trim();
    if (!address) return null;
    return parseCheckoutAddress(address);
}
