'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import { db } from '@/lib/db';

/** Saves the total sticker quantity recorded on an order. */
export async function updateOrderQuantity(orderId: string, quantity: number) {
    await requireAdmin();
    validateOrderId(orderId);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 2_147_483_647)
        throw new Error('Invalid order quantity');

    await db.order.update({
        where: { id: orderId },
        data: { planDetail: { update: { quantity } } },
        select: { id: true },
    });
}
