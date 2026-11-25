'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import { db } from '@/lib/db';

/** Releases a sticker from an order so it can be assigned again. */
export async function removeOrderProduct(orderId: string, code: string) {
    await requireAdmin();
    validateOrderId(orderId);
    if (typeof code !== 'string' || !code || code.length > 255)
        throw new Error('Invalid product code');

    await db.$transaction(async (transaction) => {
        await transaction.order.update({
            where: { id: orderId },
            data: { updatedAt: new Date() },
            select: { id: true },
        });
        const removed = await transaction.product.updateMany({
            where: { orderId, code },
            data: {
                orderId: null,
                reservedById: null,
                reservedAt: null,
                assignedToId: null,
                assignedAt: null,
                reachoutModes: { unset: true },
            },
        });
        if (!removed.count) throw new Error('Product is no longer assigned to this order');
    });
}
