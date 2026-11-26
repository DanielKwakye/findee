'use server';

import { requireAdmin } from '@/features/auth/server/auth.session';
import { checkoutVariants } from '@/features/checkout/data/checkout.variants';
import type { OrderDetails } from '@/features/orders/utils/order.types';
import { validateOrderId } from '@/features/orders/utils/order.validations';
import { db } from '@/lib/db';

/** Saves the total sticker quantity and its planned variant counts together. */
export async function updateOrderQuantity(
    orderId: string,
    { quantity, allocations }: Pick<OrderDetails['planDetail'], 'quantity' | 'allocations'>,
) {
    await requireAdmin();
    validateOrderId(orderId);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 2_147_483_647)
        throw new Error('Invalid order quantity');
    if (
        !Array.isArray(allocations) ||
        allocations.some(
            (allocation) =>
                !allocation ||
                !checkoutVariants.some(({ id }) => id === allocation.variant) ||
                !Number.isSafeInteger(allocation.quantity) ||
                allocation.quantity < 0,
        ) ||
        new Set(allocations.map(({ variant }) => variant)).size !== allocations.length ||
        allocations.reduce((sum, allocation) => sum + allocation.quantity, 0) !== quantity
    )
        throw new Error('Invalid order allocations');

    await db.order.update({
        where: { id: orderId },
        data: { planDetail: { update: { quantity, allocations: { set: allocations } } } },
        select: { id: true },
    });
}
